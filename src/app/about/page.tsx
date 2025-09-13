"use client"
import { CheckCircle, Users, Award, Shield, Clock, Heart, Target, Lightbulb, Leaf, History } from 'lucide-react'
import Image from 'next/image'
import { useState } from 'react'
import TeamMemberModal from '@/components/TeamMemberModal'

export default function About() {
  const [selectedMember, setSelectedMember] = useState(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleMemberClick = (member) => {
    setSelectedMember(member)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedMember(null)
  }

  const stats = [
    { number: '5+', label: 'Years of Excellence', description: 'Serving our community since 2008' },
    { number: '10,000+', label: 'Customer served', description: 'Trusted by thousands of families' },
    { number: '50+', label: 'Expert Doctors', description: 'Board-certified specialists' },
    { number: '24/7', label: 'Emergency Care', description: 'Always here when you need us' }
  ]

  const values = [
    {
      icon: Heart,
      title: 'Customer-Centered Care',
      description: 'Every decision we make is guided by what\'s best for our customers and their families.'
    },
    {
      icon: Target,
      title: 'Excellence in Medicine',
      description: 'We maintain the highest standards of medical care through continuous learning and improvement.'
    },
    {
      icon: Shield,
      title: 'Safety First',
      description: 'Customer safety is our top priority in every procedure, treatment, and interaction.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'We embrace new technologies and treatments to provide the best possible outcomes.'
    }
  ]

  const team = [
    {
      name: 'MR. Laxman Yadav',
      role: 'Director',
      specialty: 'Specialization in Marketing',
      experience: '15+ years',
      image: '/laxmanyadav.jpeg',
      email: 'laxmanyadavji@gmail.com',
      location: 'Jaipur, Rajasthan',
      bio: 'At Self-Employed, our team specializes in leveraging marketing strategy and social media to enhance customer conversion. With an MBA in Human Resources Management from Jaipur National University, we integrate marketing efforts with overarching business objectives, a testament to our strategic acumen. Our professional certifications from Times Pro and NISM underscore our dedication to marketing and financial proficiency. Committed to delivering innovative strategies, we aim to empower brands to thrive in the ever-evolving marketplace.',
      education: [
        'MBA, Human Resources Management - Jaipur National University'
      ],
      workHistory: [
        {
          position: 'Director',
          company: 'M-Well Healthcare',
          duration: '2023 - Present',
          description: 'Leading strategic initiatives and business development for the company, focusing on marketing strategy and social media to enhance customer conversion'
        },
        {
          position: 'Director',
          company: 'First Attempt Groups',
          duration: '2018 - Present',
          description: 'Directed comprehensive marketing strategies and business development initiatives, integrating marketing efforts with overarching business objectives'
        },
        {
          position: 'Specializing Marketing Strategy',
          company: 'HR Solution First Attempt',
          duration: '2018 - Present',
          description: 'Specialized in developing innovative marketing strategies and leveraging social media platforms to drive customer engagement and conversion'
        }
      ],
      skills: ['Strategic Planning', 'Business Development', 'Marketing Strategy', 'Social Media Marketing', 'Customer Conversion', 'HR Management'],
      achievements: [
        'Successfully integrated marketing efforts with business objectives across multiple organizations',
        'Enhanced customer conversion rates through innovative marketing strategies',
        'Established strong social media presence for multiple brands',
        'Delivered innovative strategies that empowered brands in evolving marketplace'
      ],
      certifications: [
        'Professional Marketing Certification - Times Pro',
        'NISM Certification - Financial Proficiency',
        'Social Media Marketing Certification'
      ]
    },
    {
      name: 'Mrs. Deepa Sidhnani',
      role: 'Operation Manager',
      specialty: 'Bsc, Physical Science',
      experience: '5+ years',
      image: '/deepa.jpeg',
      email: 'deepa.sidhnani@mwell.com',
      location: 'Delhi, India',
      bio: 'Mrs. Deepa Sidhnani brings a strong scientific background and operational expertise to M-Well Healthcare. Her attention to detail and systematic approach ensures smooth operations and quality control across all company processes.',
      education: [
        'BSc in Physical Science - Delhi University',
        'Diploma in Operations Management - IIM Delhi'
      ],
      workHistory: [
        {
          position: 'Operation Manager',
          company: 'M-Well Healthcare',
          duration: '2020 - Present',
          description: 'Overseeing daily operations, quality control, and process optimization'
        },
        {
          position: 'Quality Control Officer',
          company: 'Wellness Solutions Ltd',
          duration: '2018 - 2020',
          description: 'Ensured product quality and compliance with health regulations'
        }
      ],
      skills: ['Operations Management', 'Quality Control', 'Process Optimization', 'Team Coordination', 'Regulatory Compliance'],
      achievements: [
        'Improved operational efficiency by 40%',
        'Maintained 99.5% quality compliance rate',
        'Reduced operational costs by 25%',
        'Led successful ISO certification process'
      ],
      certifications: [
        'ISO 9001:2015 Quality Management Systems',
        'Good Manufacturing Practices (GMP)',
        'Operations Management Certification'
      ]
    },
    {
      name: 'Mrs. Poonam Rajput',
      role: 'Administrative Manager',
      specialty: 'BSc, Biological Science',
      experience: '5+ years',
      image: '/poonammam.jpeg',
      email: 'poonam.rajput@mwell.com',
      location: 'Bangalore, India',
      bio: 'Mrs. Poonam Rajput combines her biological science background with exceptional administrative skills to ensure seamless operations at M-Well Healthcare. Her organizational abilities and attention to detail make her an invaluable part of the leadership team.',
      education: [
        'BSc in Biological Science - Bangalore University',
        'Master of Business Administration - Symbiosis Institute'
      ],
      workHistory: [
        {
          position: 'Administrative Manager',
          company: 'M-Well Healthcare',
          duration: '2019 - Present',
          description: 'Managing administrative functions, HR processes, and office operations'
        },
        {
          position: 'Administrative Assistant',
          company: 'BioHealth Solutions',
          duration: '2017 - 2019',
          description: 'Handled administrative tasks and supported management team'
        }
      ],
      skills: ['Administrative Management', 'Human Resources', 'Office Operations', 'Documentation', 'Team Support'],
      achievements: [
        'Streamlined administrative processes reducing paperwork by 60%',
        'Successfully managed office expansion project',
        'Implemented digital filing system improving efficiency',
        'Maintained 100% compliance with administrative policies'
      ],
      certifications: [
        'Administrative Management Certification',
        'Human Resources Management',
        'Office Management Professional'
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-accent-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-gray-100 mb-6">
              About M-Well Healthcare
            </h1>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              For over 15 years, we&apos;ve been committed to providing exceptional healthcare 
              services with compassion, innovation, and excellence.
            </p>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">{stat.label}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.description}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, What We Do & History */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Our Mission */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-primary-100 rounded-xl flex items-center justify-center mb-6">
                <Target className="h-8 w-8 text-primary-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Mission</h2>
              <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                <p className="font-semibold text-primary-600">Healing Naturally. Inspiring Change.</p>
                <p>
                  At m-well Healthcare, our mission is to deliver safe, effective, and affordable herbal wellness solutions that empower people to live healthier lives — physically, mentally, and emotionally.
                </p>
                <p>We are committed to:</p>
                <ul className="space-y-2 ml-4">
                  <li className="flex items-start gap-2">
                    <span className="text-green-600">🌿</span>
                    <span>Promoting natural healing over harmful chemicals</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-blue-600">🧠</span>
                    <span>Supporting mental peace, physical strength, and overall wellness</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-600">🧪</span>
                    <span>Combining ancient Ayurvedic wisdom with modern research</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-orange-600">🤝</span>
                    <span>Building trust through quality, transparency, and results</span>
                  </li>
                </ul>
                <p>
                  Every drop, tablet, and tonic we create is a step toward a healthier society and a happier you.
                </p>
                <p className="font-semibold text-primary-600 italic">
                  m-well Healthcare – because nature knows best.
                </p>
              </div>
            </div>
            
            {/* Our Vision */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-accent-100 rounded-xl flex items-center justify-center mb-6">
                <Lightbulb className="h-8 w-8 text-accent-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Vision</h2>
              <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                <p className="font-semibold text-accent-600">A Healthier You, A Healthier World.</p>
                <p>
                  We envision a future where healthcare is simple, natural, and accessible to all. m-well Healthcare stands for trust, transparency, and transformation. Our vision is to be a leading force in holistic wellness, combining age-old herbal wisdom with modern science — to build a community that chooses healing over hiding. We don't just sell products — we offer a path to lifelong wellbeing.
                </p>
              </div>
            </div>

            {/* What We Really Do */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-green-100 rounded-xl flex items-center justify-center mb-6">
                <Leaf className="h-8 w-8 text-green-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">What We Really Do?</h2>
              <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                <p className="font-semibold text-green-600">Empowering Wellness, Naturally.</p>
                <p>
                  At m-well Healthcare, we go beyond treating symptoms — we believe in restoring balance and boosting vitality using the power of nature. From Anti-Anxiety drops to Super Herbs, our carefully crafted products are designed to support your physical, mental, and emotional health. Whether it's Woman Care, Man Care, or Anti-Addiction solutions, we focus on real results with no compromise on purity. Our mission? Simple — help you live better, feel better, and be better.
                </p>
              </div>
            </div>

            {/* History of Beginning */}
            <div className="bg-white rounded-2xl p-8 shadow-lg">
              <div className="w-16 h-16 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
                <History className="h-8 w-8 text-purple-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-4">History of Beginning</h2>
              <div className="text-lg text-gray-600 dark:text-gray-400 leading-relaxed space-y-4">
                <p className="font-semibold text-purple-600">It All Started With a Drop…</p>
                <p>
                  Our journey began with a simple goal: to fight addiction naturally. What started as one product to help one life has today grown into a brand that touches thousands. Founded by passionate minds, m-well Healthcare was built on the belief that natural remedies can be powerful, affordable, and life-changing. From our humble beginnings in a small clinic, we've evolved into a trusted name in wellness — all while keeping our roots in herbal healing strong and sacred.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Our Core Values</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              These values guide everything we do and shape our commitment to excellence in healthcare.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-20 h-20 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <value.icon className="h-10 w-10 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-3">{value.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">Leadership Team</h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
              Meet our experienced Leaders professionals who lead our commitment to excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div 
                key={index} 
                className="bg-white rounded-2xl p-6 shadow-lg text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                onClick={() => handleMemberClick(member)}
              >
                <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-primary-100">
                  <Image
                    src={member.image}
                    alt={member.name}
                    width={96}
                    height={96}
                    className="w-full h-full object-cover"
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-1">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-2">{member.role}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">{member.specialty}</p>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">{member.experience}</p>
                <div className="text-xs text-primary-500 font-medium">
                  Click to view details →
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
            Ready to Experience M-Well Healthcare?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Join our community of customers who trust us with their health and well-being. 
            Book your appointment today.
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

      {/* Team Member Modal */}
      <TeamMemberModal
        member={selectedMember}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </div>
  )
}

