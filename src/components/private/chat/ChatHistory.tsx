"use client";

import { ElementRef, FC, useEffect, useRef } from "react";

import Spinner from "@/components/common/Spinner";
import EmptyChat from "@/components/private/chat/EmptyChat";

import { useInfiniteMessages } from "@/data/queries/use-infinite-messages";
import { cn } from "@/lib/utils";
import { ChatRoom } from "@/types/chat";
import { User } from "next-auth";
import { useInView } from "react-intersection-observer";
import ScrollAreaContainer from "../common/ScrollAreaContainer";
import MessageHistory from "./MessageHistory";

export interface ChatHistoryProps extends React.ComponentProps<"div"> {
  chat: ChatRoom;
  user: User;
  className?: string;
  messageClassName?: string;
}

const ChatHistory: FC<ChatHistoryProps> = ({
  chat,
  user,
  className,
  messageClassName,
}) => {
  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
  });
  const { ref: bottomRef, inView: isBottom } = useInView();
  const scrollRef = useRef<ElementRef<"div">>(null);

  const { isLoading, messages, isFetchingNextPage } = useInfiniteMessages({
    chat,
    inView,
  });

  useEffect(() => {
    if (!isBottom && scrollRef.current && !inView) {
      scrollRef?.current?.scrollIntoView({ block: "end" });
    }
  }, [isBottom, messages]);

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Spinner className="size-5" />
      </div>
    );
  }

  return (
    <>
      {messages && messages.length > 0 ? (
        <ScrollAreaContainer
          className={cn("flex h-full w-full flex-col", className)}
        >
          {isFetchingNextPage && <Spinner className="mx-auto mb-6" />}
          <div ref={inViewRef} />
          <MessageHistory className={messageClassName} />
          <div ref={bottomRef} />
          <div ref={scrollRef} />
        </ScrollAreaContainer>
      ) : (
        <EmptyChat className="h-full" userId={user.id!} />
      )}
    </>
  );
};

export default ChatHistory;
