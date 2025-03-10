"use client";

import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Spinner from "@/components/common/Spinner";
import BotMessage from "@/features/chat/components/BotMessage";
import EmptyChatScreen from "@/features/chat/components/EmptyChatScreen";
import UserMessage from "@/features/chat/components/UserMessage";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Message } from "@/features/chat/schemas";
import { useChat } from "@/features/chat/store/use-chat";
import { useMessages } from "@/features/chat/store/use-messages";
import { cn, isGuestUser } from "@/lib/utils";
import { useParams } from "next/navigation";
import { ComponentProps, Fragment, useEffect, useRef } from "react";

interface MessageHistoryProps extends ComponentProps<"div"> {
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  fetchNextPage: () => void;
  initialMessages: Message[];
}

const MessageHistory = ({
  isFetchingNextPage,
  hasNextPage,
  fetchNextPage,
  className,
  initialMessages,
  ...props
}: MessageHistoryProps) => {
  const { messages: atomMessages } = useMessages();
  const { chatId, chatUserId } = useChat();

  const messages = atomMessages || initialMessages;
  const bottomRef = useRef<HTMLDivElement>(null);

  const { id: currentChatId } = useParams<{ id: string }>();

  useEffect(() => {
    if (!isGuestUser(chatUserId)) {
      if (chatId && !currentChatId && messages.length === 1) {
        window.history.replaceState({}, "", `/chat/${chatId}`);
      }
    }
  }, [currentChatId, messages, chatUserId]);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "instant" });
    }
  }, []);

  if (messages.length === 0)
    return (
      <EmptyChatScreen className="h-[calc(100vh-145px)]" userId={chatUserId} />
    );

  return (
    <ScrollArea className="h-full w-full">
      <MaxWidthWrapper className="max-w-5xl">
        {isFetchingNextPage && (
          <div className="mb-4 text-center">
            <Spinner />
          </div>
        )}
        <div
          className="h-1"
          ref={(el) => {
            if (el) {
              const observer = new IntersectionObserver(
                ([entry]) => {
                  if (entry.isIntersecting && hasNextPage) {
                    fetchNextPage();
                  }
                },
                {
                  threshold: 1.0,
                },
              );

              observer.observe(el);
              return () => observer.disconnect();
            }
          }}
        />
        {/* create a dummy array to loop */}

        <div className={cn("w-full space-y-4", className)} {...props}>
          {messages.map((message) => (
            <Fragment key={`${message.id}-${message.timestamp}`}>
              {message?.userId ? (
                <UserMessage message={message} />
              ) : (
                <BotMessage content={message?.content} />
              )}
            </Fragment>
          ))}
        </div>
        <div className="h-px w-full" ref={bottomRef} />
      </MaxWidthWrapper>
    </ScrollArea>
  );
};

export default MessageHistory;
