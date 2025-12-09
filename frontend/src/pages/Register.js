import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Card, PageWrapper } from '../components/ui';

const Register = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password);
      toast.success('Registration successful! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.msg || 'Registration failed');
    }
  };

  return (
    <PageWrapper>
      <div className="flex justify-center items-center min-h-[60vh]">
        <Card className="w-full max-w-md">
          <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
          <form onSubmit={handleSubmit}>
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full mt-4">Register</Button>
          </form>
          <p className="mt-4 text-center text-sm text-gray-600 dark:text-dark-text-secondary">
            Already have an account? <Link to="/login" className="text-primary hover:underline">Login</Link>
          </p>
        </Card>
      </div>
    </PageWrapper>
  );
};

export default Register;
