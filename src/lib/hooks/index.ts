import React from 'react'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' && (window.document?.createElement || window.navigator?.product === 'ReactNative')
    ? React.useLayoutEffect
    : React.useEffect


export const usePreventHydrationMismatch  = () => {
  const [hasHydrated, setHasHydrated] = React.useState(false)

  useIsomorphicLayoutEffect(() => {
    setHasHydrated(true)
  }, [])

  return hasHydrated
}