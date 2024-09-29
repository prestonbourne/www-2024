import React from 'react'
import { notFound } from 'next/navigation'
import { WorkMDXRenderer } from '@/components/markdown'
import { formatISOToDate } from '@/lib/index'
import {
  calculateReadingTime,
  getLocalWorkBySlug,
  getLocalWorks,
} from '@/lib/work'
import { NextPageProps } from '@/lib/types'
import { TextWithIcon } from '@/components/TextWithIcon'
import { CalendarIcon, ClockIcon } from '@radix-ui/react-icons'
import { Divider } from '@/components/Divider'
import { Heading } from '@/components/typography'
import { Paragraph as Body } from '@/components/typography/paragraph'
import { WorkWithRoute } from '@/lib/work/types'
import { isWorkWithRoute } from '@/lib/work'
import { BackLink } from '@/components/back-link'
import { ClientViewCount } from '@/components/work/view-count'

export function generateStaticParams() {
  const works: WorkWithRoute[] = getLocalWorks().filter(
    (work): work is WorkWithRoute =>
      work.type === 'work_route' && isWorkWithRoute(work)
  )

  return works.map((work) => ({
    slug: work.slug,
  }))
}

export async function generateMetadata({ params }: NextPageProps) {
  const currentSlug = params.slug
  const work = getLocalWorkBySlug(currentSlug)

  if (!work) return notFound()
  const { title, description } = work.metadata

  return {
    title,
    description,
  }
}

export default async function Page({ params }: NextPageProps) {
  const currentSlug = params.slug
  const work = getLocalWorkBySlug(currentSlug)

  if (!work) return notFound()

  const { metadata } = work

  return (
    <article className="mx-auto">
      <BackLink href="/work" />
      <header>
      <Heading level={1}>{metadata.title}</Heading>
      <Body className="text-sm py-2 text-sub-text">{metadata.description}</Body>
      <div className="flex justify-between my-2 py-0 items-center">
        <TextWithIcon
          text={formatISOToDate(metadata.publishedAt)}
          Icon={CalendarIcon}
        />
        <div className="flex gap-4 my-0 py-0 items-center">
          <TextWithIcon
            text={`${calculateReadingTime(work.content)} mins`}
            Icon={ClockIcon}
          />
          <ClientViewCount shouldIncrement slug={currentSlug} />
        </div>
      </div>
      </header>
      <Divider className="mt-4 mb-7" />
      <main>
      <WorkMDXRenderer source={work.content} />
      </main>
    </article>
  )
}
