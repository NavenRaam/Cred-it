import { useState } from 'react';
import { useRouter } from 'next/router';
import { Mail, Lock, LogIn, UserPlus } from 'lucide-react';
import toast, { Toaster } from 'react-hot-toast';
import { signIn } from 'next-auth/react'; // Correct import for client-side use

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Function to handle login form submission
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Call the signIn function directly from the client
    const result = await signIn('credentials', {
      redirect: false, // Prevents automatic redirection
      email,
      password,
    });

    setLoading(false);

    if (result.error) {
      toast.error(result.error || 'Invalid credentials.');
    } else {
      toast.success('Sign-in successful!');
      router.push('/dashboard'); // Redirect to your dashboard page
    }
  };

  // Function to handle registration form submission (remains the same)
  const handleRegister = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords don't match!");
      return;
    }

    setLoading(true);
    try {
      // This part still needs a custom API route, as NextAuth doesn't handle registration
      const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (data.success) {
        toast.success('Account created successfully! Please log in.');
        setIsRegistering(false); // Switch to the login view
        setEmail('');
        setPassword('');
        setConfirmPassword('');
      } else {
        toast.error(data.message || 'An error occurred during registration.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('An unexpected error occurred.');
    }
  };

  return (
    <>
      <Toaster position="top-center" reverseOrder={false} />
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white flex items-center justify-center p-4 sm:p-6 lg:p-8">
        {/* Auth Card Container */}
        <div className="max-w-md w-full bg-gray-800 rounded-2xl shadow-2xl p-8 sm:p-10 flex flex-col items-center">
          {/* Title Section */}
          <div className="flex flex-col items-center mb-6">
            <h1 className="text-4xl font-bold text-gray-100">CrediPost</h1>
            <p className="text-gray-400 mt-2">
              {isRegistering ? 'Create a new account' : 'Log in to your account'}
            </p>
          </div>

          {/* Conditional Rendering of Forms */}
          {isRegistering ? (
            // Registration Form
            <form onSubmit={handleRegister} className="w-full space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="email-register">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    id="email-register"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="password-register">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="password"
                    id="password-register"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="confirm-password">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="password"
                    id="confirm-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {loading ? 'Creating...' : <><UserPlus className="mr-2" size={20} />Create Account</>}
              </button>
            </form>
          ) : (
            // Login Form
            <form onSubmit={handleLogin} className="w-full space-y-6">
              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="email-login">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="email"
                    id="email-login"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-gray-400 text-sm font-medium mb-1" htmlFor="password-login">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={20} />
                  <input
                    type="password"
                    id="password-login"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="********"
                    required
                    className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-colors"
                  />
                </div>
              </div>

              {/* Forgot Password Link */}
              <div className="flex justify-end text-sm">
                <a href="#" className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors">
                  Forgot Password?
                </a>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 focus:ring-offset-gray-800"
              >
                {loading ? 'Logging in...' : <><LogIn className="mr-2" size={20} />Log In</>}
              </button>
            </form>
          )}

          {/* Toggle between login and registration */}
          <div className="mt-8 text-center text-gray-400 text-sm">
            {isRegistering ? (
              <>
                Already have an account?{' '}
                <button
                  onClick={() => {
                    setIsRegistering(false);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Log in
                </button>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <button
                  onClick={() => {
                    setIsRegistering(true);
                    setEmail('');
                    setPassword('');
                    setConfirmPassword('');
                  }}
                  className="font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
                >
                  Create an account
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default LoginPage;   