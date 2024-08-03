"use client";

import { FC, FormEvent, useEffect } from "react";

import { cn, nanoid } from "@/lib/utils";
import { User } from "next-auth";
import PromptForm from "./PromptForm";

import { saveChatAction } from "@/actions/chat";
import { useSubscription } from "@/store/centrifuge";
import { chatStore } from "@/store/chat";
import { useMessageStore } from "@/store/message";

interface ChatPanelProps {
  user: User;
  chatId: string;
  className?: string;
}

const ChatPanel: FC<ChatPanelProps> = ({ user, chatId, className }) => {
  const {
    store: [chat, setChat],
  } = chatStore();

  const {
    messageStore: { files, mathEquation, message, isPending },
    clearMessageStore,
  } = useMessageStore();

  console.log("chat--------------", chatId);

  const channel = `rooms:${chatId}`;
  const sub = useSubscription(channel);

  useEffect(() => {
    clearMessageStore();
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending) return;

    const submitContent = mathEquation || message;

    if (!submitContent || submitContent.trim() === "") {
      return;
    }

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      // @ts-ignore
      e.target["message"]?.blur();
    }

    const newMessage = {
      id: nanoid(),
      content: submitContent,
      files,
      role: "user",
      userId: user?.id!,
      chatId: chat.id!,
    };

    setChat((prev) => ({
      ...prev,
      messages: [...prev.messages, newMessage],
      ...(prev.messages.length === 0 && {
        title: newMessage.content.substring(0, 25),
      }),
    }));

    clearMessageStore();

    await saveChatAction({
      message: newMessage,
      chatId: chat.id!,
      title:
        chat.messages.length === 0 ? newMessage.content.substring(0, 25) : null,
    });

    if (sub) {
      sub.publish({
        input: submitContent,
      });
    }

    // Submit and get response message
    // const responseMessage = await submitUserMessage(content, encodedImage);
    // setMessages((currentMessages) => [...currentMessages, responseMessage]);
  };

  const testing = () => {
    if (sub) {
      let message = "history:" + 1722572938.111934;

      sub.publish({
        input: message,
      });
    }
  };

  return (
    <div
      className={cn(
        className ? className : "mx-auto mb-4 w-full max-w-5xl px-4 lg:px-6",
      )}
    >
      <button onClick={testing}>test</button>
      <PromptForm onSubmit={onSubmit} />
    </div>
  );
};

export default ChatPanel;
