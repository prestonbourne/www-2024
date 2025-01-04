import { forwardRef, ComponentProps } from "react";
import { cx } from "class-variance-authority";
import { TWEAK_PANE_CONTAINER_ID } from "@/lib/sketches";
import { SketchWrapper } from "../sketch-wrapper";

export const Canvas = forwardRef<HTMLCanvasElement, ComponentProps<"canvas">>(
  ({ className, ...rest }, ref) => {
    return (
      <SketchWrapper>
        <canvas
          className={cx("w-full h-full", className)}
          ref={ref}
          {...rest}
        />
      </SketchWrapper>
    );
  }
);

Canvas.displayName = "Canvas";
