export type Product = {
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

// Centralized product catalog
export const catalog: Product[] = [
	{ 
		id: 'mv-001', 
		name: 'M-Well Multi Vitamin Softgel – Daily Immunity, Energy & Wellness', 
		price: 959, 
		originalPrice: 1599, 
		discount: 40, 
		image: '/MultiVitamin.jpg', 
		description: 'M-Well Multivitamin Softgel is a complete daily nutrition formula that provides your body with essential vitamins, minerals, and antioxidants — boosting immunity, increasing energy, and supporting overall health. It comes in an easy-to-swallow softgel format and is suitable for both men and women. Whether you have a busy schedule or feel low on energy — now feel healthy, fit, and active every day!', 
		brand: 'M-Well', 
		category: 'Daily Essentials', 
		rating: 4.6, 
		reviewCount: 128, 
		inStock: true, 
		isNew: true,
		gallery: ['/MultiVitamin.jpg', '/vitamin1.jpg', '/vitamin2.jpg', '/vitamin3.jpg', '/vitamin4.jpg', '/vitamin5.png']
	},
	{ 
		id: 'mc-002', 
		name: 'M-Well Men Care Premium Concentrated Drink – Shakti, Stamina & Vitality Booster for Men', 
		price: 1199, 
		originalPrice: 1999, 
		discount: 40, 
		image: '/Mencare.jpg', 
		description: 'M-Well Men Care Premium Concentrated Drink is a powerful Ayurvedic superblend designed specifically for men — combining potent herbs to support stamina, strength, and vitality. This drink is specially formulated for men experiencing daily fatigue, stress, or weakness. It contains a blend of Shilajit, Ashwagandha, Safed Musli, Kaunch Beej, Gokhru, and other powerful herbs — which help improve blood circulation, maintain hormonal balance, and ignite a renewed sense of masculine vitality.', 
		brand: 'M-Well', 
		category: 'Personal Care', 
		rating: 4.4, 
		reviewCount: 86, 
		inStock: true, 
		isSale: true,
		gallery: ['/Mencare.jpg', '/Mencare1.jpg', '/mencare02.jpg', '/mencare3.jpg', '/mencare4.png']
	},
	{ 
		id: 'sh-003',
		name: 'M-Well Super Herbs Veg Capsules – Daily Immunity & Energy Booster', 
		price: 1199, 
		originalPrice: 1999, 
		discount: 40, 
		image: '/Superherbs.jpg', 
		description: 'M-Well Super Herbs Veg Capsules is a powerful Ayurvedic formula that naturally boosts your daily health, immunity, stamina, and overall energy levels. These 100% vegetarian capsules are made from some of India\'s most potent herbs — including Ashwagandha, Giloy, Shilajit, Tulsi, and more — that help detoxify the body, strengthen the immune system, and protect you from everyday stress and fatigue. Whether you\'re a student, working professional, or fitness enthusiast, Super Herbs Capsules help keep you active and energized all day.', 
		brand: 'M-Well', 
		category: 'Daily Essentials', 
		rating: 4.7, 
		reviewCount: 203, 
		inStock: true,
		gallery: ['/Superherbs.jpg', '/super1.jpg', '/super2.jpg', '/super3.jpg', '/super4.jpg', '/super5.png']
	},
	{ 
		id: 'ac-004', 
		name: 'M-Well All Clear Tablets – Ayurvedic Constipation & Digestive Detox Formula', 
		price: 1079, 
		originalPrice: 1799,
		image: '/AllClear.jpg', 
		description: 'M-Well All Clear Tablets is a powerful Ayurvedic blend that naturally cleanses your digestive system and provides relief from constipation, bloating, and acidity. It contains 9 legendary herbs such as Senna, Harad, Baheda, Amla, Mulethi, Ginger (Adrak), Castor Seed, and Rock Salt, which help detoxify the body and address everyday digestive issues. Whether you\'re experiencing slow digestion, difficulty going to the toilet in the morning, or bloating and heaviness, All Clear Tablets are the all-clear solution for everything!', 
		brand: 'M-Well', 
		category: 'Daily Essentials', 
		rating: 4.2, 
		reviewCount: 57, 
		inStock: true,
		gallery: ['/AllClear.jpg', '/allclear1.jpg', '/allclear2.jpg', '/allclear3.jpg', '/allclear4.png']
	},
	{ 
		id: 'aa-005', 
		name: 'M-Well Anti Anxiety Drops – Natural Stress & Anxiety Relief Formula', 
		price: 1019, 
		originalPrice: 1699, 
		discount: 40, 
		image: '/Antianxiety.jpg', 
		description: 'M-Well Anti Anxiety Drops is a natural herbal formula designed to provide relief from anxiety, stress, and sleep problems. Made with 100% natural Ayurvedic ingredients, it helps calm the mind, reduce stress levels, and promote better sleep. These drops are safe for all age groups and can be easily mixed into tea, water, or any beverage.', 
		brand: 'M-Well', 
		category: 'Personal Care', 
		rating: 4.1, 
		reviewCount: 41, 
		inStock: true,
		gallery: ['/Antianxiety.jpg', '/antia1.jpg', '/antia2.jpg', '/anita3.png', '/antia4.jpg']
	},
	{ 
		id: 'wc-006', 
		name: 'M-Well Women Care Syrup– Hormonal Balance & PCOD/PCOS Relief', 
		price: 359, 
		originalPrice: 599, 
		discount: 40, 
		image: '/Womencare.jpg', 
		description: 'M-Well Women Care Syrup is specially formulated to support hormonal balance and provide relief from PCOD/PCOS symptoms. Made with natural herbs and ingredients, it helps regulate menstrual cycles, reduce hormonal imbalances, and support overall women\'s health.', 
		brand: 'M-Well', 
		category: 'Personal Care', 
		rating: 4.5, 
		reviewCount: 112, 
		inStock: true,
		gallery: ['/Womencare.jpg', '/womana1.jpg', '/womana2.jpg', '/womana3.jpg', '/womana4.png']
	},
	{ 
		id: 'ad-007', 
		name: 'M-Well Anti Addiction Drops – Quit Smoking, Alcohol & Gutkha Naturally', 
		price: 1139, 
		originalPrice: 1899, 
		discount: 40, 
		image: '/AntiAddiction.jpg', 
		description: 'M-Well Anti-Addiction Drops is a powerful herbal formula that helps break free from addictions like cigarettes, alcohol, gutkha, and tobacco — with no side effects. Made with 100% natural Ayurvedic ingredients, it detoxifies the brain and body, reduces cravings, and boosts willpower. M-Well Drops are safe for all age groups and can be easily mixed into tea, water, or any beverage.', 
		brand: 'M-Well', 
		category: 'Anti Anxiety & Addiction', 
		rating: 4.0, 
		reviewCount: 33, 
		inStock: true,
		gallery: ['/AntiAddiction.jpg', '/alcohol1.jpg', '/alcohol2.jpg', '/alcohol3.jpg', '/alcohol4.jpg', '/alcohol5.png']
	}
]

// Search function to find products by name
export function searchProducts(query: string): Product[] {
	if (!query.trim()) return []
	
	const searchTerm = query.toLowerCase().trim()
	
	return catalog.filter(product => 
		product.name.toLowerCase().includes(searchTerm) ||
		product.description.toLowerCase().includes(searchTerm) ||
		product.category.toLowerCase().includes(searchTerm) ||
		product.brand.toLowerCase().includes(searchTerm)
	)
}

// Find exact product by name (for direct navigation)
export function findProductByName(query: string): Product | null {
	if (!query.trim()) return null
	
	const searchTerm = query.toLowerCase().trim()
	
	// First try exact match
	const exactMatch = catalog.find(product => 
		product.name.toLowerCase() === searchTerm
	)
	if (exactMatch) return exactMatch
	
	// Then try partial match
	const partialMatch = catalog.find(product => 
		product.name.toLowerCase().includes(searchTerm)
	)
	
	return partialMatch || null
}

