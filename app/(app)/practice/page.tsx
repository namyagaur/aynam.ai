import TopicGenerator from "@/components/practice/setup/TopicGenerator";
export default function PracticePage() {
  return (
    <main className="flex h-full flex-col overflow-hidden bg-[var(--theme-surface)] px-10 pt-6 pb-4">
      <TopicGenerator />
    </main>
  );
}
