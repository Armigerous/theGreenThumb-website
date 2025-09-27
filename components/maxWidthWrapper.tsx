import { cn } from "@/lib/utils";
import { MaxWidthWrapperProps } from "@/types/MaxWidthWrapper";

export const MaxWidthWrapper = ({
  className,
  children,
}: MaxWidthWrapperProps) => {
  return (
    <div
      className={cn(
        "h-full mx-auto w-full max-w-screen-2xl px-4 sm:px-6 md:px-20",
        className
      )}
    >
      {children}
    </div>
  );
};
