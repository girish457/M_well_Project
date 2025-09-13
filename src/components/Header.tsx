'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { useRouter, usePathname } from 'next/navigation'
import { Menu, X, Phone, Mail, MapPin, ShoppingBag, User, Navigation, Shield, Search, ShoppingCart } from 'lucide-react'
import ThemeToggle from './ThemeToggle'
import { findProductByName, searchProducts } from '@/data/products'
// Removed auth import - will use localStorage directly

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isAddressOpen, setIsAddressOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [cartItemCount, setCartItemCount] = useState(0)
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  // Check for user on mount
  React.useEffect(() => {
    const savedUser = localStorage.getItem('mwell_user')
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser)
        setUser(userData)
        setIsAuthenticated(true)
      } catch (error) {
        localStorage.removeItem('mwell_user')
      }
    }
  }, [])

  // Load cart count from localStorage and listen for changes
  React.useEffect(() => {
    const loadCartCount = () => {
      try {
        const savedCart = localStorage.getItem('mwell_cart')
        if (savedCart) {
          const cartItems = JSON.parse(savedCart)
          const totalItems = cartItems.reduce((total: number, item: any) => total + item.quantity, 0)
          setCartItemCount(totalItems)
        } else {
          setCartItemCount(0)
        }
      } catch (error) {
        setCartItemCount(0)
      }
    }

    // Load initial count
    loadCartCount()

    // Listen for storage changes (when cart is updated in other tabs)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'mwell_cart') {
        loadCartCount()
      }
    }

    window.addEventListener('storage', handleStorageChange)

    // Listen for custom cart update events
    const handleCartUpdate = () => {
      loadCartCount()
    }

    window.addEventListener('cartUpdated', handleCartUpdate)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('cartUpdated', handleCartUpdate)
    }
  }, [])

  // Handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value
    setSearchQuery(query)
    
    if (query.trim()) {
      const results = searchProducts(query)
      setSearchResults(results)
      setShowSearchResults(true)
    } else {
      setSearchResults([])
      setShowSearchResults(false)
    }
  }

  // Handle search form submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      const product = findProductByName(searchQuery)
      if (product) {
        // Navigate directly to product page
        router.push(`/product/${product.id}`)
        setSearchQuery('')
        setShowSearchResults(false)
      } else {
        // For non-exact matches, always go to generic shop without query
        router.push('/shop')
        setSearchQuery('')
        setShowSearchResults(false)
      }
    }
  }

  // Handle search result click
  const handleSearchResultClick = (product: any) => {
    router.push(`/product/${product.id}`)
    setSearchQuery('')
    setShowSearchResults(false)
  }

  // Close search results when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element
      if (!target.closest('.search-container')) {
        setShowSearchResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'About us', href: '/about' },
    { name: 'Shop', href: '/shop' },
    { name: 'Cart', href: '/cart' },
    { name: 'Contact us', href: '/contact' },
  ]
  return (
    <header className="bg-white dark:bg-gray-800 shadow-lg dark:shadow-2xl sticky top-0 z-50 transition-all duration-300">
      {/* Top bar */}
      <div className="bg-primary-600 dark:bg-primary-700 text-white py-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center text-sm">
            <div className="flex space-x-6">
              <div className="flex items-center space-x-2 hover-scale">
                <Phone className="h-4 w-4 animate-pulse" />
                <span>1800-891-2871</span>
              </div>
              <div className="flex items-center space-x-2 hover-scale">
                <Mail className="h-4 w-4 animate-pulse" />
                <span>sales@mwellhealthcare.com</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsAddressOpen(!isAddressOpen)}
                className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 text-white bg-gradient-to-r from-primary-500 to-primary-700 hover:from-primary-600 hover:to-primary-800 shadow-md hover:shadow-lg transition-transform duration-500 ease-out focus:outline-none focus:ring-2 focus:ring-white/40 active:scale-95 hover:-translate-y-0.5"
                aria-expanded={isAddressOpen}
                aria-controls="office-address"
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Office Address</span>
              </button>
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 bg-white/90 text-primary-700 border border-primary-100 hover:bg-white hover:shadow-lg transition-transform duration-500 ease-out active:scale-95 hover:-translate-y-0.5"
              >
                <ShoppingBag className="h-4 w-4" />
                <span className="font-medium">Shop</span>
              </Link>
              <Link
                href="/account"
                className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 bg-white/90 text-primary-700 border border-primary-100 hover:bg-white hover:shadow-lg transition-transform duration-500 ease-out active:scale-95 hover:-translate-y-0.5"
              >
                <User className="h-4 w-4" />
                <span className="font-medium">
                  {isAuthenticated ? `${user?.firstName || 'My'} Account` : 'My Account'}
                </span>
              </Link>
              {isAuthenticated && user?.role === 'ADMIN' && (
                <Link
                  href="/admin"
                  className="inline-flex items-center space-x-2 rounded-full px-4 py-1.5 bg-red-600 text-white border border-red-500 hover:bg-red-700 hover:shadow-lg transition-transform duration-500 ease-out active:scale-95 hover:-translate-y-0.5"
                >
                  <Shield className="h-4 w-4" />
                  <span className="font-medium">Admin</span>
                </Link>
              )}
            </div>
          </div>
          {isAddressOpen && (
            <div
              id="office-address"
              className="mt-2 rounded-md bg-white text-gray-800 p-3 shadow-md animate-slide-down"
            >
              <div className="flex items-center justify-between gap-4">
                <p className="text-sm sm:text-base">
                  406, 4th floor Okay Plus, Big Benn Tower, Near Palika Bazar, Jaipur, Rajasthan -302007
                </p>
                <a
                  href={`https://www.google.com/maps/dir/?api=1&origin=Current+Location&destination=${encodeURIComponent('406, 4th floor Okay Plus, Big Benn Tower, Near Palika Bazar, Jaipur, Rajasthan -302007')}&travelmode=driving`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whitespace-nowrap inline-flex items-center space-x-2 px-3 py-1.5 rounded-full bg-primary-600 text-white hover:bg-primary-700 shadow-md hover:shadow-lg transition-transform duration-500 ease-out hover:-translate-y-0.5 active:scale-95"
                >
                  <Navigation className="h-4 w-4" />
                  <span>Open in Maps</span>
                </a>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Main navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
           {/* Logo */}
           <div className="flex items-center">
             <Link href="/" className="hover-scale group">
               <Image
                 src="/mwelllogo.png"
                 alt="M-Well Healthcare Logo"
                 width={180}
                 height={80}
                 className="logo-image transition-all duration-300 group-hover:scale-110"
                 priority
               />
             </Link>
           </div>
          {/* Desktop navigation */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`${isActive(item.href) ? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 pb-1' : 'text-gray-700 dark:text-gray-300'} hover:text-primary-600 dark:hover:text-primary-400 font-medium`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Search + Theme Toggle + Cart */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Search bar */}
            <div className="relative search-container">
              <form onSubmit={handleSearchSubmit} className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  placeholder="search for products"
                  aria-label="search for products"
                  className="w-64 lg:w-80 pl-9 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-white/90 dark:bg-gray-700 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                  aria-label="Search"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
              
              {/* Search Results Dropdown */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                  {searchResults.slice(0, 5).map((product) => (
                    <div
                      key={product.id}
                      onClick={() => handleSearchResultClick(product)}
                      className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                    >
                      <div className="flex items-center space-x-3">
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={40}
                          height={40}
                          className="rounded object-cover"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                            {product.name}
                          </p>
                          <p className="text-xs text-gray-600 dark:text-gray-400">
                            ₹{product.price} • {product.category}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Cart Icon with Badge */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <ThemeToggle />
            </div>
            {/* Order Now CTA */}
            <Link
              href="/shop"
              className="relative inline-flex items-center px-5 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-[0_10px_25px_-10px_rgba(244,63,94,0.9)] hover:shadow-[0_15px_35px_-10px_rgba(234,179,8,0.9)] transition-all duration-300 hover:-translate-y-0.5 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-400"
            >
              <ShoppingBag className="h-5 w-5 mr-2 animate-bounce" />
              Order Now
              <span className="absolute inset-0 rounded-full ring-2 ring-white/30 animate-pulse pointer-events-none" />
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile Cart Icon */}
            <Link
              href="/cart"
              className="relative p-2 text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200"
            >
              <ShoppingCart className="h-6 w-6" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount > 99 ? '99+' : cartItemCount}
                </span>
              )}
            </Link>
            
            <div className="relative">
              <ThemeToggle />
            </div>
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-300 transform hover:scale-110"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6 animate-spin" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile navigation */}
        {isMenuOpen && (
          <div className="md:hidden animate-slide-down">
            <div className="px-2 pt-2 pb-3 space-y-3 sm:px-3 bg-gray-50 dark:bg-gray-700 rounded-lg mb-4">
              {/* Mobile search bar */}
              <div className="relative search-container">
                <form onSubmit={handleSearchSubmit} className="relative">
                  <Search className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    placeholder="search for products"
                    aria-label="search for products"
                    className="w-full pl-9 pr-10 py-2 rounded-full border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
                    aria-label="Search"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </form>
                
                {/* Mobile Search Results Dropdown */}
                {showSearchResults && searchResults.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-50 max-h-60 overflow-y-auto">
                    {searchResults.slice(0, 3).map((product) => (
                      <div
                        key={product.id}
                        onClick={() => handleSearchResultClick(product)}
                        className="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer border-b border-gray-100 dark:border-gray-700 last:border-b-0"
                      >
                        <div className="flex items-center space-x-3">
                          <Image
                            src={product.image}
                            alt={product.name}
                            width={40}
                            height={40}
                            className="rounded object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                              {product.name}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400">
                              ₹{product.price} • {product.category}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`block px-3 py-2 rounded-md font-medium ${isActive(item.href) ? 'bg-primary-50 text-primary-700 dark:bg-gray-600 dark:text-primary-300' : 'text-gray-700 dark:text-gray-300'} hover:text-primary-600 dark:hover:text-primary-400 hover:bg-white dark:hover:bg-gray-600`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              {/* Mobile Order Now CTA */}
              <Link
                href="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-full font-semibold text-white bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 shadow-md hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
              >
                Order Now
              </Link>
              
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
