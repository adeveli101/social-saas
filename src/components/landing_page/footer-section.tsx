'use client'

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Twitter, Facebook, Instagram, Linkedin, Github, Globe, Heart } from "lucide-react"
import { useEffect } from "react"
import AOS from "aos"
import { Section } from "@/components/shared/page-container"

const footerLinks = {
  product: [
    { name: "Features", href: "#features" },
    { name: "Pricing", href: "/pricing" },
    { name: "API", href: "#" },
    { name: "Integrations", href: "#" },
    { name: "Mobile App", href: "#" },
  ],
  company: [
    { name: "About", href: "#" },
    { name: "Blog", href: "#" },
    { name: "Careers", href: "#" },
    { name: "Press", href: "#" },
    { name: "Contact", href: "#" },
  ],
  support: [
    { name: "Help Center", href: "#" },
    { name: "Documentation", href: "#" },
    { name: "Community", href: "#" },
    { name: "Status", href: "#" },
    { name: "Security", href: "#" },
  ],
  legal: [
    { name: "Privacy Policy", href: "#" },
    { name: "Terms of Service", href: "#" },
    { name: "Cookie Policy", href: "#" },
    { name: "GDPR", href: "#" },
  ],
}

const socialLinks = [
  { name: "Twitter", href: "#", icon: Twitter },
  { name: "Facebook", href: "#", icon: Facebook },
  { name: "Instagram", href: "#", icon: Instagram },
  { name: "LinkedIn", href: "#", icon: Linkedin },
  { name: "GitHub", href: "#", icon: Github },
]

export function FooterSection() {
  useEffect(() => { AOS.init({ once: true, duration: 700 }) }, [])

  return (
    <Section 
      className="py-16 mt-12"
      animate={true}
      containerClassName="w-full px-4 md:px-8 xl:px-12 2xl:px-16 mx-auto"
      center={true}
    >
      <div className="max-w-6xl mx-auto mb-12">
        <div className="rounded-xl bg-[var(--background)] p-10 md:p-12 flex flex-col lg:flex-row gap-8 lg:gap-0 lg:items-start lg:justify-between">
          {/* Brand & Social */}
          <div className="lg:w-1/4 mb-8 lg:mb-0 flex flex-col items-center lg:items-start">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-r from-[var(--primary)] to-[var(--primary)]/80 rounded-lg flex items-center justify-center">
                <span className="text-[var(--primary-foreground)] font-bold text-sm">S</span>
              </div>
              <span className="font-medium text-xl heading-gradient heading text-[var(--heading-foreground)]">Social SaaS</span>
            </div>
            <p className="text-[var(--heading-foreground)] mb-6 text-sm leading-relaxed text-center lg:text-left">
              The all-in-one platform for managing your social media presence. 
              Schedule, analyze, and grow with confidence.
            </p>
            <div className="flex space-x-3">
              {socialLinks.map((social) => (
                <Button
                  key={social.name}
                  variant="ghost"
                  size="sm"
                  className="text-[var(--heading-foreground)] hover:text-[var(--primary-foreground)] hover:bg-[var(--primary)]/70"
                >
                  <social.icon className="h-4 w-4" />
                </Button>
              ))}
            </div>
          </div>
          {/* Links */}
          <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-medium heading-gradient heading text-[var(--heading-foreground)] mb-4">Product</h3>
              <ul className="space-y-2">
                {footerLinks.product.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-[var(--heading-foreground)] hover:text-[var(--primary-foreground)] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium heading-gradient heading text-[var(--heading-foreground)] mb-4">Company</h3>
              <ul className="space-y-2">
                {footerLinks.company.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-[var(--heading-foreground)] hover:text-[var(--primary-foreground)] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium heading-gradient heading text-[var(--heading-foreground)] mb-4">Support</h3>
              <ul className="space-y-2">
                {footerLinks.support.map((link) => (
                  <li key={link.name}>
                    <a 
                      href={link.href} 
                      className="text-[var(--heading-foreground)] hover:text-[var(--primary-foreground)] transition-colors text-sm"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="font-medium heading-gradient heading text-[var(--heading-foreground)] mb-4">Stay Updated</h3>
              <p className="text-[var(--heading-foreground)] mb-4 text-sm">
                Get the latest news and updates delivered to your inbox.
              </p>
              <div className="flex space-x-2">
                <Input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="bg-[var(--background)] border-[var(--border)] text-[var(--heading-foreground)] placeholder:text-[var(--muted)] text-sm focus:border-[var(--primary)]/50"
                />
                <Button variant="default" size="sm" className="btn-micro-effect bg-[var(--primary)] hover:bg-[var(--primary)]/90">
                  <Mail className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Bottom */}
      <div className="border-t border-[var(--border)] pt-8" data-aos="fade-up" data-aos-delay="100">
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between w-full">
          <div className="flex items-center space-x-2 text-[var(--muted)] text-sm mb-4 md:mb-0 md:justify-start md:w-auto w-full">
            <span>&copy; {new Date().getFullYear()} Social SaaS. All rights reserved.</span>
            <span className="hidden sm:inline">•</span>
            <span className="hidden sm:inline">Made with</span>
            <Heart className="h-3 w-3 text-[var(--primary)] hidden sm:inline" />
            <span className="hidden sm:inline">for creators</span>
          </div>
          <div className="flex space-x-6 md:justify-end md:w-auto w-full">
            {footerLinks.legal.map((link) => (
              <a 
                key={link.name}
                href={link.href} 
                className="text-[var(--muted)] hover:text-[var(--primary)] text-sm transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </Section>
  )
} 