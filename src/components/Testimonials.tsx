import { Star, Quote } from 'lucide-react'

export default function Testimonials() {
  const testimonials = [
    {
      name: 'Ramesh pramal',
      role: 'Customer',
      image: '/api/placeholder/60/60',
      rating: 5,
      content: 'My experience with M-Well has been outstanding. Not only did I receive excellent healthcare guidance, but their Ayurvedic stamina boost drink truly made a difference in my energy and overall wellness. The quality of their products is top-notch, and the doctors took time to explain everything in detail. On top of that, the customer service and support team were always polite, quick to respond, and genuinely cared about my needs. M-Well makes you feel valued and supported at every step of your health journey'
    },
    {
      name: 'Kashish Kumawat',
      role: 'Customer',
      image: '/api/placeholder/60/60',
      rating: 4,
      content: 'The Ayurvedic stamina drink from M-Well is truly life-changing. After using it regularly, I feel a new level of energy and freshness that I never had before. The doctors explained everything clearly, and the customer support team always responds quickly. With M-Well, I feel safe and positive about my health journey'
    },
    {
      name: 'Nargis Ansari',
      role: 'Customer',
      image: '/api/placeholder/60/60',
      rating: 5,
      content: 'Both the healthcare services and products from M-Well are outstanding. I tried their stamina booster, and within a few weeks, I noticed a real difference. Since it’s completely natural and ayurvedic, I had zero side effects. Their customer care team patiently answered all my questions, which made the entire experience trustworthy and satisfying.'
    },
    {
      name: 'Girish Goswami',
      role: 'Developer',
      image: '/api/placeholder/60/60',
      rating: 4.5,
      content: 'At first, I had doubts about whether an Ayurvedic drink would actually work, but after using M-Well’s stamina drink, my strength and immunity have improved a lot. The doctors took the time to explain a complete treatment plan, and I honestly felt like part of a family where my health was the top priority. Truly impressed!'
    },
    {
      name: 'Robert Brown',
      role: 'Customer',
      image: '/api/placeholder/60/60',
      rating: 5,
      content: 'M-Well gave me a whole new experience of healthcare. Their stamina booster drink is not only healthy but also tastes good. After using it regularly, my daily energy and stamina improved noticeably. The delivery was always on time, and the customer support team was polite and professional. It feels like a brand that genuinely cares'
    },
    {
      name: 'Sarah Johnson',
      role: 'Customer',
      image: '/api/placeholder/60/60',
      rating: 4,
      content: 'Being a regular fitness enthusiast, I was amazed by M-Well’s ayurvedic stamina drink. It enhanced my workout performance, helped me recover faster, and kept my energy levels stable throughout the day. The doctors and support staff were approachable and friendly, making the whole journey smooth. I’d definitely recommend this to everyone'
    }
  ]

  return (
    <section className="bg-gray-50 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            What Our Customer Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our customers have to say 
            about their experience with M-Well Healthcare.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="card hover:shadow-xl transition-shadow duration-300">
              <div className="flex items-center mb-4">
                <div className="flex">
                  {[0,1,2,3,4].map((i) => {
                    const isFull = i < Math.floor(testimonial.rating)
                    const isHalf = !isFull && testimonial.rating - Math.floor(testimonial.rating) >= 0.5 && i === Math.floor(testimonial.rating)
                    return (
                      <span key={i} className="relative inline-block h-5 w-5 mr-0.5">
                        <Star className="h-5 w-5 text-yellow-400" />
                        <span className="absolute inset-0 overflow-hidden" style={{ width: isFull ? '100%' : isHalf ? '50%' : '0%' }}>
                          <Star className="h-5 w-5 text-yellow-400 fill-current" />
                        </span>
                      </span>
                    )
                  })}
                </div>
              </div>
              
              <div className="relative mb-6">
                <Quote className="h-8 w-8 text-primary-200 absolute -top-2 -left-2" />
                <p className="text-gray-700 italic pl-6">
                  &ldquo;{testimonial.content}&rdquo;
                </p>
              </div>
              
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-primary-600 font-semibold text-lg">
                    {testimonial.name.charAt(0)}
                  </span>
                </div>
                <div>
                  <div className="font-semibold text-gray-900">{testimonial.name}</div>
                  <div className="text-sm text-gray-600">{testimonial.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 bg-white rounded-full px-6 py-3 shadow-lg">
            <div className="flex">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
              ))}
            </div>
            <span className="text-gray-700 font-medium">4.1/5 Average Rating</span>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600">Based on 1,200+ reviews</span>
          </div>
        </div>
      </div>
    </section>
  )
}

