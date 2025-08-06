// Client-side Clerk UI Appearance Configuration - Enhanced User Experience
export const clerkAppearance = {
  baseTheme: undefined,
  elements: {
    // Enhanced Modal styling with better positioning and animations
    modalBackdrop: "bg-black/60 backdrop-blur-md animate-in fade-in duration-300 fixed inset-0 z-[9999]",
    modalContent: "bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl animate-in zoom-in-95 duration-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] max-h-[90vh] overflow-y-auto",
    modalCard: "bg-transparent border-none shadow-none max-w-md mx-auto",
    modalHeader: "border-white/10 pb-4",
    modalHeaderTitle: "text-white font-bold text-xl tracking-tight",
    modalHeaderSubtitle: "text-gray-300 text-sm leading-relaxed",
    modalBody: "text-gray-200 space-y-4",
    modalFooter: "border-white/10 pt-4",
    
    // Enhanced Form elements with better UX
    formField: "space-y-3",
    formFieldLabel: "text-gray-200 font-semibold text-sm tracking-wide",
    formFieldInput: "bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-base",
    formFieldInputShowPasswordButton: "text-gray-400 hover:text-white transition-colors duration-200",
    formFieldInputShowPasswordIcon: "text-gray-400",
    formFieldError: "text-red-400 text-sm font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2",
    formFieldSuccess: "text-green-400 text-sm font-medium bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2",
    
    // Enhanced Button styling with better feedback
    formButtonPrimary: "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
    formButtonSecondary: "bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20 font-medium py-3 px-6 rounded-lg transition-all duration-200 hover:border-white/30",
    formButtonReset: "text-gray-400 hover:text-white transition-colors duration-200 font-medium",
    
    // Enhanced Social buttons with better branding
    socialButtonsBlockButton: "bg-white/8 hover:bg-white/15 text-gray-200 border border-white/15 hover:border-white/25 transition-all duration-200 rounded-lg py-3 px-4 font-medium",
    socialButtonsBlockButtonText: "text-gray-200 font-medium",
    socialButtonsBlockButtonArrow: "text-gray-400",
    
    // Enhanced Divider with better visual separation
    dividerLine: "bg-gradient-to-r from-transparent via-white/20 to-transparent h-px",
    dividerText: "text-gray-400 font-medium text-sm bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 px-4",
    
    // Enhanced Footer with better spacing
    footer: "border-white/10 pt-6",
    footerAction: "text-gray-400 hover:text-white transition-colors duration-200 font-medium",
    footerActionLink: "text-blue-400 hover:text-blue-300 font-semibold transition-colors duration-200",
    
    // Enhanced Brand styling
    brand: "text-gray-400 text-xs font-medium",
    brandLogo: "text-gray-400",
    
    // Enhanced User button popover with better positioning
    userButtonPopoverCard: "bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl shadow-black/30 rounded-xl animate-in zoom-in-95 duration-200",
    userButtonPopoverActionButton: "text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-3 py-2 font-medium",
    userButtonPopoverActionButtonText: "text-gray-200 font-medium",
    userButtonPopoverFooter: "border-white/10 pt-3",
    userButtonPopoverHeader: "border-white/10 pb-3",
    userButtonPopoverHeaderTitle: "text-white font-bold text-lg",
    userButtonPopoverHeaderSubtitle: "text-gray-300 text-sm",
    userButtonPopoverUserPreview: "bg-white/8 backdrop-blur-sm border border-white/15 rounded-lg p-3 hover:bg-white/12 transition-all duration-200",
    userButtonPopoverUserPreviewMainIdentifier: "text-white font-semibold",
    userButtonPopoverUserPreviewSecondaryIdentifier: "text-gray-300 text-sm",
    userButtonPopoverUserPreviewImage: "ring-2 ring-white/20 rounded-full",
    avatarBox: "h-10 w-10 ring-2 ring-white/20 shadow-lg rounded-full",
    
    // Enhanced Account settings modal styling with better layout and positioning
    pageScrollBox: "bg-transparent max-h-[80vh] overflow-y-auto scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent",
    navbar: "border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-2 sticky top-0 z-10",
    navbarButton: "text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-3 py-2 font-medium",
    navbarButtonActive: "text-white bg-white/15 font-semibold",
    
    // Enhanced Profile section with better organization
    profileSection: "border-white/10 bg-white/5 backdrop-blur-sm rounded-lg p-4 space-y-4",
    profileSectionTitle: "text-white font-bold text-lg",
    profileSectionContent: "text-gray-200 space-y-3",
    
    // Enhanced Theme selector with better visual feedback
    themeSwitcher: "bg-white/8 border border-white/15 rounded-lg p-3 space-y-2",
    themeSwitcherButton: "text-gray-200 hover:text-white hover:bg-white/10 rounded-lg p-3 transition-all duration-200 font-medium",
    themeSwitcherButtonActive: "text-white bg-white/15 font-semibold",
    
    // Enhanced Account actions with better organization
    accountSwitcher: "bg-white/8 border border-white/15 rounded-lg p-3",
    accountSwitcherTrigger: "text-gray-200 hover:text-white transition-colors duration-200 font-medium",
    accountSwitcherPopoverCard: "bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl",
    accountSwitcherPopoverActionButton: "text-gray-200 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-3 py-2",
    
    // Enhanced Danger zone with better warning styling
    dangerZone: "border-red-500/30 bg-red-500/10 backdrop-blur-sm rounded-lg p-4 space-y-3",
    dangerZoneTitle: "text-red-400 font-bold text-lg",
    dangerZoneDescription: "text-gray-300 text-sm leading-relaxed",
    dangerZoneButton: "bg-red-500 hover:bg-red-600 text-white border-none font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95",
    
    // Additional enhancements for better UX
    // Loading states
    spinner: "text-blue-400",
    loadingText: "text-gray-300 font-medium",
    
    // Error states
    errorText: "text-red-400 font-medium bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2",
    
    // Success states
    successText: "text-green-400 font-medium bg-green-500/10 border border-green-500/20 rounded-lg px-3 py-2",
    
    // Form validation
    formFieldInputError: "bg-red-500/10 border-red-500/30 text-red-200 placeholder-red-300",
    formFieldInputSuccess: "bg-green-500/10 border-green-500/30 text-green-200",
    
    // Enhanced modal positioning - Fixed positioning for account management
    modalRoot: "fixed inset-0 z-[9999] flex items-center justify-center p-4",
    modalOverlay: "fixed inset-0 bg-black/60 backdrop-blur-md z-[9998]",
    
    // Enhanced animations
    modalEnter: "animate-in fade-in-0 zoom-in-95 duration-300",
    modalExit: "animate-out fade-out-0 zoom-out-95 duration-200",
    
    // Enhanced accessibility
    modalFocusTrap: "outline-none",
    modalCloseButton: "text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-white/10",
    
    // Enhanced form layout
    formRoot: "space-y-6",
    formRow: "space-y-4",
    formActions: "flex flex-col sm:flex-row gap-3 pt-4",
    
    // Enhanced social login
    socialButtonsRoot: "space-y-3",
    socialButtonsBlockButtonPrimary: "bg-white/8 hover:bg-white/15 text-gray-200 border border-white/15 hover:border-white/25 transition-all duration-200 rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-3",
    socialButtonsBlockButtonSecondary: "bg-white/8 hover:bg-white/15 text-gray-200 border border-white/15 hover:border-white/25 transition-all duration-200 rounded-lg py-3 px-4 font-medium flex items-center justify-center space-x-3",
    
    // Enhanced verification
    verificationCodeField: "bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-center text-2xl font-mono tracking-widest",
    verificationCodeFieldError: "bg-red-500/10 border-red-500/30 text-red-200",
    
    // Enhanced password requirements
    passwordRequirements: "bg-white/5 border border-white/10 rounded-lg p-3 space-y-2",
    passwordRequirement: "text-gray-300 text-sm flex items-center space-x-2",
    passwordRequirementMet: "text-green-400",
    passwordRequirementUnmet: "text-gray-400",
    
    // Account management specific styling
    userProfileModalBackdrop: "bg-black/60 backdrop-blur-md animate-in fade-in duration-300 fixed inset-0 z-[9999]",
    userProfileModalContent: "bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl animate-in zoom-in-95 duration-300 fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] max-w-4xl w-full max-h-[90vh] overflow-y-auto",
    userProfileModalCard: "bg-transparent border-none shadow-none",
    userProfileModalHeader: "border-white/10 pb-4",
    userProfileModalHeaderTitle: "text-white font-bold text-xl tracking-tight",
    userProfileModalHeaderSubtitle: "text-gray-300 text-sm leading-relaxed",
    userProfileModalBody: "text-gray-200 space-y-6",
    userProfileModalFooter: "border-white/10 pt-4",
  },
  variables: {
    colorPrimary: "#3b82f6",
    colorPrimaryHover: "#2563eb",
    colorBackground: "transparent",
    colorInputBackground: "rgba(255, 255, 255, 0.05)",
    colorInputText: "#ffffff",
    colorText: "#ffffff",
    colorTextSecondary: "#9ca3af",
    colorTextOnPrimaryBackground: "#ffffff",
    colorNeutral: "#374151",
    colorNeutralHover: "#4b5563",
    colorSuccess: "#10b981",
    colorSuccessText: "#ffffff",
    colorDanger: "#ef4444",
    colorDangerText: "#ffffff",
    colorWarning: "#f59e0b",
    colorWarningText: "#ffffff",
    borderRadius: "0.5rem",
    fontFamily: "inherit",
    fontSize: "0.875rem",

    spacingUnit: "0.25rem",
  },
  layout: {
    socialButtonsPlacement: "bottom" as const,
    socialButtonsVariant: "blockButton" as const,
    showOptionalFields: false,
    privacyPageUrl: "/privacy",
    termsPageUrl: "/terms",
  }
} 