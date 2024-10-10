"use client";

import { MESSAGES_LIMIT } from "@/config/config";
import BotMessage from "@/features/chat/components/BotMessage";
import EmptyChatScreen from "@/features/chat/components/EmptyChatScreen";
import UserMessage from "@/features/chat/components/UserMessage";
import MaxWidthWrapper from "@/components/common/MaxWidthWrapper";
import Spinner from "@/components/common/Spinner";

import { ScrollArea } from "@/components/ui/scroll-area";
import { useMessages } from "@/features/chat/store/use-messages";
import { useScrollAnchor } from "@/hooks/use-scroll-anchor";
import { Message } from "@/features/account/schemas";
import { cn, isGuestUser } from "@/lib/utils";
import { useParams } from "next/navigation";
import { ComponentProps, Fragment, useEffect } from "react";
import { useInView } from "react-intersection-observer";
import { useChat } from "@/features/chat/store/use-chat";

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

  const { messagesRef, scrollRef, visibilityRef } = useScrollAnchor();

  const { ref: inViewRef, inView } = useInView({
    threshold: 0.1,
  });

  const { id: currentChatId } = useParams<{ id: string }>();

  useEffect(() => {
    if (!isGuestUser(chatUserId)) {
      if (chatId && !currentChatId && messages.length === 1) {
        window.history.replaceState({}, "", `/chat/${chatId}`);
      }
    }
  }, [currentChatId, messages, chatUserId]);

  useEffect(() => {
    if (inView && hasNextPage && messages.length >= MESSAGES_LIMIT) {
      fetchNextPage();
    }
  }, [inView, hasNextPage]);

  if (messages.length === 0)
    return (
      <EmptyChatScreen className="h-[calc(100vh-145px)]" userId={chatUserId} />
    );

  return (
    <ScrollArea className="h-full w-full" ref={scrollRef}>
      <MaxWidthWrapper className="max-w-5xl">
        {isFetchingNextPage && (
          <div className="mb-4 text-center">
            <Spinner />
          </div>
        )}
        <div className="h-px w-full" ref={inViewRef} />
        <div
          className={cn("w-full space-y-4", className)}
          ref={messagesRef}
          {...props}
        >
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
        <div className="h-px w-full" ref={visibilityRef} />
      </MaxWidthWrapper>
    </ScrollArea>
  );
};

export default MessageHistory;
