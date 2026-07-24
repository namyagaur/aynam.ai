import {
  BriefcaseBusiness,
  Code2,
  Mic2,
  Users,
  MessageCircle,
  Dices,
} from "lucide-react";

export const modes = [
  {
    id: "hr",
    title: "HR Interview",
    description: "Real hiring conversations and behavioral questions",
    icon: BriefcaseBusiness,
    color: "#F6E0B6",
  },
  {
    id: "technical",
    title: "Technical Interview",
    description: "Explain concepts, solve problems and think aloud",
    icon: Code2,
    color: "#A6BCC9",
  },
  {
    id: "public",
    title: "Public Speaking",
    description: "Speeches, presentations and storytelling",
    icon: Mic2,
    color: "#F2D7E4",
  },
  {
    id: "gd",
    title: "Group Discussion",
    description: "GD topics, opinions and collaborative thinking",
    icon: Users,
    color: "#D9EAD9",
  },
  {
    id: "conversation",
    title: "Conversation",
    description: "Daily conversations, situations and opinions",
    icon: MessageCircle,
    color: "#F9E7C2",
  },
  {
    id: "random",
    title: "Random Challenge",
    description: "Anything and everything. Surprise me!",
    icon: Dices,
    color: "#DDD5F8",
  },
];