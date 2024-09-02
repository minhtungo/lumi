"use client";

import { currentSubscriptionAtom } from "@/atoms/subscription";
import { useMessages } from "@/hooks/use-messages";
import { createNewMessageStore } from "@/lib/chat";
import { cn } from "@/lib/utils";
import { useAtomValue } from "jotai";
import { Lightbulb } from "lucide-react";
import { FC } from "react";

interface PromptSuggestionProps {
  className?: string;
  userId: string;
}

const promptSuggestion = [
  {
    content: "Tell me more about solving simple equations.",
  },
  {
    content: "How do I work with variables in equations?",
  },
  {
    content: "What is the difference between linear and quadratic equations?",
  },
];

const PromptHints: FC<PromptSuggestionProps> = ({ userId, className }) => {
  const currentSubscription = useAtomValue(currentSubscriptionAtom);
  const { setMessages } = useMessages();

  const publishMessage = async (content: string) => {
    const newMessage = createNewMessageStore({
      content,
      userId,
    });

    setMessages((prev) => [...prev, newMessage]);
    // setOptimisticMessage({ chatId, newMessage });

    if (currentSubscription) {
      currentSubscription.publish({
        input: {
          content,
        },
      });
    }
  };

  return (
    <div
      className={cn(
        "grid gap-3 break-words text-sm text-muted-foreground transition-colors sm:grid-cols-3 lg:max-w-[75%]",
        className,
      )}
    >
      {promptSuggestion.map(({ content }) => (
        <button
          key={`${content}-prompt-hint`}
          className="rounded-lg border bg-card px-4 py-3 text-left shadow-sm hover:bg-accent"
          onClick={() => {
            publishMessage(content);
          }}
        >
          <Lightbulb className="mb-2 size-4 text-primary" />
          <p>{content}</p>
        </button>
      ))}
    </div>
  );
};

export default PromptHints;
