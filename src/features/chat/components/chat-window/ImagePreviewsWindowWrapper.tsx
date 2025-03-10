"use client";

import OverlayWindow from "@/components/common/OverlayWindow";
import Spinner from "@/components/common/Spinner";

import { useChat } from "@/features/chat/store/use-chat";
import dynamic from "next/dynamic";

const ImagePreviewsWindow = dynamic(
  () => import("@/features/chat/components/chat-window/ImagePreviewsWindow"),
  {
    loading: () => (
      <OverlayWindow className="flex h-full w-full items-center justify-center">
        <Spinner className="size-5" />
      </OverlayWindow>
    ),
  },
);

const ImagePreviewsWindowWrapper = () => {
  const { selectedImageIndex } = useChat();

  return <>{selectedImageIndex !== null && <ImagePreviewsWindow />}</>;
};

export default ImagePreviewsWindowWrapper;
