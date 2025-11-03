import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { 
  BarChart3, 
  Users, 
  Clock, 
  AlertCircle,
  RefreshCw,
  Calendar,
  CheckCircle,
  XCircle,
  TrendingUp,
  UserCheck,
  Shield
} from 'lucide-react';
import { appointmentsApi, opsApi } from '../services/api';

const AdminDashboard: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [newStatus, setNewStatus] = useState<string>('');

  // Fetch data
  const { data: analytics } = useQuery({
    queryKey: ['analytics'],
    queryFn: opsApi.getAnalytics,
    refetchInterval: 30000,
  });

  const { data: allAppointments, isLoading: appointmentsLoading } = useQuery({
    queryKey: ['allAppointments'],
    queryFn: appointmentsApi.getAll,
    refetchInterval: 30000,
  });

  const { data: queueStatus } = useQuery({
    queryKey: ['queueStatus'],
    queryFn: appointmentsApi.getQueueStatus,
    refetchInterval: 15000,
  });

  // Update status mutation
  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      appointmentsApi.updateStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
      queryClient.invalidateQueries({ queryKey: ['queueStatus'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
      toast.success('Status updated successfully');
      setSelectedAppointment(null);
      setNewStatus('');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.error || 'Failed to update status');
    },
  });

  const handleStatusUpdate = () => {
    if (selectedAppointment && newStatus) {
      updateStatusMutation.mutate({
        id: selectedAppointment,
        status: newStatus,
      });
    }
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
    return `px-2 py-1 rounded-full text-xs font-medium ${statusClasses[status]}`;
  };

  const getPriorityBadgeClass = (priority: string) => {
    const priorityClasses: { [key: string]: string } = {
      'NORMAL': 'bg-gray-100 text-gray-800',
      'ELDERLY': 'bg-orange-100 text-orange-800',
      'DISABLED': 'bg-indigo-100 text-indigo-800',
      'EMERGENCY': 'bg-red-100 text-red-800',
    };
    return `px-2 py-1 rounded-full text-xs font-medium ${priorityClasses[priority]}`;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'COMPLETED':
        return <CheckCircle className="h-4 w-4" />;
      case 'CANCELLED':
      case 'NO_SHOW':
        return <XCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="animate-fade-in space-y-8 p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-gradient-to-r from-primary-600 to-primary-800 p-3 rounded-xl">
              <Shield className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 font-serif">
                {t('admin.title')}
              </h1>
              <p className="text-gray-600 mt-1">
                Monitor queue status and manage appointments
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              queryClient.invalidateQueries({ queryKey: ['analytics'] });
              queryClient.invalidateQueries({ queryKey: ['allAppointments'] });
              queryClient.invalidateQueries({ queryKey: ['queueStatus'] });
              toast.info('Data refreshed');
            }}
            className="btn-outline flex items-center space-x-2 border-gray-300 hover:border-primary-400"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Analytics Cards */}
      {analytics && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Today's Appointments</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.total_today}</p>
                <p className="text-xs text-green-600 mt-2 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12% from yesterday
                </p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Calendar className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Completed Today</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.completed_today}</p>
                <p className="text-xs text-gray-500 mt-2">Avg. completion time: 15min</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Current Queue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.current_queue_length}</p>
                <p className="text-xs text-yellow-600 mt-2 flex items-center">
                  <Clock className="h-3 w-3 mr-1" />
                  Avg. wait: 25min
                </p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Users className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total All Time</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{analytics.total_appointments_all_time}</p>
                <p className="text-xs text-gray-500 mt-2">Since system launch</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-lg">
                <BarChart3 className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Queue Status */}
      {queueStatus && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Waiting Queue */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Clock className="h-5 w-5 text-yellow-600 mr-2" />
                Waiting Queue
              </h3>
              <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                {queueStatus.total_waiting} waiting
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {queueStatus.waiting_queue.length > 0 ? (
                queueStatus.waiting_queue.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-yellow-50 rounded-xl border border-yellow-100 hover:bg-yellow-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-yellow-200 p-2 rounded-lg">
                        <Clock className="h-5 w-5 text-yellow-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">#{appointment.token_code}</div>
                        <div className="text-sm text-gray-600">{appointment.service_name}</div>
                        <div className="text-xs text-gray-500">{appointment.citizen_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={getPriorityBadgeClass(appointment.priority)}>
                        {appointment.priority}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDateTime(appointment.appointment_datetime)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments waiting</p>
                  <p className="text-sm mt-1">All appointments are being processed</p>
                </div>
              )}
            </div>
          </div>

          {/* In Progress */}
          <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                <Users className="h-5 w-5 text-purple-600 mr-2" />
                In Progress
              </h3>
              <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                {queueStatus.total_in_progress} in progress
              </span>
            </div>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {queueStatus.in_progress.length > 0 ? (
                queueStatus.in_progress.map((appointment: any) => (
                  <div key={appointment.id} className="flex items-center justify-between p-4 bg-purple-50 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                    <div className="flex items-center space-x-4">
                      <div className="bg-purple-200 p-2 rounded-lg">
                        <Users className="h-5 w-5 text-purple-700" />
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">#{appointment.token_code}</div>
                        <div className="text-sm text-gray-600">{appointment.service_name}</div>
                        <div className="text-xs text-gray-500">{appointment.citizen_name}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className={getPriorityBadgeClass(appointment.priority)}>
                        {appointment.priority}
                      </div>
                      <div className="text-xs text-gray-500 mt-2">
                        {formatDateTime(appointment.appointment_datetime)}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <UserCheck className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                  <p>No appointments in progress</p>
                  <p className="text-sm mt-1">Waiting for appointments to start</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* All Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm p-6 border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">
            {t('admin.allAppointments')}
          </h3>
          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
            {allAppointments?.length || 0} total
          </span>
        </div>
        
        {appointmentsLoading ? (
          <div className="text-center py-12">
            <div className="loading-spinner h-8 w-8 mx-auto mb-4 border-2 border-primary-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading appointments...</p>
          </div>
        ) : allAppointments && allAppointments.length > 0 ? (
          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Token
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Citizen
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Service
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Priority
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {allAppointments.slice(0, 10).map((appointment) => (
                  <tr key={appointment.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900 text-sm">
                        #{appointment.token_code}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.citizen.first_name} {appointment.citizen.last_name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.citizen.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {appointment.service.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {appointment.service.department}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDateTime(appointment.appointment_datetime)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={getPriorityBadgeClass(appointment.priority)}>
                        {appointment.priority}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className={getStatusBadgeClass(appointment.status)}>
                          {appointment.status}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={() => {
                          setSelectedAppointment(appointment.id);
                          setNewStatus(appointment.status);
                        }}
                        className="text-primary-600 hover:text-primary-700 text-sm font-medium hover:underline"
                      >
                        Update Status
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <AlertCircle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 text-lg mb-2">No appointments found</p>
            <p className="text-gray-500 text-sm">There are no appointments in the system yet</p>
          </div>
        )}
      </div>

      {/* Status Update Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-xl">
            <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <RefreshCw className="h-5 w-5 mr-2 text-primary-600" />
              Update Appointment Status
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select New Status
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition"
                >
                  <option value="SCHEDULED">Scheduled</option>
                  <option value="WAITING">Waiting</option>
                  <option value="IN_PROGRESS">In Progress</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                  <option value="NO_SHOW">No Show</option>
                </select>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => {
                  setSelectedAppointment(null);
                  setNewStatus('');
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium rounded-lg border border-gray-300 hover:border-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleStatusUpdate}
                disabled={updateStatusMutation.isPending}
                className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition disabled:opacity-50"
              >
                {updateStatusMutation.isPending ? (
                  <span className="flex items-center">
                    <div className="loading-spinner h-4 w-4 mr-2 border-white"></div>
                    Updating...
                  </span>
                ) : (
                  'Update Status'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;