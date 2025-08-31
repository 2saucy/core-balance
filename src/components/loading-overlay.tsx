// components/LoadingOverlay.tsx
"use client";

import { HashLoader } from "react-spinners";

export function LoadingOverlay({ message }: { message: string }) {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-sm">
      <HashLoader size={50} color="#34d399" />
      <p className="mt-4 text-lg font-semibold text-foreground">{message}</p>
    </div>
  );
}