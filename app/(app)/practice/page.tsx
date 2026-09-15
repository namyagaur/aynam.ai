import TopicGenerator from "@/components/practice/setup/TopicGenerator";
export default async function PracticePage({ searchParams }: { searchParams: Promise<{ topic?: string }> }) {
  const { topic } = await searchParams;
  return (
    <main className="flex h-full flex-col overflow-hidden bg-[var(--theme-surface)] px-10 pt-6 pb-4">
      <TopicGenerator selectedTopic={topic} />
    </main>
  );
}
