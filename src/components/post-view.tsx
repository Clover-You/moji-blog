'use client'
import { useEvent } from 'react-use'
import { Image, Modal, ModalBody, ModalContent } from '@nextui-org/react'
import React from 'react'
import styles from './post-view.module.css'

interface PostViewProps extends React.PropsWithChildren {
  content?: React.ReactNode
}

export function PostView({ children, content }: PostViewProps) {
  return (
    <div
      className={`${styles.article} slide-enter-content`}
    >
      <ImagePreview />
      {content}
      {children}
    </div>
  )
}

function ImagePreview() {
  const [imagePreviewState, setImagePreviewState] = React.useState(false)
  const imageModel = React.useRef<HTMLImageElement>()
  let invertClass = 'filter dark:invert'

  useEvent('click', (e) => {
    const path = Array.from(e.composedPath())
    const first = path[0]

    if (!(first instanceof HTMLElement))
      return
    if (first.tagName !== 'IMG')
      return
    if (first.classList.contains('no-preview'))
      return

    imageModel.current = first as HTMLImageElement

    if (!first.classList.contains('dark:invert'))
      invertClass = ''

    setImagePreviewState(true)
  })

  return (
    <Modal
      isOpen={imagePreviewState}
      onOpenChange={setImagePreviewState}
      backdrop="blur"
      placement="center"
      size="full"
      classNames={{
        base: 'bg-transparent',
      }}
    >
      <ModalContent
        className="mx-auto"
        onClick={() => setImagePreviewState(false)}
      >
        <ModalBody className="overflow-auto flex items-center justify-center">
          <Image
            src={imageModel.current?.src ?? ''}
            alt={imageModel.current?.alt ?? ''}
            removeWrapper
            className={`max-w-full max-h-full z-10 bg-cover ${invertClass}`}
            onClick={e => e.stopPropagation()}
          />
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}
