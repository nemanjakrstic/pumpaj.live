import { ActionIcon, AppShell, Group, Text } from "@mantine/core";
import { IconBrandGithub, IconFocus2, IconSettings } from "@tabler/icons-react";
import { PropsWithChildren } from "react";

interface LayoutProps extends PropsWithChildren {
  onFocusButtonClick: () => void;
  onSettingsButtonClick: () => void;
}

export const Layout = ({
  children,
  onFocusButtonClick,
  onSettingsButtonClick,
}: LayoutProps) => {
  return (
    <AppShell header={{ height: 60 }}>
      <AppShell.Header>
        <Group h="100%" px="md">
          <Text size="xl" fw={900} mr="auto">
            PUMPAJ!
          </Text>

          <ActionIcon
            component="a"
            href="https://github.com/nemanjakrstic/pumpaj.live"
            target="_blank"
            rel="noopener noreferrer"
            variant="default"
            size={40}
          >
            <IconBrandGithub size={32} />
          </ActionIcon>

          <ActionIcon variant="default" size={40} onClick={onFocusButtonClick}>
            <IconFocus2 size={32} />
          </ActionIcon>

          <ActionIcon
            variant="default"
            size={40}
            onClick={onSettingsButtonClick}
          >
            <IconSettings size={32} />
          </ActionIcon>
        </Group>
      </AppShell.Header>

      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
};
