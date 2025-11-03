import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation } from '@tanstack/react-query';
import { 
  Calendar, 
  Clock, 
  Users, 
  ArrowRight,  
  KeyRound,
  User,
  Mail,
  Phone,
  X,
  Save
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { appointmentsApi, authApi, User as UserType } from '../services/api';
import { toast } from 'react-toastify';
import { useForm } from 'react-hook-form';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();
  const { user, updateUserLocal } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  // Fetch user's recent appointments
  const { data: myAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['myAppointments'],
    queryFn: appointmentsApi.getMine,
    enabled: user?.role === 'CITIZEN',
  });

  const recentAppointments = myAppointments?.slice(0, 3) || [];

  // Edit Profile form
  const { register, handleSubmit, reset, formState: { errors } } = useForm<Partial<UserType>>({
    defaultValues: {
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || ''
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: Partial<UserType>) => authApi.updateProfile(data),
    onSuccess: (updatedUser) => {
      toast.success('Profile updated successfully!');
      updateUserLocal(updatedUser);
      setIsEditing(false);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    },
  });

  const onSubmit = (data: Partial<UserType>) => {
    updateMutation.mutate(data);
  };

  const handleCancel = () => {
    reset({
      first_name: user?.first_name || '',
      last_name: user?.last_name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      username: user?.username || ''
    });
    setIsEditing(false);
  };

  const getStatusBadgeClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      'SCHEDULED': 'bg-blue-100 text-blue-800',
      'WAITING': 'bg-yellow-100 text-yellow-800',
      'IN_PROGRESS': 'bg-purple-100 text-purple-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'CANCELLED': 'bg-red-100 text-red-800',
      'NO_SHOW': 'bg-gray-100 text-gray-800',
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${statusClasses[status]}`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    const priorityClasses: { [key: string]: string } = {
      'NORMAL': 'bg-gray-100 text-gray-800',
      'ELDERLY': 'bg-orange-100 text-orange-800',
      'DISABLED': 'bg-indigo-100 text-indigo-800',
      'EMERGENCY': 'bg-red-100 text-red-800',
    };
    return `px-3 py-1 rounded-full text-sm font-medium ${priorityClasses[priority]}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 space-y-8 p-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold font-serif mb-2">
              Welcome back, {user?.first_name}  {user?.last_name}!
            </h1>
            <p className="text-primary-100 text-lg">
              {user?.role === 'CITIZEN' 
                ? 'Manage your appointments and book new ones'
                : 'Monitor queue status and manage appointments'
              }
            </p>
          </div>
          <div className="bg-white/20 p-4 rounded-xl">
            <Clock className="h-12 w-12 text-white" />
          </div>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Book Appointment */}
        <Link
          to="/book"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
        >
          <div className="flex items-center">
            <div className="bg-primary-100 p-3 rounded-lg group-hover:bg-primary-200 transition-colors">
              <Calendar className="h-8 w-8 text-primary-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Book Appointment</h3>
              <p className="text-gray-600 text-sm">Schedule a new service</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-primary-600 transition-colors" />
          </div>
        </Link>

        {/* My Appointments */}
        <Link
          to="/mine"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
        >
          <div className="flex items-center">
            <div className="bg-secondary-100 p-3 rounded-lg group-hover:bg-secondary-200 transition-colors">
              <Users className="h-8 w-8 text-secondary-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">My Appointments</h3>
              <p className="text-gray-600 text-sm">View your bookings</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-secondary-600 transition-colors" />
          </div>
        </Link>

        {/* Edit Profile */}
        <div
          onClick={() => setIsEditing(!isEditing)}
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group cursor-pointer"
        >
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-lg group-hover:bg-green-200 transition-colors">
              <User className="h-8 w-8 text-green-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Edit Profile</h3>
              <p className="text-gray-600 text-sm">Update your information</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
          </div>
        </div>

        {/* Password Settings */}
        <Link
          to="/password-settings"
          className="bg-white rounded-xl p-6 shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border border-gray-100 group"
        >
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-lg group-hover:bg-red-200 transition-colors">
              <KeyRound className="h-8 w-8 text-red-600" />
            </div>
            <div className="ml-4 flex-1">
              <h3 className="font-semibold text-gray-900 text-lg">Password</h3>
              <p className="text-gray-600 text-sm">Change your password</p>
            </div>
            <ArrowRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Edit Profile Form */}
      {isEditing && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Update Profile</h2>
            <button
              onClick={handleCancel}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">First Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('first_name', { required: 'First name is required' })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Enter your first name"
                  />
                </div>
                {errors.first_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.first_name.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Last Name *</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('last_name', { required: 'Last name is required' })}
                    className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                    placeholder="Enter your last name"
                  />
                </div>
                {errors.last_name && (
                  <p className="text-red-600 text-sm mt-1">{errors.last_name.message}</p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  {...register('email', {
                    required: 'Email is required',
                    pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
                  })}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="text-red-600 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  {...register('phone')}
                  className="pl-10 w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                  placeholder="Enter your phone number"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-4">
              <button
                type="button"
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={updateMutation.isPending}
                className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {updateMutation.isPending ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Save Changes
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Recent Appointments */}
      {user?.role === 'CITIZEN' && (
        <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 font-serif">Recent Appointments</h2>
            {recentAppointments.length > 0 && (
              <Link 
                to="/mine" 
                className="text-primary-600 hover:text-primary-700 font-medium text-sm flex items-center"
              >
                View all <ArrowRight className="h-4 w-4 ml-1" />
              </Link>
            )}
          </div>

          {appointmentsLoading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Loading appointments...</p>
            </div>
          ) : recentAppointments.length > 0 ? (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div key={appointment.id} className="flex items-center justify-between p-6 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-colors">
                  <div className="flex items-center space-x-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary-600">#{appointment.token_code}</div>
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-lg">{appointment.service_name}</h3>
                      <p className="text-gray-600">
                        {formatDateTime(appointment.appointment_datetime)}
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        Estimated wait: {appointment.predicted_wait_minutes} minutes
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className={getPriorityBadgeClass(appointment.priority)}>
                      {appointment.priority}
                    </span>
                    <span className={getStatusBadgeClass(appointment.status)}>
                      {appointment.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No appointments yet</h3>
              <p className="text-gray-600 mb-6">Get started by booking your first appointment</p>
              <Link to="/book" className="btn-primary">
                Book Appointment
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DashboardPage;