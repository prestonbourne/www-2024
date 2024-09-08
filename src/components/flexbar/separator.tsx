import * as RadixSeperator from '@radix-ui/react-separator'


export type SeperatorProps = {
    asChild: boolean
    orientation: "horizontal" | "vertical"
    decorative: boolean
}

export const Separator = (props: SeperatorProps) => {
    return <RadixSeperator.Root {...props} />
}