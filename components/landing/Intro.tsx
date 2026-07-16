"use client";

import Background from "./Background";
import SceneManager from "./SceneManager";

export default function Intro() {
  return (
    <main className="relative min-h-screen w-full">

      <Background />

      <div className="relative z-10 flex min-h-screen items-center justify-center px-8">
        <SceneManager />
      </div>

    </main>
  );
}
