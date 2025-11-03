import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  Users,
  HelpCircle,
  Building,
  Navigation
} from 'lucide-react';
import { contactApi, ContactSubmission } from '../services/api';

interface ContactFormData {
  name: string;
  email: string;
  phone: string;
  subject: string;
  category: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>();

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true);
    
    try {
      // Map form data to ContactSubmission type
      const submissionData: ContactSubmission = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        subject: data.subject,
        category: data.category as ContactSubmission['category'],
        message: data.message
      };
      
      await contactApi.submit(submissionData);
      toast.success('Message sent successfully! We\'ll get back to you within 24 hours.');
      reset();
    } catch (error: any) {
      console.error('Contact form error:', error);
      toast.error(error.response?.data?.message || 'Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      details: 'info@smartqueue.gov.lk',
      description: 'Send us an email anytime',
      color: 'text-primary-600 bg-primary-100'
    },
    {
      icon: Phone,
      title: 'Call Us',
      details: '+94 11 234 5678',
      description: 'Mon-Fri 8:00 AM - 6:00 PM',
      color: 'text-secondary-600 bg-secondary-100'
    },
    {
      icon: MapPin,
      title: 'Colombo Office',
      details: '123 Galle Road, Colombo 03',
      description: 'Sri Lanka',
      color: 'text-accent-600 bg-accent-100'
    },
    {
      icon: MapPin,
      title: 'Jaffna Office',
      details: '456 Temple Road, Jaffna',
      description: 'Northern Province, Sri Lanka',
      color: 'text-success-600 bg-success-100'
    }
  ];

  const departments = [
    {
      icon: Users,
      title: 'Customer Support',
      description: 'General inquiries and technical support',
      email: 'support@smartqueue.gov.lk'
    },
    {
      icon: Building,
      title: 'Regional Offices',
      description: 'Jaffna office inquiries',
      email: 'offices@smartqueue.gov.lk'
    },
    {
      icon: HelpCircle,
      title: 'Technical Support',
      description: 'Technical issues and system problems',
      email: 'tech@smartqueue.gov.lk'
    }
  ];

  const faqs = [
    {
      question: 'How accurate are the wait time predictions?',
      answer: 'Our AI-powered system achieves 85-90% accuracy in wait time predictions by analyzing historical data, current queue status, and various other factors.'
    },
    {
      question: 'Can I cancel or reschedule my appointment?',
      answer: 'Yes, you can cancel or reschedule your appointment up to 2 hours before the scheduled time through your account dashboard.'
    },
    {
      question: 'Is the system available 24/7?',
      answer: 'Yes, our online booking system is available 24/7. However, physical service locations operate during their regular business hours.'
    },
    {
      question: 'How do I get priority booking?',
      answer: 'Priority booking is available for elderly citizens (65+), persons with disabilities, and emergency cases. Select the appropriate priority level when booking.'
    }
  ];

  return (
    <div className="animate-fade-in pt-4">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
              Get in Touch
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              Have questions about our services? Need technical support? 
              We're here to help you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info Cards */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactInfo.map((info, index) => {
              const Icon = info.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-xl p-4 md:p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100 h-full flex flex-col">
                    <div className={`inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 rounded-lg mb-4 md:mb-6 mx-auto ${info.color}`}>
                      <Icon className="h-6 w-6 md:h-8 md:w-8" />
                    </div>
                    <h3 className="text-lg md:text-xl font-semibold text-gray-900 mb-2">
                      {info.title}
                    </h3>
                    <p className="text-base md:text-lg font-medium text-gray-900 mb-1">
                      {info.details}
                    </p>
                    <p className="text-gray-600 text-sm md:text-base mt-auto">
                      {info.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Contact Form & Departments */}
      <section className="py-16 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Contact Form */}
            <div>
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <div className="mb-6 md:mb-8">
                  <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    Send us a Message
                  </h2>
                  <p className="text-gray-600">
                    Fill out the form below and we'll get back to you within 24 hours.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 md:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        id="name"
                        type="text"
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        {...register('name', { required: 'Name is required' })}
                      />
                      {errors.name && (
                        <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                        Email Address *
                      </label>
                      <input
                        id="email"
                        type="email"
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        {...register('email', {
                          required: 'Email is required',
                          pattern: {
                            value: /^\S+@\S+$/i,
                            message: 'Invalid email address'
                          }
                        })}
                      />
                      {errors.email && (
                        <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                        Phone Number
                      </label>
                      <input
                        id="phone"
                        type="tel"
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        {...register('phone')}
                      />
                    </div>

                    <div>
                      <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                        Category *
                      </label>
                      <select
                        id="category"
                        className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                        {...register('category', { required: 'Please select a category' })}
                      >
                        <option value="">Select category...</option>
                        <option value="general">General Inquiry</option>
                        <option value="technical">Technical Support</option>
                        <option value="jaffna">Jaffna Office</option>
                        <option value="feedback">Feedback</option>
                        <option value="other">Other</option>
                      </select>
                      {errors.category && (
                        <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                      Subject *
                    </label>
                    <input
                      id="subject"
                      type="text"
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      {...register('subject', { required: 'Subject is required' })}
                    />
                    {errors.subject && (
                      <p className="mt-1 text-sm text-red-600">{errors.subject.message}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                      Message *
                    </label>
                    <textarea
                      id="message"
                      rows={4}
                      className="w-full px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                      placeholder="Please describe your inquiry in detail..."
                      {...register('message', { 
                        required: 'Message is required',
                        minLength: {
                          value: 10,
                          message: 'Message must be at least 10 characters'
                        }
                      })}
                    />
                    {errors.message && (
                      <p className="mt-1 text-sm text-red-600">{errors.message.message}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-primary-600 text-white py-2 md:py-3 px-4 md:px-6 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Sending...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center">
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </span>
                    )}
                  </button>
                </form>
              </div>
            </div>

            {/* Departments & FAQ */}
            <div className="space-y-6 md:space-y-8">
              {/* Departments */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">
                  Contact Departments
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {departments.map((dept, index) => {
                    const Icon = dept.icon;
                    return (
                      <div key={index} className="flex items-start">
                        <div className="bg-primary-100 p-2 md:p-3 rounded-lg mr-3 md:mr-4 flex-shrink-0">
                          <Icon className="h-5 w-5 md:h-6 md:w-6 text-primary-600" />
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {dept.title}
                          </h4>
                          <p className="text-gray-600 text-sm mb-2">
                            {dept.description}
                          </p>
                          <a
                            href={`mailto:${dept.email}`}
                            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                          >
                            {dept.email}
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick FAQ */}
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-100">
                <h3 className="text-xl font-bold text-gray-900 mb-4 md:mb-6">
                  Frequently Asked Questions
                </h3>
                <div className="space-y-4 md:space-y-6">
                  {faqs.map((faq, index) => (
                    <div key={index}>
                      <h4 className="font-semibold text-gray-900 mb-2">
                        {faq.question}
                      </h4>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 md:py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-4">
              Visit Our Office
            </h2>
            <p className="text-lg md:text-xl text-gray-600">
              We are located in Jaffna. Easily accessible by public transport.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
            {/* Colombo Office */}
            {/* <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md h-80">
              <div className="h-full flex flex-col">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-700">Colombo Office</h3>
                    <p className="text-gray-600 text-sm">123 Galle Road, Colombo 03</p>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 mb-4">
                    Our main office in Colombo provides comprehensive support for all services.
                  </p>
                  <a
                    href="https://maps.google.com/?q=123+Galle+Road,Colombo,Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div> */}

            {/* Jaffna Office */}
            <div className="bg-gray-100 rounded-xl overflow-hidden shadow-md h-80">
              <div className="h-full flex flex-col">
                <div className="h-48 bg-gray-300 flex items-center justify-center">
                  <div className="text-center p-4">
                    <MapPin className="h-12 w-12 text-gray-500 mx-auto mb-2" />
                    <h3 className="font-semibold text-gray-700">Jaffna Office</h3>
                    <p className="text-gray-600 text-sm">456 Temple Road, Jaffna</p>
                  </div>
                </div>
                <div className="p-4 flex-grow flex flex-col justify-between">
                  <p className="text-gray-600 mb-4">
                    Our Jaffna regional office serves the Northern Province with dedicated support.
                  </p>
                  <a
                    href="https://maps.google.com/?q=456+Temple+Road,Jaffna,Sri+Lanka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-primary-600 hover:text-primary-700 text-sm font-medium"
                  >
                    <Navigation className="h-4 w-4 mr-1" />
                    Get Directions
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Emergency Contact */}
      <section className="py-12 md:py-16 bg-red-50 border-t border-red-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="bg-red-100 rounded-full w-12 h-12 md:w-16 md:h-16 flex items-center justify-center mx-auto mb-4">
              <Phone className="h-6 w-6 md:h-8 md:w-8 text-red-600" />
            </div>
            <h3 className="text-lg md:text-xl font-bold text-gray-900 mb-2">
              Emergency Support
            </h3>
            <p className="text-gray-600 mb-4">
              For urgent technical issues or system outages
            </p>
            <a
              href="tel:+94112345678"
              className="inline-flex items-center bg-red-600 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-medium hover:bg-red-700 transition-colors"
            >
              <Phone className="h-4 w-4 mr-2" />
              +94 11 234 5678
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;