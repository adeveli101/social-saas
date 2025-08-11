import { SignIn } from "@clerk/nextjs";
import { clerkTheme } from "@/lib/clerk-theme";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-background to-blue-950/20">
      <SignIn 
        appearance={clerkTheme}
      />
    </div>
  );
} 