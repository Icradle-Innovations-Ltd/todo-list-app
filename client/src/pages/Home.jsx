import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  FaTasks, 
  FaSignInAlt, 
  FaUserPlus, 
  FaChartBar, 
  FaCheckCircle, 
  FaMobileAlt, 
  FaLock, 
  FaCalendarAlt, 
  FaBell, 
  FaCloudUploadAlt,
  FaMoon,
  FaSun,
  FaArrowRight
} from 'react-icons/fa';
import useAuthStore from '../store/authStore';

const Home = ({ darkMode, setDarkMode }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Redirect to dashboard if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  // Toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };
  
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-md sticky top-0 z-50`}>
        <div className="container mx-auto flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <FaTasks className="text-blue-600 text-2xl" />
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaskMaster</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <Link
              to="/login"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300"
            >
              <FaSignInAlt />
              <span>Login</span>
            </Link>
            <Link
              to="/signup"
              className="flex items-center space-x-1 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 text-white hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg"
            >
              <FaUserPlus />
              <span>Sign Up</span>
            </Link>
          </div>
          
          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 mr-4 rounded-full ${darkMode ? 'bg-gray-700 text-yellow-400' : 'bg-gray-100 text-gray-700'}`}
              aria-label="Toggle dark mode"
            >
              {darkMode ? <FaSun /> : <FaMoon />}
            </button>
            
            <button
              onClick={toggleMenu}
              className={`p-2 rounded-lg ${darkMode ? 'text-white' : 'text-gray-800'}`}
              aria-label="Toggle menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className={`md:hidden mt-4 py-4 px-6 rounded-lg shadow-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex flex-col space-y-4">
              <Link
                to="/login"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-blue-600 text-blue-600"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaSignInAlt />
                <span>Login</span>
              </Link>
              <Link
                to="/signup"
                className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-blue-600 text-white"
                onClick={() => setIsMenuOpen(false)}
              >
                <FaUserPlus />
                <span>Sign Up</span>
              </Link>
            </div>
          </div>
        )}
      </header>
      
      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 md:py-32">
        {/* Background Elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
          <div className={`absolute top-0 right-0 w-1/3 h-1/3 rounded-full ${darkMode ? 'bg-blue-900/20' : 'bg-blue-200/40'} blur-3xl transform translate-x-1/4 -translate-y-1/4`}></div>
          <div className={`absolute bottom-0 left-0 w-1/2 h-1/2 rounded-full ${darkMode ? 'bg-indigo-900/20' : 'bg-indigo-200/40'} blur-3xl transform -translate-x-1/4 translate-y-1/4`}></div>
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-12 md:mb-0 md:pr-12">
              <div className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 text-sm font-medium mb-6">
                Boost Your Productivity
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold mb-6 leading-tight">
                <span className="block">Organize Your Tasks</span>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Achieve Your Goals</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 text-gray-600 dark:text-gray-300 max-w-xl">
                TaskMaster helps you organize your tasks, track your progress, and boost your productivity with powerful features and intuitive design.
              </p>
              <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
                <Link
                  to="/signup"
                  className="flex items-center justify-center space-x-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg transform hover:-translate-y-1"
                >
                  <span className="font-medium">Get Started Free</span>
                  <FaArrowRight />
                </Link>
                <Link
                  to="/login"
                  className="flex items-center justify-center space-x-2 px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition duration-300"
                >
                  <span className="font-medium">Login</span>
                </Link>
              </div>
              
              {/* Social Proof */}
              <div className="mt-12">
                <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Trusted by thousands of users</p>
                <div className="flex items-center space-x-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                  <span className="ml-2 text-gray-600 dark:text-gray-300 font-medium">4.9/5 from over 1,000+ reviews</span>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 relative">
              {/* Dashboard Preview Image */}
              <div className={`relative rounded-xl overflow-hidden shadow-2xl ${darkMode ? 'shadow-blue-500/10' : 'shadow-blue-500/20'} transform md:rotate-2 hover:rotate-0 transition-transform duration-500`}>
                <img 
                  src="https://placehold.co/800x600/2563eb/FFFFFF/png?text=TaskMaster+Dashboard&font=Montserrat" 
                  alt="TaskMaster Dashboard" 
                  className="w-full rounded-xl"
                />
                
                {/* Floating Elements */}
                <div className={`absolute -bottom-6 -left-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform rotate-6`}>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="text-sm font-medium">Tasks Completed</span>
                  </div>
                  <div className="text-2xl font-bold">12/15</div>
                </div>
                
                <div className={`absolute -top-4 -right-4 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg transform -rotate-3`}>
                  <div className="flex items-center space-x-2">
                    <FaCheckCircle className="text-green-500" />
                    <span className="text-sm font-medium">Productivity</span>
                  </div>
                  <div className="text-2xl font-bold">+27%</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Features Section */}
      <section className={`py-20 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Powerful Features for Your Productivity</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              TaskMaster comes packed with all the tools you need to organize your work and life.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-6">
                <FaTasks className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Intuitive Task Management</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Create, organize, and track your tasks with ease. Set priorities, due dates, and categories to stay on top of your workload.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Drag-and-drop organization</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Priority levels</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Custom categories</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 2 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-indigo-100 text-indigo-600 mb-6">
                <FaChartBar className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Detailed Analytics</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Visualize your productivity with interactive charts and statistics. Monitor your progress and identify patterns.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Productivity trends</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Completion rate tracking</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Time management insights</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 3 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-6">
                <FaCalendarAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Scheduling</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Plan your days effectively with our intelligent scheduling system. Never miss a deadline again.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Recurring tasks</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Due date reminders</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Calendar integration</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 4 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-6">
                <FaBell className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Smart Notifications</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Stay on track with customizable notifications. Get reminded about upcoming deadlines and important tasks.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Custom notification schedules</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Priority-based alerts</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Daily summaries</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 5 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 text-red-600 mb-6">
                <FaMobileAlt className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Cross-Platform Access</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Access your tasks from anywhere. Our responsive design works seamlessly across all your devices.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Mobile-friendly interface</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Real-time synchronization</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Offline capabilities</span>
                </li>
              </ul>
            </div>
            
            {/* Feature 6 */}
            <div className={`p-8 rounded-xl shadow-lg ${darkMode ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-50 hover:bg-white'} transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 text-yellow-600 mb-6">
                <FaLock className="text-2xl" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure Data Storage</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Your data is always safe with us. We use industry-standard encryption to protect your information.
              </p>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>End-to-end encryption</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Regular backups</span>
                </li>
                <li className="flex items-center">
                  <FaCheckCircle className="text-green-500 mr-2" />
                  <span>Privacy controls</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
      
      {/* Testimonials Section */}
      <section className="py-20">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
              Thousands of users love TaskMaster for its simplicity and effectiveness.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Testimonial 1 */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "TaskMaster has completely transformed how I manage my work. The intuitive interface and powerful features make it easy to stay organized and focused."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                  <span className="text-blue-600 font-bold">JD</span>
                </div>
                <div>
                  <h4 className="font-bold">John Doe</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Product Manager</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 2 */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "As a freelancer juggling multiple projects, TaskMaster has been a game-changer. The analytics help me understand where my time goes and how to improve."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mr-4">
                  <span className="text-purple-600 font-bold">JS</span>
                </div>
                <div>
                  <h4 className="font-bold">Jane Smith</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Freelance Designer</p>
                </div>
              </div>
            </div>
            
            {/* Testimonial 3 */}
            <div className={`p-6 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
              <div className="flex items-center space-x-1 mb-4">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg key={star} className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6 italic">
                "Our team's productivity increased by 35% after switching to TaskMaster. The collaborative features and clear task assignments make teamwork seamless."
              </p>
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mr-4">
                  <span className="text-green-600 font-bold">RJ</span>
                </div>
                <div>
                  <h4 className="font-bold">Robert Johnson</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Team Lead</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className={`py-20 ${darkMode ? 'bg-gradient-to-r from-blue-900 to-indigo-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50'}`}>
        <div className="container mx-auto px-6 text-center">
          <div className={`max-w-4xl mx-auto p-10 rounded-2xl shadow-2xl ${darkMode ? 'bg-gray-800/80 backdrop-blur-sm' : 'bg-white/90 backdrop-blur-sm'}`}>
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Transform Your Productivity?</h2>
            <p className="text-xl mb-10 text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Join thousands of users who are already managing their tasks efficiently with TaskMaster. Start your journey today!
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
              <Link
                to="/signup"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition duration-300 shadow-lg text-lg font-medium"
              >
                Get Started Free
              </Link>
              <Link
                to="/login"
                className="px-8 py-4 border-2 border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 dark:hover:bg-gray-700 transition duration-300 text-lg font-medium"
              >
                Login to Your Account
              </Link>
            </div>
            <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
              No credit card required. Free plan available with premium upgrades.
            </p>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className={`py-12 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <FaTasks className="text-blue-600 text-2xl" />
                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">TaskMaster</span>
              </div>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Simplify your life with the most intuitive task management application.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                  </svg>
                </a>
                <a href="#" className="text-gray-400 hover:text-blue-600">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                    <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                  </svg>
                </a>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Product</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Features</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Pricing</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Testimonials</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">FAQ</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Company</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-6">Legal</h3>
              <ul className="space-y-4">
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-300 hover:text-blue-600">GDPR</a></li>
              </ul>
            </div>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-500 text-sm">
              &copy; {new Date().getFullYear()} TaskMaster. All rights reserved.
            </p>
            <div className="mt-4 md:mt-0">
              <div className="flex space-x-6">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 text-sm">
                  Login
                </Link>
                <Link to="/signup" className="text-gray-600 dark:text-gray-300 hover:text-blue-600 text-sm">
                  Sign Up
                </Link>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;