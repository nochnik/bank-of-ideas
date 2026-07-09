import * as React from 'react'
import * as CheckboxPrimitive from '@radix-ui/react-checkbox'
import { cva, type VariantProps } from 'class-variance-authority'
import { Check, Minus } from 'lucide-react'
import { cn } from '@/lib/utils'

const checkboxVariants = cva(
  `group peer shrink-0 rounded-md border-2 border-black bg-white ring-offset-canvas
   focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2
   disabled:cursor-not-allowed disabled:opacity-50
   data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500 data-[state=checked]:text-white
   data-[state=indeterminate]:bg-blue-500 data-[state=indeterminate]:border-blue-500 data-[state=indeterminate]:text-white
   transition-colors duration-150`,
  {
    variants: {
      size: {
        sm: 'size-4 [&_svg]:size-3',
        md: 'size-5 [&_svg]:size-3.5',
        lg: 'size-6 [&_svg]:size-4',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  },
)

export interface CheckboxProps
  extends React.ComponentPropsWithoutRef<typeof CheckboxPrimitive.Root>,
    VariantProps<typeof checkboxVariants> {}

function Checkbox({ className, size, ...props }: CheckboxProps) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(checkboxVariants({ size }), className)}
      {...props}
    >
      <CheckboxPrimitive.Indicator className="flex items-center justify-center text-current">
        <Check className="group-data-[state=indeterminate]:hidden" />
        <Minus className="hidden group-data-[state=indeterminate]:block" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  )
}

export { Checkbox }
