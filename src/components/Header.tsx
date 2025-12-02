"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Search, User, ShoppingCart, Menu, X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`sticky top-0 z-50 bg-[#4A5D7E] text-white transition-shadow ${isScrolled ? 'shadow-md' : ''}`}>
      <div className="container mx-auto px-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between py-3">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden text-white p-2"
              onClick={() => {
                setIsMenuOpen(!isMenuOpen)
                if (isSearchOpen) setIsSearchOpen(false)
              }}
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link href="/" className="flex items-center gap-2">
              <div className="bg-white px-3 py-1 rounded">
                <span className="text-[#4A5D7E] font-bold text-xl">BKT</span>
              </div>
            </Link>
          </div>

          {/* Search Bar - Hidden on mobile when menu is open */}
          <div className={`${isMenuOpen ? 'hidden' : 'flex'} flex-1 max-w-xl mx-4 lg:mx-8`}>
            <div className="w-full relative">
              <Input 
                type="search" 
                placeholder="Search" 
                className="bg-white text-gray-900 pr-10 w-full"
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4">
            <Button 
              variant="ghost" 
              size="sm" 
              className="hidden sm:flex text-white hover:bg-white/10"
            >
              <User className="h-5 w-5 mr-2" />
              <span className="hidden md:inline">LOGG INN</span>
            </Button>
            
            <button 
              className="sm:hidden text-white p-2"
              onClick={() => {
                setIsSearchOpen(!isSearchOpen)
                if (isMenuOpen) setIsMenuOpen(false)
              }}
            >
              <Search size={20} />
            </button>
            
            <Link href="/cart" className="relative p-2">
              <ShoppingCart className="h-6 w-6" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-red-500 text-white text-xs">
                0
              </Badge>
            </Link>
          </div>
        </div>

        {/* Mobile Search - Only shows when search is toggled on mobile */}
        {isSearchOpen && (
          <div className="pb-3 lg:hidden">
            <div className="relative">
              <Input 
                type="search" 
                placeholder="Search products..." 
                className="bg-white text-gray-900 pr-10 w-full"
                autoFocus
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
            </div>
          </div>
        )}

        {/* Navigation */}
        <nav className={`${isMenuOpen ? 'block' : 'hidden'} lg:block border-t border-white/20`}>
          <ul className="flex flex-col justify-center lg:flex-row gap-4 lg:gap-6 py-3 text-sm">
            <li><Link href="/products" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>TAXI</Link></li>
            <li><Link href="/products" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>MOBIL OG DINGSER</Link></li>
            <li><Link href="/products" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>REKLAME - PROFILERING</Link></li>
            <li><Link href="/products" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>BIL ELEKTRISK</Link></li>
            <li><Link href="/products" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>OUTLET</Link></li>
            <li><Link href="/contact" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>KONTAKT</Link></li>
            <li><Link href="/about" className="block py-2 hover:text-gray-200" onClick={() => setIsMenuOpen(false)}>OM OSS</Link></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}