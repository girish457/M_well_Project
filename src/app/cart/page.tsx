'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/contexts/CartContext'
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Lock } from 'lucide-react'
import LoginForm from '@/components/LoginForm'
import SignupForm from '@/components/SignupForm'
import ProductTabs from '@/components/ProductTabs'
import { catalog as sharedCatalog } from '@/data/products'

// Lightweight confetti burst (no external deps)
function ConfettiBurst({ duration = 7000 }: { duration?: number }) {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const startRef = React.useRef<number | null>(null)
  const rafRef = React.useRef<number | null>(null)

  React.useLayoutEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)
    const onResize = () => {
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }
    window.addEventListener('resize', onResize)

    const colors = ['#EF4444', '#3B82F6', '#F59E0B', '#10B981', '#8B5CF6']
    const gravity = 0.18
    const drag = 0.005
    const particles: Array<{
      x: number; y: number; vx: number; vy: number; size: number; color: string; rot: number; vr: number
    }> = []

    const spawn = (count: number) => {
      for (let i = 0; i < count; i++) {
        const fromRight = Math.random() < 0.5
        const originX = fromRight ? width - 40 : 40
        const originY = 40
        // angle: fan inward from each corner toward center with some randomness
        const baseAngle = fromRight ? -Math.PI / 2 - Math.PI / 6 : -Math.PI / 2 + Math.PI / 6
        const angle = baseAngle + (Math.random() - 0.5) * 0.9
        const speed = 6 + Math.random() * 6
        particles.push({
          x: originX,
          y: originY,
          vx: Math.cos(angle) * speed * (0.6 + Math.random() * 0.8),
          vy: Math.sin(angle) * speed,
          size: 6 + Math.random() * 6,
          color: colors[(Math.random() * colors.length) | 0],
          rot: Math.random() * Math.PI,
          vr: (Math.random() - 0.5) * 0.2
        })
      }
    }

    // Single strong burst only (no waves)
    spawn(500)

    const draw = (ts: number) => {
      if (startRef.current === null) startRef.current = ts
      const elapsed = ts - startRef.current
      ctx.clearRect(0, 0, width, height)

      // No additional spawning after the initial burst

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        // physics
        p.vy += gravity
        // air drag
        p.vx *= (1 - drag)
        p.vy *= (1 - drag * 0.5)
        p.x += p.vx
        p.y += p.vy
        p.rot += p.vr

        // draw as rotated rectangle for variety
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.size * 0.6, -p.size * 0.3, p.size, p.size * 0.6)
        ctx.restore()

        // remove if off screen
        if (p.y - p.size > height + 40 || p.x < -40 || p.x > width + 40) {
          particles.splice(i, 1)
        }
      }

      if (elapsed < duration) {
        rafRef.current = requestAnimationFrame(draw)
      }
    }

    rafRef.current = requestAnimationFrame(draw)
    return () => {
      window.removeEventListener('resize', onResize)
      if (rafRef.current) cancelAnimationFrame(rafRef.current)
    }
  }, [duration])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[60]"
      aria-hidden
    />
  )
}

export default function CartPage() {
  const { cartItems, updateQuantity, removeFromCart, clearCart, getTotalPrice, getTotalItems } = useCart()
  const [isAuthModalOpen, setIsAuthModalOpen] = React.useState(false)
  const [authTab, setAuthTab] = React.useState<'login' | 'signup'>('login')
  const [showPayment, setShowPayment] = React.useState(false)
  const [couponCode, setCouponCode] = React.useState('')
  const [couponApplied, setCouponApplied] = React.useState(false)
  const [paymentMethod, setPaymentMethod] = React.useState<'PHONEPE'|'PAYTM'|'CARD'|'COD'>('COD')
  const [couponError, setCouponError] = React.useState('')
  const [showConfetti, setShowConfetti] = React.useState(false)
  const [notice, setNotice] = React.useState('')

  // Sound removed per request; animation only

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price)
  }

  const getEffectiveUnitPrice = (unitPrice: number) => (couponApplied ? unitPrice * 0.1 : unitPrice)

  const getPaymentDiscountRate = () => {
    switch (paymentMethod) {
      case 'PHONEPE': return 0.10
      case 'PAYTM': return 0.07
      case 'CARD': return 0.05
      default: return 0
    }
  }

  if (cartItems.length === 0) {
    return (
      <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          {/* Back to Shop Button */}
          <div className="mb-6">
            <Link
              href="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Shop
            </Link>
          </div>

          {/* Empty Cart */}
          <div className="text-center py-16">
            <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
              <ShoppingBag className="w-12 h-12 text-gray-400" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Your Cart is Empty</h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
              Looks like you haven&apos;t added any items to your cart yet. Start shopping to fill it up!
            </p>
            <Link
              href="/shop"
              className="inline-flex items-center px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
            >
              <ShoppingBag className="w-5 h-5 mr-2" />
              Start Shopping
            </Link>
          </div>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {showConfetti && <ConfettiBurst duration={7000} />}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Shopping Cart</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              {getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link
            href="/shop"
            className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Continue Shopping
          </Link>
        </div>

        

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
              <div className="p-6 border-b border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Cart Items</h2>
                  <button
                    onClick={clearCart}
                    className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors duration-200"
                  >
                    Clear Cart
                  </button>
                </div>
              </div>
              
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {cartItems.map((item) => (
                  <div key={item.product.id} className="p-6">
                    <div className="flex items-center space-x-4">
                      {/* Product Image */}
                      <div className="relative h-20 w-20 flex-shrink-0">
                        <Image
                          src={item.product.image}
                          alt={item.product.name}
                          fill
                          className="object-cover rounded-lg"
                        />
                      </div>

                      {/* Product Details */}
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white line-clamp-2">
                          {item.product.name}
                        </h3>
                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                          {item.product.brand} • {item.product.category}
                        </p>
                        {item.quantity >= 10 && (
                          <p className="text-xs text-orange-600 dark:text-orange-400 mt-1 font-medium">
                            ⚠️ Maximum quantity reached (10)
                          </p>
                        )}
                        
                        {/* Price */}
                        <div className="mt-2 flex items-center space-x-2">
                          {couponApplied ? (
                            <>
                              <span className="text-sm text-gray-400 line-through">₹{formatPrice(item.product.price)}</span>
                              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">₹{formatPrice(getEffectiveUnitPrice(item.product.price))}</span>
                              <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">-90%</span>
                            </>
                          ) : (
                            <>
                              {item.product.originalPrice && (
                                <span className="text-sm text-gray-400 line-through">₹{formatPrice(item.product.originalPrice)}</span>
                              )}
                              <span className="text-lg font-semibold text-primary-600 dark:text-primary-400">₹{formatPrice(item.product.price)}</span>
                              {item.product.discount && (
                                <span className="text-xs bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 px-2 py-1 rounded-full">-{item.product.discount}%</span>
                              )}
                            </>
                          )}
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
                        >
                          <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                        </button>
                        <span className="w-8 text-center font-medium text-gray-900 dark:text-white">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          disabled={item.quantity >= 10}
                          className={`p-1 rounded-full transition-colors duration-200 ${
                            item.quantity >= 10
                              ? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
                              : 'hover:bg-gray-100 dark:hover:bg-gray-700'
                          }`}
                          title={item.quantity >= 10 ? 'Maximum quantity reached (10)' : 'Increase quantity'}
                        >
                          <Plus className={`w-4 h-4 ${
                            item.quantity >= 10 
                              ? 'text-gray-400 dark:text-gray-500' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`} />
                        </button>
                      </div>

                      {/* Item Total */}
                      <div className="text-right">
                        <div className="text-lg font-semibold text-gray-900 dark:text-white">
                          ₹{formatPrice(getEffectiveUnitPrice(item.product.price) * item.quantity)}
                        </div>
                        {couponApplied && (
                          <div className="text-xs text-gray-500 line-through">₹{formatPrice(item.product.price * item.quantity)}</div>
                        )}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="mt-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm transition-colors duration-200"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Order Summary</h3>

              {/* Mini thumbnails */}
              <div className="space-y-2 mb-4">
                {cartItems.map((item) => (
                  <div key={`mini-${item.product.id}`} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative w-10 h-10 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700 flex-none">
                        <Image src={item.product.image} alt={item.product.name} fill className="object-contain p-1" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm text-gray-800 dark:text-gray-200 truncate max-w-[160px]">{item.product.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <div className="text-sm font-medium text-gray-900 dark:text-white">₹{formatPrice(getEffectiveUnitPrice(item.product.price) * item.quantity)}</div>
                  </div>
                ))}
              </div>

              {/* Apply Coupon */}
              <div className="mb-5">
                <label className="block text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">Apply Coupon Code</label>
                <div className="flex gap-2">
                  <input
                    value={couponCode}
                    onChange={(e)=>{ setCouponCode(e.target.value); setCouponError('') }}
                    placeholder="Enter Coupon code here"
                    className="flex-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                  />
                  <button
                    onClick={() => {
                      if (couponCode.trim().toLowerCase() === 'girishsir90'.toLowerCase()) {
                        if (!couponApplied) {
                          setCouponApplied(true)
                          setShowConfetti(true)
                          // auto stop confetti after 7s
                          setTimeout(() => setShowConfetti(false), 7000)
                        }
                        setCouponError('')
                      } else {
                        setCouponApplied(false)
                        setCouponError('Invalid coupon code. Try again.')
                      }
                    }}
                    className="px-4 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white"
                    type="button"
                  >
                    Apply
                  </button>
                </div>
                {couponApplied && (
                  <p className="mt-2 text-sm text-green-600 dark:text-green-400">🎉 Hurray! 90% OFF applied successfully!</p>
                )}
                {couponError && (
                  <p className="mt-2 text-sm text-red-600">{couponError}</p>
                )}
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setCouponApplied(false)
                      setCouponCode('')
                      setCouponError('')
                      setShowConfetti(false)
                    }}
                    className={`text-xs font-medium underline transition-colors ${couponApplied ? 'text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white' : 'text-gray-400 cursor-pointer hover:text-gray-500'}`}
                    title="Clear coupon"
                  >
                    Clear coupon
                  </button>
                </div>
              </div>
              
              {/* Totals calc */}
              {(() => {
                const subtotal = getTotalPrice()
                const couponDiscount = couponApplied ? subtotal * 0.9 : 0
                const afterCoupon = Math.max(0, subtotal - couponDiscount)
                // NOTE: As requested, payment method offers are display-only and do not affect totals
                const discountedSubtotal = afterCoupon
                const gst = Math.round((discountedSubtotal * 0.18) * 100) / 100
                const handling = cartItems.length > 0 ? 20 : 0
                const delivery = 0
                const finalTotal = discountedSubtotal + gst + handling + delivery
                return (
                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Subtotal ({getTotalItems()} items)</span>
                      <span className="text-gray-900 dark:text-white">₹{formatPrice(subtotal)}</span>
                    </div>
                    {couponApplied && (
                      <div className="flex justify-between text-sm text-green-600">
                        <span>Coupon (90% OFF)</span>
                        <span>-₹{formatPrice(couponDiscount)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">GST (18%)</span>
                      <span className="text-gray-900 dark:text-white">₹{formatPrice(gst)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Handling Charges</span>
                      <span className="text-gray-900 dark:text-white">₹{formatPrice(handling)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                      <span className="text-green-600 dark:text-green-400">Free</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
                      <div className="flex items-center justify-between text-lg font-semibold">
                        <span className="text-gray-900 dark:text-white">Total</span>
                        <span className="text-primary-600 dark:text-primary-400">₹{formatPrice(finalTotal)}</span>
                      </div>
                      <div className="mt-1 flex items-center gap-2 text-xs text-gray-500">
                        <Lock className="w-3.5 h-3.5" />
                        <span>Secure Checkout with 128-bit SSL</span>
                      </div>
                    </div>
                  </div>
                )
              })()}

              <button
                className="w-full bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105 mb-4"
                onClick={() => {
                  try {
                    const userRaw = localStorage.getItem('mwell_user')
                    if (!userRaw) {
                      setIsAuthModalOpen(true)
                      setAuthTab('login')
                      setNotice('')
                      setShowPayment(false)
                    } else {
                      setShowPayment(true)
                    }
                  } catch {
                    setIsAuthModalOpen(true)
                  }
                }}
              >
                Proceed to Checkout
              </button>
              
              <Link
                href="/shop"
                className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-900 dark:text-white font-semibold py-3 px-4 rounded-lg transition-all duration-300 text-center block"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>

        {/* Payment Options after auth */
        }
        {showPayment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/50" onClick={()=>setShowPayment(false)} />
            <div className="relative w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Select Payment</h3>
                <button onClick={()=>setShowPayment(false)} className="text-gray-500 hover:text-gray-700">✕</button>
              </div>
              <div className="px-6 py-5">
                <div className="grid grid-cols-1 gap-3">
                  <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${paymentMethod==='PHONEPE'?'border-primary-400 bg-primary-50 dark:bg-primary-900/20':'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input name="pay" type="radio" checked={paymentMethod==='PHONEPE'} onChange={()=>setPaymentMethod('PHONEPE')} />
                      <span className="text-gray-800 dark:text-gray-200">PhonePe</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">10% OFF</span>
                  </label>
                  <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${paymentMethod==='PAYTM'?'border-primary-400 bg-primary-50 dark:bg-primary-900/20':'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input name="pay" type="radio" checked={paymentMethod==='PAYTM'} onChange={()=>setPaymentMethod('PAYTM')} />
                      <span className="text-gray-800 dark:text-gray-200">Paytm</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">7% OFF</span>
                  </label>
                  <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${paymentMethod==='CARD'?'border-primary-400 bg-primary-50 dark:bg-primary-900/20':'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input name="pay" type="radio" checked={paymentMethod==='CARD'} onChange={()=>setPaymentMethod('CARD')} />
                      <span className="text-gray-800 dark:text-gray-200">Credit/Debit Card</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium">5% OFF</span>
                  </label>
                  <label className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer ${paymentMethod==='COD'?'border-primary-400 bg-primary-50 dark:bg-primary-900/20':'border-gray-200 dark:border-gray-700'}`}>
                    <div className="flex items-center gap-3">
                      <input name="pay" type="radio" checked={paymentMethod==='COD'} onChange={()=>setPaymentMethod('COD')} />
                      <span className="text-gray-800 dark:text-gray-200 flex items-center gap-2">Cash on Delivery <span aria-hidden>🛵</span></span>
                    </div>
                    <span className="text-gray-600 text-sm">No discount</span>
                  </label>
                </div>
                <div className="mt-5 flex justify-end gap-3">
                  <button className="px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50" onClick={()=>setShowPayment(false)}>Close</button>
                  <button className="px-5 py-2 rounded-lg bg-primary-600 hover:bg-primary-700 text-white font-semibold">Place Order</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Product Tabs Section at bottom of cart page */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="mt-14">
          <ProductTabs products={sharedCatalog} />
        </div>
      </div>

      {/* Auth Modal */}
      {isAuthModalOpen && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Login or Sign up</h3>
              <button onClick={()=>setIsAuthModalOpen(false)} className="text-gray-500 hover:text-gray-700">✕</button>
            </div>
            <div className="px-6 pt-4">
              <div className="flex gap-2 mb-4">
                <button onClick={()=>setAuthTab('login')} className={`px-4 py-2 rounded-lg text-sm ${authTab==='login'?'bg-primary-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Login</button>
                <button onClick={()=>setAuthTab('signup')} className={`px-4 py-2 rounded-lg text-sm ${authTab==='signup'?'bg-primary-600 text-white':'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'}`}>Sign up</button>
              </div>
            </div>
            <div className="px-6 pb-6">
              {authTab==='login' ? (
                <LoginForm 
                  onSwitchToSignup={() => setAuthTab('signup')}
                  onSuccess={() => { setIsAuthModalOpen(false); setShowPayment(true) }}
                  notice={notice}
                />
              ) : (
                <SignupForm 
                  onSwitchToLogin={() => {
                    setAuthTab('login')
                    setNotice('Signup successful! Login here')
                  }}
                  onSuccess={() => {
                    setAuthTab('login')
                    setNotice('Signup successful! Login here')
                  }}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </main>
  )
}
