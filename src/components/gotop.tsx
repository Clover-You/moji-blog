'use client'
import { Button } from '@nextui-org/react'
import { useWindowScroll } from 'react-use'

export function GoTopBtn() {
  function toTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    })
  }

  const windowScroll = useWindowScroll()
  const showClass = windowScroll.y > 300 ? 'opacity-30' : '!opacity-0 pointer-events-none'

  return (
    <Button
      isIconOnly
      className={`fixed w-10 h-10 right-3 bottom-20 hover:opacity-100 ${showClass} z-10 `}
      variant="light"
      onClick={toTop}
      aria-label="Go to the top"
    >
      <span className="icon-[humbleicons--arrow-up] w-4 h-4"></span>
    </Button>
  )
}
