import io from "socket.io-client";
import { useStore } from "./store";

export const socket = io(import.meta.env.VITE_API_URL);

socket.on("connect", () => {
  grecaptcha.ready(function () {
    grecaptcha
      .execute(import.meta.env.VITE_RECAPTCHA_SITE_KEY, { action: "submit" })
      .then((token: string) => {
        socket.emit("init", {
          token,
          location: useStore.getState().location,
          user: useStore.getState().user,
        });
      });
  });
});

socket.on("error", (data) => {
  console.error("Socket error", data);
});
