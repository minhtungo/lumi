import Link from "next/link";
import Logo from "@/components/common/Logo";
import ChatList from "@/components/private/chat/ChatList";
import ChatDropdownMenu from "@/components/private/common/ChatDropdownMenu";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { PanelLeftOpen, SquarePen } from "lucide-react";
import { chatUrl } from "@/app-config";
import { User } from "next-auth";
import { FC, Suspense } from "react";
import ChatSkeleton from "@/components/private/skeleton/ChatSkeleton";

interface ChatMobileMenuProps {
  user: User | undefined;
}

const ChatMobileMenu: FC<ChatMobileMenuProps> = ({ user }) => {
  return (
    <Sheet>
      <SheetTrigger className="lg:hidden">
        <PanelLeftOpen className="size-5 text-muted-foreground hover:text-foreground" />
      </SheetTrigger>
      <SheetContent
        className="flex h-screen flex-col"
        side="left"
        noCloseTrigger
      >
        <div className="flex items-center justify-between px-4 pt-4">
          <SheetClose>
            <Link href="/">
              <Logo />
            </Link>
          </SheetClose>
          <Link href={chatUrl}>
            <SquarePen className="size-5 text-muted-foreground hover:text-foreground" />
          </Link>
        </div>
        <ScrollArea className="flex h-full w-full flex-1 flex-col py-2">
          {user ? (
            <Suspense fallback={<ChatSkeleton />}>
              <ChatList className="py-2" />
            </Suspense>
          ) : (
            <p className="px-4 text-sm text-muted-foreground">
              You must be logged in to view the chat history
            </p>
          )}
        </ScrollArea>
        <div className="mb-2 px-4">
          <ChatDropdownMenu />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default ChatMobileMenu;
