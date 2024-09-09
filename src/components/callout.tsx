import { cva } from "class-variance-authority";
import { ReactElement, ReactNode } from "react";
import { InfoCircledIcon, ChevronRightIcon } from "@radix-ui/react-icons";

const TypeToEmoji = {
    error: "🚫",
    info: <InfoCircledIcon />,
    warning: "⚠️",
  };
  
  type CalloutType = keyof typeof TypeToEmoji;
  
  const calloutClasses = cva(
    "overflow-x-auto my-6 rounded-md border py-4 px-6 contrast-more:border-current contrast-more:dark:border-current transition-all",
    {
      variants: {
        type: {
          error: "border-red-200 bg-red-500 text-red-900",
          info: "border-purple-500 bg-purple-200 text-purple-900",
          warning: "border-yellow-200 bg-yellow-500 text-yellow-900",
        },
      },
      defaultVariants: {
        type: "info",
      },
    }
  );
  
  type CalloutProps = {
    type?: CalloutType;
    emoji?: string | ReactNode;
    children: ReactNode;
    title: string;
  };
  
  export function Callout({
    children,
    type = "info",
    emoji = TypeToEmoji[type],
    title,
  }: CalloutProps): ReactElement {
    const justTitle = !children;
  
    if (justTitle) {
      return (
        <div className={calloutClasses({ type })}>
          <div className="flex items-center">
            <div className="select-none text-xl mr-3">{emoji}</div>
            <span className="text-lg">{title}</span>
          </div>
        </div>
      );
    }
  
    return (
      <details className={calloutClasses({ type })}>
        <summary className="flex items-center cursor-pointer">
          <div className="select-none text-xl mr-3">{emoji}</div>
          <span className="font-semibold">{title}</span>
          <ChevronRightIcon className="ml-auto w-5 h-5 arrow-icon" />
        </summary>
        <div className="mt-4">{children}</div>
      </details>
    );
  }