import { useState } from 'react';
import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login } = useAuth();
  const [activeTab, setActiveTab] = useState('login');
  const [message, setMessage] = useState('');

  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    password: '',
    university: 'Bar-Ilan University',
    major: 'Information Science',
  });

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', loginData);

      login(response.data.token);

      setMessage('Login successful!');
    } catch (error) {
      setMessage('Login failed');
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/register', registerData);

      login(response.data.token);

      setMessage('Register successful!');
    } catch (error) {
      setMessage('Register failed');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        {activeTab === 'login' ? 'Login' : 'Register'}
      </h1>

      <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
        <button
          onClick={() => {
            setActiveTab('login');
            setMessage('');
          }}
          className={`w-1/2 py-2 rounded-md font-semibold ${
            activeTab === 'login'
              ? 'bg-blue-700 text-white'
              : 'text-slate-600'
          }`}
        >
          Login
        </button>

        <button
          onClick={() => {
            setActiveTab('register');
            setMessage('');
          }}
          className={`w-1/2 py-2 rounded-md font-semibold ${
            activeTab === 'register'
              ? 'bg-blue-700 text-white'
              : 'text-slate-600'
          }`}
        >
          Register
        </button>
      </div>

      {message && (
        <p className="text-center mb-4 font-semibold text-blue-700">
          {message}
        </p>
      )}

      {activeTab === 'login' ? (
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={loginData.email}
              onChange={handleLoginChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleLoginChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              placeholder="Enter your password"
            />
          </div>

          <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800">
            Login
          </button>
        </form>
      ) : (
        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="name"
              value={registerData.name}
              onChange={handleRegisterChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={registerData.email}
              onChange={handleRegisterChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={registerData.password}
              onChange={handleRegisterChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
              placeholder="Create a password"
            />
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              University
            </label>
            <select
              name="university"
              value={registerData.university}
              onChange={handleRegisterChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            >
              <option>Bar-Ilan University</option>
              <option>Tel Aviv University</option>
              <option>Hebrew University</option>
              <option>Technion</option>
              <option>University of Haifa</option>
              <option>Ariel University</option>
            </select>
          </div>

          <div>
            <label className="block text-slate-700 font-medium mb-1">
              Major
            </label>
            <select
              name="major"
              value={registerData.major}
              onChange={handleRegisterChange}
              className="w-full border border-slate-300 rounded-lg px-4 py-2"
            >
              <option>Information Science</option>
              <option>Computer Science</option>
              <option>Psychology</option>
              <option>Economics</option>
              <option>Engineering</option>
              <option>Mathematics</option>
            </select>
          </div>

          <button className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800">
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;