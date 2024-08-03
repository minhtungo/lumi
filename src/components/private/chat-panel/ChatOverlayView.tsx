"use client";

import { FilePreviewCarousel } from "@/components/private/chat-panel/FilePreviewCarousel";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useDraw } from "@/hooks/use-draw";
import { drawLine } from "@/lib/draw";
import { chatStore } from "@/store/chat";
import { Eraser, Paintbrush, X } from "lucide-react";
import { User } from "next-auth";
import { FC, useCallback, useMemo, useRef, useState } from "react";
import ChatPanel from "./ChatPanel";
import ImageMasker from "./ImageMasker";
import LineWidthSlider from "./LineWidthSlider";
import MessageHistory from "./MessageHistory";

interface ChatOverlayViewProps {
  user: User;
}

const ChatOverlayView: FC<ChatOverlayViewProps> = ({ user }) => {
  const {
    store: [
      {
        overlay: { isOpen, selectedImage },
        messages,
        id,
      },
      setChat,
    ],
  } = chatStore();

  const [isEditing, setIsEditing] = useState(false);
  const [lineWidth, setLineWidth] = useState(25);

  const imageRefs = useRef([]);
  const [selectedIndex, setSelectedIndex] = useState<number | undefined>(
    undefined,
  );

  const { clear, onMouseDown, canvasRef, getConvexHull } = useDraw(
    ({ prevPoint, currentPoint, ctx }) => {
      drawLine({
        prevPoint,
        currentPoint,
        ctx,
        lineWidth,
      });
    },
  );

  // const filesUrls = useMemo(
  //   () =>
  //     messages.reduce((acc, message) => {
  //       const urls = message.files.map((file) => file.url);
  //       return acc.concat(urls);
  //     }, []),
  //   [messages],
  // );

  const fileUrls = useMemo(
    () => messages.flatMap((message) => message.files.map((file) => file.url)),
    [messages],
  );

  const handleCarouselChange = useCallback(
    (index: number) => {
      // Update the selected image index
      // setChat((prev) => ({
      //   ...prev,
      //   overlay: { ...prev.overlay, selectedImageIndex: index },
      // }));
      setSelectedIndex(index);
    },
    [setChat],
  );

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-accent transition">
      <div className="flex duration-300 ease-in-out">
        <div className="flex-grow overflow-auto">
          <div className="flex h-full w-full flex-col">
            <div className="mb-3 flex w-full items-center gap-x-2 px-4 pt-2">
              {isEditing && (
                <div className="flex gap-x-4">
                  <LineWidthSlider setLineWidth={setLineWidth} />
                  <button
                    onClick={() => {
                      const hull = getConvexHull();
                      console.log("---------hull", hull);
                    }}
                  >
                    Testing
                  </button>
                  <Button
                    size="icon"
                    variant="ghost"
                    className="hover:bg-background/60"
                    onClick={clear}
                  >
                    <Eraser className="size-6" />
                  </Button>
                </div>
              )}

              <div className="ml-auto flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-background/60"
                  onClick={() => setIsEditing(!isEditing)}
                >
                  <Paintbrush className="size-6" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-background/60"
                  onClick={() => {
                    setIsEditing(false);
                    setChat((prev) => ({
                      ...prev,
                      overlay: { ...prev.overlay, isOpen: false },
                    }));
                  }}
                >
                  <X className="size-6" />
                </Button>
              </div>
            </div>
            <div className="relative">
              <FilePreviewCarousel
                fileArray={fileUrls as string[]}
                imageRefs={imageRefs}
                handleCarouselChange={handleCarouselChange}
              />
              {isEditing && (
                <div className="absolute inset-0 z-10">
                  <div className="relative cursor-crosshair">
                    <ImageMasker
                      onMouseDown={onMouseDown}
                      canvasRef={canvasRef}
                      image={imageRefs.current[selectedIndex!]}
                    />
                  </div>
                </div>
              )}

              {/* <Image
                ref={imageRef}
                src={selectedImage!}
                width={1024}
                height={1024}
                className="h-auto w-full object-cover"
                alt="Image"
              /> */}
            </div>
          </div>
        </div>
        <div className="relative w-[450px] shrink-0 bg-background">
          <div className="relative flex h-screen flex-col">
            <ScrollArea className="flex h-full w-full flex-1 flex-col py-4 lg:py-6">
              <MessageHistory
                messages={messages}
                className="px-4 sm:pl-4 sm:pr-6"
              />
            </ScrollArea>
            <ChatPanel className="w-full px-4 pb-4" user={user} chatId={id!} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatOverlayView;
