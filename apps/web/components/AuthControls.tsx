"use client";
import { UserButton, SignedIn, SignedOut, SignInButton } from "@clerk/nextjs";

export function AuthControls() {
  return (
    <div>
      <SignedIn>
        <UserButton afterSignOutUrl="/" />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal" />
      </SignedOut>
    </div>
  );
}
