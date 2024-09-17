import { cva } from 'class-variance-authority'

export type SeperatorProps = {
  orientation: 'horizontal' | 'vertical'
}

export const Separator = ({ orientation }: SeperatorProps) => {
  const className = cva(
    [`border-gray-400`],
    {
      variants: {
        orientation: {
          vertical: ['w-[1px]', 'h-4', 'border-l'],
          horizontal: ['h-[1px]', 'w-4', 'border-b'],
        },
      },
    }
  )

  return (
    <hr data-orientation={orientation} className={className({ orientation })} />
  )
}
