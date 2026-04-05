"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const res = await fetch("/api/admin/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    if (res.ok) {
      router.refresh();
    } else {
      setError("비밀번호가 올바르지 않습니다.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen px-4">
      <form onSubmit={handleLogin} className="w-full max-w-xs">
        <h1 className="text-lg font-bold mb-6 text-center text-neutral-300">
          Admin
        </h1>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="비밀번호"
          className="w-full px-4 py-3 rounded-lg bg-neutral-900 border border-neutral-800 text-white placeholder-neutral-600 mb-3 text-sm focus:outline-none focus:border-neutral-600"
        />
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        <button
          type="submit"
          className="w-full py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-neutral-200 transition-colors"
        >
          로그인
        </button>
      </form>
    </div>
  );
}
