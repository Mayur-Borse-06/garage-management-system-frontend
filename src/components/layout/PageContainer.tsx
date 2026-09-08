import type { ReactNode } from 'react'
import { cn } from '../../lib/utils'

interface PageContainerProps {
  title: string
  description?: string
  actions?: ReactNode
  className?: string
  children: ReactNode
}

export function PageContainer({ title, description, actions, className, children }: PageContainerProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="flex flex-col gap-3 border-b border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-[-0.04em] text-slate-900">{title}</h1>
          {description ? <p className="mt-1 text-sm text-slate-500">{description}</p> : null}
        </div>
        {actions}
      </div>
      {children}
    </div>
  )
}
