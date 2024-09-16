import { useEffect, useReducer } from 'react'
import { getClient } from '@/lib/supabase/browser-client'
import { fetchRemoteWorkBySlug, incrementViewsBySlug } from '@/lib/work'
import { LIKES_VIEWS_SENTINEL } from '@/lib/work'
import { useIsFirstRender } from '@/lib/hooks'
import { incrementViewsBySlugAction } from '@/lib/work/actions'

type RealTimeViewCountState = {
  views: number
  loading: boolean
  error: Error | null
}

type ViewCountAction =
  | { type: 'LOADING' }
  | { type: 'SUCCESS'; payload: number }
  | { type: 'ERROR'; payload: Error }

function viewCountReducer(
  state: RealTimeViewCountState,
  action: ViewCountAction
): RealTimeViewCountState {
  switch (action.type) {
    case 'LOADING':
      return { ...state, loading: true, error: null }
    case 'SUCCESS':
      return { views: action.payload, loading: false, error: null }
    case 'ERROR':
      return { ...state, loading: false, error: action.payload }
    default:
      return state
  }
}

export const useRealTimeViewCount = (slug: string, shouldIncrement = false) => {
  const [state, dispatch] = useReducer(viewCountReducer, {
    views: LIKES_VIEWS_SENTINEL,
    loading: false,
    error: null,
  })
  const supabase = getClient()
  const { isFirst } = useIsFirstRender()
  const inProd = process.env['VERCEL_ENV']
  const canIncrement = isFirst && shouldIncrement && inProd
  console.log({
    isFirst,
    inProd,
    shouldIncrement,
    res: canIncrement
  })

  useEffect(() => {
    ;(async function initializeViewCount() {
      dispatch({
        type: 'LOADING',
      })
      if (canIncrement) {
        const { data, error } = await incrementViewsBySlugAction(slug)
        if (error) {
          /** just go to next if statement, we'll try to fetch current `view` and sacrifice the increment */
        } else {
          dispatch({
            type: 'SUCCESS',
            payload: data,
          })
        }
      }

      const { data, error } = await fetchRemoteWorkBySlug(slug, supabase)
      if (error) {
        dispatch({ type: 'ERROR', payload: error })
        return
      }

      if (!data || !data.views) {
        dispatch({
          type: 'ERROR',
          payload: new Error(
            `Unknown Error: Unable to fetch view count for ${slug}`
          ),
        })
        return
      }

      dispatch({
        type: 'SUCCESS',
        payload: data.views,
      })
    })()
  }, [slug, supabase, canIncrement])

  useEffect(() => {
    const subscribeToViewChanges = () => {
      const channel = supabase
        .channel('realtime:work.views')
        .on(
          'postgres_changes',
          {
            event: '*',
            schema: 'public',
            table: 'work',
          },
          (payload) => {
            const hasViewCount =
              'views_count' in payload.new &&
              typeof payload.new.views_count === 'number'
            const sameSlug = 'slug' in payload.new && payload.new.slug === slug
            if (hasViewCount && sameSlug) {
              //@ts-ignore
              dispatch({ type: 'SUCCESS', payload: payload.new.views_count })
            }
          }
        )
        .subscribe()

      return channel
    }
    const channel = subscribeToViewChanges()
    return () => {
      channel.unsubscribe()
    }
  }, [slug, supabase])

  return state
}
