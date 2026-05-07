import * as React from "react"
import { cn } from "@/lib/utils"

interface FieldProps extends React.ComponentProps<"div"> {
  orientation?: "horizontal" | "vertical"
}

function Field({ className, orientation = "vertical", ...props }: FieldProps) {
  return (
    <div
      data-slot="field"
      data-orientation={orientation}
      className={cn(
        "flex",
        orientation === "horizontal" ? "flex-row items-center gap-2" : "flex-col gap-1",
        className
      )}
      {...props}
    />
  )
}

function FieldLabel({
  className,
  ...props
}: React.ComponentProps<"label">) {
  return (
    <label
      data-slot="field-label"
      className={cn("text-sm text-muted-foreground whitespace-nowrap", className)}
      {...props}
    />
  )
}

export { Field, FieldLabel }
