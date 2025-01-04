import { cx } from "class-variance-authority";
import * as Tooltip from "@radix-ui/react-tooltip";

type FlexbarItemProps = {
  children: React.ReactNode;
  label: string;
  active?: boolean;
};

export const FlexbarItem = ({
  children,
  label,
  active = false,
}: FlexbarItemProps) => {
  const tooltipClassName = cx(
    `dark:bg-gray-900 bg-white rounded-md py-[2px] px-2 mb-3 font-semibold`,
    `dark:shadow-inner-shine shadow-dense`
  );

  return (
    <Tooltip.Provider delayDuration={175}>
      <Tooltip.Root>
        <Tooltip.Portal>
          <Tooltip.Content sideOffset={8}>
            <div className={cx(
              `dark:bg-gray-900 bg-white rounded-md py-[2px] px-2 mb-3 font-semibold`,
              `dark:shadow-inner-shine shadow-dense`
            )}>{label}</div>
          </Tooltip.Content>
        </Tooltip.Portal>
        <Tooltip.Trigger asChild>
          <div className="relative">
            <div className="sr-only">{label}</div>
            {children}
            {active && (
              <div
                className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-purple-700 dark:bg-lime-200 rounded-full"
              />
            )}
          </div>
        </Tooltip.Trigger>
      </Tooltip.Root>
    </Tooltip.Provider>
  );
};
