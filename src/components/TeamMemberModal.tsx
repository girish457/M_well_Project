"use client"
import React from 'react'
import Image from 'next/image'
import { X, Mail, Phone, MapPin, Award, Briefcase, GraduationCap, Calendar, Users } from 'lucide-react'

interface TeamMember {
  name: string
  role: string
  specialty: string
  experience: string
  image: string
  email?: string
  phone?: string
  location?: string
  education?: string[]
  achievements?: string[]
  workHistory?: {
    position: string
    company: string
    duration: string
    description?: string
  }[]
  skills?: string[]
  bio?: string
  certifications?: string[]
}

interface TeamMemberModalProps {
  member: TeamMember | null
  isOpen: boolean
  onClose: () => void
}

export default function TeamMemberModal({ member, isOpen, onClose }: TeamMemberModalProps) {
  if (!isOpen || !member) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-4 border-primary-100">
              <Image
                src={member.image}
                alt={member.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{member.name}</h2>
              <p className="text-primary-600 font-medium">{member.role}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Bio Section */}
          {member.bio && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3 flex items-center">
                <Users className="h-5 w-5 text-primary-600 mr-2" />
                About
              </h3>
              <p className="text-gray-600 leading-relaxed">{member.bio}</p>
            </div>
          )}

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {member.email && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-900 font-medium">{member.email}</p>
                </div>
              </div>
            )}
            {member.location && (
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <MapPin className="h-5 w-5 text-primary-600" />
                <div>
                  <p className="text-sm text-gray-500">Location</p>
                  <p className="text-gray-900 font-medium">{member.location}</p>
                </div>
              </div>
            )}
          </div>

          {/* Experience & Education */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Education */}
            {member.education && member.education.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <GraduationCap className="h-5 w-5 text-primary-600 mr-2" />
                  Education
                </h3>
                <div className="space-y-3">
                  {member.education.map((edu, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-900 font-medium">{edu}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Work History */}
            {member.workHistory && member.workHistory.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                  <Briefcase className="h-5 w-5 text-primary-600 mr-2" />
                  Work Experience
                </h3>
                <div className="space-y-4">
                  {member.workHistory.map((work, index) => (
                    <div key={index} className="p-4 bg-gray-50 rounded-lg">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{work.position}</h4>
                        <span className="text-sm text-gray-500">{work.duration}</span>
                      </div>
                      <p className="text-primary-600 font-medium mb-1">{work.company}</p>
                      {work.description && (
                        <p className="text-gray-600 text-sm">{work.description}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Skills */}
          {member.skills && member.skills.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-primary-600 mr-2" />
                Skills & Expertise
              </h3>
              <div className="flex flex-wrap gap-2">
                {member.skills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary-100 text-primary-700 rounded-full text-sm font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Certifications */}
          {member.certifications && member.certifications.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-primary-600 mr-2" />
                Certifications
              </h3>
              <div className="space-y-2">
                {member.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full"></div>
                    <p className="text-gray-700">{cert}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Achievements */}
          {member.achievements && member.achievements.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Award className="h-5 w-5 text-primary-600 mr-2" />
                Key Achievements
              </h3>
              <div className="space-y-2">
                {member.achievements.map((achievement, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-primary-600 rounded-full mt-2"></div>
                    <p className="text-gray-700">{achievement}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="bg-primary-600 hover:bg-primary-700 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
