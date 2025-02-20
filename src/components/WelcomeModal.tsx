import { Alert, Button, Group, Image, Modal, Stack, Text } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import { useEffect } from "react";
import splash from "../images/splash.webp";
import { Link } from "./Link";

interface WelcomeModalProps {
  onClose: () => void;
}

export const WelcomeModal = ({ onClose }: WelcomeModalProps) => {
  const [opened, { close }] = useDisclosure(true);

  useEffect(() => {
    if (!opened) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [opened]);

  return (
    <Modal
      size="md"
      opened={opened}
      onClose={close}
      overlayProps={{ style: { background: "black" } }}
      closeOnClickOutside={false}
      withCloseButton={false}
      centered
    >
      <Stack gap="lg">
        <Image src={splash} />

        <Text size="lg" style={{ textAlign: "center" }}>
          Nastanak ove aplikacije inspirisan je{" "}
          <Link href="https://www.instagram.com/p/DGIuPstCDPG">objavom</Link>{" "}
          Eko straže na Instagram-u. Hvala{" "}
          <Link href="https://www.instagram.com/ekostraza">@ekostraza</Link> i{" "}
          <Link href="https://www.instagram.com/bojan.simisic">
            @bojan.simisic
          </Link>{" "}
          za sve što radite!
        </Text>

        <Group justify="center">
          <Button color="red" fw={900} size="xl" onClick={close}>
            SPREMAN SAM!
          </Button>
        </Group>

        <Alert variant="light" color="blue" style={{ textAlign: "center" }}>
          <Text size="xs">
            This site is protected by reCAPTCHA and the Google{" "}
            <a href="https://policies.google.com/privacy">Privacy Policy</a> and{" "}
            <a href="https://policies.google.com/terms">Terms of Service</a>{" "}
            apply.
          </Text>
        </Alert>
      </Stack>
    </Modal>
  );
};
