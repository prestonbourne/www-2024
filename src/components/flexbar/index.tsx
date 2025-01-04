'use client'
import React, { useRef } from 'react'
import { motion } from 'framer-motion'
import { cx } from 'class-variance-authority'
import { useSnap, type SnapPointsType } from './useSnap'
import {
  HomeIcon,
  BackpackIcon,
  SunIcon,
  MoonIcon,
} from '@radix-ui/react-icons'
import { FlexbarItem } from './item'
import NextLink from 'next/link'
import { useTheme } from 'next-themes'
import { usePreventHydrationMismatch } from '@/lib/hooks'
import { usePathname } from 'next/navigation'
import { Separator } from './separator'

// if you're wondering, why tf is this so complicated for a seemingly normal navbar
//...just lemme cook working on something cool

export const Flexbar = () => {
  const containerRef = useRef<HTMLDivElement>(null)
  const flexbarRef = useRef<HTMLDivElement>(null)
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isSelected = (path: string) => {
    return pathname === path || pathname.startsWith(`${path}/`)
  }

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark')
  }

  const snapPoints: SnapPointsType = {
    type: 'constraints-box',
    unit: 'percent',
    points: [{ x:1, y: 0.0 }],
  }

  // const { dragProps, snapTo } = useSnap({
  //   direction: 'both',
  //   snapPoints,
  //   ref: flexbarRef,
  //   constraints: containerRef,
  // })

  const itemClassName = cx(
    `bg-transparent block`,
    `p-4`,
    `dark:hover:bg-gray-200/10 hover:bg-slate-800/10`,
    `cursor-pointer`
  )

  const ThemeIcon = theme === 'dark' ? SunIcon : MoonIcon
  const { hasHydrated } = usePreventHydrationMismatch()

  const toolbarClassName = cx(
    `dark:bg-black/70 rounded-full`,
    `z-40 flex flex-row items-center gap-2 cursor-pointer bg-white/70`,
    `select-none`,
    `backdrop-blur-md overflow-hidden`,
    `shadow-inner-shine shadow-dense dark:border-slate-100/20 border`,
    `transition-all`,
    !hasHydrated && `opacity-0 -translate-y-2 blur`,
    // remove these styles when making dynamic and ensure pos fixed
    `absolute top-16 right-2`
  )


  return (
    <>
   { /* these values are hard coded 
    based on <body> width, they account for padding + margin */}
      {/* <div
        ref={containerRef}
        className={cx(
          'w-[450px] sm:w-[736px]',  
          'max-w-sc',
          'h-screen -mt-8 fixed mx-auto',
          'pointer-events-none touch-none'
        )}
      > 
      {snapPoints.points.map((p, ind) => (
          <div
            key={ind} // Array is static so it's fine to use index as key
            className="absolute bg-red-800 rounded-full z-50"
            style={{
              top: p.y === undefined ? "0" : (height - 50) * p.y,
              bottom: p.y === undefined ? "0" : undefined,
              left: p.x === undefined ? "0" : (width - 167) * p.x,
              right: p.x === undefined ? "0" : undefined,
              width: p.x === undefined ? undefined : p.y === undefined ? 4 : 8,
              height: p.y === undefined ? undefined : p.x === undefined ? 4 : 8,
            }}
          />
        ))} 
      </div> 
      */}

      {/* Flexbar Component */}
      <motion.div ref={flexbarRef} className={toolbarClassName} >
        <FlexbarItem label="Home" active={isSelected('/')}>
          <NextLink href="/" className={itemClassName}>
            <HomeIcon />
          </NextLink>
        </FlexbarItem>
        <FlexbarItem label="Work" active={isSelected('/work')}>
          <NextLink href="/work" className={itemClassName}>
            <BackpackIcon />
          </NextLink>
        </FlexbarItem>
        <Separator orientation={'vertical'} />
        <FlexbarItem label="Toggle Theme">
          <button onClick={toggleTheme} className={itemClassName}>
            {hasHydrated ? (
              <ThemeIcon />
            ) : (
              <div className="w-4 h-4 animate-pulse bg-gray-500/30 rounded-md" />
            )}
          </button>
        </FlexbarItem>
      </motion.div>
    </>
  )
}
