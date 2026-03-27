"use client";

import { useEffect, useState } from "react";

type User = { name: string; email: string; picture: string } | null;

export default function UserAuth() {
  const [user, setUser] = useState<User>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth?action=session")
      .then((r) => r.json())
      .then(setUser)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return null;

  if (!user) {
    return (
      <a
        href="/api/auth?action=signin"
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-700">Sign in with Google</span>
      </a>
    );
  }

  return (
    <div className="flex items-center gap-3">
      <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full" />
      <span className="text-sm font-medium text-gray-700">{user.name}</span>
      <a
        href="/api/auth?action=signout"
        className="text-sm text-gray-500 hover:text-gray-700"
      >
        Sign out
      </a>
    </div>
  );
}
