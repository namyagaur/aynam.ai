"use client";

import Background from "./Background";
import SceneManager from "./SceneManager";

export default function Intro() {
  return (
    <main className="relative h-screen w-screen overflow-hidden">

      <Background />

      <div className="relative z-10 flex h-full items-center justify-center px-8">
        <SceneManager />
      </div>

    </main>
  );
}