"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useState } from "react";
import NewChatCreation from "./NewChatCreation";

const CreateChatButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="w-full justify-start !text-sm" size="sm">
          <Plus className="size-4" />
          New Chat
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Select a subject</DialogTitle>
        </DialogHeader>
        <NewChatCreation toggleDialog={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateChatButton;
