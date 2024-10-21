import { Link } from 'react-router-dom'
import { signOut } from 'firebase/auth'
import { useFirebase } from '../Context/firebaseContext'

export default function Navbar() {
  const firebase = useFirebase()
  const handleSignOut = () => {
    firebase.signout()
  }

  return (
    <nav className="bg-indigo-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-xl">Fitness Tracker</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                  Dashboard
                </Link>
                <Link to="/workout" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                  Workout Tracker
                </Link>
                <Link to="/calories" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                  Calorie Tracker
                </Link>
                <Link to="/guide" className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium">
                  Workout Guide
                </Link>
              </div>
            </div>
          </div>
          <div>
            <button
              onClick={handleSignOut}
              className="text-white hover:bg-indigo-500 px-3 py-2 rounded-md text-sm font-medium"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}