'use client'

import React, { Suspense } from 'react'
import { useCompare } from '@/contexts/CompareContext'
import Image from 'next/image'
import Link from 'next/link'
import { Plus, Minus, ArrowLeft, Heart } from 'lucide-react'
import PriceFilter from '@/components/PriceFilter'
import ProductViewBar, { ViewMode, SortOption } from '@/components/ProductViewBar'
import ProductTabs from '@/components/ProductTabs'
import { useCart, Product as CartProduct } from '@/contexts/CartContext'
import { useSearchParams } from 'next/navigation'
import { catalog as sharedCatalog, searchProducts } from '@/data/products'
import { getAuthHeaders } from '@/lib/auth-utils'

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
}

// Use shared catalog from data/products.ts
const catalog: Product[] = sharedCatalog

const categories = ['Daily Essentials', 'Personal Care', 'Anti Anxiety & Addiction']
const brands = ['M-Well']

function StarRow({ rating }: { rating: number }) {
	const full = Math.round(rating)
	return (
		<div className="flex gap-0.5 text-amber-500">
			{Array.from({ length: 5 }).map((_, i) => (
				<span key={i}>{i < full ? '★' : '☆'}</span>
			))}
		</div>
	)
}

function ProductCard({ p, viewMode }: { p: Product; viewMode: ViewMode }) {
	const [isWishlisted, setIsWishlisted] = React.useState(false)
	const [isComparing, setIsComparing] = React.useState(false)
	const [isHovered, setIsHovered] = React.useState(false)
	const [animateHeart, setAnimateHeart] = React.useState(false)
	const { addToCart, removeFromCart, isInCart, updateQuantity, cartItems } = useCart()
	const { addToCompare, removeFromCompare, isInCompare } = useCompare()
	
	// Check if product is in wishlist from localStorage (no database)
	React.useEffect(() => {
		const wishlist = JSON.parse(localStorage.getItem('mwell_wishlist') || '[]')
		const isInWishlist = wishlist.includes(p.id)
		setIsWishlisted(isInWishlist)
	}, [p.id])
	
	// Get current quantity in cart for this product
	const cartItem = cartItems.find(item => item.product.id === p.id)
	const currentQuantity = cartItem ? cartItem.quantity : 0

	const handleAddToCart = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent navigation when clicking cart button
		if (isInCart(p.id)) {
			// Remove from cart
			removeFromCart(p.id)
			console.log('Removed from cart:', p.name)
		} else {
			// Add to cart
			addToCart(p)
			console.log('Added to cart:', p.name)
		}
		// Dispatch custom event to notify header
		window.dispatchEvent(new CustomEvent('cartUpdated'))
	}

	const handleQuantityChange = (newQuantity: number, e?: React.MouseEvent) => {
		if (e) e.stopPropagation() // Prevent navigation when clicking quantity buttons
		if (newQuantity <= 0) {
			removeFromCart(p.id)
		} else if (newQuantity > 10) {
			updateQuantity(p.id, 10) // Cap at 10
		} else {
			updateQuantity(p.id, newQuantity)
		}
		// Dispatch custom event to notify header
		window.dispatchEvent(new CustomEvent('cartUpdated'))
	}


	const handleWishlist = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent navigation when clicking wishlist button
		
		setAnimateHeart(true)
		setTimeout(() => setAnimateHeart(false), 300)

		const wishlist = JSON.parse(localStorage.getItem('mwell_wishlist') || '[]')
		
		if (isWishlisted) {
			// Remove from wishlist
			const updatedWishlist = wishlist.filter((id: string) => id !== p.id)
			localStorage.setItem('mwell_wishlist', JSON.stringify(updatedWishlist))
			setIsWishlisted(false)
			console.log('✅ Removed from wishlist:', p.name)
		} else {
			// Add to wishlist
			const updatedWishlist = [...wishlist, p.id]
			localStorage.setItem('mwell_wishlist', JSON.stringify(updatedWishlist))
			setIsWishlisted(true)
			console.log('✅ Added to wishlist:', p.name)
		}
	}

	const handleCompare = (e: React.MouseEvent) => {
		e.stopPropagation() // Prevent navigation when clicking compare button
		if (isInCompare(p.id)) {
			removeFromCompare(p.id)
			setIsComparing(false)
		} else {
			addToCompare(p)
			setIsComparing(true)
		}
	}

	const formatPrice = (price: number) => {
		return new Intl.NumberFormat('en-IN', {
			minimumFractionDigits: 2,
			maximumFractionDigits: 2
		}).format(price)
	}

	if (viewMode === 'list' || viewMode === 'list-bullet') {
	return (
			<div 
				className="bg-white dark:bg-gray-800 rounded-lg shadow-md flex gap-6 relative transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden"
				onMouseEnter={() => setIsHovered(true)}
				onMouseLeave={() => setIsHovered(false)}
				onClick={() => window.location.href = `/product/${p.id}`}
			>
				{/* Discount Badge */}
				{p.discount && (
					<div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-lg">
						-{p.discount}%
					</div>
				)}
				
			{/* Product Image - Larger in list view */}
			<div className="relative h-64 w-64 flex-shrink-0 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden">
				<Image
					src={p.image}
					alt={p.name}
					fill
					className="object-contain p-3"
					sizes="192px"
					priority
				/>
			</div>
			{/* Product Content */}
			<div className="flex-1 py-4 pr-4">
				{/* Product Name */}
				<h3 className="font-semibold text-gray-900 dark:text-white text-2xl line-clamp-2 mb-4">{p.name}</h3>
				
				{/* Rating */}
				<div className="mb-4">
					<StarRow rating={p.rating} />
				</div>
				
				{/* Description */}
				<p className="text-lg text-gray-600 dark:text-gray-300 line-clamp-3 mb-5">{p.description}</p>
					
				{/* Pricing */}
				<div className="mb-5">
					{p.originalPrice ? (
						<div className="flex items-center gap-2">
							<span className="text-lg text-gray-400 line-through">₹{formatPrice(p.originalPrice)}</span>
							<span className="font-bold text-red-600 dark:text-red-400 text-2xl">₹{formatPrice(p.price)}</span>
						</div>
					) : (
						<span className="font-bold text-primary-600 dark:text-primary-400 text-2xl">₹{formatPrice(p.price)}</span>
					)}
				</div>
				
				{/* Cart Controls */}
				<div className="flex items-center justify-between mb-4">
					{isInCart(p.id) ? (
						// Quantity controls when in cart
						<div className="flex items-center space-x-2">
							<button
								onClick={(e) => handleQuantityChange(currentQuantity - 1, e)}
								className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
								title="Decrease quantity"
							>
								<Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
							</button>
							<span className="w-8 text-center font-medium text-gray-900 dark:text-white text-sm">
								{currentQuantity}
							</span>
							<button
								onClick={(e) => handleQuantityChange(currentQuantity + 1, e)}
								disabled={currentQuantity >= 10}
								className={`p-2 rounded-full transition-colors duration-200 ${
									currentQuantity >= 10
										? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
										: 'hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
								title={currentQuantity >= 10 ? 'Maximum quantity reached (10)' : 'Increase quantity'}
							>
								<Plus className={`w-4 h-4 ${
									currentQuantity >= 10 
										? 'text-gray-400 dark:text-gray-500' 
										: 'text-gray-600 dark:text-gray-400'
								}`} />
							</button>
						</div>
					) : (
						// Add to cart button when not in cart
						<button
							onClick={handleAddToCart}
							className={`flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 ${
								isHovered ? 'scale-105' : ''
							}`}
							title="Add to Cart"
						>
							<Image 
								src="/cartlogo.png" 
								alt="Add to Cart" 
								width={24} 
								height={24} 
								className="w-6 h-6 object-contain"
							/>
							<span className="text-sm font-medium">Add to Cart</span>
						</button>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center gap-6 pt-3 border-t border-gray-200 dark:border-gray-600">
					<button
						onClick={handleWishlist}
						className={`flex items-center gap-1 transition-all duration-300 ${
							isWishlisted 
								? 'text-red-500' 
								: 'text-gray-400 hover:text-red-500'
						}`}
						title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
					>
						<Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] fill-current animate-pulse' : ''} ${animateHeart ? 'scale-110' : ''}`} />
						<span className="text-sm">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
					</button>
					
					<button
						onClick={handleCompare}
						className={`flex items-center gap-1 transition-colors duration-200 ${
							isInCompare(p.id) ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
						}`}
						title="Compare"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span className="text-sm">Compare</span>
					</button>
				</div>
			</div>
			</div>
		)
	}

	// Grid view (small or large)
	const isLargeGrid = viewMode === 'grid-large'
	return (
		<div 
			className={`bg-white dark:bg-gray-800 rounded-lg shadow-md relative transition-all duration-300 hover:shadow-xl cursor-pointer overflow-hidden ${isLargeGrid ? 'text-center' : ''}`}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			onClick={() => window.location.href = `/product/${p.id}`}
		>
			{/* Discount Badge */}
			{p.discount && (
				<div className="absolute top-3 left-3 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10 shadow-lg">
					-{p.discount}%
				</div>
			)}

			{/* Product Image - Takes most of the card space */}
			<div className={`relative ${isLargeGrid ? 'h-96 w-full' : 'h-80 w-full'} mb-6 bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden`}>
				<Image
					src={p.image}
					alt={p.name}
					fill
					className="object-contain p-2"
					sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
					priority
				/>
			</div>
			{/* Product Content */}
			<div className="px-6 pb-6">
				{/* Product Name */}
				<h3 className={`font-semibold text-gray-900 dark:text-white ${isLargeGrid ? 'text-2xl' : 'text-xl'} line-clamp-2 mb-4`}>
					{p.name}
				</h3>
				
				{/* Rating */}
				<div className="mb-4">
					<StarRow rating={p.rating} />
				</div>
				
				{/* Description for large grid */}
				{isLargeGrid && (
					<p className="text-base text-gray-600 dark:text-gray-300 line-clamp-2 mb-4">{p.description}</p>
				)}
				
				{/* Pricing */}
				<div className={`mb-5 ${isLargeGrid ? 'text-2xl' : 'text-xl'}`}>
					{p.originalPrice ? (
						<div className="flex items-center gap-2">
							<span className="text-gray-400 line-through text-lg">₹{formatPrice(p.originalPrice)}</span>
							<span className="font-bold text-red-600 dark:text-red-400">₹{formatPrice(p.price)}</span>
						</div>
					) : (
						<span className="font-bold text-primary-600 dark:text-primary-400">₹{formatPrice(p.price)}</span>
					)}
				</div>
				
				{/* Cart Controls */}
				<div className="flex items-center justify-between mb-4">
					{isInCart(p.id) ? (
						// Quantity controls when in cart
						<div className="flex items-center space-x-2">
							<button
								onClick={(e) => handleQuantityChange(currentQuantity - 1, e)}
								className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
								title="Decrease quantity"
							>
								<Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
							</button>
							<span className="w-8 text-center font-medium text-gray-900 dark:text-white text-sm">
								{currentQuantity}
							</span>
							<button
								onClick={(e) => handleQuantityChange(currentQuantity + 1, e)}
								disabled={currentQuantity >= 10}
								className={`p-2 rounded-full transition-colors duration-200 ${
									currentQuantity >= 10
										? 'bg-gray-100 dark:bg-gray-700 cursor-not-allowed opacity-50'
										: 'hover:bg-gray-100 dark:hover:bg-gray-700'
								}`}
								title={currentQuantity >= 10 ? 'Maximum quantity reached (10)' : 'Increase quantity'}
							>
								<Plus className={`w-4 h-4 ${
									currentQuantity >= 10 
										? 'text-gray-400 dark:text-gray-500' 
										: 'text-gray-600 dark:text-gray-400'
								}`} />
							</button>
						</div>
					) : (
						// Add to cart button when not in cart
						<button
							onClick={handleAddToCart}
							className={`flex items-center gap-2 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg transition-all duration-300 ${
								isHovered ? 'scale-105' : ''
							}`}
							title="Add to Cart"
						>
							<Image 
								src="/cartlogo.png" 
								alt="Add to Cart" 
								width={24} 
								height={24} 
								className="w-6 h-6 object-contain"
							/>
							<span className="text-sm font-medium">Add to Cart</span>
						</button>
					)}
				</div>

				{/* Action Buttons */}
				<div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-600">
					<button
						onClick={handleWishlist}
						className={`flex items-center gap-1 transition-all duration-300 ${
							isWishlisted 
								? 'text-red-500' 
								: 'text-gray-400 hover:text-red-500'
						}`}
						title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
					>
						<Heart className={`w-4 h-4 transition-all duration-300 ${isWishlisted ? 'text-red-500 drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] fill-current animate-pulse' : ''} ${animateHeart ? 'scale-110' : ''}`} />
						<span className="text-xs">{isWishlisted ? 'Wishlisted' : 'Wishlist'}</span>
					</button>
					
					<button
						onClick={handleCompare}
						className={`flex items-center gap-1 transition-colors duration-200 ${
							isComparing ? 'text-blue-500' : 'text-gray-400 hover:text-blue-500'
						}`}
						title="Compare"
					>
						<svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
						</svg>
						<span className="text-xs">Compare</span>
					</button>
				</div>
			</div>
		</div>
	)
}

function LatestList({ items }: { items: Product[] }) {
	return (
		<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
			<h3 className="font-semibold text-gray-900 dark:text-white mb-3">Latest Products</h3>
			<div className="space-y-4">
				{items.map((p) => (
					<div key={p.id} className="flex gap-4 items-start">
						<div className="relative h-20 w-20 flex-shrink-0 rounded-lg overflow-hidden bg-gray-50 dark:bg-gray-700">
							<Image
								src={p.image}
								alt={p.name}
								fill
								className="object-contain p-1"
								sizes="80px"
							/>
						</div>
						<div className="min-w-0">
							<p className="text-sm font-medium text-gray-900 dark:text-gray-100 line-clamp-2">{p.name}</p>
							<StarRow rating={p.rating} />
							<p className="text-sm font-semibold text-primary-600 dark:text-primary-400 mt-1">₹{p.price}</p>
						</div>
					</div>
				))}
			</div>
		</div>
	)
}

function ShopPageContent() {
    const searchParams = useSearchParams()
	const [minPrice, setMinPrice] = React.useState(0)
	const [maxPrice, setMaxPrice] = React.useState(2000)
	const [category, setCategory] = React.useState<string>('all')
	const [brand, setBrand] = React.useState<string>('all')
	const [viewMode, setViewMode] = React.useState<ViewMode>('grid-small')
	const [sortOption, setSortOption] = React.useState<SortOption>('default')
	const [appliedFilters, setAppliedFilters] = React.useState({
		minPrice: 0,
		maxPrice: 2000,
		category: 'all',
		brand: 'all'
	})
	const { getTotalItems } = useCart()

    // Initialize category from URL if provided
    React.useEffect(() => {
        const urlCategory = searchParams.get('category')
        if (urlCategory && categories.includes(urlCategory)) {
            setCategory(urlCategory)
        }
    }, [searchParams])

    // Handle search query from URL
    const searchQuery = searchParams.get('q')
    const searchResults = React.useMemo(() => {
        if (searchQuery) {
            const results = searchProducts(searchQuery)
            // If no results for the given query, fall back to showing all products
            return results.length > 0 ? results : catalog
        }
        return catalog
    }, [searchQuery])

    // Keep appliedFilters in sync when category radio changes
    React.useEffect(() => {
        setAppliedFilters(prev => ({ ...prev, category }))
    }, [category])

	const filtered = React.useMemo(() => {
		let filteredProducts = searchResults.filter((p) => (
			(appliedFilters.category === 'all' || p.category === appliedFilters.category) &&
			(appliedFilters.brand === 'all' || p.brand === appliedFilters.brand) &&
			p.price >= appliedFilters.minPrice && p.price <= appliedFilters.maxPrice
		))

		// Apply sorting
		switch (sortOption) {
			case 'popularity':
				filteredProducts.sort((a, b) => b.reviewCount - a.reviewCount)
				break
			case 'rating':
				filteredProducts.sort((a, b) => b.rating - a.rating)
				break
			case 'latest':
				// Assuming newer products have higher IDs or we could add a date field
				filteredProducts.sort((a, b) => b.id.localeCompare(a.id))
				break
			case 'price-low':
				filteredProducts.sort((a, b) => a.price - b.price)
				break
			case 'price-high':
				filteredProducts.sort((a, b) => b.price - a.price)
				break
			default:
				// Keep original order for 'default'
				break
		}

		// Duplicate specific products with small discount badges to make 9 items in 'all'
		if (appliedFilters.category === 'all') {
			const mv = catalog.find(p => p.id === 'mv-001')
			const mc = catalog.find(p => p.id === 'mc-002')
			if (mv) filteredProducts.push({ ...mv, price: 1499, originalPrice: 1599, discount: 6 })
			if (mc) filteredProducts.push({ ...mc, price: 1899, originalPrice: 1999, discount: 5 })
		}

		return filteredProducts
	}, [searchResults, appliedFilters, sortOption])

	const handlePriceChange = (min: number, max: number) => {
		setMinPrice(min)
		setMaxPrice(max)
	}

	const handleApplyFilters = () => {
		setAppliedFilters({
			minPrice,
			maxPrice,
			category,
			brand
		})
	}

	const handleResetFilters = () => {
		setMinPrice(0)
		setMaxPrice(2000)
		setCategory('all')
		setBrand('all')
		setAppliedFilters({
			minPrice: 0,
			maxPrice: 2000,
			category: 'all',
			brand: 'all'
		})
	}

	return (
		<main className="min-h-screen bg-gray-50 dark:bg-gray-900">
			<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
				{/* Back to Home Button */}
				<div className="mb-6">
					<Link
						href="/"
						className="inline-flex items-center text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 font-medium transition-colors duration-200"
					>
						<ArrowLeft className="w-4 h-4 mr-2" />
						Back to Home
					</Link>
				</div>

				<h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-6">All Products</h1>

				{/* Product View Bar */}
				<ProductViewBar
					viewMode={viewMode}
					onViewModeChange={setViewMode}
					sortOption={sortOption}
					onSortChange={setSortOption}
					productCount={filtered.length}
				/>

				{/* View Cart Button - appears when items are in cart */}
				{getTotalItems() > 0 && (
					<div className="mb-6 flex justify-center">
						<Link
							href="/cart"
							className="inline-flex items-center px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 hover:scale-105"
						>
							<svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
							</svg>
							View Cart ({getTotalItems()} {getTotalItems() === 1 ? 'item' : 'items'})
						</Link>
					</div>
				)}

				<div className="grid grid-cols-12 gap-6">
					<aside className="hidden lg:block lg:col-span-3">
						<div className="space-y-6">
							<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
								<h3 className="font-semibold text-gray-900 dark:text-white mb-3">Product Categories</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"><input type="radio" name="cat" checked={category==='all'} onChange={()=>setCategory('all')} />All</label>
									{categories.map((c)=> (
										<label key={c} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"><input type="radio" name="cat" checked={category===c} onChange={()=>setCategory(c)} />{c}</label>
									))}
								</div>
							</div>

							<PriceFilter
								minPrice={minPrice}
								maxPrice={maxPrice}
								onPriceChange={handlePriceChange}
								onApply={handleApplyFilters}
								onReset={handleResetFilters}
								minRange={0}
								maxRange={2000}
							/>

							<div className="bg-white dark:bg-gray-800 rounded-lg shadow p-5">
								<h3 className="font-semibold text-gray-900 dark:text-white mb-3">Brand</h3>
								<div className="space-y-2">
									<label className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"><input type="radio" name="brand" checked={brand==='all'} onChange={()=>setBrand('all')} />All</label>
									{brands.map((b)=> (
										<label key={b} className="flex items-center gap-2 text-sm text-gray-800 dark:text-gray-200"><input type="radio" name="brand" checked={brand===b} onChange={()=>setBrand(b)} />{b}</label>
									))}
								</div>
							</div>
						</div>

						{/* Sticky Latest Products Section */}
						<div className="sticky top-4 mt-6">
							<LatestList items={[...catalog].slice(-4).reverse()} />
						</div>
					</aside>

					<section className="col-span-12 lg:col-span-9">
						<div className={
							viewMode === 'list' || viewMode === 'list-bullet' 
								? 'space-y-6' 
								: viewMode === 'grid-large'
								? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8'
								: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6'
						}>
							{filtered.map((p, index)=> (
								<ProductCard key={`${p.id}-${index}`} p={p} viewMode={viewMode} />
							))}
						</div>
					</section>
				</div>

				{/* Product Tabs Section */}
				<ProductTabs products={catalog} />
			</div>
		</main>
	)
}

export default function ShopPage() {
	return (
		<Suspense fallback={
			<main className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
					<p className="text-gray-600 dark:text-gray-400">Loading products...</p>
				</div>
			</main>
		}>
			<ShopPageContent />
		</Suspense>
	)
}


