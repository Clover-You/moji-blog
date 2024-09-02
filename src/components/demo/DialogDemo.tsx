'use client'

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure } from '@nextui-org/react'

export function DialogDemo() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure()

  return (
    <>
      <Button onPress={onOpen} variant="ghost" size="sm">Open Modal</Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} placement="auto">
        <ModalContent>
          {onClose => (
            <>
              <ModalHeader className="flex flex-col gap-1">Modal Title</ModalHeader>
              <ModalBody>
                <p>
                  你好，想来一片木屑吗？
                  <br />
                  妈妈说人生就像一碗木屑
                  <br />
                  你永远不知道下一片是什么树的味道
                  <br />
                  你看起来跑得很快
                  <br />
                  真希望我也可以
                  <br />
                  我的腿比较短
                  <br />
                  但有天遇到魔物
                  <br />
                  大家都喊：「跑！戴尔蒙德，跑！」
                  <br />
                  所以我就跑
                  <br />
                  我跑过赐福森林
                  <br />
                  跑过星轨王城
                  <br />
                  跑到了积木矿窟
                  <br />
                  后来有很多人和我一起跑
                  <br />
                  因为有头龙从里面出来了
                  <br />
                  妈妈常说：「永远要追寻新的冒险, 不要怜惜身后的风景」
                  <br />
                  我想这就是我跑步的意义了
                </p>
                {/* <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                  Nullam pulvinar risus non risus hendrerit venenatis.
                  Pellentesque sit amet hendrerit risus, sed porttitor quam.
                </p>
                <p>
                  Magna exercitation reprehenderit magna aute tempor cupidatat consequat elit
                  dolor adipisicing. Mollit dolor eiusmod sunt ex incididunt cillum quis.
                  Velit duis sit officia eiusmod Lorem aliqua enim laboris do dolor eiusmod.
                  Et mollit incididunt nisi consectetur esse laborum eiusmod pariatur
                  proident Lorem eiusmod et. Culpa deserunt nostrud ad veniam.
                </p> */}
              </ModalBody>
              <ModalFooter>
                <Button color="danger" variant="ghost" onPress={onClose} size="sm">
                  Close
                </Button>
                {/* <Button color="primary" onPress={onClose}>
                  Action
                </Button> */}
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  )
}
