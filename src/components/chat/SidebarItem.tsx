import { useLocalStorage } from "@/hooks/use-local-storage";
import { cn } from "@/lib/utils";
import { Chat } from "@/types/chat";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FC } from "react";
import { buttonVariants } from "../ui/button";
import { PROTECTED_BASE_URL } from "@/lib/constant";

interface SidebarItemProps {
  index: number;
  chat: Chat;
  children: React.ReactNode;
}

const SidebarItem: FC<SidebarItemProps> = ({ index, chat, children }) => {
  const pathname = usePathname();

  const isActive = pathname.split(PROTECTED_BASE_URL)[1] === chat.path;

  const [newChatId, setNewChatId] = useLocalStorage("newChatId", null);
  const shouldAnimate = index === 0 && isActive && newChatId;

  if (!chat?.id) return null;

  return (
    <motion.div
      className={cn("group relative h-8")}
      variants={{
        initial: {
          height: 0,
          opacity: 0,
        },
        animate: {
          height: "auto",
          opacity: 1,
        },
      }}
      initial={shouldAnimate ? "initial" : undefined}
      animate={shouldAnimate ? "animate" : undefined}
      transition={{
        duration: 0.25,
        ease: "easeIn",
      }}
    >
      <Link
        href={`${PROTECTED_BASE_URL}/chat/${chat.id}`}
        className={cn(
          buttonVariants({ variant: "ghost" }),
          "w-full px-8 transition-colors group-hover:bg-zinc-200/40 dark:group-hover:bg-zinc-300/10",
          isActive && "bg-zinc-200 pr-16 font-semibold dark:bg-zinc-800",
        )}
      >
        <div className="absolute left-2 top-2.5 flex size-5 items-center justify-center">
          <MessageCircle className=" mr-1 text-zinc-500" />
        </div>
        <div
          className="relative max-h-5 flex-1 select-none overflow-hidden text-ellipsis break-all"
          title={chat.title}
        >
          <span className="whitespace-nowrap">
            {shouldAnimate ? (
              chat.title.split("").map((character, index) => (
                <motion.span
                  key={index}
                  variants={{
                    initial: {
                      opacity: 0,
                      x: -100,
                    },
                    animate: {
                      opacity: 1,
                      x: 0,
                    },
                  }}
                  initial={shouldAnimate ? "initial" : undefined}
                  animate={shouldAnimate ? "animate" : undefined}
                  transition={{
                    duration: 0.25,
                    ease: "easeIn",
                    delay: index * 0.05,
                    staggerChildren: 0.05,
                  }}
                  onAnimationComplete={() => {
                    if (index === chat.title.length - 1) {
                      setNewChatId(null);
                    }
                  }}
                >
                  {character}
                </motion.span>
              ))
            ) : (
              <span>{chat.title}</span>
            )}
          </span>
        </div>
      </Link>
      <div
        className={cn(
          "absolute right-2 top-1.5 hidden",
          isActive ? "block" : "group-hover:block",
        )}
      >
        {children}
      </div>
    </motion.div>
  );
};

export default SidebarItem;
