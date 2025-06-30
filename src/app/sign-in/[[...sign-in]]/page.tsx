import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-background to-blue-950/20">
      <SignIn 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700',
            card: 'bg-slate-800 border-slate-700 shadow-xl',
            headerTitle: 'text-white',
            headerSubtitle: 'text-slate-400',
            socialButtonsBlockButton: 'bg-slate-700 hover:bg-slate-600 border-slate-600',
            socialButtonsBlockButtonText: 'text-white',
            formFieldLabel: 'text-slate-300',
            formFieldInput: 'bg-slate-700 border-slate-600 text-white',
            footerActionLink: 'text-blue-400 hover:text-blue-300',
            footerActionText: 'text-slate-400',
          }
        }}
      />
    </div>
  );
} 