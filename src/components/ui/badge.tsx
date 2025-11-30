import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const badgeVariants = cva(
  "inline-flex items-center justify-center border-3 border-ink px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 transition-all",
  {
    variants: {
      variant: {
        default:
          "bg-terracotta text-rice shadow-brutal-sm",
        secondary:
          "bg-indigo text-rice shadow-brutal-sm",
        destructive:
          "bg-red-600 text-rice shadow-brutal-sm",
        outline:
          "bg-white text-ink",
        success:
          "bg-green-600 text-rice shadow-brutal-sm",
        warning:
          "bg-saffron text-ink shadow-brutal-sm",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

function Badge({
  className,
  variant,
  asChild = false,
  ...props
}: React.ComponentProps<"span"> &
  VariantProps<typeof badgeVariants> & { asChild?: boolean }) {
  const Comp = asChild ? Slot : "span"

  return (
    <Comp
      data-slot="badge"
      className={cn(badgeVariants({ variant }), className)}
      {...props}
    />
  )
}

export { Badge, badgeVariants }
