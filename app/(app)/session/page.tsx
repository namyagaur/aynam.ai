"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
export default function SessionPage() {
  const searchParams = useSearchParams();
  const router = useRouter();  

  // Read values passed from Practice page
  const [error, setError] = useState("");
  const topic = searchParams.get("topic") || "Unknown Topic";
  const duration = searchParams.get("duration") || "10";
  const difficulty = searchParams.get("difficulty") || "Medium";
  const transcriptRef = useRef<HTMLDivElement>(null);
  const [seconds, setSeconds] = useState(0);
  const [recordingStatus, setRecordingStatus] = useState<
  "idle" | "recording" | "paused"
>("idle");
const [finalTranscript, setFinalTranscript] = useState("");
const [interimTranscript, setInterimTranscript] = useState("");
const recognitionRef = useRef<any>(null);
 useEffect(() => {
  if (recordingStatus !== "recording") return;

  const interval = setInterval(() => {
    setSeconds((prev) => prev + 1);
  }, 1000);

  return () => clearInterval(interval);
}, [recordingStatus]);
useEffect(() => {
  transcriptRef.current?.scrollTo({
    top: transcriptRef.current.scrollHeight,
    behavior: "smooth",
  });
}, [finalTranscript, interimTranscript]);

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
  let interim = "";
  let final = "";

  for (let i = event.resultIndex; i < event.results.length; i++) {
    const transcript = event.results[i][0].transcript;

    if (event.results[i].isFinal) {
      final += transcript + " ";
    } else {
      interim += transcript;
    }
  }

  if (final) {
    setFinalTranscript((prev) => prev + final);
  }

  setInterimTranscript(interim);
};
recognition.onerror = (event: any) => {
  if (event.error === "not-allowed") {
    setError("Microphone permission denied.");
  } else {
    setError(event.error);
  }

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

 setFinalTranscript("");
setInterimTranscript("");
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
 
async function handleEndSession() {
  recognitionRef.current?.stop();

  setRecordingStatus("idle");

  try {
    const response = await fetch("/api/feedback", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transcript: finalTranscript,
        topic,
        durationSeconds: seconds, // <-- use actual recording duration
        difficulty,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate feedback");
    }

    const data = await response.json();

    console.log(data);

    // We'll replace mockFeedback with this later
    sessionStorage.setItem(
      "feedback",
      JSON.stringify(data)
    );

    router.push("/feedback");

  } catch (error) {
    console.error(error);
    alert("Unable to generate feedback.");
  }
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
      <div className="mt-8 flex items-center gap-3">

  <div
    className={`h-3 w-3 rounded-full ${
      recordingStatus === "recording"
        ? "animate-pulse bg-red-500"
        : "bg-gray-500"
    }`}
  />

  <span className="text-white/70">
    {recordingStatus === "idle" && "Ready"}

    {recordingStatus === "recording" && "Listening..."}

    {recordingStatus === "paused" && "Paused"}
  </span>

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
  {error && (
  <p className="mt-4 text-red-400">
    {error}
  </p>
)}

</div>

      {/* Transcript */}

<div
  ref={transcriptRef}
  className="mt-10 h-72 overflow-y-auto rounded-lg border border-white/10 bg-[#1B2233] p-6"
>
        <div className="mb-6 flex items-center justify-between">
  <h2 className="text-xl font-semibold">
    Live Transcript
  </h2>

  <span className="text-sm text-white/40">
    {finalTranscript.split(/\s+/).filter(Boolean).length} words
  </span>
</div>

<p className="mt-6 whitespace-pre-wrap leading-8 text-lg text-white">  {finalTranscript}
<span className="text-white/40 italic">    {interimTranscript}
  </span>

  {!finalTranscript && !interimTranscript &&
    "Press Start Recording to begin speaking."}
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