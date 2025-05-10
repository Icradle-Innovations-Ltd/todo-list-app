import { Link } from 'react-router-dom';
import { FaTasks, FaExclamationTriangle } from 'react-icons/fa';

const NotFound = ({ darkMode }) => {
  return (
    <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      {/* Header */}
      <header className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow`}>
        <div className="container mx-auto flex justify-between items-center">
          <Link to="/" className="flex items-center space-x-2">
            <FaTasks className="text-blue-500 text-2xl" />
            <span className="text-xl font-bold">TaskMaster</span>
          </Link>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow flex items-center justify-center p-6">
        <div className="text-center">
          <FaExclamationTriangle className="text-yellow-500 text-6xl mx-auto mb-4" />
          <h1 className="text-4xl font-bold mb-2">404</h1>
          <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            The page you are looking for doesn't exist or has been moved.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Go Home
          </Link>
        </div>
      </main>
      
      {/* Footer */}
      <footer className={`py-4 px-6 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-inner`}>
        <div className="container mx-auto text-center text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} TaskMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;