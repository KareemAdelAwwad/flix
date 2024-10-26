import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import React from "react"

export default function readyTooltip({ children, title, className }: { children: React.ReactNode, title: string, className?: string }) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger className={className}>{children}</TooltipTrigger>
        <TooltipContent>
          <p>{title}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
