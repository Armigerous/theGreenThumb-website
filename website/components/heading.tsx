import { cn } from "@/lib/utils";

interface headingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children?: React.ReactNode;
}

export const Heading = ({ children, className, ...props }: headingProps) => {
  return (
    <h1
      className={cn(
        "text-4xl sm:text-5xl font-heading font-semibold tracking-tight text-cream-800",
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
};
