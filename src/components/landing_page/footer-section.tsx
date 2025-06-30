import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Twitter, Facebook, Instagram, Linkedin } from "lucide-react"

export function FooterSection() {
  return (
    <footer id="about" className="bg-surface-primary border-t border-surface-border">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="lg:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">S</span>
              </div>
              <span className="font-bold text-xl text-text-primary">Social SaaS</span>
            </div>
            <p className="text-text-secondary mb-6">
              The all-in-one platform for managing your social media presence. 
              Schedule, analyze, and grow with confidence.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                <Instagram className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-text-tertiary hover:text-text-primary hover:bg-surface-secondary">
                <Linkedin className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Product */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Product</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Features</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Pricing</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">API</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Integrations</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Mobile App</a></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Company</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">About</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Blog</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Careers</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Press</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Contact</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-text-primary mb-4">Support</h3>
            <ul className="space-y-2">
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Help Center</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Documentation</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Community</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Status</a></li>
              <li><a href="#" className="text-text-secondary hover:text-text-primary transition-colors">Security</a></li>
            </ul>
          </div>
        </div>

        {/* Newsletter */}
        <div className="border-t border-surface-border mt-12 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="mb-4 md:mb-0">
              <h3 className="font-semibold text-text-primary mb-2">Stay updated</h3>
              <p className="text-text-secondary">Get the latest news and updates delivered to your inbox.</p>
            </div>
            <div className="flex w-full md:w-auto">
              <Input 
                type="email" 
                placeholder="Enter your email" 
                className="mr-2 bg-surface-secondary border-surface-border text-text-primary placeholder:text-text-tertiary"
              />
              <Button className="bg-primary-600 hover:bg-primary-700 text-white">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-surface-border mt-8 pt-8 flex flex-col md:flex-row items-center justify-between">
          <p className="text-text-tertiary text-sm">
            © 2024 Social SaaS. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-text-tertiary hover:text-text-primary text-sm transition-colors">Privacy Policy</a>
            <a href="#" className="text-text-tertiary hover:text-text-primary text-sm transition-colors">Terms of Service</a>
            <a href="#" className="text-text-tertiary hover:text-text-primary text-sm transition-colors">Cookie Policy</a>
          </div>
        </div>
      </div>
    </footer>
  )
} 