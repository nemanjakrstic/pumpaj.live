import { Button, Group, Modal, ModalProps, Stack, Text } from "@mantine/core";

export const RaiseAwarenessModal = (props: ModalProps) => {
  return (
    <Modal centered {...props} closeOnClickOutside={false}>
      <Stack gap="xl">
        <Text c="white" fw={900} size="xl" style={{ textAlign: "center" }}>
          Još nisi na ulici? Šta čekaš?
        </Text>

        <Text fw={900} size="md" style={{ textAlign: "center" }}>
          Klikni dole 👇
        </Text>

        <Group justify="center">
          <Button
            size="xl"
            fw={900}
            component="a"
            href="https://kudanaprotest.rs"
            target="_blank"
            rel="noopener noreferrer"
            color="green"
          >
            https://kudanaprotest.rs
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
