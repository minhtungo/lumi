import { Button } from "@/components/ui/button";
import { useChat } from "@/features/chat/store/use-chat";
import { useChatOverlay } from "@/features/chat/store/use-chat-overlay";
import { clearCanvas } from "@/lib/utils";
import "@/styles/draw.css";
import { Eraser, Paintbrush, X } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

import ChatWindowWrapper from "@/features/chat/components/chat-window/ChatWindowWrapper";
import SlidesNav from "@/components/common/SlidesNav";
import { ImageMaskEditor } from "@/features/chat/components/ImageMaskEditor";
import LineWidthSlider from "@/features/chat/components/LineWidthSlider";
import { clearPoints, getConvexHull } from "@/lib/chat";

const ImagePreviewsWindow = () => {
  const { selectedImageIndex, images, setSelectedImageIndex } = useChat();
  const drawingPointsRef = useRef<Array<[number, number]>>([]);
  const { setFocusedImage } = useChat();

  const {
    isFocusMode,
    onToggleFocusMode,
    canvasRef,
    imageRefs,
    cursorSize,
    setCursorSize,
    onNavigateImage,
  } = useChatOverlay(drawingPointsRef);

  return (
    <ChatWindowWrapper>
      <div className="flex h-full w-full flex-col justify-between">
        <div className="flex h-14 w-full items-center gap-3 px-4">
          {isFocusMode && (
            <div className="flex gap-3">
              <LineWidthSlider setLineWidth={setCursorSize} />
              <Button
                size="icon"
                variant="ghost"
                className="hover:bg-background/60"
                onClick={() => {
                  clearCanvas(canvasRef);
                  clearPoints(drawingPointsRef);
                }}
              >
                <Eraser className="size-5" />
              </Button>
            </div>
          )}

          <div className="ml-auto flex gap-2">
            {isFocusMode ? (
              <button
                className="text-muted-foreground hover:text-foreground"
                onClick={() => {
                  onToggleFocusMode();
                  setFocusedImage(undefined);
                }}
              >
                Cancel
              </button>
            ) : (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-background/60"
                  onClick={() => {
                    onToggleFocusMode();
                    const selectedImage =
                      imageRefs?.current[selectedImageIndex!];

                    const focusedImage = {
                      url: images[selectedImageIndex!].url,
                      annotation: getConvexHull({
                        drawingPointsRef,
                        selectedImage,
                      }),
                    };

                    setFocusedImage(focusedImage);
                  }}
                >
                  {isFocusMode ? "Cancel" : <Paintbrush className="size-5" />}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="hover:bg-background/60"
                  onClick={() => {
                    setSelectedImageIndex(null);
                    setFocusedImage(undefined);
                    clearPoints(drawingPointsRef);
                  }}
                >
                  <X className="size-5" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="p-4">
          <div className="relative mx-auto w-fit">
            {images[selectedImageIndex!] && (
              <Image
                src={images[selectedImageIndex!].url}
                ref={(el) => {
                  if (el && imageRefs.current) {
                    imageRefs.current[selectedImageIndex!] = el;
                  }
                }}
                width={1024}
                height={1024}
                className="h-auto max-h-[100vh] w-fit max-w-full"
                alt={images[selectedImageIndex!].name}
              />
            )}
            {isFocusMode && (
              <div className="absolute inset-0 z-10 cursor-crosshair">
                <div className="relative">
                  <ImageMaskEditor
                    canvasRef={canvasRef}
                    drawingPointsRef={drawingPointsRef}
                    image={imageRefs.current[selectedImageIndex!]}
                    cursorSize={cursorSize}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
        <SlidesNav
          onNavigate={onNavigateImage}
          selectedIndex={selectedImageIndex!}
          total={images.length}
        />
      </div>
    </ChatWindowWrapper>
  );
};

export default ImagePreviewsWindow;
