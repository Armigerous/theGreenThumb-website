"use client";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type PlantStatus = "healthy" | "warning" | "critical" | "dormant";

interface StatusIndicatorProps {
  status: PlantStatus;
}

const StatusIndicator = ({ status }: StatusIndicatorProps) => {
  const statusConfig = {
    healthy: { color: "bg-emerald-500", label: "Healthy" },
    warning: { color: "bg-amber-500", label: "Needs Attention" },
    critical: { color: "bg-rose-500", label: "Critical" },
    dormant: { color: "bg-slate-400", label: "Dormant" },
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className={`w-3 h-3 rounded-full ${statusConfig[status].color}`}
          />
        </TooltipTrigger>
        <TooltipContent>{statusConfig[status].label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StatusIndicator;
