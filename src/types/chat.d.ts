import { Message } from "@/lib/definitions";

type IFile = {
  name: string;
  type: "image" | "document" | "pdf";
  url?: string;
  preview?: string;
  isUploading?: boolean;
};

export type CreateNewRoomResponse = {
  roomid: string;
  uid: string;
};

export type ChatRoom = {
  id: string;
  userId: string;
  title: string;
  subject: string;
  timestamp: number;
  last_active: number;
};

export type MessageFile = {
  id: string;
  name: string;
  url?: string;
  preview?: string;
  type: "image" | "document" | "pdf";
  isUploading?: boolean;
  size: number;
};

export type MessageResponse = {
  message: {
    content: string;
    docs?: IFile[];
    images?: IFile[];
  };
  timestamp: number;
  userid: string;
};

export type MessageStore = Omit<Message, "docs" | "images"> & {
  id: string;
  docs?: IFile[];
  images?: IFile[];
};

export type NewMessage = Omit<Message, "id" | "chatId">;

export type Chat = {
  id: string;
  title: string;
  subject: string;
  userId: string;
  messages: Message[];
};
