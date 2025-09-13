import Link from 'next/link'
import { ArrowRight, Phone, Calendar, MessageCircle } from 'lucide-react'

export default function CTA() {
  return (
    <section className="bg-primary-600 section-padding">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Ready to Take Control of Your Health?
          </h2>
          <p className="text-xl text-primary-100 mb-12 max-w-3xl mx-auto">
            Join thousands of customers who trust M-Well for their healthcare needs. 
            Book your appointment today and experience the difference quality care makes.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
            <Link
              href="/appointments"
              className="bg-white text-primary-600 hover:bg-gray-50 font-semibold py-4 px-8 rounded-lg text-lg inline-flex items-center transition-colors duration-200 shadow-lg"
            >
              <Calendar className="mr-2 h-6 w-6" />
              Book Appointment
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            
            <Link
              href="/contact"
              className="bg-primary-700 hover:bg-primary-800 text-white font-semibold py-4 px-8 rounded-lg text-lg inline-flex items-center transition-colors duration-200 border border-primary-500"
            >
              <MessageCircle className="mr-2 h-6 w-6" />
              Contact Us
            </Link>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Call Us</h3>
              <p className="text-primary-100">1800-891-2871</p>
              <p className="text-primary-100 text-sm">24/7 Emergency Line</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Book Online</h3>
              <p className="text-primary-100">Easy online booking</p>
              <p className="text-primary-100 text-sm">Available 24/7</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-primary-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">Live Chat</h3>
              <p className="text-primary-100">Get instant answers</p>
              <p className="text-primary-100 text-sm">Mon - Sat 10 AM - 7 PM</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

