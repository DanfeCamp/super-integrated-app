"use client";

/**
 * External dependencies.
 */
import { useState, useEffect } from "react";

const DynamicComponent = ({ children }) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  if (!hasMounted) {
    return null;
  }

  return <>{children}</>;
};

export default DynamicComponent;
