"use client";

import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function SessionPage() {
const router = useRouter();

const [isRecording, setIsRecording] = useState(false);
const [audioURL, setAudioURL] = useState("");

const mediaRecorderRef = useRef<MediaRecorder | null>(null);
const audioChunksRef = useRef<Blob[]>([]);

async function startRecording() {
try {
const stream = await navigator.mediaDevices.getUserMedia({
audio: true,
});


  const mediaRecorder = new MediaRecorder(stream);

  mediaRecorderRef.current = mediaRecorder;
  audioChunksRef.current = [];

  mediaRecorder.ondataavailable = (event) => {
    audioChunksRef.current.push(event.data);
  };

  mediaRecorder.onstop = () => {
    const audioBlob = new Blob(audioChunksRef.current, {
      type: "audio/webm",
    });

    const url = URL.createObjectURL(audioBlob);
    setAudioURL(url);
  };

  mediaRecorder.start();
  setIsRecording(true);
} catch (error) {
  console.error(error);
}

}

function stopRecording() {
if (!mediaRecorderRef.current) return;


mediaRecorderRef.current.stop();
setIsRecording(false);


}

return ( <main className="min-h-screen bg-[#FFFDF8] px-6 py-10"> <div className="max-w-5xl mx-auto"> <div className="flex items-center justify-between"> <div> <p className="uppercase tracking-[0.3em] text-gray-400 text-sm">
Recording Session </p>


        <h1 className="mt-3 text-5xl font-extralight">
          Speak Naturally.
        </h1>
      </div>

      <div className="text-right">
        <p className="text-gray-400 text-sm">Status</p>

        <h2 className="text-2xl font-light">
          {isRecording ? "Recording" : "Idle"}
        </h2>
      </div>
    </div>

    <div className="mt-10 bg-white rounded-3xl p-8 shadow-sm">
      <p className="text-sm text-gray-400">Topic</p>

      <h2 className="mt-3 text-2xl font-light">
        Tell a story about a difficult decision.
      </h2>
    </div>

    <div className="mt-8 bg-white rounded-3xl p-10 shadow-sm text-center">
      <div className="w-28 h-28 mx-auto rounded-full bg-[#F7F4FF] flex items-center justify-center text-5xl">
        🎤
      </div>

      <h3 className="mt-6 text-2xl font-light">
        {isRecording ? "Recording..." : "Ready to Record"}
      </h3>

      <div className="flex justify-center gap-4 mt-8">
        <button
          disabled={isRecording}
          onClick={startRecording}
          className="px-6 py-3 rounded-2xl bg-green-500 text-white"
        >
          Start Recording
        </button>

        <button
          onClick={stopRecording}
          className="px-6 py-3 rounded-2xl bg-red-500 text-white"
        >
          Stop Recording
        </button>
      </div>
    </div>

    <div className="mt-8 bg-white rounded-3xl p-8 shadow-sm">
      <p className="text-sm text-gray-400">
        Recording Preview
      </p>

      <div className="mt-5">
        {audioURL ? (
          <audio controls className="w-full">
            <source src={audioURL} type="audio/webm" />
          </audio>
        ) : (
          <p className="text-gray-500">
            No recording yet.
          </p>
        )}
      </div>
    </div>

    <div className="flex justify-end mt-10">
      <button
        onClick={() => router.push("/analysis")}
        className="px-8 py-4 rounded-2xl bg-[#A78BFA] text-white font-medium"
      >
        End Session →
      </button>
    </div>
  </div>
</main>

);
}
