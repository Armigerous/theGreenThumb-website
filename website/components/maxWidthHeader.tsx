import { cn } from "@/lib/utils";

interface MaxWidthHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export const MaxWidthWrapper = ({
  className,
  children,
}: MaxWidthHeaderProps) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-2xl px-2.5 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};
