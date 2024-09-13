'use client'
import { EyeOpenIcon } from '@radix-ui/react-icons'
import { useRealTimeViewCount } from './hooks'
import { LIKES_VIEWS_SENTINEL } from '@/lib/work'
import type { ComponentProps } from 'react'

type WorkItemViewsProps = { slug: string } & ComponentProps<'div'>

export function WorkItemViewsIcon({ slug, className }: WorkItemViewsProps) {
  const { views, loading } = useRealTimeViewCount(slug)

  if (loading || views === LIKES_VIEWS_SENTINEL) return

  return (
    <div className={className}>
      <EyeOpenIcon />
      <div>{views}</div>
    </div>
  )
}
