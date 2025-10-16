import { cn } from "@/lib/utils";

interface headingProps extends React.HTMLAttributes<HTMLHeadingElement> {
	children?: React.ReactNode;
}

export const Heading = ({ children, className, ...props }: headingProps) => {
	return (
		<h1
			className={cn(
				"text-3xl sm:text-4xl md:text-5xl font-title-bold tracking-tight text-cream-800",
				className
			)}
			{...props}
		>
			{children}
		</h1>
	);
};
