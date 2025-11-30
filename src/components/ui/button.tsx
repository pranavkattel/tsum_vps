import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-mono text-xs font-bold uppercase tracking-wider transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none",
  {
    variants: {
      variant: {
        default:
          "bg-terracotta text-rice border-3 border-ink shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1",
        destructive:
          "bg-red-600 text-rice border-3 border-ink shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1",
        outline:
          "border-3 border-ink bg-white text-ink shadow-brutal hover:bg-saffron hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1",
        secondary:
          "bg-indigo text-rice border-3 border-ink shadow-brutal hover:shadow-brutal-hover hover:translate-x-1 hover:translate-y-1",
        ghost:
          "hover:bg-saffron hover:text-ink border-3 border-transparent hover:border-ink",
        link: "text-terracotta underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4",
        lg: "h-12 px-8",
        icon: "size-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
