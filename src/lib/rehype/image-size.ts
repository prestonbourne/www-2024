//@ts-nocheck
import "server-only";
import getImageSize from "image-size";
import { visit } from "unist-util-visit";
import path from "path";

// credit to https://mmazzarolo.com/blog/2023-07-29-nextjs-mdx-image-size/

/**
 * Analyze local MDX images and add `width` and `height` attributes to the
 * generated `img` elements.
 * Supports both markdown-style images and MDX <Image /> components.
 * @param {string} options.root - The root path when reading the image file.
 */
export const rehypeImageSize = (options) => {
  return (tree) => {
    // This matches all images that use the markdown standard format ![label](path).
    visit(tree, { type: "element", tagName: "img" }, (node) => {
      if (node.properties.width || node.properties.height) {
        return;
      }
      const imagePath = `${options?.root ?? ""}${node.properties.src}`;
      const imageSize = getImageSize(imagePath);
      node.properties.width = imageSize.width;
      node.properties.height = imageSize.height;
    });
    // This matches all MDX' <Image /> components.
    // Feel free to update it if you're using a different component name.
    visit(tree, { type: "mdxJsxFlowElement", name: "Image" }, (node) => {
      const srcAttr = node.attributes?.find((attr) => attr.name === "src");
      // const imagePath = `${options?.root ?? ""}${srcAttr.value}`;
      const imagePath = path.join(path.resolve( process.cwd(), './public') + extractSrcValue(node));
      console.log("imagePath", imagePath);
      const imageSize = getImageSize(imagePath);
      const widthAttr = node.attributes?.find((attr) => attr.name === "width");
      const heightAttr = node.attributes?.find(
        (attr) => attr.name === "height"
      );
      if (widthAttr || heightAttr) {
        // If `width` or `height` have already been set explicitly we
        // don't want to override them.
        return;
      }
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "width",
        value: imageSize.width,
      });
      node.attributes.push({
        type: "mdxJsxAttribute",
        name: "height",
        value: imageSize.height,
      });
    });
  };
};

/* 
no idea why but sometimes the src value is doubly nested
my initial hunch was that doing
<Image src={imageUrl} alt="Sketch Image" objectFit="cover" fill />
would be different to doing
<Image src="some/path" alt="Sketch Image" objectFit="cover" fill />

but that is not the case, so I'm not sure why the src value is sometimes nested

*/
const extractSrcValue = (node) => {
  const srcAttr = node.attributes?.find((attr) => attr.name === "src");
  const srcValue = srcAttr.value;
  if (typeof srcValue === "object" && srcValue.value) {
    // Strip double quotes and single quotes only at the start and end
    const cleanedValue = srcValue.value.replace(/^["']|["']$/g, "");
    return cleanedValue;
  }

  return srcValue;
};
