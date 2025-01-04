import { cx } from 'class-variance-authority'
import { ArrowTopRightIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import { ServerImage } from '@/components/image/server-image'
import { Heading } from '@/components/typography'
// import { WorkItemViewsIcon } from '../view-count/icon'
import type { Post } from '@/lib/types'

type PostGridItemProps = {
  post: Post
}

export const PostGridItem: React.FC<PostGridItemProps> = ({ post }) => {

  const containerClass = cx(
    'cursor-pointer block shadow-sheen overflow-hidden',
    'relative rounded-sm overflow-hidden max-h-96',
    'group/card'
  )

  const link = `/${post.type}/${post.slug}`
  const linkTarget = undefined

  const iconClassContainer = cx(
    `text-xs flex items-center gap-1 text-foreground bg-black shadow-dense`,
    'opacity-0 -translate-y-3 transition-all border border-foreground-muted/40',
    'group-hover/card:opacity-100 group-hover/card:translate-y-0 rounded-lg'
  )
  const descClass = cx(
    `text-sm items-center text-foreground-muted px-1 py-1`,
    'opacity-0 translate-y-3 transition-all',
    'group-hover/card:opacity-100 group-hover/card:translate-y-0'
  )

  return (
    <NextLink className={containerClass} href={link} target={linkTarget}>
      <div className="relative w-full h-fit rounded-sm overflow-hidden">
        <ServerImage
          loading='eager'
          src={post.media?.image!}
          alt={`${post.title} cover`}
          className={cx(
            'w-full h-auto transition-all',
            'group-hover/card:contrast-100 group-hover/card:scale-105'
          )}
          sizes="(max-width: 1200px) 60vw, 30vw, (max-width: 768px) 100vw"
        />
        <div
          className={cx(
            '[background-image:linear-gradient(to_top,theme(colors.black),transparent)]',
            'group-hover/card:opacity-70 opacity-0 transition-all ease-in duration-150',
            'w-full h-full absolute top-0 left-0'
          )}
        />
      </div>

      {/* {isWorkRoute(work) && (
        <WorkItemViewsIcon
          slug={work.slug}
          className={cx(
            iconClassContainer,
            'absolute top-2 left-2 delay-100',
            'px-2 py-1 gap-2'
          )}
        />
      )} */}
      <div className={cx(iconClassContainer, 'absolute top-2 right-2', 'p-1')}>
        <ArrowTopRightIcon />
      </div>
      <div className={cx(descClass, 'absolute bottom-0 w-full ease-in')}>
        <Heading
          level={6}
          render="h3"
          className="pl-2 pb-0 opacity-0 group-hover/card:opacity-100"
        >
          {post.title}
        </Heading>
      </div>
    </NextLink>
  )
}
