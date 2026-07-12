import Sidebar from "@/components/dashboard/Sidebar";

export default function DashboardPage() {
  return (
    <div className="flex">

      <Sidebar />

      <main className="flex-1 p-12 bg-[#101726] min-h-screen text-white">

        <h1 className="text-5xl font-semibold">
          Good Evening, Namya 👋
        </h1>

      </main>

    </div>
  );
}