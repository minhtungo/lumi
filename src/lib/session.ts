import "server-only";
import { getCurrentUser } from "@/lib/auth";
import { AuthenticationError } from "@/lib/error";
import { getCookie, setCookie } from "cookies-next";
import { User } from "next-auth";
import { cookies } from "next/headers";
import { v4 as uuid } from "uuid";

export const assertAuthenticated = async () => {
  const user = await getCurrentUser();
  if (!user) {
    throw new AuthenticationError();
  }
  return user;
};

export const getChatUserId = async (user: User | undefined) => {
  let userId;

  if (!user) {
    if (getCookie("userId", { cookies })) {
      userId = getCookie("userId", { cookies });
    } else {
      userId = `guest-${uuid()}`;
      setCookie("userId", userId, { cookies });
    }
  } else {
    userId = user.id;
  }

  return userId;
};
