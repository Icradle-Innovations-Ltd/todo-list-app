import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { FaUser, FaEnvelope, FaLock, FaEye, FaEyeSlash, FaTasks, FaHome, FaSignInAlt, FaUserPlus } from 'react-icons/fa';
import useAuthStore from '../../store/authStore';

const SignupForm = ({ darkMode }) => {
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors }, watch, setError } = useForm();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, isLoading, error, clearError } = useAuthStore();
  
  const onSubmit = async (data) => {
    // Clear any previous errors
    clearError();
    
    // Check if passwords match
    if (data.password !== data.confirmPassword) {
      setError('confirmPassword', { 
        type: 'manual', 
        message: 'Passwords do not match' 
      });
      return;
    }
    
    // Remove confirmPassword and terms from data before sending to API
    const { confirmPassword, terms, ...userData } = data;
    
    // Register the user
    const result = await registerUser(userData);
    
    if (result.success) {
      // Redirect to dashboard on successful registration
      navigate('/dashboard');
    }
  };
  
  return (
    <div className={`w-full max-w-md mx-auto ${darkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'} rounded-lg shadow-lg p-8`}>
      {/* Navigation Tabs */}
      <div className="flex mb-8 border-b border-gray-200 dark:border-gray-700">
        <Link 
          to="/" 
          className="flex items-center mr-6 pb-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <FaHome className="mr-2" />
          <span>Home</span>
        </Link>
        <Link 
          to="/login" 
          className="flex items-center mr-6 pb-4 text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
        >
          <FaSignInAlt className="mr-2" />
          <span>Login</span>
        </Link>
        <div 
          className="flex items-center pb-4 border-b-2 border-blue-600 font-medium text-blue-600"
        >
          <FaUserPlus className="mr-2" />
          <span>Sign Up</span>
        </div>
      </div>
      
      <div className="flex items-center justify-center mb-6">
        <FaTasks className="text-blue-600 text-3xl mr-2" />
        <h2 className="text-2xl font-bold text-center bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
          Create Your Account
        </h2>
      </div>
      
      {error && (
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 dark:border-red-700 text-red-700 dark:text-red-400 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Username Field */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="username">
            Username <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaUser className="text-gray-400" />
            </div>
            <input
              id="username"
              type="text"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.username 
                  ? 'border-red-500' 
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Enter your username"
              {...register('username', { 
                required: 'Username is required',
                minLength: {
                  value: 3,
                  message: 'Username must be at least 3 characters'
                }
              })}
            />
          </div>
          {errors.username && (
            <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>
          )}
        </div>
        
        {/* Email Field */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="email">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaEnvelope className="text-gray-400" />
            </div>
            <input
              id="email"
              type="email"
              className={`w-full pl-10 pr-3 py-2 rounded-lg border ${
                errors.email 
                  ? 'border-red-500' 
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
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
        
        {/* Name Fields - Side by Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name Field */}
          <div>
            <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="firstName">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your first name"
              {...register('firstName')}
            />
          </div>
          
          {/* Last Name Field */}
          <div>
            <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="lastName">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className={`w-full px-3 py-2 rounded-lg border ${
                darkMode ? 'border-gray-600 bg-gray-700 text-white' : 'border-gray-300 bg-white text-gray-800'
              } focus:outline-none focus:ring-2 focus:ring-blue-500`}
              placeholder="Enter your last name"
              {...register('lastName')}
            />
          </div>
        </div>
        
        {/* Password Field */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="password">
            Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.password 
                  ? 'border-red-500' 
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Enter your password"
              {...register('password', { 
                required: 'Password is required',
                minLength: {
                  value: 6,
                  message: 'Password must be at least 6 characters'
                }
              })}
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 flex items-center pr-3"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" />
              ) : (
                <FaEye className="text-gray-400" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
          )}
        </div>
        
        {/* Confirm Password Field */}
        <div>
          <label className={`block ${darkMode ? 'text-gray-200' : 'text-gray-700'} text-sm font-bold mb-2`} htmlFor="confirmPassword">
            Confirm Password <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FaLock className="text-gray-400" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className={`w-full pl-10 pr-10 py-2 rounded-lg border ${
                errors.confirmPassword 
                  ? 'border-red-500' 
                  : darkMode ? 'border-gray-600 bg-gray-700' : 'border-gray-300 bg-white'
              } focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                darkMode ? 'text-white' : 'text-gray-800'
              }`}
              placeholder="Confirm your password"
              {...register('confirmPassword', { 
                required: 'Please confirm your password',
                validate: value => value === watch('password') || 'Passwords do not match'
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
        
        {/* Terms and Conditions */}
        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              id="terms"
              type="checkbox"
              className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 dark:bg-gray-700 dark:border-gray-600 dark:focus:ring-blue-600"
              {...register('terms', { required: 'You must agree to the terms and conditions' })}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="terms" className={`${darkMode ? 'text-gray-300' : 'text-gray-500'}`}>
              I agree to the <a href="#" className="text-blue-600 hover:underline dark:text-blue-500">terms and conditions</a>
            </label>
            {errors.terms && (
              <p className="text-red-500 text-xs mt-1">{errors.terms.message}</p>
            )}
          </div>
        </div>
        
        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-300 ease-in-out transform hover:-translate-y-1 shadow-lg mt-6"
        >
          {isLoading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Account...
            </div>
          ) : 'Create Account'}
        </button>
      </form>
      
      <div className="mt-8 text-center">
        <p className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;