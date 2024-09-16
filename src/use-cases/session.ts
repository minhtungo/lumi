import { headers } from "next/headers";
import { toast } from "sonner";
import { env } from "@/env";
import { User } from "next-auth";

export const getChatUserUseCase = async (): Promise<{
  user: User;
  token: string;
}> => {
  const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/chat/user`, {
    headers: headers(),
  });

  const { data } = await response.json();

  console.log("*****************getChatUserUseCase", data);

  return data;
};

export const getChatTokenUseCase = async () => {
  const response = await fetch(`${env.NEXT_PUBLIC_BASE_URL}/api/chat/token`, {
    headers: headers(),
  });

  const { data } = await response.json();

  if (!data) {
    toast.error("Error getting chat user id");
    return;
  }

  console.log("*****************getChatTokenUseCase", data);

  return data.token as string;
};
