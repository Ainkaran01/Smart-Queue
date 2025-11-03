import React from 'react';
import { 
  Clock, 
  Users, 
  Brain, 
  Shield, 
  Award, 
  Target,
  Heart,
  Lightbulb,
  CheckCircle
} from 'lucide-react';

const AboutPage: React.FC = () => {
  const values = [
    {
      icon: Heart,
      title: 'User-Centric Design',
      description: 'Every feature is designed with the user experience in mind, ensuring accessibility and ease of use for all.'
    },
    {
      icon: Brain,
      title: 'Innovation',
      description: 'We leverage cutting-edge AI and machine learning to provide accurate predictions and smart solutions.'
    },
    {
      icon: Shield,
      title: 'Trust & Security',
      description: 'Your data is protected with enterprise-grade security measures and complete privacy compliance.'
    },
    {
      icon: Target,
      title: 'Efficiency',
      description: 'We eliminate waste and optimize processes to save time for both service providers and citizens.'
    }
  ];

  const team = [
    {
      name: 'Dr. Samantha Perera',
      role: 'Chief Technology Officer',
      bio: 'PhD in Computer Science with 15+ years in AI and healthcare systems.',
      image: 'https://images.pexels.com/photos/3760263/pexels-photo-3760263.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Rajesh Kumar',
      role: 'Head of Product',
      bio: 'Former government digital transformation lead with expertise in public service delivery.',
      image: 'https://images.pexels.com/photos/3785079/pexels-photo-3785079.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    },
    {
      name: 'Amara Silva',
      role: 'UX Design Director',
      bio: 'Award-winning designer focused on inclusive and accessible digital experiences.',
      image: 'https://images.pexels.com/photos/3760067/pexels-photo-3760067.jpeg?auto=compress&cs=tinysrgb&w=300&h=300&fit=crop'
    }
  ];

  const achievements = [
    { number: '50,000+', label: 'Citizens Served' },
    { number: '95%', label: 'Satisfaction Rate' },
    { number: '30min', label: 'Average Time Saved' },
    { number: '24/7', label: 'System Uptime' }
  ];

  return (
    <div className="animate-fade-in">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-600 via-primary-700 to-secondary-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              About Smart Queue Management
            </h1>
            <p className="text-xl lg:text-2xl text-primary-100 max-w-3xl mx-auto leading-relaxed">
              We're revolutionizing public service delivery through intelligent queue management 
              and AI-powered appointment booking systems.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Mission
              </h2>
              <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                To eliminate unnecessary waiting times and improve the quality of public service 
                delivery through innovative technology solutions. We believe that every citizen 
                deserves efficient, dignified, and accessible government services.
              </p>
              <p className="text-lg text-gray-600 leading-relaxed">
                By combining artificial intelligence, user-centered design, and deep understanding 
                of public service challenges, we create solutions that benefit both citizens and 
                service providers.
              </p>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-primary-100 to-secondary-100 rounded-2xl p-8">
                <div className="grid grid-cols-2 gap-6">
                  <div className="text-center">
                    <Clock className="h-12 w-12 text-primary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900">Time Efficiency</h3>
                    <p className="text-sm text-gray-600 mt-2">Reduce waiting times by up to 70%</p>
                  </div>
                  <div className="text-center">
                    <Users className="h-12 w-12 text-secondary-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900">Better Experience</h3>
                    <p className="text-sm text-gray-600 mt-2">Improved citizen satisfaction</p>
                  </div>
                  <div className="text-center">
                    <Brain className="h-12 w-12 text-accent-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900">AI Powered</h3>
                    <p className="text-sm text-gray-600 mt-2">Smart predictions and insights</p>
                  </div>
                  <div className="text-center">
                    <Shield className="h-12 w-12 text-success-600 mx-auto mb-4" />
                    <h3 className="font-semibold text-gray-900">Secure & Private</h3>
                    <p className="text-sm text-gray-600 mt-2">Enterprise-grade security</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do and every decision we make
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => {
              const Icon = value.icon;
              return (
                <div key={index} className="text-center">
                  <div className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                    <div className="bg-primary-100 rounded-lg w-16 h-16 flex items-center justify-center mx-auto mb-6">
                      <Icon className="h-8 w-8 text-primary-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-4">
                      {value.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1">
              <img
                src="https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=600&h=400&fit=crop"
                alt="Government office queue"
                className="rounded-2xl shadow-lg"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600 leading-relaxed">
                <p>
                  Smart Queue Management was born from a simple observation: millions of citizens 
                  waste countless hours waiting in queues for essential government services.
                </p>
                <p>
                  In 2023, our team of technologists, designers, and public service experts came 
                  together with a shared vision - to transform how citizens interact with government 
                  services through technology.
                </p>
                <p>
                  Today, we're proud to serve over 50,000 citizens across Sri Lanka, helping them 
                  save time, reduce stress, and access services more efficiently than ever before.
                </p>
              </div>
              <div className="mt-8 flex items-center">
                <Award className="h-6 w-6 text-primary-600 mr-3" />
                <span className="text-gray-900 font-medium">
                  Winner of the 2024 Digital Government Innovation Award
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Meet Our Leadership Team
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Experienced professionals dedicated to transforming public service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <div key={index} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mx-auto mb-6 object-cover"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {member.name}
                </h3>
                <p className="text-primary-600 font-medium mb-4">
                  {member.role}
                </p>
                <p className="text-gray-600 leading-relaxed">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Our Impact
            </h2>
            <p className="text-xl text-primary-100 max-w-3xl mx-auto">
              Real numbers that demonstrate our commitment to improving public service delivery
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">
                  {achievement.number}
                </div>
                <div className="text-primary-200">
                  {achievement.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Future Vision Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <Lightbulb className="h-16 w-16 text-primary-600 mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Looking Forward
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our vision for the future of public service delivery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Nationwide Expansion
                  </h3>
                  <p className="text-gray-600">
                    Expanding our services to cover all government departments and healthcare 
                    facilities across Sri Lanka.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Advanced AI Integration
                  </h3>
                  <p className="text-gray-600">
                    Implementing more sophisticated AI models for even more accurate predictions 
                    and personalized experiences.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Mobile-First Experience
                  </h3>
                  <p className="text-gray-600">
                    Developing native mobile applications to make our services even more 
                    accessible to all citizens.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Integration Ecosystem
                  </h3>
                  <p className="text-gray-600">
                    Building seamless integrations with existing government systems and 
                    third-party service providers.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    Accessibility Features
                  </h3>
                  <p className="text-gray-600">
                    Enhancing accessibility features to ensure our platform serves citizens 
                    with diverse needs and abilities.
                  </p>
                </div>
              </div>

              <div className="flex items-start">
                <CheckCircle className="h-6 w-6 text-success-600 mt-1 mr-4 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold text-gray-900 mb-2">
                    International Expansion
                  </h3>
                  <p className="text-gray-600">
                    Sharing our expertise and technology with other countries to improve 
                    public service delivery globally.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;