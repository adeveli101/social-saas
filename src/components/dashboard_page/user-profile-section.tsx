'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useUser } from '@clerk/nextjs'
import { UserButton, UserProfile } from '@clerk/nextjs'
import Image from 'next/image'
import { 
  User, 
  Shield, 
  CreditCard, 
  Settings,
  Crown,
  Sparkles
} from 'lucide-react'
import { 
  getPlanDisplayName, 
  getPlanFeatures, 
  getPlanIcon as getLibPlanIcon, 
  getPlanBadgeClass as getLibPlanBadgeClass 
} from '@/lib/plans'
import { modalUserProfileTheme, userButtonTheme } from '@/lib/clerk-theme'

interface TabItem {
  id: string
  label: string
  icon: any
  component: 'profile' | 'billing'
  description: string
}

interface ProfileFormData {
  firstName: string
  lastName: string
  email: string
  username: string
  phoneNumber: string
}

interface EmailAddress {
  id: string
  emailAddress: string
  verification: {
    status: 'verified' | 'unverified'
    strategy: string
  }
  linkedTo: Array<{ type: string; id: string }>
}

interface ExternalAccount {
  id: string
  provider: string
  emailAddress: string
  firstName?: string
  lastName?: string
}



export function UserProfileSection() {
  const { user, isLoaded } = useUser()
  const [activeTab, setActiveTab] = useState<string>('overview')
  const [isUpdating, setIsUpdating] = useState(false)
  const [updateSuccess, setUpdateSuccess] = useState(false)
  const [updateError, setUpdateError] = useState<string | null>(null)
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    phoneNumber: ''
  })
  
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)


  const getUserPlan = () => {
    if (!user) return 'free'
    
    // Clerk public metadata'sından plan bilgisini al
    const metadata = user.publicMetadata || {}
    const plan = metadata.plan as string
    
    // Geçerli plan değerlerini kontrol et
    const validPlans = ['free', 'pro', 'premium']
    return validPlans.includes(plan) ? plan : 'free'
  }

  const getPlanIcon = (plan: string) => {
    const iconType = getLibPlanIcon(plan)
    return iconType === 'crown' 
      ? <Crown className="h-4 w-4" />
      : <Sparkles className="h-4 w-4" />
  }

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  const getUserName = () => {
    if (!user) return ''
    return user.firstName || user.fullName || user.emailAddresses[0]?.emailAddress || ''
  }

  // Initialize form data when user loads
  useEffect(() => {
    if (user && isLoaded) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        username: user.username || '',
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || ''
      })
    }
  }, [user, isLoaded])

  // Handle profile image selection
  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        setUpdateError('File size must be less than 10MB')
        return
      }
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setUpdateError('Please select a valid image file')
        return
      }
      
      setProfileImageFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setUpdateError(null)
    }
  }
  
  // Handle profile image upload
  const handleImageUpload = async () => {
    if (!profileImageFile) return
    
    setImageUploading(true)
    setUpdateError(null)
    
    try {
      const formData = new FormData()
      formData.append('image', profileImageFile)
      
      const response = await fetch('/api/user/profile-image', {
        method: 'POST',
        body: formData
      })
      
      if (!response.ok) {
        throw new Error('Failed to upload image')
      }
      
      setUpdateSuccess(true)
      setProfileImageFile(null)
      setImagePreview(null)
      
      // Refresh user data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      setUpdateError('Failed to upload profile image')
    } finally {
      setImageUploading(false)
    }
  }
  
  // Handle profile image removal
  const handleImageRemove = async () => {
    setImageUploading(true)
    setUpdateError(null)
    
    try {
      const response = await fetch('/api/user/profile-image', {
        method: 'DELETE'
      })
      
      if (!response.ok) {
        throw new Error('Failed to remove image')
      }
      
      setUpdateSuccess(true)
      
      // Refresh user data
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      setUpdateError('Failed to remove profile image')
    } finally {
      setImageUploading(false)
    }
  }





  // Form handlers
  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Clear any previous errors when user starts typing
    if (updateError) setUpdateError(null)
    if (updateSuccess) setUpdateSuccess(false)
  }

  const handleProfileSave = async () => {
    if (!user) return

    setIsUpdating(true)
    setUpdateError(null)
    setUpdateSuccess(false)

    try {
      // Upload image first if there's one selected
      if (profileImageFile) {
        await handleImageUpload()
        return // handleImageUpload already handles success/error and reload
      }

      // Update user profile via Clerk API
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: formData.firstName.trim(),
          lastName: formData.lastName.trim(),
          username: formData.username.trim() || undefined
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      setUpdateSuccess(true)
      
      // Refresh user data to show updates
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (error) {
      console.error('Profile update error:', error)
      setUpdateError(error instanceof Error ? error.message : 'Failed to update profile')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleProfileCancel = () => {
    // Reset form to original user data
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.emailAddresses[0]?.emailAddress || '',
        username: user.username || '',
        phoneNumber: user.phoneNumbers?.[0]?.phoneNumber || ''
      })
    }
    setUpdateError(null)
    setUpdateSuccess(false)
    setProfileImageFile(null)
    setImagePreview(null)
  }

  const tabs: TabItem[] = [
    {
      id: 'overview',
      label: 'Overview',
      icon: User,
      component: 'profile',
      description: 'Account overview and basic information'
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      component: 'profile',
      description: 'Manage your profile information'
    },


    {
      id: 'billing',
      label: 'Billing',
      icon: CreditCard,
      component: 'billing',
      description: 'Subscription and billing information'
    }
  ]

  if (!isLoaded) {
    return (
      <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-white/20 rounded w-48 mb-2"></div>
            <div className="h-4 bg-white/20 rounded w-32 mb-6"></div>
            <div className="flex gap-2 mb-6">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-10 bg-white/20 rounded w-20"></div>
              ))}
            </div>
            <div className="h-96 bg-white/20 rounded"></div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const userName = getUserName()
  const userPlan = getUserPlan()
  const currentTab = tabs.find(t => t.id === activeTab) || tabs[0]

  const handleBillingClick = () => {
    window.location.href = '/pricing'
  }

  const renderTabContent = () => {
    if (activeTab === 'overview') {
      return (
        <div className="space-y-6">
          {/* Welcome Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-50 mb-1">
                {getGreeting()}{userName ? `, ${userName}` : ''}!
              </h1>
              <p className="text-gray-200">
                Ready to create amazing AI-powered carousel content?
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Badge 
                variant="secondary" 
                className={getLibPlanBadgeClass(userPlan)}
              >
                {getPlanIcon(userPlan)}
                <span className="ml-1">{getPlanDisplayName(userPlan)}</span>
              </Badge>
              <UserButton 
                appearance={userButtonTheme}
                userProfileMode="modal"
                userProfileProps={{
                  appearance: modalUserProfileTheme
                }}
              />
            </div>
          </div>

          {/* Account Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center overflow-hidden">
                  {(() => {
                    const overviewImgSrc: string | null = user?.imageUrl ?? null
                    return overviewImgSrc ? (
                      <Image
                        src={overviewImgSrc}
                        alt={user?.fullName || 'User avatar'}
                        width={96}
                        height={96}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="h-5 w-5 text-blue-400" />
                    )
                  })()}
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-50">
                    {user?.fullName || `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'User'}
                  </h3>
                  <p className="text-xs text-gray-300">
                    {user?.emailAddresses[0]?.emailAddress || 'No email'}
                  </p>
                  {user?.lastSignInAt && (
                    <p className="text-xs text-gray-400">
                      Last login: {new Date(user.lastSignInAt).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <CreditCard className="h-5 w-5 text-green-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-50">Current Plan</h3>
                  <p className="text-xs text-gray-300">{getPlanDisplayName(userPlan)}</p>
                </div>
              </div>
              <Button 
                size="sm"
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
                onClick={() => {
                  window.location.href = '/pricing'
                }}
              >
                {userPlan === 'free' ? 'Upgrade Plan' : 'Manage Subscription'}
              </Button>
            </div>

            <div className="p-4 rounded-lg border border-white/10 bg-white/5 backdrop-blur-sm">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-white/10 backdrop-blur-sm">
                  <Shield className="h-5 w-5 text-blue-400" />
                </div>
                <div className="flex-1">
                  <h3 className="font-medium text-sm text-gray-50">Security</h3>
                  <p className="text-xs text-gray-300">All security features active</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      )
    }

    if (activeTab === 'billing') {
      return (
        <div className="space-y-6">
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-500/20 to-pink-600/20 flex items-center justify-center">
              <CreditCard className="h-8 w-8 text-purple-400" />
            </div>
            <h3 className="font-semibold text-lg text-gray-50 mb-2">Billing & Subscriptions</h3>
            <p className="text-gray-300 text-sm mb-6 max-w-md mx-auto">
              Manage your subscription plan and billing information. Upgrade or downgrade your plan anytime.
            </p>
            <Button
              onClick={handleBillingClick}
              className="bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white border-none shadow-lg font-semibold py-3 px-6 rounded-lg transition-all duration-200 transform hover:scale-105"
            >
              Manage Billing
            </Button>
          </div>

          {/* Current Plan Info */}
          <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
            <h4 className="font-semibold text-gray-50 mb-4">Current Plan Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Plan</span>
                <Badge className={getLibPlanBadgeClass(userPlan)}>
                  {getPlanIcon(userPlan)}
                  <span className="ml-1">{getPlanDisplayName(userPlan)}</span>
                </Badge>
              </div>
              {(() => {
                const features = getPlanFeatures(userPlan)
                return (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Credits</span>
                      <span className="text-gray-50 text-sm font-medium">{features.credits}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-300 text-sm">Daily Limit</span>
                      <span className="text-gray-50 text-sm font-medium">{features.dailyLimit}</span>
                    </div>
                  </>
                )
              })()}
            </div>
          </div>
        </div>
      )
    }

    // For other tabs, show custom content
    if (activeTab === 'profile') {
      return (
        <div className="space-y-6">
          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-6">Profile Information</h3>
            
            <div className="space-y-6">
              {/* Profile Picture Section */}
              <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-white font-medium mb-4">Profile Picture</h4>
                <div className="flex items-center gap-6">
                  <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20 flex items-center justify-center overflow-hidden ring-2 ring-white/10">
                    {(() => {
                      const imgSrc: string | null = imagePreview ?? user?.imageUrl ?? null
                      return imgSrc ? (
                        <Image
                          src={imgSrc}
                          alt={user?.fullName || 'User avatar'}
                          width={96}
                          height={96}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <User className="h-10 w-10 text-blue-400" />
                      )
                    })()}
                  </div>
                  <div className="flex-1">
                    <p className="text-gray-300 text-sm mb-4">Recommended size 1:1, up to 10MB.</p>
                    <div className="flex gap-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                        id="profile-image-input"
                        disabled={imageUploading}
                      />
                      <label
                        htmlFor="profile-image-input"
                        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 cursor-pointer ${
                          imageUploading 
                            ? 'bg-gray-500/20 text-gray-400 cursor-not-allowed' 
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        Upload New
                      </label>
                      
                      {profileImageFile && (
                        <Button
                          size="sm"
                          onClick={handleImageUpload}
                          disabled={imageUploading}
                          className="bg-green-600 hover:bg-green-700 text-white"
                        >
                          {imageUploading ? 'Uploading...' : 'Save'}
                        </Button>
                      )}
                      
                      {user?.imageUrl && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={handleImageRemove}
                          disabled={imageUploading}
                          className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                        >
                          Remove
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Success/Error Messages */}
              {updateSuccess && (
                <div className="bg-green-500/10 border border-green-400/20 text-green-200 rounded-lg p-4 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-green-400 flex-shrink-0"></div>
                  <span className="text-sm">Profile updated successfully!</span>
                </div>
              )}

              {updateError && (
                <div className="bg-red-500/10 border border-red-400/20 text-red-200 rounded-lg p-4 flex items-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-red-400 flex-shrink-0"></div>
                  <span className="text-sm">{updateError}</span>
                </div>
              )}

              {/* Profile Form */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-200 font-semibold text-sm mb-2">First Name</label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange('firstName', e.target.value)}
                    className="w-full bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-base"
                    placeholder="Enter your first name"
                    disabled={isUpdating}
                  />
                </div>
                <div>
                  <label className="block text-gray-200 font-semibold text-sm mb-2">Last Name</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange('lastName', e.target.value)}
                    className="w-full bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-base"
                    placeholder="Enter your last name"
                    disabled={isUpdating}
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-200 font-semibold text-sm mb-2">Username</label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => handleInputChange('username', e.target.value)}
                  className="w-full bg-white/8 border border-white/15 text-white placeholder-gray-400 focus:border-blue-400 focus:ring-2 focus:ring-blue-400/30 focus:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 text-base"
                  placeholder="Enter your username (optional)"
                  disabled={isUpdating}
                />
                <p className="text-xs text-gray-400 mt-1">Username must be unique and can contain letters, numbers, and underscores</p>
              </div>

              {/* Email Addresses Section */}
              <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-white font-medium mb-4">Email Addresses</h4>
                <div className="space-y-3">
                  {user?.emailAddresses?.map((emailAddr, index) => (
                    <div key={emailAddr.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                          <span className="text-blue-400 text-xs font-semibold">@</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">{emailAddr.emailAddress}</p>
                          <div className="flex items-center gap-2">
                            {index === 0 && (
                              <Badge className="bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5">Primary</Badge>
                            )}
                            <Badge className={`text-xs px-2 py-0.5 ${
                              emailAddr.verification?.status === 'verified'
                                ? 'bg-green-500/20 text-green-300'
                                : 'bg-amber-500/20 text-amber-300'
                            }`}>
                              {emailAddr.verification?.status === 'verified' ? 'Verified' : 'Unverified'}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Email management requires additional verification. Use the UserButton for email changes.
                </p>
              </div>

              {/* Connected Accounts Section */}
              <div className="border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-6">
                <h4 className="text-white font-medium mb-4">Connected Accounts</h4>
                <div className="space-y-3">
                  {user?.externalAccounts?.map((account) => (
                    <div key={account.id} className="flex items-center justify-between p-3 border border-white/10 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-red-500/20 to-orange-500/20 flex items-center justify-center">
                          <span className="text-red-400 text-xs font-semibold">G</span>
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium capitalize">{account.provider}</p>
                          <p className="text-gray-400 text-xs">{account.emailAddress}</p>
                        </div>
                      </div>
                      <Badge className="bg-green-500/20 text-green-300 text-xs px-2 py-0.5">
                        Connected
                      </Badge>
                    </div>
                  )) || (
                    <div className="text-center py-4">
                      <p className="text-gray-400 text-sm">No connected accounts</p>
                    </div>
                  )}
                </div>
                <p className="text-gray-400 text-xs mt-3">
                  Manage connected accounts and social logins through the UserButton.
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button 
                  onClick={handleProfileSave}
                  disabled={isUpdating || (!formData.firstName.trim() && !formData.lastName.trim() && !formData.username.trim())}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-none shadow-lg font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdating ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border border-white border-t-transparent"></div>
                      <span>Saving...</span>
                    </div>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={handleProfileCancel}
                  disabled={isUpdating}
                  className="bg-white/10 hover:bg-white/20 text-gray-200 border border-white/20 disabled:opacity-50"
                >
                  Cancel
                </Button>
              </div>

              {/* Danger Zone Section */}
              <div className="border border-red-500/30 bg-red-500/10 backdrop-blur-sm rounded-xl p-6 mt-8">
                <h4 className="text-red-400 font-medium mb-4 flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Danger Zone
                </h4>
                <div className="flex items-center justify-between p-4 border border-red-500/20 rounded-lg bg-red-500/5">
                  <div>
                    <p className="text-white text-sm font-medium">Delete Account</p>
                    <p className="text-gray-400 text-xs mt-1">Permanently delete your account and all associated data</p>
                  </div>
                  <Button 
                    size="sm"
                    variant="outline"
                    className="border-red-500/50 text-red-400 hover:bg-red-500/10 hover:border-red-400 transition-all duration-200"
                    onClick={() => setShowDeleteModal(true)}
                  >
                    Delete Account
                  </Button>
                </div>
                <div className="mt-3 p-3 bg-amber-500/10 border border-amber-400/20 rounded-lg">
                  <p className="text-amber-200 text-xs flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-amber-400 flex items-center justify-center text-amber-900 text-xs font-bold">!</span>
                    Account deletion is handled securely through Clerk with email verification and confirmation steps.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }





    return (
      <div className="text-center py-12">
        <p className="text-gray-300">This section is under development. Please use the UserButton in the top right for full profile management.</p>
        <Button 
          className="mt-4 bg-blue-500 hover:bg-blue-600 text-white"
          onClick={() => {
            // Trigger UserButton click
            const userButton = document.querySelector('[data-clerk-user-button]') as HTMLElement
            if (userButton) {
              userButton.click()
            }
          }}
        >
          Open Profile Manager
        </Button>
      </div>
    )
  }

  return (
    <>
      <Card className="bg-glass backdrop-blur-sm border-white/10 shadow-lg hover:shadow-xl hover:border-white/20 transition-all duration-300">
        <CardContent className="p-6">
          {/* Tab Navigation */}
          <div className="mb-6">
            {/* Desktop Tab Navigation */}
            <div className="hidden md:flex items-center gap-1 bg-white/5 backdrop-blur-sm rounded-xl p-1">
              {tabs.map((tab) => {
                const Icon = tab.icon
                const isActive = activeTab === tab.id
                
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 flex-1 ${
                      isActive
                        ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 shadow-lg'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                )
              })}
            </div>

            {/* Mobile Tab Navigation - Scrollable */}
            <div className="md:hidden overflow-x-auto">
              <div className="flex items-center gap-2 bg-white/5 backdrop-blur-sm rounded-xl p-1 min-w-max">
                {tabs.map((tab) => {
                  const Icon = tab.icon
                  const isActive = activeTab === tab.id
                  
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 whitespace-nowrap ${
                        isActive
                          ? 'text-white bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 shadow-lg'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{tab.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-in fade-in-0 duration-300">
            {renderTabContent()}
          </div>
        </CardContent>
      </Card>
      
      {/* Delete Account Modal */}
      <Dialog 
        open={showDeleteModal} 
        onOpenChange={setShowDeleteModal}
        modal={true}
      >
        <DialogContent 
        className="bg-gradient-to-br from-slate-900/98 via-blue-950/95 to-slate-900/98 backdrop-blur-xl border border-white/20 shadow-2xl rounded-xl max-w-4xl max-h-[85vh] overflow-y-auto"
        style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 50000,
          margin: 0,
          bottom: 'auto',
          right: 'auto'
        }}
      >
          <DialogHeader className="border-b border-white/10 pb-4">
            <DialogTitle className="text-white font-bold text-xl">Account Management</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <UserProfile 
              appearance={{
                ...modalUserProfileTheme,
                elements: {
                  ...modalUserProfileTheme.elements,
                  // Override modal styling since we're in our own modal
                  modalBackdrop: "hidden",
                  modalContent: "bg-transparent border-none shadow-none",
                  navbar: "border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl p-1 mb-6",
                  navbarButton: "text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200 rounded-lg px-4 py-3 font-medium text-sm",
                  navbarButtonActive: "text-white bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 font-semibold shadow-lg",
                }
              }}
              routing="virtual"
            />
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
