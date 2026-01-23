import { cn } from "@/lib/utils";

interface GridBackgroundProps {
  children?: React.ReactNode;
  className?: string;
}

export function GridBackground({ children, className }: GridBackgroundProps) {
  return (
    <div
      className={cn(
        "relative w-full md:min-h-200 flex flex-col items-center justify-center bg-white dark:bg-black overflow-hidden",
        className,
      )}
    >
      <div
        className={cn(
          "absolute inset-0 pointer-events-none",
          "bg-[linear-gradient(to_right,#e5e7eb_1px,transparent_1px),linear-gradient(to_bottom,#e5e7eb_1px,transparent_1px)]",
          "bg-size-[4rem_4rem] [radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]",
          "dark:bg-[linear-gradient(to_right,#1f2937_1px,transparent_1px),linear-gradient(to_bottom,#1f2937_1px,transparent_1px)]",
        )}
      />

      <div className="relative z-20 w-full">{children}</div>
    </div>
  );
}
