'use client';

import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { faPhone } from '@fortawesome/free-solid-svg-icons';

library.add(fab, faEnvelope, faPhone, faLocationDot);

export default function ContactForm({ resumeData }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const { personalInfo } = resumeData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission (replace with actual form handling)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSubmitStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setSubmitStatus(null), 3000);
    }
  };

  return (
    <section id="contact" className="py-20 bg-base-200">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-base-content mb-4">
            Get In Touch
          </h2>
          <p className="text-xl text-base-content/70 max-w-3xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Info */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold text-base-content mb-6">
                Contact Information
              </h3>
              <p className="text-base-content/70 mb-8">
                Ready to discuss new opportunities, collaborate on projects, or explore how we can work together.
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4">
              {/* Email */}
              <div className="flex items-center gap-4 p-4 bg-base-100 rounded-box border border-base-300 hover:bg-base-200 transition-colors">
                <div className="text-primary">
                  <FontAwesomeIcon icon={['fas', 'envelope']} className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <span className="text-base-content font-medium">Email: </span>
                  <a
                    href={`mailto:${personalInfo?.email}`}
                    className="link link-primary"
                  >
                    {personalInfo?.email}
                  </a>
                </div>
              </div>

              {/* Phone */}
              {personalInfo?.phone && (
                <div className="flex items-center gap-4 p-4 bg-base-100 rounded-box border border-base-300 hover:bg-base-200 transition-colors">
                  <div className="text-secondary">
                    <FontAwesomeIcon icon={['fas', 'phone']} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base-content font-medium">Phone: </span>
                    <a
                      href={`tel:${personalInfo.phone}`}
                      className="link link-secondary"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* WhatsApp */}
              {personalInfo?.whatsapp && (
                <div className="flex items-center gap-4 p-4 bg-base-100 rounded-box border border-base-300 hover:bg-base-200 transition-colors">
                  <div className="text-success">
                    <FontAwesomeIcon icon={['fab', 'whatsapp']} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base-content font-medium">WhatsApp: </span>
                    <a
                      href={`https://wa.me/${personalInfo.whatsapp}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="link link-success"
                    >
                      Message on WhatsApp
                    </a>
                  </div>
                </div>
              )}

              {/* Location */}
              {personalInfo?.location && (
                <div className="flex items-center gap-4 p-4 bg-base-100 rounded-box border border-base-300">
                  <div className="text-accent">
                    <FontAwesomeIcon icon={['fas', 'location-dot']} className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <span className="text-base-content font-medium">Location: </span>
                    <span className="text-base-content">{personalInfo.location}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Social Links */}
            <div className="pt-8">
              <h4 className="text-lg font-semibold text-base-content mb-4 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Follow Me
              </h4>
              <div className="flex flex-wrap gap-3">
                {personalInfo?.social?.github && (
                  <a
                    href={personalInfo.social.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <FontAwesomeIcon icon={['fab', 'github']} className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                
                {personalInfo?.social?.linkedin && (
                  <a
                    href={personalInfo.social.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <FontAwesomeIcon icon={['fab', 'linkedin']} className="w-4 h-4" />
                    LinkedIn
                  </a>
                )}
                
                {personalInfo?.social?.dev && (
                  <a
                    href={personalInfo.social.dev}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-outline btn-sm"
                  >
                    <FontAwesomeIcon icon={['fab', 'dev']} className="w-4 h-4" />
                    DEV
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <h3 className="card-title text-2xl mb-6">
                <svg className="w-6 h-6 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                Send Message
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name and Email Row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-medium">Name *</span>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="Your name"
                      required
                    />
                  </label>
                  
                  <label className="form-control">
                    <div className="label">
                      <span className="label-text font-medium">Email *</span>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input input-bordered w-full"
                      placeholder="your.email@example.com"
                      required
                    />
                  </label>
                </div>

                {/* Subject */}
                <label className="form-control">
                  <div className="label">
                    <span className="label-text font-medium">Subject *</span>
                  </div>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="select select-bordered w-full"
                    required
                  >
                    <option value="">Select a subject</option>
                    <option value="Project Collaboration">Project Collaboration</option>
                    <option value="Job Opportunity">Job Opportunity</option>
                    <option value="Consulting">Consulting</option>
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Other">Other</option>
                  </select>
                </label>

                <div className='gap-2'></div>
                
                {/* Message */}
                <label className="form-control space-y-2">
                  <div className="label">
                    <span className="label-text font-medium">Message *</span>
                    <span className="label-text-alt">({formData.message.length}/500)</span>
                  </div>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    className="textarea textarea-bordered h-32 resize-none w-full"
                    placeholder="Tell me about your project, opportunity, or how I can help..."
                    maxLength={500}
                    required
                  ></textarea>
                </label>

                <div className='gap-2'></div>
                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn btn-primary btn-block btn-lg mt-auto pt-4 pb-4 flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="loading loading-spinner loading-sm"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                      </svg>
                      Send Message
                    </>
                  )}
                </button>

                {/* Status Messages */}
                {submitStatus === 'success' && (
                  <div className="alert alert-success">
                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Message sent successfully! I'll get back to you soon.</span>
                  </div>
                )}

                {submitStatus === 'error' && (
                  <div className="alert alert-error">
                    <svg className="w-6 h-6 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>Failed to send message. Please try again.</span>
                  </div>
                )}
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
