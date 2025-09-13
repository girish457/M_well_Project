import { Heart, Brain, Baby, Eye, Bone, Stethoscope, Shield, Clock, CheckCircle } from 'lucide-react'

export default function Services() {
  const services = [
    {
      icon: Heart,
      title: 'Cardiology',
      description: 'Comprehensive heart care with advanced diagnostic tools and treatment options.',
      features: [
        'Echocardiography and Stress Testing',
        'Cardiac Catheterization',
        'Heart Surgery and Interventions',
        'Cardiac Rehabilitation',
        'Preventive Cardiology',
        'Arrhythmia Management'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Brain,
      title: 'Neurology',
      description: 'Expert neurological care for brain and nervous system conditions.',
      features: [
        'EEG and EMG Testing',
        'MRI and CT Scans',
        'Stroke Treatment and Prevention',
        'Epilepsy Management',
        'Memory Disorder Care',
        'Headache and Migraine Treatment'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Baby,
      title: 'Pediatrics',
      description: 'Specialized care for children from infancy through adolescence.',
      features: [
        'Well-child Visits and Checkups',
        'Vaccination Programs',
        'Developmental Screening',
        'Emergency Pediatric Care',
        'Chronic Disease Management',
        'Behavioral Health Services'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Eye,
      title: 'Ophthalmology',
      description: 'Complete eye care services including surgery and vision correction.',
      features: [
        'Comprehensive Eye Exams',
        'Cataract Surgery',
        'LASIK and Refractive Surgery',
        'Glaucoma Treatment',
        'Retinal Disorders',
        'Pediatric Ophthalmology'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Bone,
      title: 'Orthopedics',
      description: 'Musculoskeletal care with advanced surgical and non-surgical treatments.',
      features: [
        'Joint Replacement Surgery',
        'Sports Medicine',
        'Physical Therapy',
        'Fracture Care',
        'Spine Surgery',
        'Arthroscopic Procedures'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Primary healthcare services for all ages and conditions.',
      features: [
        'Annual Physical Examinations',
        'Chronic Disease Management',
        'Preventive Care Services',
        'Health Screenings',
        'Minor Procedures',
        'Health Education and Counseling'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Shield,
      title: 'Emergency Care',
      description: '24/7 emergency medical services with immediate response.',
      features: [
        'Trauma and Critical Care',
        'Emergency Surgery',
        'Ambulance Services',
        'Emergency Diagnostics',
        'Intensive Care Unit',
        'Emergency Medicine Residency'
      ],
      image: '/api/placeholder/400/300'
    },
    {
      icon: Clock,
      title: 'Telemedicine',
      description: 'Virtual consultations and remote healthcare services.',
      features: [
        'Video Consultations',
        'Remote Patient Monitoring',
        'Prescription Refills',
        'Health Coaching',
        'Mental Health Services',
        'Follow-up Care'
      ],
      image: '/api/placeholder/400/300'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Our Medical Services
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Comprehensive healthcare services across multiple specialties, 
              ensuring you receive the best possible care for all your health needs.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {services.map((service, index) => (
              <div key={index} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="p-8">
                  <div className="flex items-start space-x-4 mb-6">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center">
                        <service.icon className="h-8 w-8 text-primary-600" />
                      </div>
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">{service.title}</h3>
                      <p className="text-gray-600 dark:text-gray-400 text-lg">{service.description}</p>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <h4 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3">Services Include:</h4>
                    {service.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="h-5 w-5 text-accent-600 flex-shrink-0" />
                        <span className="text-gray-700 dark:text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-8">
                    <button className="btn-primary w-full">
                      Learn More
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary-600 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Need Help Choosing a Service?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Our team is here to help you find the right care for your needs. 
            Contact us for a consultation or book an appointment today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Contact Us
            </button>
            <button className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-lg text-lg border border-primary-500 transition-colors duration-200">
              Book Appointment
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

