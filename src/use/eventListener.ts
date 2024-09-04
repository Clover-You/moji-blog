import { useEffect } from 'react'

export function useEventListener<K extends keyof WindowEventMap>(
  element: Window | null,
  type: K,
  listener: (this: Window, ev: WindowEventMap[K]) => any,
  options?: boolean | AddEventListenerOptions,
) {
  useEffect(() => {
    (element ?? window).addEventListener(type, listener, options)

    return () => (element ?? window).removeEventListener(type, listener, options)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
}
