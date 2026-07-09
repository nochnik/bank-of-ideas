import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-body font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-[#5e6ad2]/50 disabled:pointer-events-none disabled:opacity-40',
  {
    variants: {
      variant: {
        default:   'bg-accent text-white hover:bg-accent-hover active:bg-accent-focus',
        secondary: 'bg-s1 text-ink border border-hl hover:bg-s2',
        ghost:     'bg-transparent text-ink-subtle hover:text-ink hover:bg-s1',
        danger:    'bg-danger/10 text-danger border border-danger/30 hover:bg-danger/20',
      },
      size: {
        default: 'h-9 px-3.5 py-2',
        sm:      'h-7 px-2.5 text-caption',
        lg:      'h-11 px-5 text-body-lg',
        icon:    'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
