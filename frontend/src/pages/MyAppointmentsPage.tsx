import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Calendar, Clock, Plus, AlertCircle } from "lucide-react";
import { appointmentsApi } from "../services/api";

const MyAppointmentsPage: React.FC = () => {
  const { t } = useTranslation();

  const {
    data: appointments,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["myAppointments"],
    queryFn: appointmentsApi.getMine,
    
  });
console.log(appointments);
  const getStatusBadgeClass = (status: string) => {
    const statusClasses: { [key: string]: string } = {
      SCHEDULED: "badge-primary",
      WAITING: "badge-warning",
      IN_PROGRESS: "badge-secondary",
      COMPLETED: "badge-success",
      CANCELLED: "badge-error",
      NO_SHOW: "badge-gray",
    };
    return statusClasses[status] || "badge-gray";
  };

  const getPriorityBadgeClass = (priority: string) => {
    const priorityClasses: { [key: string]: string } = {
      NORMAL: "priority-normal badge",
      ELDERLY: "priority-elderly badge",
      DISABLED: "priority-disabled badge",
      EMERGENCY: "priority-emergency badge",
    };
    return priorityClasses[priority] || "badge-gray";
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
      }),
      time: date.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="loading-spinner h-10 w-10 mx-auto mb-4"></div>
          <p className="text-gray-600">{t("common.loading")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card text-center py-12 shadow-lg rounded-xl bg-white border border-gray-100">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Error loading appointments
        </h3>
        <p className="text-gray-600">
          Please try again later or contact support if the problem persists.
        </p>
      </div>
    );
  }

  return (
    <div className="animate-fade-in max-w-4xl mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <Calendar className="h-8 w-8 text-primary-600" />
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {t("appointments.title")}
            </h1>
            <p className="text-gray-600">
              Track and manage your scheduled appointments
            </p>
          </div>
        </div>
        <Link to="/book" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>{t("nav.book")}</span>
        </Link>
      </div>

      {appointments && appointments.length > 0 ? (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const { date, time } = formatDateTime(
              appointment.appointment_datetime
            );
            const estimatedCompletion = formatDateTime(
              appointment.estimated_completion_time
            );

            return (
              <div
                key={appointment.id}
                className="card shadow-lg rounded-xl border border-gray-100 hover:shadow-xl transition p-5 bg-white"
              >
                <div className="flex flex-col md:flex-row md:justify-between gap-4">
                  {/* Left: Token & Service */}
                  <div className="flex items-start space-x-4">
                    <div className="bg-primary-100 text-primary-700 font-bold rounded-lg p-3 text-center min-w-[80px]">
                      <div className="text-xs">TOKEN</div>
                      <div className="text-lg">#{appointment.token_code}</div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.service_name}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                        <Calendar className="h-4 w-4" />
                        <span>
                          {date} at {time}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2 mt-1 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>
                          Wait: ~{appointment.predicted_wait_minutes}{" "}
                          {t("common.minutes")}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Right: Status & Priority */}
                  <div className="flex flex-col items-end space-y-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeClass(
                        appointment.status
                      )}`}
                    >
                      {t(`appointments.statuses.${appointment.status}`)}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${getPriorityBadgeClass(
                        appointment.priority
                      )}`}
                    >
                      {t(`booking.priorities.${appointment.priority}`)}
                    </span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="mt-4 bg-gray-50 p-4 rounded-lg text-sm grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="font-medium text-gray-700">
                      Estimated Completion:
                    </span>
                    <div className="text-gray-600">
                      {estimatedCompletion.date} at {estimatedCompletion.time}
                    </div>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">
                      Booked on:
                    </span>
                    <div className="text-gray-600">
                      {new Date(appointment.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  {appointment.notes && (
                    <div className="md:col-span-2 border-t border-gray-200 pt-2 mt-2">
                      <span className="font-medium text-gray-700">Notes:</span>
                      <p className="text-gray-600 mt-1">{appointment.notes}</p>
                    </div>
                  )}
                  {appointment.qr_code_url && (
                    <img
                      src={`http://localhost:8000${appointment.qr_code_url}`} 
                      alt="QR Code"
                      className="w-32 h-32 rounded shadow object-contain"
                    />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="card text-center py-16 shadow-lg rounded-xl bg-white border border-gray-100">
          <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {t("appointments.noAppointments")}
          </h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            You haven't booked any appointments yet. Start by scheduling your
            first appointment.
          </p>
          <Link
            to="/book"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Calendar className="h-4 w-4" />
            <span>{t("nav.book")}</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default MyAppointmentsPage;
