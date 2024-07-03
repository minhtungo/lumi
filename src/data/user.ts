import { db } from "@/lib/db";
import {
  changeUserPasswordSchema,
  twoFactorToggleSchema,
  updateUserProfileSchema,
} from "@/lib/definitions";
import { comparePassword, saltAndHashPassword } from "@/lib/security";
import { Languages, User } from "@prisma/client";
import { z } from "zod";

//Query
export const getUserByEmail = async (
  email: string,
  options?: getUserOptions,
) => {
  try {
    return await db.user.findUnique({
      where: { email },
      omit: {
        ...options?.omit,
      },
      include: {
        ...options?.include,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getUserById = async (id: string, options?: getUserOptions) => {
  try {
    return await db.user.findUnique({
      where: { id },
      omit: {
        ...options?.omit,
      },
      include: {
        ...options?.include,
      },
    });
  } catch (error) {
    return null;
  }
};

export const getUserRole = async (id: string) => {
  try {
    return await db.user.findUnique({
      where: { id },
      select: {
        role: true,
      },
    });
  } catch (error) {
    return null;
  }
};

type CreateUserProps = Omit<
  User,
  | "id"
  | "createdAt"
  | "updatedAt"
  | "role"
  | "plan"
  | "emailVerified"
  | "image"
  | "dateOfBirth"
>;

// Mutation
export const createUser = async (user: CreateUserProps) => {
  return await db.user.create({
    data: {
      ...user,
      settings: {
        create: {},
      },
    },
  });
};

export const updateNewGoogleUser = async (id: string) => {
  await db.user.update({
    where: { id },
    data: {
      emailVerified: new Date(),
      settings: {
        create: {},
      },
    },
  });
};

export const updateUserProfile = async (
  userID: string,
  values: z.infer<typeof updateUserProfileSchema>,
) => {
  const { language, ...rest } = values;

  await db.user.update({
    where: { id: userID },
    data: {
      ...rest,
      settings: {
        update: {
          preferredLang: language.toUpperCase() as Languages,
        },
      },
    },
  });
};

export const updateUserEmailVerification = async (id: string) => {
  await db.user.update({
    where: { id },
    data: { emailVerified: new Date() },
  });
};

export const toggleTwoFactor = async (
  userID: string,
  values: z.infer<typeof twoFactorToggleSchema>,
) => {
  await db.user.update({
    where: { id: userID },
    data: {
      ...values,
    },
  });
};

interface getUserOptions {
  include?: {
    settings?: boolean;
    accounts?: {
      select: {
        type: boolean;
      };
    };
  };
  omit?: {
    password?: boolean;
  };
}

export const changeUserPassword = async (
  userID: string,
  userPassword: string,
  values: z.infer<typeof changeUserPasswordSchema>,
) => {
  const { password, newPassword } = values;

  const passwordMatch = await comparePassword(password, userPassword);

  if (!passwordMatch) {
    throw new Error("Password mismatch");
  }

  const hashedPassword = await saltAndHashPassword(newPassword);

  await db.user.update({
    where: { id: userID },
    data: {
      password: hashedPassword,
    },
  });
};

//use when resetting password
export const setNewUserPassword = async ({
  id,
  password,
}: {
  id: string;
  password: string;
}) => {
  const hashedPassword = await saltAndHashPassword(password);

  await db.user.update({
    where: { id },
    data: { password: hashedPassword },
  });
};
