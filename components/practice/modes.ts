import {
  BriefcaseBusiness,
  Code2,
  Mic2,
  MessageCircle,
  Sparkles,
} from "lucide-react";

export const modes = [
  {
    id: "hr",
    title: "HR Interview",
    icon: BriefcaseBusiness,
    color: "#F6E0B6",
  },
  {
    id: "technical",
    title: "Technical Interview",
    icon: Code2,
    color: "#A6BCC9",
  },
  {
    id: "public",
    title: "Public Speaking",
    icon: Mic2,
    color: "#F3D6E3",
  },
  {
    id: "conversation",
    title: "Conversation",
    icon: MessageCircle,
    color: "#FFE7B7",
  },
  {
    id: "random",
    title: "Random Challenge",
    icon: Sparkles,
    color: "#DDD3FF",
  },
];