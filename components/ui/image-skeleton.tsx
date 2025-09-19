import { cn } from "@/lib/utils";

interface ImageSkeletonProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Reusable image loading skeleton component
 * Provides a consistent loading state for images across the application
 */
export const ImageSkeleton: React.FC<ImageSkeletonProps> = ({
  className,
  children,
}) => {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      {/* Loading skeleton background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-100 via-brand-50 to-brand-100 animate-pulse">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer" />
      </div>

      {/* Content overlay */}
      {children && <div className="relative z-10">{children}</div>}
    </div>
  );
};
