import { cx } from "class-variance-authority";
import * as Tooltip from '@radix-ui/react-tooltip';

type FlexbarItemProps = {
    children: React.ReactNode;
    label: string;
  };
  
  export const FlexbarItem = ({ children, label }: FlexbarItemProps) => {
  
    const tooltipClassName = cx(
      `bg-gray-900 rounded-md py-[2px] px-2 mb-3 font-semibold`,
      `shadow-inner-shine`
    );
  
    return (
      <Tooltip.Provider delayDuration={175}>
        <Tooltip.Root>
          <Tooltip.Portal>
            <Tooltip.Content>
              <div className={tooltipClassName}>{label}</div>
            </Tooltip.Content>
          </Tooltip.Portal>
          <Tooltip.Trigger asChild>
              {children}
          </Tooltip.Trigger>
        </Tooltip.Root>
      </Tooltip.Provider>
    );
};