'use client'

import type { PropsWithChildren } from 'react'
import { NextUIProvider as Provider } from '@nextui-org/react'

export function NextUIProvider({ children }: PropsWithChildren) {
  return <Provider>{children}</Provider>
}
