import { ComponentProps, ReactElement } from "react";

type CodeBlockProps = {
  code: string;
} & ComponentProps<"code">;

export const CodeBlock = ({ code }: CodeBlockProps) => {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: code }}
      className="my-4 shadow-md p-4 border rounded-md overflow-x-auto"
    />
  );
};

export const extractLang = (className?: string) => {
  if (!className) return "plaintext";

  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
};

export const extractCodeEl = (children: ReactElement): ReactElement | null => {
  if (!children) {
    console.error("No children found", children);
    return null;
  }
  if (children.type === "code") {
    return children;
  }

  if (children.type === "pre") {
    return extractCodeEl(children.props.children);
  }

  console.error("No code block found", children);
  return null;
};