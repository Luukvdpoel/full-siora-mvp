import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="grid min-h-[70vh] place-items-center">
      <SignIn routing="hash" />
    </div>
  );
}
