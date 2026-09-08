"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = createClient();
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError("Incorrect email or password.");
      setLoading(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-paper text-ink flex items-center justify-center px-6">
      <form onSubmit={handleLogin} className="w-full max-w-sm">
        <h1 className="font-serif text-3xl mb-8">Admin login</h1>

        <div className="mb-5">
          <label className="block text-sm text-muted mb-2" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm text-muted mb-2" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
          />
        </div>

        {error ? <p className="mb-4 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-50"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
