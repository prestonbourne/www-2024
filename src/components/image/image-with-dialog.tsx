import { ClientImageProvider, ClientImageDialog, ClientImageClickTarget } from "./client-image"
import { ServerImage } from "./server-image"
import { ImageProps as NextImageProps } from "next/image"
import { cx } from "class-variance-authority"

type ImageProps = NextImageProps & {
    src: string;
    alt?: string;
    caption?: string;
  };
  
  const Image = ({ src, alt, caption }: ImageProps) => {

    const className = cx(
        "flex flex-col mb-12 overflow-hidden mx-auto",
        "max-w-full rounded-md surface bg-transparent",
    );

    return (
      <ClientImageProvider src={src} alt={alt } caption={caption}>
        <ClientImageDialog />
         <ClientImageClickTarget >
        <figure className={className}>
          {caption && (
            <figcaption className="w-full block text-sm text-sub-text pl-6 py-2">
              {caption}
            </figcaption>
          )}
          <div className="w-full relative flex-1">
            <ServerImage src={src} alt={alt} />
          </div>
          </figure>
        </ClientImageClickTarget>
      </ClientImageProvider>
    );
  };
  
export { Image }
