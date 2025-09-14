import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const statusBadgeVariants = cva(
  'inline-flex items-center text-xs font-medium px-3 py-1.5 rounded-full border transition-all duration-200 hover:scale-105',
  {
    variants: {
      status: {
        'Open': 'bg-status-open/10 text-status-open border-status-open/20 hover:bg-status-open/15',
        'In Progress': 'bg-status-progress/10 text-status-progress border-status-progress/20 hover:bg-status-progress/15',
        'Resolved': 'bg-status-resolved/10 text-status-resolved border-status-resolved/20 hover:bg-status-resolved/15',
        'Closed': 'bg-status-closed/10 text-status-closed border-status-closed/20 hover:bg-status-closed/15'
      }
    }
  }
)

interface StatusBadgeProps extends VariantProps<typeof statusBadgeVariants> {
  status: 'Open' | 'In Progress' | 'Resolved' | 'Closed'
  className?: string
}

export default function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <span className={cn(statusBadgeVariants({ status }), className)}>
      {status}
    </span>
  )
}