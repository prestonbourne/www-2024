import { cx } from "class-variance-authority";

type ButtonToggleOption = {
  label: string;
  icon: React.ReactNode;
  value: string;
};

type ButtonToggleProps = {
  options: ButtonToggleOption[];
  value: string;
  onChange: (value: string) => void;
};

export const ButtonToggle = ({
  options,
  value,
  onChange,
}: ButtonToggleProps) => {
  return (
    <span className="flex w-fit items-center gap-0.5 rounded surface p-0.5">
      {options.map(({ label, icon, value: optionValue }) => (
        <button
          type="button"
          key={label}
          onClick={() => onChange(optionValue)}
          className={cx(
            "transition-all flex h-6 w-6 items-center justify-center rounded-sm hover:brightness-120",
            {
              "text-action border-action bg-action/10": value === optionValue,
            }
          )}
        >
          {icon}
        </button>
      ))}
    </span>
  );
};
