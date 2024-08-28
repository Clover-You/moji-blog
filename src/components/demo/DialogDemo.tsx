import { AlertDialog, Button, Flex } from '@radix-ui/themes'

export function DialogDemo() {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Open dialog</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Dialog</AlertDialog.Title>
        <AlertDialog.Description size="2">
          <pre
            dangerouslySetInnerHTML={{
              __html: `Genshin Impact... Hey hey hey... For fun
            
原神...诶嘿嘿...好玩...`,
            }}
          />
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" disabled>
              Revoke access
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  )
}
