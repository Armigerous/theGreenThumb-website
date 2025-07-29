"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

// Simple fade-in wrapper for smooth content transitions
export function FadeInWrapper({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        delay: delay / 1000,
        ease: [0.4, 0, 0.2, 1], // Custom cubic-bezier for smooth easing
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Staggered list for smooth grid animations
export function StaggeredList({
  children,
  className,
  staggerDelay = 50,
}: {
  children: React.ReactNode[];
  className?: string;
  staggerDelay?: number;
}) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: staggerDelay / 1000,
            delayChildren: 0.1, // Small delay before children start animating
          },
        },
      }}
    >
      {children.map((child, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 30, scale: 0.95 },
            visible: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                duration: 0.6,
                ease: [0.4, 0, 0.2, 1],
                type: "spring",
                stiffness: 100,
                damping: 15,
              },
            },
          }}
        >
          {child}
        </motion.div>
      ))}
    </motion.div>
  );
}

// Smooth transition between loading and content states
export function LoadingTransition({
  isLoading,
  loadingContent,
  content,
  className,
}: {
  isLoading: boolean;
  loadingContent: React.ReactNode;
  content: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <AnimatePresence mode="wait" initial={false}>
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {loadingContent}
          </motion.div>
        ) : (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              delay: 0.05,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {content}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Specialized component for image loading transitions to prevent flashing
export function ImageLoadingTransition({
  children,
  skeleton,
  minLoadTime = 100,
  className,
}: {
  children: React.ReactNode;
  skeleton: React.ReactNode;
  minLoadTime?: number;
  className?: string;
}) {
  const [showSkeleton, setShowSkeleton] = useState(true);

  // Reason: Prevent skeleton from showing too briefly, causing flash
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSkeleton(false);
    }, minLoadTime);

    return () => clearTimeout(timer);
  }, [minLoadTime]);

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        {showSkeleton && (
          <motion.div
            key="skeleton"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.3,
              ease: [0.4, 0, 0.2, 1],
            }}
          >
            {skeleton}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {!showSkeleton && (
          <motion.div
            key="content"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.4,
              ease: [0.4, 0, 0.2, 1],
            }}

          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Generic skeleton wrapper for consistent loading states
export function SkeletonWrapper({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: delay / 1000,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
