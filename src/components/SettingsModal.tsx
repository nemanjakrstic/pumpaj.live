import {
  Button,
  Group,
  Modal,
  ModalProps,
  Stack,
  Text,
  useMantineTheme,
} from "@mantine/core";
import { IconMapPin } from "@tabler/icons-react";
import { useStore } from "../store";
import { PlaceSelector } from "./PlaceSelector";

export const SettingsModal = ({ onClose, ...rest }: ModalProps) => {
  const theme = useMantineTheme();

  return (
    <Modal centered withCloseButton={false} onClose={onClose} {...rest}>
      <Stack gap="lg">
        <Text size="lg" style={{ textAlign: "center" }}>
          Odakle pumpaš?
        </Text>

        <PlaceSelector />

        <Group justify="center" p="lg">
          <IconMapPin size={200} color={theme.colors.gray[8]} />
        </Group>

        <Group justify="center">
          <Button
            color="red"
            fw={900}
            size="lg"
            onClick={() => {
              useStore.setState({ acknowledged: true });
              onClose();
            }}
          >
            ZNAM ŠTA TREBA DA RADIM!
          </Button>
        </Group>
      </Stack>
    </Modal>
  );
};
