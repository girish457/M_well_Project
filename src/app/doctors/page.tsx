import { Mail, Phone, Award, Calendar, Star, MapPin } from 'lucide-react'

export default function Doctors() {
  const doctors = [
    {
      id: 1,
      name: 'Dr. Sarah Johnson',
      specialty: 'Internal Medicine',
      role: 'Chief Medical Officer',
      experience: '20+ years',
      education: 'MD, Harvard Medical School',
      image: '/api/placeholder/300/300',
      rating: 4.1,
      customers: 2500,
      bio: 'Dr. Johnson specializes in internal medicine with a focus on preventive care and chronic disease management. She has been with M-Well for over 15 years.',
      specialties: ['Preventive Medicine', 'Diabetes Management', 'Hypertension', 'Annual Checkups'],
      availability: 'Mon-Fri: 8:00 AM - 5:00 PM',
      location: 'Main Campus, Floor 2'
    },
    {
      id: 2,
      name: 'Dr. Michael Chen',
      specialty: 'Cardiology',
      role: 'Head of Cardiology',
      experience: '18+ years',
      education: 'MD, Johns Hopkins University',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      customers: 1800,
      bio: 'Dr. Chen is a board-certified cardiologist specializing in interventional cardiology and heart disease prevention.',
      specialties: ['Interventional Cardiology', 'Heart Surgery', 'Cardiac Rehabilitation', 'Preventive Cardiology'],
      availability: 'Mon-Thu: 9:00 AM - 6:00 PM',
      location: 'Cardiology Wing, Floor 3'
    },
    {
      id: 3,
      name: 'Dr. Emily Rodriguez',
      specialty: 'Pediatrics',
      role: 'Pediatric Director',
      experience: '5+ years',
      education: 'MD, Stanford University',
      image: '/api/placeholder/300/300',
      rating: 4.1,
      customers: 2200,
      bio: 'Dr. Rodriguez is passionate about children\'s health and specializes in developmental pediatrics and adolescent medicine.',
      specialties: ['Developmental Pediatrics', 'Adolescent Medicine', 'Vaccinations', 'Well-child Care'],
      availability: 'Mon-Fri: 8:30 AM - 4:30 PM',
      location: 'Pediatrics Wing, Floor 1'
    },
    {
      id: 4,
      name: 'Dr. David Thompson',
      specialty: 'Orthopedics',
      role: 'Orthopedic Surgeon',
      experience: '12+ years',
      education: 'MD, Mayo Clinic',
      image: '/api/placeholder/300/300',
      rating: 4.7,
      customers: 1600,
      bio: 'Dr. Thompson specializes in sports medicine and joint replacement surgery, helping patients return to active lifestyles.',
      specialties: ['Sports Medicine', 'Joint Replacement', 'Arthroscopic Surgery', 'Fracture Care'],
      availability: 'Tue-Fri: 8:00 AM - 5:00 PM',
      location: 'Orthopedics Wing, Floor 2'
    },
    {
      id: 5,
      name: 'Dr. Jennifer Lee',
      specialty: 'Dermatology',
      role: 'Dermatologist',
      experience: '10+ years',
      education: 'MD, University of California',
      image: '/api/placeholder/300/300',
      rating: 4.8,
      customers: 1400,
      bio: 'Dr. Lee specializes in medical and cosmetic dermatology, with expertise in skin cancer detection and treatment.',
      specialties: ['Medical Dermatology', 'Cosmetic Dermatology', 'Skin Cancer Treatment', 'Acne Treatment'],
      availability: 'Mon-Wed-Fri: 9:00 AM - 5:00 PM',
      location: 'Dermatology Clinic, Floor 1'
    },
    {
      id: 6,
      name: 'Dr. Amanda Taylor',
      specialty: 'Ophthalmology',
      role: 'Ophthalmologist',
      experience: '14+ years',
      education: 'MD, Yale University',
      image: '/api/placeholder/300/300',
      rating: 4.1,
      customers: 1900,
      bio: 'Dr. Taylor specializes in cataract surgery and refractive procedures, helping patients achieve better vision.',
      specialties: ['Cataract Surgery', 'LASIK', 'Glaucoma Treatment', 'Retinal Disorders'],
      availability: 'Mon-Thu: 8:00 AM - 4:00 PM',
      location: 'Eye Care Center, Floor 2'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Meet Our Doctors
            </h1>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Our team of experienced and compassionate medical professionals 
              is dedicated to providing you with the highest quality healthcare.
            </p>
          </div>
        </div>
      </section>

      {/* Doctors Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {doctors.map((doctor) => (
              <div key={doctor.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                {/* Doctor Image */}
                <div className="relative h-64 bg-gradient-to-br from-primary-100 to-accent-100">
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-32 h-32 bg-primary-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold text-4xl">
                        {doctor.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                  </div>
                  <div className="absolute top-4 right-4 bg-white rounded-full px-3 py-1 flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{doctor.rating}</span>
                  </div>
                </div>

                {/* Doctor Info */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">{doctor.name}</h3>
                    <p className="text-primary-600 font-semibold text-lg">{doctor.specialty}</p>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">{doctor.role}</p>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Award className="h-4 w-4 text-primary-500" />
                      <span>{doctor.experience} experience</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <Star className="h-4 w-4 text-primary-500" />
                      <span>{(doctor as any).customers.toLocaleString()} customers served</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                      <MapPin className="h-4 w-4 text-primary-500" />
                      <span>{doctor.location}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 leading-relaxed">
                    {doctor.bio}
                  </p>

                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-2">Specialties:</h4>
                    <div className="flex flex-wrap gap-2">
                      {doctor.specialties.map((specialty, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-primary-100 text-primary-700 text-xs rounded-full"
                        >
                          {specialty}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-3 mb-6 text-sm">
                    <div className="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                      <Calendar className="h-4 w-4 text-primary-500" />
                      <span>{doctor.availability}</span>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <button className="flex-1 bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200">
                      Book Appointment
                    </button>
                    <button className="px-4 py-2 border border-primary-600 text-primary-600 hover:bg-primary-50 font-semibold rounded-lg transition-colors duration-200">
                      View Profile
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-primary-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Meet Your Doctor?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Schedule an appointment with one of our expert physicians 
            and take the first step towards better health.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-3 px-8 rounded-lg text-lg transition-colors duration-200">
              Book Appointment
            </button>
            <button className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-3 px-8 rounded-lg text-lg border border-primary-500 transition-colors duration-200">
              Contact Us
            </button>
          </div>
        </div>
      </section>
    </div>
  )
}

