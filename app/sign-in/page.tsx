import Link from "next/link";

export default function SignInPage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-[#0B1020] text-white px-6">

      <div className="w-full max-w-md space-y-8">

        <div className="space-y-3 text-center">

          <h1 className="text-4xl font-medium">
            Welcome to Aynam
          </h1>

          <p className="text-neutral-400">
            Become someone you trust every time you speak.
          </p>

        </div>

        <div className="space-y-4">

          <button className="w-full rounded-xl border border-white/10 bg-white/5 py-4 transition hover:bg-white/10">
            Continue with Google
          </button>

          <button className="w-full rounded-xl border border-white/10 bg-white/5 py-4 transition hover:bg-white/10">
            Continue with GitHub
          </button>

          <button className="w-full rounded-xl border border-white/10 bg-white/5 py-4 transition hover:bg-white/10">
            Continue with Email
          </button>

        </div>

        <Link href="/dashboard">
    Continue →
</Link>

      </div>

    </main>
  );
}