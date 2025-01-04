import { cx } from "class-variance-authority";

export const SketchWrapper = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return (
    <div className={cx("surface bg-transparent overflow-hidden", className)}>
      {children}
    </div>
  );
};
