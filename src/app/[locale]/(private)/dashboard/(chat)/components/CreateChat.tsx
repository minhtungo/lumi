"use client";

import { createNewChatAction } from "@/actions/chat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { chatStore } from "@/store/chat";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useServerAction } from "zsa-react";
import NewChatCreation from "./NewChatCreation";

const CreateChatButton = () => {
  const {
    getChat: { subject },
  } = chatStore();
  const { isPending, execute } = useServerAction(createNewChatAction);

  const createNewChat = async () => {
    const [_, error] = await execute({
      subject: subject || "",
    });

    if (error) {
      toast.error(error.message);
      return;
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          className="w-full justify-start bg-zinc-50 px-4 shadow-none transition-colors hover:bg-zinc-200/40 dark:bg-zinc-900 dark:hover:bg-zinc-300/10"
        >
          <Plus className="size-4 -translate-x-2 stroke-2" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a subject</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {/* <SubjectSelection /> */}
          <NewChatCreation />
        </div>
        {/* <DialogFooter>
          <SubmitButton
            type="button"
            className="w-full"
            onClick={createNewChat}
            label="Continue"
            isPending={isPending}
          />
        </DialogFooter> */}
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatButton;
