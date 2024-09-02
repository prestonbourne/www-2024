import React, { ComponentProps } from "react";
import { cx } from "class-variance-authority";
import { ClientVideoProvider, ClientVideoDialog, ClientVideoClickTarget } from "./client";

type VideoProps = ComponentProps<'video'> & {
  caption?: string;
  bleed?: boolean;
  borderless?: boolean;
};

export const Video = ({ caption, bleed = false, borderless = false, src, ...props }: VideoProps) => {
  const className = cx(
    "flex flex-col my-10 overflow-hidden mx-auto",
    bleed ? "relative lg:-mx-36 xl:-mx-64" : "max-w-full",
    !borderless && "rounded-md shadow-sheen dark:bg-background/30"
  );
  if (!src) throw new Error("Video component requires a src prop");


  return (
    <ClientVideoProvider caption={caption} src={src}>
      <ClientVideoDialog />
      <ClientVideoClickTarget>
        <figure className={className}>
          <div className="w-full relative flex-1">
            <video src={src} {...props} className="w-full h-full object-contain" />
          </div>
          {caption && (
            <figcaption className="w-full block text-sm text-sub-text pl-6 py-2">
              {caption}
            </figcaption>
          )}
        </figure>
      </ClientVideoClickTarget>
    </ClientVideoProvider>
  );
};
