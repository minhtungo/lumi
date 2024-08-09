"use server";

import { messageSchema } from "@/lib/definitions";
import { PROTECTED_BASE_URL } from "@/lib/routes";
import { authedAction } from "@/lib/safe-actions";
import {
  createNewChatUseCase,
  getChatsUseCase,
  getMessageImagesUseCase,
  getMessagesUseCase,
  updateChatUseCase,
} from "@/use-cases/chat";
import { redirect } from "next/navigation";
import { z } from "zod";
import { ZSAError } from "zsa";

export const getChatsAction = authedAction.handler(
  async ({ ctx: { user } }) => {
    try {
      const chats = await getChatsUseCase();
      return chats;
    } catch (error) {
      throw new Error("Error fetching chats");
    }
  },
);

export const createNewChatAction = authedAction
  .input(
    z.object({
      subject: z.string(),
    }),
  )
  .handler(async ({ input: { subject }, ctx: { user } }) => {
    let chat;
    try {
      chat = await createNewChatUseCase({
        subject,
        title: subject,
      });

      // return {
      //   id: room.id,
      // };
    } catch (error) {
      throw new ZSAError("ERROR", error);
    }

    if (chat) {
      redirect(`${PROTECTED_BASE_URL}/chat/${chat.id}`);
    }
  });

export const getMessagesAction = authedAction
  .input(
    z.object({
      roomId: z.string(),
      query: z.object({
        limit: z.number().optional(),
        offset: z.number().optional(),
      }),
    }),
  )
  .output(z.object({ messages: z.array(messageSchema) }))
  .handler(async ({ input: { roomId, query } }) => {
    const messages = await getMessagesUseCase({
      roomId: roomId,
      query,
    });
    return { messages };
  });

export const updateChatAction = authedAction
  .input(
    z.object({
      roomId: z.string(),
      title: z.string().optional(),
      subject: z.string().optional(),
    }),
  )
  .handler(async ({ input: { roomId, title, subject }, ctx: { user } }) => {
    try {
      return await updateChatUseCase({
        userId: user.id!,
        roomId,
        title,
        subject,
      });
    } catch (error) {
      throw new Error("Error updating chat");
    }
  });

export const removeChatAction = authedAction
  .input(
    z.object({
      chatId: z.string(),
    }),
  )
  .handler(async ({ input: { chatId }, ctx: { user } }) => {
    try {
      // return await updateChatUseCase({
      //   userId: user.id!,
      //   roomId,
      //   title,
      //   subject,
      // });
    } catch (error) {
      throw new Error("Error removing chat");
    }
  });

export const removeAllChatsAction = authedAction.handler(
  async ({ input, ctx: { user } }) => {
    try {
      // return await updateChatUseCase({
      //   userId: user.id!,
      //   roomId,
      //   title,
      //   subject,
      // });
      return {
        message: true,
      };
    } catch (error) {
      throw new Error("Error removing chat");
    }
  },
);

export const getMessageImagesAction = authedAction
  .input(
    z.object({
      url: z.string(),
    }),
  )
  .handler(async ({ input: { url }, ctx: { user } }) => {
    const path = new URL(url).pathname;
    const image = await getMessageImagesUseCase({
      userId: user.id!,
      path,
    });
    return { image };
  });
