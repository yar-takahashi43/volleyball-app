import { useState } from "react";

export function useFlashMessage(duration = 2000) {
  const [message, setMessage] = useState("");

  const showMessage = (text) => {
    setMessage(text);
    setTimeout(() => {
      setMessage("");
    }, duration);
  };

  return { message, showMessage };
}
