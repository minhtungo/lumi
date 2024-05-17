"use client";

import { CornerDownLeft, Mic, Paperclip } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useChat } from "ai/react";
import ChatInput from "./ChatInput";
import { Card } from "./ui/card";
import { useRef } from "react";

const Chat = () => {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const chatFormRef = useRef<HTMLFormElement | null>(null);

  return (
    <>
      <ScrollArea className="h-full flex-1 py-4 lg:py-6">
        <div className="mx-auto flex h-full max-w-5xl flex-1 flex-col gap-y-5 overflow-hidden px-4 lg:px-6">
          {messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? (
                <Card className="ml-auto w-fit bg-secondary px-3 py-2">
                  {m.content}
                </Card>
              ) : (
                <Card className="bg-primary-muted w-fit px-3 py-2">
                  {m.content}
                </Card>
              )}
            </div>
          ))}
        </div>
      </ScrollArea>
      <div className="mx-auto mb-4 w-full max-w-5xl px-4 lg:px-6">
        <form
          className="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);
          }}
          ref={chatFormRef}
        >
          <div className="flex w-full items-center gap-1.5 p-1.5 lg:gap-3.5">
            <div className="flex items-center gap-1.5">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Paperclip className="size-4" />
                      <span className="sr-only">Attach file</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Attach File</TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <Mic className="size-4" />
                      <span className="sr-only">Use Microphone</span>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">Use Microphone</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <Label htmlFor="message" className="sr-only">
              Message
            </Label>
            <div className="mr-1.5 flex flex-1">
              <ChatInput
                value={input}
                onChange={handleInputChange}
                chatFormRef={chatFormRef}
              />
            </div>

            <Button
              variant="outline"
              type="submit"
              size="icon"
              className="ml-auto gap-1.5"
            >
              <CornerDownLeft className="size-3.5" />
            </Button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Chat;
