'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Plus, Minus, Heart, RotateCcw, Share2, Star, Check } from 'lucide-react'
import { useCompare } from '@/contexts/CompareContext'
import { useCart } from '@/contexts/CartContext'
import ClickZoomImage from '@/components/ClickZoomImage'
import { catalog as sharedCatalog } from '@/data/products'
import { getAuthHeaders, getUserId } from '@/lib/auth-utils'

type Product = {
	id: string
	name: string
	price: number
	originalPrice?: number
	discount?: number
	image: string
	description: string
	brand: string
	category: string
	rating: number
	reviewCount: number
	inStock: boolean
	isNew?: boolean
	isSale?: boolean
	gallery?: string[]
}

type Review = {
	id: number
	name: string
	email: string
	rating: number
	date: string
	comment: string
}

// Product catalog with detailed information
// Use shared catalog from data/products.ts
const catalog: Product[] = sharedCatalog

// Mock reviews data
const mockReviews = [
	{
		id: 1,
		name: 'Rajesh Kumar',
		rating: 5,
		date: '2024-01-15',
		comment: 'Excellent product! Really helped with my energy levels throughout the day.'
	},
	{
		id: 2,
		name: 'Priya Sharma',
		rating: 4,
		date: '2024-01-10',
		comment: 'Good quality and fast delivery. Would recommend to others.'
	},
	{
		id: 3,
		name: 'Amit Singh',
		rating: 5,
		date: '2024-01-08',
		comment: 'Amazing results! This product has become a part of my daily routine.'
	}
] as Review[]

function StarRating({ rating }: { rating: number }) {
	const full = Math.round(rating)
	return (
		<div className="flex gap-1 text-amber-500">
			{Array.from({ length: 5 }).map((_, i) => (
				<Star key={i} className={`w-4 h-4 ${i < full ? 'fill-current' : 'stroke-current'}`} />
			))}
		</div>
	)
}

function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
	return (
		<div className="flex items-center gap-2">
			{[1,2,3,4,5].map((v) => (
				<button key={v} type="button" onClick={() => onChange(v)} aria-label={`Rate ${v} star`} className="text-amber-500">
					<Star className={`w-5 h-5 ${v <= value ? 'fill-amber-400 text-amber-400' : ''}`} />
				</button>
			))}
		</div>
	)
}

export default function ProductDetailPage({ params }: { params: { id: string } }) {
	const [quantity, setQuantity] = useState(1)
	const [isWishlisted, setIsWishlisted] = useState(false)
	const [activeTab, setActiveTab] = useState<'description' | 'reviews'>('description')
	const [selectedImage, setSelectedImage] = useState(0)
	const { addToCart, isInCart, updateQuantity, cartItems, removeFromCart } = useCart()
	const { addToCompare, removeFromCompare, isInCompare } = useCompare()

	const product = catalog.find(p => p.id === params.id)

	if (!product) {
		return (
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Product Not Found</h1>
					<Link href="/shop" className="text-primary-600 hover:text-primary-700 dark:text-primary-400">
						Back to Shop
					</Link>
				</div>
			</main>
		)
	}

	const cartItem = cartItems.find(item => item.product.id === product.id)
	const currentQuantity = cartItem ? cartItem.quantity : 0

	// Keep local quantity in sync with cart state so default doesn't always show 1
	React.useEffect(() => {
		setQuantity(currentQuantity)
	}, [currentQuantity])

	// Reviews state
	const [reviews, setReviews] = useState<Review[]>(mockReviews)
	const averageRating = reviews.length === 0 ? 0 : reviews.reduce((s, r) => s + r.rating, 0) / reviews.length

	// Review form state
	const [formRating, setFormRating] = useState<number>(0)
	const [formComment, setFormComment] = useState('')
	const [formName, setFormName] = useState('')
	const [formEmail, setFormEmail] = useState('')
	const [remember, setRemember] = useState(false)

	// Load saved name/email
	React.useEffect(() => {
		const saved = localStorage.getItem('mwell_review_identity')
		if (saved) {
			try {
				const obj = JSON.parse(saved)
				setFormName(obj.name || '')
				setFormEmail(obj.email || '')
				setRemember(true)
			} catch {}
		}
	}, [])

	// Check if product is in wishlist from localStorage (no database)
	React.useEffect(() => {
		const wishlist = JSON.parse(localStorage.getItem('mwell_wishlist') || '[]')
		const isInWishlist = wishlist.includes(product.id)
		setIsWishlisted(isInWishlist)
	}, [product.id])

	// Wishlist functions - localStorage only (no database)
	const handleWishlistToggle = () => {
		const wishlist = JSON.parse(localStorage.getItem('mwell_wishlist') || '[]')
		
		if (isWishlisted) {
			// Remove from wishlist
			const updatedWishlist = wishlist.filter((id: string) => id !== product.id)
			localStorage.setItem('mwell_wishlist', JSON.stringify(updatedWishlist))
			setIsWishlisted(false)
			console.log('Removed from wishlist:', product.name)
		} else {
			// Add to wishlist
			const updatedWishlist = [...wishlist, product.id]
			localStorage.setItem('mwell_wishlist', JSON.stringify(updatedWishlist))
			setIsWishlisted(true)
			console.log('Added to wishlist:', product.name)
		}
	}

	const handleAddToCart = () => {
		if (isInCart(product.id)) {
			updateQuantity(product.id, currentQuantity + quantity)
		} else {
			addToCart(product)
			// If user selected more than 1, set that quantity
			if (quantity > 1) {
				updateQuantity(product.id, quantity)
			}
		}
		// Dispatch custom event to notify header
		window.dispatchEvent(new CustomEvent('cartUpdated'))
	}

	const handleClearCart = () => {
		if (isInCart(product.id)) {
			removeFromCart(product.id)
			setQuantity(0)
			window.dispatchEvent(new CustomEvent('cartUpdated'))
		}
	}

	// Auto-update cart when quantity changes via +/-
	const handleQuantityChange = (newQuantity: number) => {
		if (newQuantity < 0) return
		if (newQuantity === 0) {
			// remove from cart if exists
			if (isInCart(product.id)) {
				removeFromCart(product.id)
				window.dispatchEvent(new CustomEvent('cartUpdated'))
			}
			setQuantity(0)
			return
		}
		if (newQuantity > 10) {
			newQuantity = 10
		}
		// If not in cart, add first then set quantity
		if (!isInCart(product.id)) {
			addToCart(product)
		}
		updateQuantity(product.id, newQuantity)
		setQuantity(newQuantity)
		window.dispatchEvent(new CustomEvent('cartUpdated'))
	}

	const handleSubmitReview = async (e: React.FormEvent) => {
		e.preventDefault()
		if (formRating <= 0 || formComment.trim().length === 0 || formName.trim().length === 0 || formEmail.trim().length === 0) {
			return
		}

		// Add to local state for immediate UI update (no database saving)
		const newReview: Review = {
			id: Date.now(),
			name: formName.trim(),
			email: formEmail.trim(),
			rating: formRating,
			date: new Date().toISOString().slice(0, 10),
			comment: formComment.trim()
		}
		setReviews((prev) => [newReview, ...prev])
		
		// Save user info if remember is checked
		if (remember) {
			localStorage.setItem('mwell_review_identity', JSON.stringify({ name: formName.trim(), email: formEmail.trim() }))
		}
		
		// Reset form
		setFormRating(0)
		setFormComment('')
		
		alert('Review added successfully!')
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-IN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price)
	}

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-[1400px] mx-auto px-2 sm:px-4 lg:px-6 py-6">
				{/* Back to Shop Button */}
				<div className="mb-6">
					<Link
						href="/shop"
						className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Shop
					</Link>
				</div>

				{/* Product Details */}
				<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
					{/* Similar Products Sidebar */}
					<aside className="order-last lg:order-first lg:col-span-3 lg:sticky lg:top-24 h-max">
						<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 lg:p-5 border border-gray-100 dark:border-gray-700 overflow-hidden">
							<h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Similar Products</h3>
							<div className="space-y-5 max-h-[80vh] overflow-y-auto pr-2">
								{catalog.filter(p => p.id !== product.id).slice(0, 4).map((sp) => (
									<Link key={sp.id} href={`/product/${sp.id}`} className="flex gap-4 items-start group">
										<div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-50 dark:bg-gray-700 ring-1 ring-gray-100 dark:ring-gray-600">
											<Image src={sp.image} alt={sp.name} fill className="object-contain p-1" />
										</div>
										<div className="min-w-0 overflow-hidden flex-1">
											<p className="text-[13px] leading-snug font-medium text-gray-900 dark:text-gray-100 line-clamp-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">{sp.name}</p>
											<div className="mt-1"><StarRating rating={sp.rating} /></div>
											{sp.originalPrice ? (
												<>
													<div className="text-[12px] text-gray-400 line-through">₹{formatPrice(sp.originalPrice)}</div>
													<div className="text-[15px] font-semibold text-red-600 dark:text-red-400">₹{formatPrice(sp.price)}</div>
												</>
											) : (
												<div className="text-[15px] font-semibold text-primary-600 dark:text-primary-400">₹{formatPrice(sp.price)}</div>
											)}
										</div>
									</Link>
								))}
							</div>
						</div>
					</aside>

					{/* Main Product Card */}
					<div className="lg:col-span-9 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
						<div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 p-5 lg:p-8">
							{/* Product Image with Click Zoom - No Frame */}
							<div className="relative lg:col-span-5 z-0 overflow-hidden">
								<ClickZoomImage
									src={product.gallery ? product.gallery[selectedImage] : product.image}
									alt={product.name}
									width={500}
									height={500}
									className="w-full h-72 sm:h-96 lg:h-[420px]"
								/>
								{/* Discount Badge */}
								{product.discount && (
									<div className="absolute top-4 left-4 bg-green-500 text-white text-sm font-bold px-3 py-1 rounded-md z-20 shadow-lg">
										-{product.discount}%
									</div>
								)}
								
								{/* Image Gallery Thumbnails */}
								{product.gallery && product.gallery.length > 1 && (
									<div className="mt-4 flex gap-2 overflow-x-auto pb-2">
										{product.gallery.map((image, index) => (
											<button
												key={index}
												onClick={() => setSelectedImage(index)}
												className={`relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
													selectedImage === index
														? 'border-primary-600 ring-2 ring-primary-200 dark:ring-primary-800'
														: 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
												}`}
											>
												<Image
													src={image}
													alt={`${product.name} - Image ${index + 1}`}
													fill
													className="object-cover"
													sizes="64px"
												/>
											</button>
										))}
									</div>
								)}
							</div>

							{/* Product Info */}
							<div className="relative z-10 space-y-6 lg:col-span-7 self-start max-w-[720px]">
								{/* Product Name */}
								<div>
									<h1 className="text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white leading-tight">
										{product.name}
									</h1>
									<div className="flex items-center gap-4 mt-2">
										<StarRating rating={product.rating} />
										<span className="text-sm text-gray-600 dark:text-gray-400">
											{product.rating} ({product.reviewCount} reviews)
										</span>
									</div>
								</div>

								{/* Price */}
								<div className="flex items-center gap-4">
									{product.originalPrice ? (
										<>
											<span className="text-3xl font-bold text-red-600 dark:text-red-400">
												₹{formatPrice(product.price)}
											</span>
											<span className="text-xl text-gray-400 line-through">
												₹{formatPrice(product.originalPrice)}
											</span>
										</>
									) : (
										<span className="text-3xl font-bold text-primary-600 dark:text-primary-400">
											₹{formatPrice(product.price)}
										</span>
									)}
								</div>

								{/* Stock Status */}
								<div className="flex items-center gap-2">
									{product.inStock ? (
										<>
											<Check className="w-5 h-5 text-green-500" />
											<span className="text-green-600 dark:text-green-400 font-medium">In Stock</span>
										</>
									) : (
										<span className="text-red-600 dark:text-red-400 font-medium">Out of Stock</span>
									)}
								</div>

								{/* Quantity and Add to Cart */}
								<div className="space-y-4">
									<div className="flex items-center gap-4">
										<span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quantity:</span>
										<div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
											<button
												onClick={() => handleQuantityChange(quantity - 1)}
												disabled={quantity <= 0}
												className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<Minus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
											</button>
											<span className="px-4 py-2 text-center min-w-[3rem] text-gray-800 dark:text-gray-100 font-semibold">{quantity}</span>
											<button
												onClick={() => handleQuantityChange(quantity + 1)}
												disabled={quantity >= 10}
												className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
											>
												<Plus className="w-4 h-4 text-gray-700 dark:text-gray-200" />
											</button>
										</div>
									</div>

									<div className="flex gap-4">
										{isInCart(product.id) ? (
											<button
												onClick={handleClearCart}
												disabled={!product.inStock}
												className="flex-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
											>
												Clear Cart
											</button>
										) : (
											<button
												onClick={handleAddToCart}
												disabled={!product.inStock}
												className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200"
											>
												Add to Cart
											</button>
										)}
										<button
											onClick={handleWishlistToggle}
											className={`p-3 rounded-lg border transition-all duration-300 hover:scale-105 ${
												isWishlisted 
													? 'bg-red-50 border-red-200 text-red-600 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400 shadow-lg shadow-red-200/50 animate-pulse'
													: 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-600'
											}`}
											title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
										>
											<Heart className={`w-5 h-5 transition-all duration-300 ${isWishlisted ? 'fill-current drop-shadow-[0_0_12px_rgba(239,68,68,0.9)] animate-pulse' : ''}`} />
										</button>
									</div>

									{/* Quick Actions */}
									<div className="flex items-center gap-6 pt-2">
										<button
											onClick={handleWishlistToggle}
											className={`flex items-center gap-2 text-sm transition-all duration-300 hover:scale-105 ${
												isWishlisted 
													? 'text-red-600 dark:text-red-400 animate-pulse' 
													: 'text-gray-700 dark:text-gray-300 hover:text-red-600'
											}`}
										>
											<Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'fill-current text-red-600 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] animate-pulse' : ''}`} />
											{isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
										</button>
										<button
											onClick={() => {
								if (isInCompare(product.id)) {
									removeFromCompare(product.id)
								} else {
									addToCompare(product)
								}
							}}
								className={`flex items-center gap-2 text-sm ${isInCompare(product.id) ? 'text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300 hover:text-blue-600'}`}
							>
								<RotateCcw className="w-4 h-4" />
								Compare
							</button>
										<button
											onClick={() => {
												const shareData = { title: product.name, text: product.name, url: typeof window !== 'undefined' ? window.location.href : '' }
												if (navigator.share) {
													navigator.share(shareData).catch(()=>{})
												} else {
													navigator.clipboard?.writeText(shareData.url)
												}
											}}
											className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 hover:text-primary-600"
										>
											<Share2 className="w-4 h-4" />
											Share
										</button>
									</div>
								</div>
							</div>
						</div>

						{/* Tabs Section */}
						<div className="border-t border-gray-200 dark:border-gray-600">
							{/* Tab Navigation */}
							<div className="flex border-b border-gray-200 dark:border-gray-600">
								<button
									onClick={() => setActiveTab('description')}
									className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
										activeTab === 'description'
											? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
									}`}
								>
									Description
								</button>
								<button
									onClick={() => setActiveTab('reviews')}
									className={`px-6 py-4 font-medium text-sm transition-colors duration-200 ${
										activeTab === 'reviews'
											? 'text-primary-600 dark:text-primary-400 border-b-2 border-primary-600 dark:border-primary-400'
											: 'text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
									}`}
								>
									Reviews ({reviews.length})
								</button>
							</div>

							{/* Tab Content */}
							<div className="p-8">
								{activeTab === 'description' && (
									<div className="space-y-4">
										<h3 className="text-lg font-semibold text-gray-900 dark:text-white">Product Description</h3>
										<p className="text-gray-700 dark:text-gray-300 leading-relaxed">
											{product.description}
										</p>
										
										{/* Additional Product Details */}
										<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
											<div>
												<h4 className="font-semibold text-gray-900 dark:text-white mb-2">Product Details</h4>
												<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
													<li><strong>Brand:</strong> {product.brand}</li>
													<li><strong>Category:</strong> {product.category}</li>
													<li><strong>SKU:</strong> {product.id}</li>
													<li><strong>Availability:</strong> {product.inStock ? 'In Stock' : 'Out of Stock'}</li>
												</ul>
											</div>
											<div>
												<h4 className="font-semibold text-gray-900 dark:text-white mb-2">Key Benefits</h4>
												<ul className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
													<li>• 100% Natural & Ayurvedic</li>
													<li>• No Side Effects</li>
													<li>• Easy to Use</li>
													<li>• Fast Results</li>
												</ul>
											</div>
										</div>
									</div>
								)}

								{activeTab === 'reviews' && (
									<div className="space-y-8">
										{/* Summary */}
										<div className="flex flex-col md:flex-row gap-8">
											<div className="md:w-1/3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-4">
												<h3 className="font-semibold text-gray-900 dark:text-white mb-2">Based on {reviews.length} review{reviews.length !== 1 ? 's' : ''}</h3>
												<div className="text-4xl font-bold text-gray-900 dark:text-white">{averageRating.toFixed(1)}</div>
												<div className="text-sm text-gray-500">overall</div>
											</div>
											<div className="md:w-2/3">
												<form onSubmit={handleSubmitReview} className="space-y-4">
													<div>
														<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Rating</label>
														<StarInput value={formRating} onChange={setFormRating} />
													</div>
													<div>
														<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Review</label>
														<textarea value={formComment} onChange={(e) => setFormComment(e.target.value)} rows={5} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" placeholder="Write your review..." />
													</div>
													<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
															<input value={formName} onChange={(e) => setFormName(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
														</div>
														<div>
															<label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
															<input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500" required />
														</div>
													</div>
													<label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300"><input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} /> Save my name, email, and website in this browser for the next time I comment.</label>
													<div>
														<button type="submit" className="px-6 py-2 rounded-lg bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-900 font-semibold hover:opacity-90 transition">Add Review</button>
													</div>
												</form>
											</div>
										</div>

										{/* Reviews List */}
										<div className="space-y-4">
											{reviews.map((review) => (
												<div key={review.id} className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
													<div className="flex items-center justify-between mb-2">
														<div className="flex items-center gap-2">
															<span className="font-medium text-gray-900 dark:text-white">{review.name}</span>
															<StarRating rating={review.rating} />
														</div>
														<span className="text-sm text-gray-500 dark:text-gray-400">{review.date}</span>
													</div>
													<p className="text-gray-700 dark:text-gray-300">{review.comment}</p>
												</div>
											))}
										</div>
									</div>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	)
}
