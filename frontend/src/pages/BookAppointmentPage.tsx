import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { Calendar, Clock, AlertCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { servicesApi, appointmentsApi, CreateAppointmentData, AvailableSlot } from '../services/api';

const BookAppointmentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [availableSlots, setAvailableSlots] = useState<AvailableSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CreateAppointmentData>();

  const { data: services, isLoading: servicesLoading } = useQuery({
    queryKey: ['services'],
    queryFn: servicesApi.getForBooking,
  });

  const selectedServiceId = watch('service');
  const selectedService = services?.find(s => s.id === Number(selectedServiceId));

  const generateCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    const days: (Date | null)[] = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) {
      const day = new Date(year, month, i);
      days.push(day >= new Date(new Date().setHours(0, 0, 0, 0)) ? day : null);
    }

    return days;
  };

  const calendarDays = generateCalendarDays(currentMonth);

 useEffect(() => {
  const fetchSlots = async () => {
    setSelectedSlot(null);

    if (selectedServiceId && selectedDate) {
      const pad = (n: number) => n.toString().padStart(2, '0');
      const dateStr = `${selectedDate.getFullYear()}-${pad(selectedDate.getMonth() + 1)}-${pad(selectedDate.getDate())}`;

      try {
        let slots = await appointmentsApi.getAvailableSlots(dateStr, Number(selectedServiceId));

        // 🔥 If selected date is today → filter past times
        const now = new Date();
        const today = new Date();
        today.setHours(0,0,0,0);

        if (selectedDate.toDateString() === today.toDateString()) {
          slots = slots.filter(slot => new Date(slot.datetime) > now);
        }

        setAvailableSlots(slots);
      } catch (error) {
        console.error('Error fetching slots:', error);
        setAvailableSlots([]);
      }
    } else {
      setAvailableSlots([]);
    }
  };

  fetchSlots();
}, [selectedServiceId, selectedDate]);


  const createAppointmentMutation = useMutation({
    mutationFn: appointmentsApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myAppointments'] });
      toast.success(t('booking.success'));
      navigate('/mine');
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.detail || error.response?.data?.message || 'Failed to create appointment';
      toast.error(errorMessage);
    },
  });

  const onSubmit = (data: CreateAppointmentData) => {
    if (!selectedDate || !selectedSlot) {
      toast.error('Please select both date and time slot');
      return;
    }

    const slotData = availableSlots.find(slot => slot.id === selectedSlot);
    if (!slotData) {
      toast.error('Invalid time slot selected');
      return;
    }

    createAppointmentMutation.mutate({
      ...data,
      appointment_datetime: slotData.datetime,
      slot_id: selectedSlot,
    });
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      newMonth.setMonth(prev.getMonth() + (direction === 'next' ? 1 : -1));
      return newMonth;
    });
  };

  const goToToday = () => {
    const today = new Date();
    setCurrentMonth(today);
    setSelectedDate(today);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in px-4 py-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-gray-900 flex justify-center items-center space-x-2">
          <Calendar className="h-8 w-8 text-primary-600" />
          <span>{t('booking.title')}</span>
        </h1>
        <p className="text-gray-600">Schedule your appointment easily and quickly</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Service Selection */}
        <div className="card p-6 shadow-lg rounded-xl space-y-4 bg-white border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700">Service *</label>
          <select
            {...register('service', { required: 'Please select a service', valueAsNumber: true })}
            className="form-select mt-1 w-full border-gray-300 rounded-lg focus:ring focus:ring-primary-200 focus:border-primary-500"
          >
            <option value="">Select a service...</option>
            {services?.map(service => (
              <option key={service.id} value={service.id}>
                {service.name} ({service.department}) - ~{service.avg_service_minutes} min
              </option>
            ))}
          </select>
          {errors.service && <p className="text-red-600 text-sm mt-1">{errors.service.message}</p>}

          {selectedService && (
            <div className="mt-4 bg-primary-50 border border-primary-100 rounded-lg p-4 flex items-start space-x-3">
              <Clock className="h-6 w-6 text-primary-600 mt-1" />
              <div>
                <h4 className="font-semibold text-primary-900">{selectedService.name}</h4>
                <p className="text-sm text-primary-700">Department: {selectedService.department}</p>
                <p className="text-sm text-primary-700">Avg. time: {selectedService.avg_service_minutes} mins</p>
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="card p-6 shadow-lg rounded-xl bg-white border border-gray-100">
          <label className="block text-sm font-semibold text-gray-700 mb-2">Select Date *</label>
          <div className="flex justify-between items-center mb-3">
            <button type="button" onClick={() => navigateMonth('prev')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <h3 className="text-lg font-medium">{currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</h3>
            <button type="button" onClick={() => navigateMonth('next')} className="p-2 hover:bg-gray-100 rounded">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>

          <div className="grid grid-cols-7 text-center text-gray-500 font-medium mb-2">
            {['Su','Mo','Tu','We','Th','Fr','Sa'].map(day => <div key={day}>{day}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, idx) => (
              <button
                key={idx}
                type="button"
                disabled={!day}
                onClick={() => day && handleDateSelect(day)}
                className={`p-2 rounded text-sm transition ${
                  !day ? 'invisible' :
                  selectedDate && day.toDateString() === selectedDate.toDateString() ? 'bg-primary-500 text-white font-semibold shadow-md' :
                  'hover:bg-gray-100'
                }`}
              >
                {day?.getDate()}
              </button>
            ))}
          </div>

          <div className="flex justify-between items-center mt-2">
            <button type="button" onClick={goToToday} className="text-sm text-primary-600 hover:text-primary-700">Today</button>
            {selectedDate && <span className="text-sm text-gray-600">Selected: {selectedDate.toLocaleDateString()}</span>}
          </div>
        </div>

        {/* Time Slots */}
        {selectedDate && (
          <div className="card p-6 shadow-lg rounded-xl bg-white border border-gray-100">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Available Time Slots</label>
            {availableSlots.length > 0 ? (
              <div className="grid grid-cols-2 gap-3">
                {availableSlots.map(slot => (
                  <button
                    key={slot.id}
                    type="button"
                    onClick={() => setSelectedSlot(slot.id)}
                    className={`p-3 rounded-lg border transition text-sm font-medium ${
                      selectedSlot === slot.id ? 'bg-primary-100 border-primary-500 text-primary-700 shadow-md' :
                      'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <div>{new Date(slot.datetime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                    <div className="text-xs text-gray-500 mt-1">{slot.current_bookings}/{slot.max_capacity} booked</div>
                  </button>
                ))}
              </div>
            ) : (
              <p className="text-yellow-700 bg-yellow-50 border border-yellow-200 p-3 rounded">No available slots for this date.</p>
            )}
          </div>
        )}

        {/* Priority & Notes */}
        <div className="card p-6 shadow-lg rounded-xl bg-white border border-gray-100 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">Priority *</label>
            <select
              {...register('priority', { required: 'Please select priority' })}
              className="form-select mt-1 w-full border-gray-300 rounded-lg focus:ring focus:ring-primary-200 focus:border-primary-500"
            >
              <option value="">Select priority...</option>
              <option value="NORMAL">{t('booking.priorities.NORMAL')}</option>
              <option value="ELDERLY">{t('booking.priorities.ELDERLY')}</option>
              <option value="DISABLED">{t('booking.priorities.DISABLED')}</option>
              <option value="EMERGENCY">{t('booking.priorities.EMERGENCY')}</option>
            </select>
            {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">Notes</label>
            <textarea
              rows={3}
              {...register('notes')}
              className="form-input mt-1 w-full border-gray-300 rounded-lg focus:ring focus:ring-primary-200 focus:border-primary-500"
              placeholder="Any additional information or special requests..."
            />
          </div>
        </div>

        {/* Info Card */}
        <div className="card p-6 shadow-lg rounded-xl bg-amber-50 border border-amber-200 flex space-x-3 items-start">
          <AlertCircle className="h-6 w-6 text-amber-600 mt-1" />
          <div className="text-sm text-amber-700">
            <h4 className="font-semibold mb-1">Important Information:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>You will receive an email confirmation with your token number</li>
              <li>Please arrive at least 15 minutes before your scheduled time</li>
              <li>Wait times are estimated using AI and may vary</li>
              <li>Emergency cases will be prioritized</li>
            </ul>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-end space-x-4">
          <button type="button" onClick={() => navigate('/mine')} className="btn-outline px-6 py-2 rounded-lg font-medium hover:bg-gray-50">
            {t('common.cancel')}
          </button>
          <button
            type="submit"
            disabled={createAppointmentMutation.isPending || servicesLoading || !selectedDate || !selectedSlot}
            className="btn-primary px-6 py-2 rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createAppointmentMutation.isPending ? 'Booking...' : t('booking.book')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BookAppointmentPage;
