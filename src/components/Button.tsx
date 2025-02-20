import { ComponentProps } from "react";
import styles from "./Button.module.css";

export const Button = ({ children, ...rest }: ComponentProps<"button">) => {
  return (
    <button {...rest} className={styles.root} role="button">
      <span className={styles.root_shadow}></span>
      <span className={styles.root_edge}></span>
      <span className={styles.root_front}>{children}</span>
    </button>
  );
};
