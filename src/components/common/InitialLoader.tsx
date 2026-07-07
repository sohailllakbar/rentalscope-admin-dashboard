"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    const hideTimer = setTimeout(() => {
      setVisible(false);
    }, 450);

    const unmountTimer = setTimeout(() => {
      setMounted(false);
    }, 1100);

    return () => {
      clearTimeout(hideTimer);
      clearTimeout(unmountTimer);
    };
  }, []);

  if (!mounted) return null;

  return <SplashScreen visible={visible} />;
}
