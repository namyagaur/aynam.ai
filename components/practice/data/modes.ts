import {
  Mic,
  MessageCircle,
  BookOpenText,
  Users,
  Sparkles,
} from "lucide-react";

export const modes = [
  {
    id: "public",
    title: "Public Speaking",
    icon: Mic,
  },
  {
    id: "conversation",
    title: "Conversation",
    icon: MessageCircle,
  },
  {
    id: "storytelling",
    title: "Storytelling",
    icon: BookOpenText,
  },
  {
    id: "social",
    title: "Social",
    icon: Users,
  },
  {
    id: "custom",
    title: "Create",
    icon: Sparkles,
  },
];