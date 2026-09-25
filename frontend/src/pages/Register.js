import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input, PageWrapper } from '../components/ui';
import { motion } from 'framer-motion';
import { User, Lock, Rocket, CheckCircle, Shield, Zap } from 'lucide-react';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(username, password);
      toast.success('Registration successful! 🎉');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const benefits = [
    { icon: Zap, text: 'Instant ML model training' },
    { icon: Shield, text: 'Secure & private data' },
    { icon: CheckCircle, text: 'Accurate predictions' },
  ];

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-[75vh]">
        <div className="w-full max-w-4xl flex flex-col lg:flex-row gap-8 items-center">
          {/* Left Side - Benefits */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="hidden lg:flex flex-col flex-1 pr-8"
          >
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Start Your <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-400 bg-clip-text text-transparent">Journey</span>
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mb-8 text-lg">
              Join thousands of educators using AI to transform student outcomes.
            </p>
            
            <div className="space-y-4">
              {benefits.map((benefit, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  className="flex items-center gap-4"
                >
                  <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 dark:from-purple-500/30 dark:to-pink-500/30">
                    <benefit.icon className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                  </div>
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{benefit.text}</span>
                </motion.div>
              ))}
            </div>

            {/* Decorative */}
            <div className="mt-8 p-6 rounded-2xl bg-gradient-to-br from-purple-100 via-pink-100 to-orange-100 dark:from-purple-900/20 dark:via-pink-900/20 dark:to-orange-900/20">
              <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                "This platform has revolutionized how we predict and support student success!"
              </p>
              <p className="text-sm font-semibold text-purple-600 dark:text-purple-400 mt-2">— Education Professional</p>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <div className="w-full max-w-md">
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative"
            >
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-orange-400 to-pink-400 rounded-full opacity-20 blur-3xl" />
              <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-br from-purple-400 to-cyan-400 rounded-full opacity-20 blur-3xl" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative bg-white/80 dark:bg-dark-card/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-purple-500/10 p-8 border border-gray-200/50 dark:border-gray-700/50"
            >
              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", delay: 0.2 }}
                  className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-500 mb-4 shadow-lg shadow-orange-500/30"
                >
                  <Rocket className="w-8 h-8 text-white" />
                </motion.div>
                <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Create Account</h2>
                <p className="text-gray-500 dark:text-gray-400">Get started in just 30 seconds</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <Input
                  label="Username"
                  icon={User}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="Choose a username"
                  required
                />
                <Input
                  label="Password"
                  icon={Lock}
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Create a strong password"
                  required
                />

                <div className="flex items-start gap-2 text-sm">
                  <input type="checkbox" className="mt-1 w-4 h-4 rounded border-gray-300 text-purple-500 focus:ring-purple-500" required />
                  <span className="text-gray-600 dark:text-gray-400">
                    I agree to the{' '}
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Terms of Service</a>
                    {' '}and{' '}
                    <a href="#" className="text-purple-600 dark:text-purple-400 hover:underline">Privacy Policy</a>
                  </span>
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-3.5 text-base" 
                  loading={loading}
                >
                  Create Account
                  <Rocket className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Divider */}
              <div className="relative my-6">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white dark:bg-dark-card text-gray-500 dark:text-gray-400">
                    Already have an account?
                  </span>
                </div>
              </div>

              <Link to="/login">
                <Button 
                  variant="outline" 
                  className="w-full py-3"
                >
                  Sign In Instead
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
};

export default Register;
