import type { Result, WorkWithRoute, Work } from '@/lib/work/types'
import __worksMap from './worksMap.json' assert { type: 'json' }
import { SupabaseClient } from '@/lib/supabase/types'
import { WorkRow } from '@/lib/work/types'

// @ts-ignore, at build time we run a check to ensure this is a valid object (see scripts/prebuild/01-build-work-map.ts)
let worksMap: Record<string, Work> = __worksMap

export const LIKES_VIEWS_SENTINEL = -1

type PostgrestError = {
  message: string
  details: string
  hint: string
  code: string
}

export const isWorkWithRoute = (work: Work): work is WorkWithRoute => {
  return (
    (work as WorkWithRoute).slug !== undefined &&
    (work as WorkWithRoute).content !== undefined
  )
}

const makeSupabaseError = (pgErr: PostgrestError) => {
  const error: Error = {
    name: 'SupabaseError',
    ...pgErr,
  }
  return error
}

type WorkRouteMap = Map<string, Work>

const localWorksMap: WorkRouteMap = new Map(
  Object.entries(worksMap as Record<string, WorkWithRoute>)
)
const localWorksArr: Work[] = Object.values(worksMap)

export const getLocalWorks = (): Work[] => {
  return localWorksArr
}

export const getLocalWorkBySlug = (slug: string): WorkWithRoute | undefined => {
  return localWorksMap.get(slug) as WorkWithRoute
}



export const incrementViewsBySlug = async (
  slug: string,
  supabase: SupabaseClient
): Promise<Result<number>> => {
  const { error, data } = await supabase.rpc('increment_work_views_by_slug', {
    work_slug: slug,
  })

  console.log("`incrementViewsBySlug:", {
    slug,
    data,
    error
  })

  if (error) {
    console.error('Error incrementing work views', error)
    return { data: null, error: makeSupabaseError(error) }
  }
  return { data, error: null }
}

export const isValidWorkRow = (data: any): data is WorkRow => {
  return (
    typeof data === 'object' &&
    typeof data.slug === 'string' &&
    typeof data.publish_date === 'string' &&
    typeof data.content === 'string' &&
    typeof data.views_count === 'number' &&
    typeof data.likes_count === 'number'
  )
}

export const extractWorkFromRow = (row: WorkRow): WorkWithRoute => {
  const title = worksMap[row.slug]?.metadata.title

  return {
    slug: row.slug,
    type: 'work_route',
    metadata: {
      title: title || '',
      publishedAt: row.publish_date,
      description: row.description || '',
    },
    content: row.content,
    views: row.views_count || LIKES_VIEWS_SENTINEL,
    likes: row.likes_count || LIKES_VIEWS_SENTINEL,
  }
}

let remotesWorkMap: Map<string, WorkWithRoute> = new Map()
const resolveWorks = (remoteWorks: WorkWithRoute[]): WorkWithRoute[] => {
  const combinedWorks: WorkWithRoute[] = []

  const remoteWorksMap = new Map(remoteWorks.map((work) => [work.slug, work]))

  for (const localWork of localWorksArr) {
    if (localWork.type !== 'work_route') continue
    const remoteWork = remoteWorksMap.get(localWork.slug)

    if (!remoteWork) {
      combinedWorks.push({
        ...localWork,
        likes: LIKES_VIEWS_SENTINEL,
        views: LIKES_VIEWS_SENTINEL,
      })
    }

    if (remoteWork) {
      const combinedWork: WorkWithRoute = {
        slug: localWork.slug,
        type: 'work_route',
        metadata: {
          title: localWork.metadata.title,
          description: localWork.metadata.description,
          publishedAt: remoteWork.metadata.publishedAt,
        },
        content: localWork.content,
        views: remoteWork.views,
        likes: remoteWork.likes,
      }
      localWorksMap.set(localWork.slug, combinedWork)
      combinedWorks.push(combinedWork)
    }
  }
  return combinedWorks
}

const _fetchRemoteWorks = async (
  supabase: SupabaseClient
): Promise<Result<WorkWithRoute[]>> => {
  const { data, error } = await supabase.from('work').select('*')
  if (error) {
    console.error('Error fetching works', error)
    return { data: null, error: makeSupabaseError(error) }
  }

  const validData = data.filter(isValidWorkRow)
  const mappedData = validData.map(extractWorkFromRow)
  return { data: mappedData, error: null }
}

export const fetchRemoteWorks = async (
  supabase: SupabaseClient
): Promise<Result<WorkWithRoute[]>> => {
  const remoteWorks = await _fetchRemoteWorks(supabase)
  if (remoteWorks.error) return { data: null, error: remoteWorks.error }

  const data = resolveWorks(remoteWorks.data)
  return { data, error: null }
}

export const calculateReadingTime = (content: string) => {
  const wordsPerMinute = 220
  const words = content.split(/\s/g).length
  const minutes = words / wordsPerMinute
  const readTime = Math.floor(minutes)
  return readTime
}

export const fetchRemoteWorkBySlug = async (
  slug: string,
  supabase: SupabaseClient
): Promise<Result<WorkWithRoute>> => {
 
  const { data, error } = await supabase
    .from('work')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching work by slug', error)
    return { data: null, error: makeSupabaseError(error) }
  }

  if (!isValidWorkRow(data)) {
    return { data: null, error: new Error('Invalid work data') }
  }

  const work = extractWorkFromRow(data)

  // Update the cache
  remotesWorkMap.set(slug, work)

  return { data: work, error: null }
}
