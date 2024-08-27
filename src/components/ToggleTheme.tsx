'use client'

import { Button } from '@nextui-org/react'

export function ToggleTheme() {
  return (
    <Button
      className="text-3xl"
      onClick={() => {
        document.documentElement.classList.toggle('dark')
      }}
    >
      <span className="icon-[ph--sun] dark:icon-[ph--moon] !w-5 !h-5 align-text-bottom"></span>
    </Button>
  )
}
