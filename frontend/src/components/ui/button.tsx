import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 active:scale-95 relative overflow-hidden',
  {
    variants: {
      variant: {
        default: 'btn-primary',
        secondary: 'btn-secondary',
        outline: 'btn-outline',
        ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 hover:text-gray-900 rounded-lg',
        destructive: 'bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 rounded-xl shadow-lg hover:shadow-red-500/25',
        success: 'bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 rounded-xl shadow-lg hover:shadow-green-500/25',
        warning: 'bg-gradient-to-r from-yellow-500 to-orange-500 text-white hover:from-yellow-600 hover:to-orange-600 rounded-xl shadow-lg hover:shadow-yellow-500/25',
        accent: 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:from-purple-600 hover:to-pink-600 rounded-xl shadow-lg hover:shadow-purple-500/25'
      },
      size: {
        default: 'h-11 px-6 py-2',
        sm: 'h-9 rounded-md px-4 text-xs',
        lg: 'h-12 rounded-xl px-8 text-base',
        icon: 'h-11 w-11',
        xs: 'h-8 px-3 text-xs rounded-md'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button'
  return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
})
Button.displayName = 'Button'

export { Button, buttonVariants }