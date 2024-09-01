"use client";

import { chatUrl } from "@/app-config";
import Spinner from "@/components/common/Spinner";
import EditChatTitle from "@/components/private/chat/EditChatTitle";
import { buttonVariants } from "@/components/ui/button";
import { useUpdateChat } from "@/data/mutations/use-update-chat";
import { cn } from "@/lib/utils";
import { ChatListItem } from "@/types/chat";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FC, useState } from "react";
import ChatActions from "./ChatActions";

interface ChatItemProps {
  chat: ChatListItem;
}

const ChatItem: FC<ChatItemProps> = ({ chat }) => {
  const { id: currentChatId } = useParams<{ id: string }>();

  const [isActive, setIsActive] = useState(currentChatId === chat.id);
  const [newTitle, setNewTitle] = useState("");

  const { mutate: updateChat, isPending } = useUpdateChat();

  const isActiveChat = currentChatId === chat.id;

  const toggleUpdateTitle = () => {
    setNewTitle(chat.title);
  };

  const onTitleChange = async () => {
    if (newTitle === chat.title) {
      setNewTitle("");
      return;
    }

    updateChat({
      chatId: chat.id!,
      title: newTitle,
    });

    setNewTitle("");
  };

  return (
    <li
      className={cn(
        "group relative w-full overflow-hidden rounded-lg hover:bg-accent",
        (isActiveChat || isActive) && "bg-accent",
      )}
    >
      {newTitle ? (
        <div className="border-1 z-10 h-full w-full rounded-lg border-ring bg-card">
          <EditChatTitle
            newTitle={newTitle}
            onTitleChange={onTitleChange}
            setNewTitle={setNewTitle}
          />
        </div>
      ) : (
        <>
          <Link
            href={`${chatUrl}/${chat.id}`}
            className={cn(
              buttonVariants({ variant: "ghost", size: "sm" }),
              "flex items-center justify-start overflow-hidden p-2 font-normal text-foreground/80 hover:text-foreground/80",
            )}
          >
            <div className="relative w-full flex-1 overflow-hidden whitespace-nowrap text-sm capitalize">
              {chat.title}
              <div
                className={cn(
                  "absolute bottom-0 right-0 top-0 w-2 bg-gradient-to-l from-background/80 from-60% to-transparent group-hover:w-9 group-hover:from-accent/90",
                  isActiveChat && "w-9 from-accent/90",
                )}
              />
            </div>
          </Link>
          <div
            className={cn(
              "absolute bottom-0 right-0 top-0 hidden items-center bg-accent pr-2 group-hover:flex",
              (isActiveChat || isActive) && "flex",
            )}
          >
            {isPending ? (
              <Spinner className="size-3" />
            ) : (
              <ChatActions
                chat={chat}
                setIsActive={setIsActive}
                currentChatId={currentChatId}
                onUpdateTitle={toggleUpdateTitle}
              />
            )}
          </div>
        </>
      )}
    </li>
  );
};

export default ChatItem;
