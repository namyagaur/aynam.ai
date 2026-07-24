"use client";

const modes = [
  {
    id: "hr",
    icon: "💼",
    title: "HR Interview",
    description: "Real hiring conversations",
    color: "#F8F2C8",
  },
  {
    id: "technical",
    icon: "👨‍💻",
    title: "Technical",
    description: "Think aloud & explain concepts",
    color: "#DCEAF2",
  },
  {
    id: "public",
    icon: "🎤",
    title: "Public Speaking",
    description: "Present with confidence",
    color: "#F8E7EC",
  },
  {
    id: "gd",
    icon: "🤝",
    title: "Group Discussion",
    description: "Collaborate & debate",
    color: "#E7F3E8",
  },
  {
    id: "conversation",
    icon: "💬",
    title: "Conversation",
    description: "Daily communication",
    color: "#FDEBC8",
  },
  {
    id: "random",
    icon: "🎲",
    title: "Random",
    description: "Surprise me",
    color: "#EAE5FA",
  },
];

export default function CommunicationModes() {
  return (
    <div className="grid grid-cols-2 gap-4 xl:grid-cols-3">
      {modes.map((mode) => (
        <button
          key={mode.id}
          className="group rounded-3xl border border-[#ECE7E1] bg-white p-5 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
        >
          <div
            className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl text-2xl"
            style={{ backgroundColor: mode.color }}
          >
            {mode.icon}
          </div>

          <h3 className="text-lg font-semibold text-[#2A2A2A]">
            {mode.title}
          </h3>

          <p className="mt-1 text-sm text-[#6C6C74]">
            {mode.description}
          </p>
        </button>
      ))}
    </div>
  );
}