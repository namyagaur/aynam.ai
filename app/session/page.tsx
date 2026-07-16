"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export default function SessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();  

  // Read values passed from Practice page
  const topic = searchParams.get("topic") || "Unknown Topic";
  const duration = searchParams.get("duration") || "10";
  const difficulty = searchParams.get("difficulty") || "Medium";

  const [seconds, setSeconds] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState<
  "idle" | "recording" | "paused"
>("idle");
  const [transcript, setTranscript] = useState("");

const recognitionRef = useRef<any>(null);
 useEffect(() => {
  if (recordingStatus !== "recording") return;

  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [recordingStatus]);

useEffect(() => {
  const SpeechRecognition =
    (window as any).SpeechRecognition ||
    (window as any).webkitSpeechRecognition;

  if (!SpeechRecognition) {
    alert("Speech Recognition is not supported in this browser.");
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = "en-US";
  
recognition.onresult = (event: any) => {
  let text = "";

  for (let i = 0; i < event.results.length; i++) {
    text += event.results[i][0].transcript;
  }

  setTranscript(text);
};

recognition.onerror = (event: any) => {
  console.error(event.error);
};

recognition.onend = () => {
  console.log("Recognition stopped");
};
  recognitionRef.current = recognition;
}, []);

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;


function handleStartRecording() {
  if (!recognitionRef.current) return;

  setTranscript("");
  setSeconds(0);

  setRecordingStatus("recording");

  recognitionRef.current.start();
}

function handlePauseRecording() {
  if (!recognitionRef.current) return;

  setRecordingStatus("paused");

  recognitionRef.current.stop();
}

function handleResumeRecording() {
  if (!recognitionRef.current) return;

  setRecordingStatus("recording");

  recognitionRef.current.start();
}
 
 function handleEndSession() {
  recognitionRef.current?.stop();

  setRecordingStatus("idle");

  router.push(
    `/feedback?topic=${encodeURIComponent(topic)}
    &duration=${duration}
    &difficulty=${difficulty}
    &time=${seconds}`
  );
}

  return (
    <main className="min-h-screen bg-[#101726] p-10 text-white">

      <h1 className="text-4xl font-bold">
        Speaking Session
      </h1>

      <div className="mt-8 space-y-3">

        <p>
          <strong>Topic:</strong> {topic}
        </p>

        <p>
          <strong>Duration:</strong> {duration} min
        </p>

        <p>
          <strong>Difficulty:</strong> {difficulty}
        </p>

      </div>

      {/* Timer */}

      <div className="mt-10">

        <h2 className="text-5xl font-bold">

          {String(minutes).padStart(2, "0")}:
          {String(remainingSeconds).padStart(2, "0")}

        </h2>

      </div>

      {/* Recording */}

      <div className="mt-10 flex gap-4">

  {recordingStatus === "idle" && (
    <button
      onClick={handleStartRecording}
      className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white"
    >
      🎤 Start
    </button>
  )}

  {recordingStatus === "recording" && (
    <button
      onClick={handlePauseRecording}
      className="rounded-lg bg-yellow-500 px-6 py-3 font-semibold text-black"
    >
      ⏸ Pause
    </button>
  )}

  {recordingStatus === "paused" && (
    <button
      onClick={handleResumeRecording}
      className="rounded-lg bg-green-500 px-6 py-3 font-semibold text-white"
    >
      ▶ Resume
    </button>
  )}

  {(recordingStatus === "recording" ||
    recordingStatus === "paused") && (
    <button
      onClick={handleEndSession}
      className="rounded-lg bg-red-500 px-6 py-3 font-semibold text-white"
    >
      🛑 Stop Session
    </button>
  )}

</div>

      {/* Transcript */}

      <div className="mt-10 rounded-lg border border-white/10 bg-[#1B2233] p-6">

        <h2 className="text-xl font-semibold">
          Transcript
        </h2>

        <p className="mt-4 whitespace-pre-wrap text-white/70">
  {transcript || "Press Start Recording to begin speaking."}
</p>

      </div>

      {/* <button
        onClick={handleEndSession}
        className="mt-10 rounded-lg bg-red-500 px-8 py-4 font-semibold"
      >
        End Session
      </button> */}

    </main>
  );
}