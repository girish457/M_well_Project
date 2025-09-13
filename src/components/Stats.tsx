import { Users, Award, Clock, Heart } from 'lucide-react'

export default function Stats() {
  const stats = [
    {
      icon: Users,
      value: '10,000+',
      label: 'Customer served',
      description: 'Trusted by thousands of customers'
    },
    {
      icon: Award,
      value: '5+',
      label: 'Years Experience',
      description: 'Proven track record of excellence'
    },
    {
      icon: Clock,
      value: '24/7',
      label: 'Emergency Care',
      description: 'Always here when you need us'
    },
    {
      icon: Heart,
      value: '99%',
      label: 'Success Rate',
      description: 'High-quality care outcomes'
    }
  ]

  return (
    <section className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4 group-hover:bg-primary-600 transition-colors duration-300">
                <stat.icon className="h-8 w-8 text-primary-600 group-hover:text-white transition-colors duration-300" />
              </div>
              <div className="text-3xl font-bold text-gray-900 mb-2">{stat.value}</div>
              <div className="text-lg font-semibold text-gray-700 mb-1">{stat.label}</div>
              <div className="text-sm text-gray-500">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

