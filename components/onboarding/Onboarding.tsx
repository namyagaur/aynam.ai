"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Onboarding() {
  const router = useRouter();

  const [step, setStep] = useState(0);

  const [form, setForm] = useState({
    name: "",
    goals: [] as string[],
    dailyPractice: "",
    reason: "",
  });

  const totalSteps = 5;
  const goals = [
  "Confidence",
  "Communication",
  "Public Speaking",
  "Interviews",
  "English Fluency",
  "Leadership",
  "Storytelling",
];

  const next = () => {
    if (step < totalSteps - 1) {
      setStep((prev) => prev + 1);
    }
  };

  const back = () => {
    if (step > 0) {
      setStep((prev) => prev - 1);
    }
  };
const toggleGoal = (goal: string) => {
  if (form.goals.includes(goal)) {
    setForm({
      ...form,
      goals: form.goals.filter((g) => g !== goal),
    });
  } else {
    setForm({
      ...form,
      goals: [...form.goals, goal],
    });
  }
};
  return (
    <main className="min-h-screen bg-[#0B1020] text-white flex items-center justify-center px-8">

      <div className="w-full max-w-3xl">

        {/* Progress */}

        <div className="mb-16">

          <div className="h-2 w-full rounded-full bg-white/10 overflow-hidden">

            <div
              className="h-full rounded-full bg-sky-400 transition-all duration-500"
              style={{
                width: `${((step + 1) / totalSteps) * 100}%`,
              }}
            />

          </div>

        </div>

        {step === 1 && (

<div className="space-y-10">

    <h1 className="text-5xl font-light">
        What would you like to improve?
    </h1>

    <p className="text-white/60">
        Choose as many as you'd like.
    </p>

    <div className="grid grid-cols-2 gap-4">

        {goals.map((goal)=>{

            const selected=form.goals.includes(goal);

            return(

                <button

                    key={goal}

                    onClick={()=>toggleGoal(goal)}

                    className={`
                    rounded-xl
                    border
                    p-5
                    text-left
                    transition-all

                    ${
                        selected
                        ?"border-sky-400 bg-sky-400/20"
                        :"border-white/10 bg-white/5 hover:bg-white/10"
                    }

                    `}
                >

                    {goal}

                </button>

            )

        })}

    </div>

</div>

)}

        {step === 0 && (

          <div className="space-y-10">

            <h1 className="text-5xl font-light">
              What should I call you?
            </h1>

            <input
              value={form.name}
              onChange={(e) =>
                setForm({
                  ...form,
                  name: e.target.value,
                })
              }
              placeholder="Enter your name"
              className="w-full rounded-xl border border-white/10 bg-white/5 px-6 py-5 text-xl outline-none"
            />

          </div>

        )}

        {/* Navigation */}

        <div className="mt-20 flex justify-between">

          <button
            onClick={back}
            disabled={step === 0}
            className="rounded-xl border border-white/10 px-6 py-3 disabled:opacity-30"
          >
            Back
          </button>

          <button
            onClick={() => {

    if(step===0 && form.name.trim()==="") return;

    if(step===1 && form.goals.length===0) return;

    next();

}}
            className="rounded-xl bg-sky-400 px-8 py-3 font-medium text-black"
          >
            Next
          </button>

        </div>

      </div>

    </main>
  );
}