import React, { useEffect, useState } from 'react'

export const useIsomorphicLayoutEffect =
  typeof window !== 'undefined' && (window.document?.createElement || window.navigator?.product === 'ReactNative')
    ? React.useLayoutEffect
    : React.useEffect


export const usePreventHydrationMismatch  = () => {
  const [hasHydrated, setHasHydrated] = React.useState(false)

  useEffect(() => {
    setHasHydrated(true)
  }, [])

  return {
    hasHydrated,
  }
}


export const useIsFirstRender = () => {
  const isFirst = React.useRef(true)

  React.useEffect(() => {
    isFirst.current = false
  }, [])

  return  {
    isFirst: isFirst.current,
  }
}


const isDifferent = (a: unknown, b: unknown): boolean => {
  if (Array.isArray(a) && Array.isArray(b)) {
    return b.length !== a.length || a.some((v, i) => isDifferent(v, b[i]));
  }

  return a !== b;
}

/**
 * @param value - state to watch
 * @param onChange - when the state changed
 * @param isUpdated - a function that determines if the state is updated
 */
export const useOnChange = <T>(
  value: T,
  onChange: (current: T, previous: T) => void,
  isUpdated: (prev: T, current: T) => boolean = isDifferent,
): void => {
  const [prev, setPrev] = useState<T>(value);

  if (isUpdated(prev, value)) {
    onChange(value, prev);
    setPrev(value);
  }
}
