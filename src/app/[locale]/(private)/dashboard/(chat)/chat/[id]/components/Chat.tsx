"use client";

import { ElementRef, FC, useEffect, useRef } from "react";

import { chatStore } from "@/store/chat";
import { Chat as TChat, Message as TMessage } from "@prisma/client";
import { User } from "next-auth";
import Container from "../../../../components/Container";
import ChatOverlayView from "./ChatOverlayView";
import ChatPanel from "./ChatPanel";
import MessageHistory from "./MessageHistory";

export interface ChatProps extends React.ComponentProps<"div"> {
  user: User;
  chat: TChat & {
    messages: TMessage[];
  };
}

const Chat: FC<ChatProps> = ({ user, chat }) => {
  const {
    store: [{ messages }, setChat],
  } = chatStore();

  useEffect(() => {
    setChat((prev) => ({
      ...prev,
      id: chat.id,
      subject: chat.subject,
      messages: chat.messages,
    }));
  }, [chat]);

  const scrollRef = useRef<ElementRef<"div">>(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <Container>
        <div className="h-full w-full flex-1">
          {messages && messages.length > 0 && (
            <MessageHistory messages={messages} />
          )}
        </div>
      </Container>
      <div ref={scrollRef} />
      <ChatPanel user={user} />
      <ChatOverlayView user={user} />
    </>
  );
};

export default Chat;
