import React from 'react'
import { cn } from '@/lib/utils'

type InputProps = React.ComponentProps<'input'> & {
  variant?: 'default' | 'unstyled'
  className?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, variant = 'default', type = 'text', ...props }, ref) => {
    return (
      <input
        ref={ref}
        type={type}
        className={cn(
          // Style de base
          'text-sm text-foreground placeholder:text-muted-foreground focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',

          // Style par défaut
          variant === 'default' &&
            'rounded-xl border border-border bg-card-muted px-4 py-2.5 transition focus:border-primary focus:ring-2 focus:ring-primary-light',

          // Style unstyled
          variant === 'unstyled' && 'bg-transparent',

          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'

export default Input
