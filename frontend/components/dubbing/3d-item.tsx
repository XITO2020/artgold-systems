"use client";

import React from "react";
import dynamic from "next/dynamic";

// Dynamic client-only wrapper; do not SSR-load R3F
const ThreeDItemInner = dynamic(() => import("./3d-item-inner"), {
  ssr: false,
  loading: () => null,
});

const ThreeDItem: React.FC = () => {
  return <ThreeDItemInner />;
};

export default ThreeDItem;
