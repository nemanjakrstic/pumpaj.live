import { Anchor } from "@mantine/core";
import { PropsWithChildren } from "react";

interface LinkProps extends PropsWithChildren {
  href: string;
}

export const Link = ({ href, ...rest }: LinkProps) => {
  return (
    <Anchor
      target="_blank"
      rel="noopener noreferrer"
      href={`${href}?utm_source=pumpaj.live&utm_medium=referral`}
      {...rest}
    />
  );
};
