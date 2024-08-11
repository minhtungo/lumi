"use client";

import { FC, FormEvent, useEffect } from "react";
import PromptForm from "./PromptForm";

import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import PromptSuggestions from "@/components/private/chat/PromptSuggestions";
import { createNewMessageStore, getMessageFiles } from "@/lib/chat";
import { useSubscription } from "@/store/centrifuge";
import { chatInitialState, chatStore } from "@/store/chat";
import { useMessageStore } from "@/store/message";

interface ChatPanelProps {
  userId: string;
  chatId: string;
}

const ChatPanel: FC<ChatPanelProps> = ({ userId, chatId }) => {
  const { messages, setMessages, setChat } = chatStore();

  const {
    messageStore: { files, mathEquation, message, isPending },
    clearMessageStore,
  } = useMessageStore();

  const channel = `rooms:${chatId}`;
  const sub = useSubscription(channel);

  useEffect(() => {
    return () => {
      clearMessageStore();
      setChat(chatInitialState);
    };
  }, [chatId]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isPending) return;

    const content = mathEquation || message;

    if (!content || content.trim() === "") {
      return;
    }

    // Blur focus on mobile
    if (window.innerWidth < 600) {
      // @ts-ignore
      e.target["message"]?.blur();
    }

    const { images, docs } = getMessageFiles(files);

    if (sub) {
      sub.publish({
        input: {
          content,
          images,
          docs,
        },
      });
    }

    const newMessage = createNewMessageStore({
      content,
      userId,
      docs,
      images,
    });

    setMessages((prev) => [...prev, newMessage]);

    clearMessageStore();
  };

  return (
    <MaxWidthWrapper className="space-y-3 pt-3">
      {messages && messages.length > 4 && (
        <PromptSuggestions className="mt-4" sub={sub} userId={userId} />
      )}
      <PromptForm onSubmit={onSubmit} />
    </MaxWidthWrapper>
  );
};

export default ChatPanel;
