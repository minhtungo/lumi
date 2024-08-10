"use client";

import { removeChatAction } from "@/actions/chat";
import DeleteChatAlert from "@/components/private/chat/DeleteChatAlert";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ChatRoom } from "@/types/chat";
import { Ellipsis, Pencil, Trash } from "lucide-react";
import { FC, useState } from "react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";

interface ChatActionsProps {
  chat: ChatRoom;
  setIsActive: (value: boolean) => void;
  toggleUpdateTitle: () => void;
}

const ChatActions: FC<ChatActionsProps> = ({
  chat,
  setIsActive,
  toggleUpdateTitle,
}) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const { isPending: isRemovePending, execute } =
    useServerAction(removeChatAction);

  const onDeleteChat = async (e: any) => {
    e.preventDefault();
    const [_, error] = await execute({
      chats: [chat.id!],
    });
    setDeleteDialogOpen(false);

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <>
      <DropdownMenu modal={false} onOpenChange={setIsActive}>
        <TooltipProvider delayDuration={100}>
          <Tooltip>
            <TooltipTrigger asChild>
              <DropdownMenuTrigger>
                <Ellipsis className="size-4" />
              </DropdownMenuTrigger>
            </TooltipTrigger>
            <TooltipContent>Delete chat</TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenuContent>
          <DropdownMenuItem
            disabled={isRemovePending}
            onClick={() => setDeleteDialogOpen(true)}
          >
            <Trash className="size-4" />
            <span>Delete</span>
            <span className="sr-only">Delete</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={toggleUpdateTitle}>
            <Pencil className="size-4" />
            <span>Rename</span>
            <span className="sr-only">Rename</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <DeleteChatAlert
        deleteDialogOpen={deleteDialogOpen}
        setDeleteDialogOpen={setDeleteDialogOpen}
        isRemovePending={isRemovePending}
        onDeleteChat={onDeleteChat}
      />
    </>
  );
};

export default ChatActions;
