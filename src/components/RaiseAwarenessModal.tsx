import { Modal, ModalProps, Text } from "@mantine/core";

export const RaiseAwarenessModal = (props: ModalProps) => {
  return (
    <Modal centered {...props} closeOnClickOutside={false}>
      <Text fw={900} size="xl" style={{ textAlign: "center" }}>
        Dosta je kliktanja po internetu, sada je vreme za izlazak na ulice!
      </Text>
    </Modal>
  );
};
