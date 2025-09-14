import * as React from 'react'
import { cn } from '@/lib/utils'

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {}

export function Select({ className, ...props }: SelectProps) {
  return (
    <select
      className={cn('flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring', className)}
      {...props}
    />
  )
}

// Export additional components for compatibility
export const SelectContent = ({ children, ...props }: React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{children}</div>
)

export const SelectItem = ({ children, value, ...props }: React.OptionHTMLAttributes<HTMLOptionElement>) => (
  <option value={value} {...props}>{children}</option>
)

export const SelectTrigger = Select

export const SelectValue = ({ placeholder, ...props }: { placeholder?: string } & React.HTMLAttributes<HTMLDivElement>) => (
  <div {...props}>{placeholder}</div>
)