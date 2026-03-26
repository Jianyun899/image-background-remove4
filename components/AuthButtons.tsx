"use client";

export function SignInButton() {
  return (
    <a
      href="/api/auth?action=signin"
      className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
    >
      Sign in with Google
    </a>
  );
}

export function SignOutButton({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">{name}</span>
      <a
        href="/api/auth?action=signout"
        className="text-sm text-blue-600 hover:underline"
      >
        Sign out
      </a>
    </div>
  );
}
