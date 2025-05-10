import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaLock, FaEye, FaEyeSlash, FaKey, FaSpinner } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const ChangePassword = () => {
  const { changePassword, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  
  const onSubmit = async (data) => {
    // Clear any previous messages
    clearError();
    setSuccessMessage('');
    
    // Check if new password and confirm password match
    if (data.newPassword !== data.confirmPassword) {
      return;
    }
    
    // Change the password
    const result = await changePassword({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword
    });
    
    if (result.success) {
      setSuccessMessage('Password changed successfully');
      reset(); // Clear the form
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Change Password</h2>
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {successMessage}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Current Password Field */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="currentPassword">
            Current Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaKey className="text-gray-400" />
            </div>
            <input
              id="currentPassword"
              type={showCurrentPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.currentPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your current password"
              {...register('currentPassword', { required: 'Current password is required' })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              {showCurrentPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>
          {errors.currentPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.currentPassword.message}</p>
          )}
        </div>
        
        {/* New Password Field */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="newPassword">
            New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.newPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your new password"
              {...register('newPassword', { 
                required: 'New password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              {showNewPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.newPassword.message}</p>
          )}
        </div>
        
        {/* Confirm New Password Field */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
            Confirm New Password
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Confirm your new password"
              {...register('confirmPassword', { 
                required: 'Please confirm your new password',
                validate: value => value === watch('newPassword') || 'Passwords do not match'
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
          )}
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="flex items-center justify-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out"
        >
          {isLoading ? (
            <>
              <FaSpinner className="animate-spin mr-2" />
              Changing Password...
            </>
          ) : (
            <>
              <FaKey className="mr-2" />
              Change Password
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ChangePassword;