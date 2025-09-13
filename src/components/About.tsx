import Image from 'next/image'
import { Star } from 'lucide-react'

export default function About() {
  const products = [
    { title: 'Keytar McSweeney\'s Williamsburn,re.', image: '/MultiVitamin.jpg', price: '₹389.35', rating: 4.5, reviews: 2857, tag: '35% OFF', points: '1500' },
    { title: 'INLIFE Immunity Plus Capsules 60\'s', image: '/Womencare.jpg', price: '₹389.35', rating: 4.5, reviews: 2857, tag: '35% OFF', points: '1500' },
    { title: 'Kee Pharma Immune Smart Capsule 60\'s', image: '/Superherbs.jpg', price: '₹389.35', rating: 4.5, reviews: 2857, tag: '35% OFF', points: '1500' },
  ]

  return (
    <section className="bg-white section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Popular Healthcare Products</h2>
          <div className="hidden sm:flex items-center gap-2">
            <button className="w-8 h-8 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition">←</button>
            <button className="w-8 h-8 rounded-lg bg-primary-100 text-primary-700 hover:bg-primary-200 transition">→</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((p, i) => (
            <div key={i} className="rounded-2xl border border-gray-100 shadow-sm hover:shadow-md bg-white overflow-hidden">
              <div className="flex items-center justify-between px-4 pt-4 text-xs">
                <span className="px-2 py-1 rounded-md bg-green-50 text-green-600 font-semibold">{p.tag}</span>
                <span className="text-amber-500">{p.points}</span>
              </div>
              <div className="relative mx-6 my-4 rounded-xl bg-primary-50/60" style={{ height: 140 }}>
                <Image src={p.image} alt={p.title} fill className="object-contain" />
              </div>
              <div className="px-4 pb-4">
                <h3 className="text-gray-800 font-semibold line-clamp-2 min-h-[3.2rem]">{p.title}</h3>
                <div className="mt-3 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-amber-500">
                    <Star className="h-4 w-4 fill-amber-400 text-amber-400" />
                    <span className="font-semibold">{p.rating} Star</span>
                    <span className="text-gray-400">{p.reviews} Rating</span>
                  </div>
                  <span className="px-2 py-1 rounded-md bg-primary-50 text-primary-700 font-semibold">{p.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

