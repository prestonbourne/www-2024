import { ChevronLeftIcon } from '@radix-ui/react-icons'
import NextLink from 'next/link'
import { cx } from 'class-variance-authority'

type BackLinkProps = {
  href: string
}

export const BackLink = ({ href, ...rest }: BackLinkProps) => {
  const className = cx(
    'flex flex-row gap-1 items-center w-fit py-1 group',
    'hover:text-purple-600 dark:hover:text-lime-500'
  )

  return (
    <NextLink className={className} href={href}>
      <ChevronLeftIcon className="group-hover:-translate-x-1 transition-transform" />
      <div>Back</div>
    </NextLink>
  )
}
