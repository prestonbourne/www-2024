import { forwardRef, ComponentProps } from "react";
import { cx } from "class-variance-authority";
import { TWEAK_PANE_CONTAINER_ID } from "@/lib/sketches";


export const Canvas = forwardRef<HTMLCanvasElement, ComponentProps<"canvas">>(
  ({ className, ...rest }, ref) => {
    return (<>
    <div id={TWEAK_PANE_CONTAINER_ID} className="hidden absolute lg:block right-4 mt-4"></div>
      <canvas className={cx("w-full h-full", className)} ref={ref} {...rest} />
      </>
    );
  }
);

Canvas.displayName = "Canvas";
