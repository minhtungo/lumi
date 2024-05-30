import { getChat } from "@/actions/chat";
import { auth } from "@/auth";
import Chat from "@/components/dashboard/Chat";
import { getCurrentUser } from "@/lib/auth";
import { AI } from "@/lib/chat/actions";
import { useActions } from "ai/rsc";
import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

export interface ChatPageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({
  params,
}: ChatPageProps): Promise<Metadata> {
  const user = await getCurrentUser();

  if (!user) {
    return {};
  }

  const chat = await getChat(params.id, user?.id!);
  return {
    title: chat?.title.toString().slice(0, 50) ?? "Chat",
  };
}

const ChatPage = async ({ params }: ChatPageProps) => {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/auth/login?redirect=/chat/${params.id}`);
  }

  const chat = await getChat(params.id, user.id!);

  if (!chat) {
    redirect("/");
  }

  if (chat?.userId !== user?.id) {
    notFound();
  }

  console.log("chat", chat);

  return (
    <AI initialAIState={{ chatId: chat.id, messages: chat.messages }}>
      <Chat id={chat.id} user={user} initialMessages={chat.messages} />
    </AI>
  );
};

export default ChatPage;
