import * as React from "react"

import { cn } from "@/lib/utils"

type BadgeVariant = "default" | "secondary" | "outline" | "destructive"

function badgeVariantClass(variant: BadgeVariant) {
  switch (variant) {
    case "secondary":
      return "border-transparent bg-zinc-100 text-zinc-800"
    case "outline":
      return "border-zinc-200 bg-transparent text-zinc-700"
    case "destructive":
      return "border-transparent bg-red-600 text-white"
    case "default":
    default:
      return "border-transparent bg-zinc-900 text-white"
  }
}

function Badge({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<"span"> & { variant?: BadgeVariant }) {
  return (
    <span
      data-slot="badge"
      className={cn(
        "inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-xs font-medium whitespace-nowrap",
        badgeVariantClass(variant),
        className
      )}
      {...props}
    />
  )
}

export { Badge }
