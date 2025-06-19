import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import HeroImage from '../assets/images/hero.jpg';
import { FaSearch, FaBriefcase, FaUserGraduate } from 'react-icons/fa';

const Home = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-700 to-blue-900 text-white py-20">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-10 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Find Your Dream <span className="text-yellow-400">Internship</span> or <span className="text-yellow-400">Job</span>
            </h1>
            <p className="text-xl mb-8">
              StageX connects students with top companies for internships and entry-level positions. Start your career journey today!
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              {!isAuthenticated ? (
                <>
                  <Link 
                    to="/register" 
                    className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
                  >
                    Get Started
                  </Link>
                  <Link 
                    to="/login" 
                    className="bg-white hover:bg-gray-100 text-blue-700 font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
                  >
                    Sign In
                  </Link>
                </>
              ) : (
                <Link 
                  to={user?.role === 'employer' ? '/post-job' : '/jobs'} 
                  className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 text-center"
                >
                  {user?.role === 'employer' ? 'Post a Job' : 'Browse Jobs'}
                </Link>
              )}
            </div>
          </div>
          <div className="md:w-1/2">
            <img 
              src={HeroImage} 
              alt="Career growth" 
              className="rounded-lg shadow-2xl w-full max-w-md mx-auto"
            />
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-white flex-grow">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Why Choose StageX?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-blue-600 mb-4">
                <FaSearch className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Smart Search</h3>
              <p className="text-gray-600">
                Find the perfect match with our advanced search filters tailored for students and recent graduates.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-blue-600 mb-4">
                <FaBriefcase className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Diverse Opportunities</h3>
              <p className="text-gray-600">
                Access thousands of internships and entry-level jobs from top companies across various industries.
              </p>
            </div>
            <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition duration-300">
              <div className="text-blue-600 mb-4">
                <FaUserGraduate className="text-4xl" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-gray-800">Career Growth</h3>
              <p className="text-gray-600">
                Get personalized recommendations and resources to help you grow in your chosen career path.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-blue-50">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Ready to jumpstart your career?</h2>
          <p className="text-xl mb-8 text-gray-600 max-w-2xl mx-auto">
            Join thousands of students and employers who are already using StageX to connect and grow.
          </p>
          <Link 
            to={isAuthenticated ? (user?.role === 'employer' ? '/post-job' : '/jobs') : '/register'} 
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg transition duration-300"
          >
            {isAuthenticated ? 
              (user?.role === 'employer' ? 'Post a Job' : 'Browse Jobs') : 
              'Get Started Now'}
          </Link>
        </div>
      </div>

      {/* Footer Section */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h2 className="text-2xl font-bold mb-4">StageX</h2>
            </div>
            
            <div className="mb-6 md:mb-0">
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><Link to="/jobs" className="hover:text-yellow-400 transition duration-300">Browse Jobs</Link></li>
                <li><Link to="/post-job" className="hover:text-yellow-400 transition duration-300">Post a Job</Link></li>
                <li><Link to="/about" className="hover:text-yellow-400 transition duration-300">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-yellow-400 transition duration-300">Contact</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
              <ul className="space-y-2">
                <li>T3 University Ave</li>
                <li>College Town, CA 12345</li>
                <li>Email: info@stagex.com</li>
                <li>Phone: (123) 456-7890</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-8 pt-6 text-center">
            <p>© 2025 StageX. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;