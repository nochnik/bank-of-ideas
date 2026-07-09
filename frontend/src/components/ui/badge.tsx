import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center rounded-pill px-2 py-0.5 text-caption font-medium transition-colors',
  {
    variants: {
      variant: {
        default:   'bg-s2 text-ink-subtle',
        draft:     'bg-s2 text-ink-subtle',
        submitted: 'bg-accent/15 text-accent',
        approved:  'bg-success/15 text-success',
        rejected:  'bg-danger/15 text-danger',
        barrel:    'bg-barrel/15 text-barrel',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />
}

export { Badge, badgeVariants }
