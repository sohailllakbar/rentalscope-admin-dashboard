"use client";

import { useEffect, useState } from "react";
import SplashScreen from "./SplashScreen";

export default function InitialLoader() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 1800);

    return () => clearTimeout(timer);
  }, []);

  return <SplashScreen visible={visible} />;
}