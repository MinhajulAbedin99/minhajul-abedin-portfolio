"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">(
    "idle",
  );

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");

    // Save to Supabase so there's always a record
    const { error } = await supabase.from("contact_messages").insert({
      name,
      email,
      message,
    });

    if (error) {
      setStatus("error");
      return;
    }

    // Also send an email notification via Web3Forms
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          access_key: process.env.NEXT_PUBLIC_WEB3FORMS_KEY,
          name,
          email,
          message,
          subject: "New portfolio contact message from " + name,
        }),
      });
    } catch {
      // Message is already saved in Supabase even if the email fails,
      // so this failure alone doesn't need to block the success state.
    }

    setStatus("sent");
    setName("");
    setEmail("");
    setMessage("");
  }

  if (status === "sent") {
    return (
      <div className="border border-ink/15 p-8">
        <p className="font-serif text-xl">Message sent.</p>
        <p className="mt-2 text-sm text-muted">
          Thanks for reaching out — I&apos;ll get back to you soon.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div>
        <label className="block text-sm text-muted mb-2" htmlFor="name">
          Your name
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <div>
        <label className="block text-sm text-muted mb-2" htmlFor="email">
          Email address
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

      <div>
        <label className="block text-sm text-muted mb-2" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          required
          rows={5}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border border-ink/20 bg-transparent px-4 py-3 text-sm focus:outline-none focus:border-moss"
        />
      </div>

      <button
        type="submit"
        disabled={status === "sending"}
        className="bg-ink px-6 py-3 text-sm font-medium text-paper transition-colors hover:bg-moss-dark disabled:opacity-50"
      >
        {status === "sending" ? "Sending..." : "Send message"}
      </button>

      {status === "error" ? (
        <p className="text-sm text-red-700">
          Something went wrong. Please try again or email directly.
        </p>
      ) : null}
    </form>
  );
}
