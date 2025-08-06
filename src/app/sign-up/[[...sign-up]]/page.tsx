import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-background to-blue-950/20">
      <SignUp 
        appearance={{
          elements: {
            formButtonPrimary: 'bg-gradient-to-r from-blue-600 to-purple-700 hover:from-blue-700 hover:to-purple-800 text-white font-semibold shadow-lg transition-all duration-300 focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900',
            card: 'bg-glass backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/20',
            headerTitle: 'text-white font-bold text-2xl',
            headerSubtitle: 'text-gray-200 text-sm',
            socialButtonsBlockButton: 'bg-white/10 hover:bg-white/20 border border-white/20 text-white backdrop-blur-sm transition-all duration-300',
            socialButtonsBlockButtonText: 'text-white font-medium',
            formFieldLabel: 'text-gray-200 font-medium',
            formFieldInput: 'bg-white/10 border border-white/20 text-white placeholder:text-gray-400 backdrop-blur-sm focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30 transition-all duration-300',
            footerActionLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
            footerActionText: 'text-gray-300',
            formFieldInputShowPasswordButton: 'text-gray-400 hover:text-white transition-colors',
            formFieldInputShowPasswordIcon: 'text-gray-400',
            formResendCodeLink: 'text-blue-400 hover:text-blue-300 font-medium transition-colors',
            identityPreviewText: 'text-gray-200',
            identityPreviewEditButton: 'text-blue-400 hover:text-blue-300',
            otpCodeFieldInput: 'bg-white/10 border border-white/20 text-white text-center text-lg font-mono focus:border-blue-400/50 focus:ring-2 focus:ring-blue-400/30',
            alertText: 'text-red-300',
            alert: 'bg-red-500/20 border border-red-400/30 backdrop-blur-sm',
            alertIcon: 'text-red-400',
            dividerLine: 'bg-white/20',
            dividerText: 'text-gray-300',
            formFieldErrorText: 'text-red-300 text-sm',
            formFieldError: 'border-red-400/50',
            loading: 'text-blue-400',
            spinner: 'text-blue-400',
          }
        }}
      />
    </div>
  );
} 