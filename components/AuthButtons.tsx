"use client";

export function SignInButton() {
  return (
    <form action="/api/auth/signin/google" method="POST">
      <button
        type="submit"
        className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Sign in with Google
      </button>
    </form>
  );
}

export function SignOutButton({ name }: { name: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-700">{name}</span>
      <form action="/api/auth/signout" method="POST">
        <button type="submit" className="text-sm text-blue-600 hover:underline">
          Sign out
        </button>
      </form>
    </div>
  );
}
