import { codeToHtml } from "shiki";
import { ComponentProps } from "react";

const extractLang = (className?: string) => {
  if (!className) return "plaintext";

  const match = className.match(/language-(\w+)/);
  return match ? match[1] : "plaintext";
};

type CodeBlockProps = ComponentProps<"code">;

export const CodeBlock = async ({ children, className }: CodeBlockProps) => {
  const lang = extractLang(className);
  const html = await codeToHtml(children as string, {
    lang,
    theme: "nord",
  });
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
};
