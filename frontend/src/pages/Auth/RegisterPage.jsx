import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import authService from '../../services/auth.service.js';
import toast from 'react-hot-toast';
import { BookOpen, Mail, Lock, Eye, EyeOff, User } from 'lucide-react';

const Register = ({ title = 'Notes Drill' }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Please make sure your passwords match.');
      return;
    }

    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await authService.register(username, email, password);
      const { token, user } = result.data;
      login(user, token);

      toast.success(`Welcome to ${title}. Let\'s start learning!`);
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.error || 'Failed to register user. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex">
      {/* Left Side */}
      <section className="hidden lg:flex lg:w-1/2 xl:w-[55%] bg-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-20 left-20 w-64 h-64 rounded-full bg-accent/30 blur-3xl animate-float" />
          <div className="absolute bottom-40 right-20 w-80 h-80 rounded-full bg-secondary/30 blur-3xl animate-float-delayed" />
        </div>

        <div className="relative z-10 flex flex-col justify-center px-12 xl:px-20">
          <div className="max-w-lg">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-foreground" />
              </div>
              <span className="text-2xl font-bold text-foreground">{title}</span>
            </div>

            <h2 className="text-4xl xl:text-5xl font-bold text-foreground mb-6 leading-tight">
              Start your
              <br />
              learning journey
            </h2>
            <p className="text-lg text-light leading-relaxed">
              Join thousands of learners who are mastering new skills with AI-powered personalized
              learning.
            </p>
          </div>
        </div>
      </section>

      {/* Right Side - Register Form */}
      <section className="w-full lg:w-1/2 xl:w-[45%] flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-3 mb-8 justify-center">
            <div className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-accent-foreground" />
            </div>
            <span className="text-xl font-bold text-foreground">{title}</span>
          </div>

          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-foreground mb-2">
              Create your account
            </h1>
            <p className="text-foreground">Fill in your details to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="text-foreground">
                User Name
              </label>
              <div className="relative">
                <User className="absolute left-2 top-1/2 -translate-y-1/3 w-5 h-5 text-foreground" />
                <input
                  id="name"
                  type="text"
                  placeholder="johndoe123"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="pl-10 bg-card text-foreground border border-accent/60 w-full px-2 py-1 mt-2 focus:outline-none focus:ring-1 focus:ring-accent rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="text-foreground">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-2 top-1/2 -translate-y-1/3 w-5 h-5 text-foreground" />
                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-card text-foreground border border-accent/60 w-full px-2 py-1 mt-2 focus:outline-none focus:ring-1 focus:ring-accent rounded"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="text-foreground">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/3 w-5 h-5 text-foreground" />
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-card text-foreground border border-accent/60 w-full px-2 py-1 mt-2 focus:outline-none focus:ring-1 focus:ring-accent rounded "
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/3 text-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="text-foreground">
                Confirm Password
              </label>
              <div className="relative">
                <Lock className="absolute left-2 top-1/2 -translate-y-1/3 w-5 h-5 text-foreground" />
                <input
                  id="confirmPassword"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 bg-card text-foreground border border-accent/60 w-full px-2 py-1 mt-2 focus:outline-none focus:ring-1 focus:ring-accent rounded"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-accent text-foreground font-semibold h-12"
              disabled={isLoading}
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </form>

          <p className="mt-6 text-center text-foreground">
            Already have an account?{' '}
            <Link
              to="/login"
              className="text-accent hover:text-accent/80 font-medium transition-colors"
            >
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default Register;
