import { authErrorUrl, signInUrl } from "@/config/config";
import authConfig from "@/auth/config";
import {
  deleteTwoFactorConfirmation,
  getTwoFactorConfirmationByUserId,
} from "@/features/auth/dto";
import { getUserById, updateNewGoogleUser } from "@/data/user";
import { db } from "@/lib/db";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { Languages, Plan, type UserRole } from "@prisma/client";
import { setCookie } from "cookies-next";
import NextAuth from "next-auth";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: signInUrl,
    error: authErrorUrl,
  },
  secret: process.env.AUTH_SECRET,
  // jwt: {
  //   encode: async ({ secret, token }) => {
  //     if (!secret) {
  //       return "";
  //     }
  //     return jwt.sign({ ...token, userId: token?.sub }, secret as jwt.Secret, {
  //       algorithm: "HS256",
  //     });
  //   },
  //   decode: async ({ secret, token }) => {
  //     if (!secret) {
  //       return null;
  //     }
  //     return jwt.verify(token!, secret as jwt.Secret, {
  //       algorithms: ["HS256"],
  //     }) as jwt.JwtPayload;
  //   },
  // },
  events: {
    async linkAccount({ user }) {
      await updateNewGoogleUser(user.id!);
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id!, {
        include: {
          settings: true,
        },
      });

      if (!existingUser || !existingUser?.emailVerified) return false;

      if (existingUser.settings?.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(
          existingUser.id,
        );

        if (!twoFactorConfirmation) {
          return false;
        }

        await deleteTwoFactorConfirmation(twoFactorConfirmation.id);
      }

      setCookie("userId", existingUser.id);

      return true;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub, {
        include: {
          settings: true,
          accounts: {
            select: {
              type: true,
            },
          },
        },
      });

      if (!existingUser) return token;

      token.isOauth = existingUser.accounts?.length > 0;
      token.name = existingUser.name;
      token.role = existingUser.role;
      token.isOnboarded = existingUser.isOnboarded;
      token.isTwoFactorEnabled = existingUser.settings?.isTwoFactorEnabled;
      token.plan = existingUser.plan;
      token.preferredLang =
        existingUser.settings?.preferredLang?.toLowerCase() || "vi";
      return token;
    },
    async session({ token, session }) {
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }
      if (token.role && session.user) {
        session.user.role = token.role as UserRole;
      }
      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (token.preferredLang && session.user) {
        session.user.preferredLang = token.preferredLang as Languages;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.isOauth = token.isOauth as boolean;
        session.user.isOnboarded = token.isOnboarded as boolean;
        session.user.plan = token.plan as Plan;
      }
      session.test = "test";
      return session;
    },
  },
  ...authConfig,
});
