import React, { useState } from "react";
import { Eye, EyeOff, CheckCircle, XCircle, KeyRound } from "lucide-react";
import { toast } from "react-toastify";
import { useMutation } from "@tanstack/react-query";
import { authApi } from "../services/api";

interface PasswordFormData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

const PasswordSettings: React.FC = () => {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<PasswordFormData>({
    current_password: "",
    new_password: "",
    confirm_password: "",
  });

  const [passwordStrength, setPasswordStrength] = useState({
    hasMinLength: false,
    hasUpperCase: false,
    hasLowerCase: false,
    hasNumber: false,
    hasSpecialChar: false,
  });

  const validatePassword = (password: string) => {
    setPasswordStrength({
      hasMinLength: password.length >= 8,
      hasUpperCase: /[A-Z]/.test(password),
      hasLowerCase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    });
  };

  const handleInputChange = (field: keyof PasswordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (field === "new_password") validatePassword(value);
  };

  const passwordMutation = useMutation({
    mutationFn: (data: {
      old_password: string;
      new_password1: string;
      new_password2: string;
    }) => authApi.updatePassword(data),
    onSuccess: () => {
      toast.success("Password updated successfully!");
      setFormData({
        current_password: "",
        new_password: "",
        confirm_password: "",
      });
      setPasswordStrength({
        hasMinLength: false,
        hasUpperCase: false,
        hasLowerCase: false,
        hasNumber: false,
        hasSpecialChar: false,
      });
    },
    onError: (error: any) => {
      const messages = error.response?.data?.errors
        ? Object.values(error.response.data.errors).flat().join(" ")
        : "Failed to update password";
      toast.error(messages);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.current_password ||
      !formData.new_password ||
      !formData.confirm_password
    ) {
      toast.error("All fields are required");
      return;
    }

    if (formData.new_password !== formData.confirm_password) {
      toast.error("New passwords do not match");
      return;
    }

    if (!isPasswordStrong) {
      toast.error("Please choose a stronger password");
      return;
    }

    passwordMutation.mutate({
      old_password: formData.current_password,
      new_password1: formData.new_password,
      new_password2: formData.confirm_password,
    });
  };

  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);
  const passwordScore = Object.values(passwordStrength).filter(Boolean).length;

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-lg border border-gray-100">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary-100 rounded-full mb-4">
          <KeyRound className="h-8 w-8 text-primary-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Change Password</h2>
        <p className="text-gray-600 mt-2">Update your account password</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Current Password */}
        <div>
          <label
            htmlFor="current_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Current Password
          </label>
          <div className="relative">
            <input
              id="current_password"
              type={showCurrentPassword ? "text" : "password"}
              value={formData.current_password}
              onChange={(e) =>
                handleInputChange("current_password", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-12"
              placeholder="Enter your current password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
        </div>

        {/* New Password */}
        <div>
          <label
            htmlFor="new_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            New Password
          </label>
          <div className="relative">
            <input
              id="new_password"
              type={showNewPassword ? "text" : "password"}
              value={formData.new_password}
              onChange={(e) =>
                handleInputChange("new_password", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-12"
              placeholder="Enter your new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>

          {/* Strength Meter */}
          {formData.new_password && (
            <div className="mt-3 space-y-2">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className="h-2 rounded-full transition-all duration-300"
                  style={{
                    width: `${(passwordScore / 5) * 100}%`,
                    backgroundColor:
                      passwordScore === 5
                        ? "#10B981"
                        : passwordScore >= 3
                        ? "#F59E0B"
                        : "#EF4444",
                  }}
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                {[
                  {
                    check: passwordStrength.hasMinLength,
                    label: "At least 8 characters",
                  },
                  {
                    check: passwordStrength.hasUpperCase,
                    label: "Uppercase letter",
                  },
                  {
                    check: passwordStrength.hasLowerCase,
                    label: "Lowercase letter",
                  },
                  { check: passwordStrength.hasNumber, label: "Number" },
                  {
                    check: passwordStrength.hasSpecialChar,
                    label: "Special character",
                  },
                ].map((item, idx) => (
                  <div key={idx} className="flex items-center">
                    {item.check ? (
                      <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 text-gray-400 mr-2" />
                    )}
                    <span
                      className={
                        item.check ? "text-green-600" : "text-gray-500"
                      }
                    >
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label
            htmlFor="confirm_password"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Confirm New Password
          </label>
          <div className="relative">
            <input
              id="confirm_password"
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirm_password}
              onChange={(e) =>
                handleInputChange("confirm_password", e.target.value)
              }
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent transition pr-12"
              placeholder="Confirm your new password"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <EyeOff className="h-5 w-5 text-gray-400" />
              ) : (
                <Eye className="h-5 w-5 text-gray-400" />
              )}
            </button>
          </div>
          {formData.confirm_password &&
            formData.new_password !== formData.confirm_password && (
              <p className="text-red-600 text-sm mt-1">
                Passwords do not match
              </p>
            )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={
            passwordMutation.isPending ||
            !isPasswordStrong ||
            formData.new_password !== formData.confirm_password
          }
          className="w-full bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {passwordMutation.isPending ? "Updating..." : "Update Password"}
        </button>
      </form>

      {/* Security Tips */}
      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-semibold text-blue-900 mb-2">Password Tips</h3>
        <ul className="text-sm text-blue-700 space-y-1">
          <li>• Use a unique password that you don't use elsewhere</li>
          <li>• Avoid common words and personal information</li>
          <li>• Consider using a password manager</li>
          <li>• Change your password regularly</li>
        </ul>
      </div>
    </div>
  );
};

export default PasswordSettings;
