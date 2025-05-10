import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { FaUser, FaEnvelope, FaSave, FaSpinner } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const UserProfile = () => {
  const { user, updateProfile, isLoading, error, clearError } = useAuthStore();
  const [successMessage, setSuccessMessage] = useState('');
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      email: user?.email || '',
      theme: user?.theme || 'light'
    }
  });
  
  // Reset form when user data changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        theme: user.theme || 'light'
      });
    }
  }, [user, reset]);
  
  const onSubmit = async (data) => {
    // Clear any previous messages
    clearError();
    setSuccessMessage('');
    
    // Update the profile
    const result = await updateProfile(data);
    
    if (result.success) {
      setSuccessMessage('Profile updated successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    }
  };
  
  if (!user) {
    return (
      <div className="flex justify-center items-center h-64">
        <FaSpinner className="animate-spin text-blue-500 text-4xl" />
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Your Profile</h2>
      
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
      
      <div className="flex items-center mb-6">
        <div className="w-20 h-20 bg-gray-200 rounded-full flex items-center justify-center mr-4">
          {user.profilePicture ? (
            <img 
              src={user.profilePicture} 
              alt={`${user.username}'s profile`} 
              className="w-full h-full rounded-full object-cover"
            />
          ) : (
            <FaUser className="text-gray-400 text-3xl" />
          )}
        </div>
        <div>
          <h3 className="text-xl font-semibold text-gray-800">{user.username}</h3>
          <p className="text-gray-500">Member since {new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* First Name Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.firstName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your first name"
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className="text-red-500 text-xs mt-1">{errors.firstName.message}</p>
            )}
          </div>
          
          {/* Last Name Field */}
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                errors.lastName ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your last name"
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className="text-red-500 text-xs mt-1">{errors.lastName.message}</p>
            )}
          </div>
        </div>
        
        {/* Email Field */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
            Email
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your email"
              {...register('email', { 
                required: 'Email is required',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Invalid email address'
                }
              })}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>
        
        {/* Theme Preference */}
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Theme Preference
          </label>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="light"
                {...register('theme')}
                className="form-radio h-4 w-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700">Light</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                value="dark"
                {...register('theme')}
                className="form-radio h-4 w-4 text-blue-500"
              />
              <span className="ml-2 text-gray-700">Dark</span>
            </label>
          </div>
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
              Saving...
            </>
          ) : (
            <>
              <FaSave className="mr-2" />
              Save Changes
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default UserProfile;