import { useState, type ChangeEvent, type FormEvent } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { GoogleLogin, type CredentialResponse } from '@react-oauth/google';

import api from '../services/api';
import { useAuth } from '../context/AuthContext';

function Login() {
  const { login, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from =
    (location.state as { from?: { pathname?: string } } | null)?.from
      ?.pathname || '/browse';

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
    university: '',
    major: '',
  });

  const handleLoginChange = (e: ChangeEvent<HTMLInputElement>) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    logout();

    try {
      const response = await api.post('/auth/login', loginData);

      login(response.data.token);
      setMessage('Login successful!');
      navigate(from, { replace: true });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Login failed');
    }
  };

  const handleRegister = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');

    try {
      const response = await api.post('/auth/register', registerData);

      login(response.data.token);
      setMessage('Register successful!');
      navigate(from, { replace: true });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Register failed');
    }
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    setMessage('');

    try {
      const response = await api.post('/auth/google', {
        credential: credentialResponse.credential,
      });

      login(response.data.token);
      setMessage('Google login successful!');
      navigate(from, { replace: true });
    } catch (error: any) {
      setMessage(error.response?.data?.message || 'Google login failed');
    }
  };

  const handleGoogleError = () => {
    setMessage('Google login failed');
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8">
      <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">
        {activeTab === 'login' ? 'Login' : 'Register'}
      </h1>

      <div className="flex mb-6 bg-slate-100 rounded-lg p-1">
        <button
          type="button"
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
          type="button"
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
        <>
          <form onSubmit={handleLogin} className="space-y-4" autoComplete="off">
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
                required
                autoComplete="off"
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
                required
                minLength={6}
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
            >
              Login
            </button>
          </form>

          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-slate-200"></div>
            <span className="text-slate-500 text-sm">or</span>
            <div className="h-px flex-1 bg-slate-200"></div>
          </div>

          <div className="flex justify-center">
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={handleGoogleError}
            />
          </div>
        </>
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
              required
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
              required
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
              required
              minLength={6}
              autoComplete="new-password"
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
              required
            >
              <option value="" disabled>
                Select university
              </option>
              <option value="Bar-Ilan University">Bar-Ilan University</option>
              <option value="Tel Aviv University">Tel Aviv University</option>
              <option value="Hebrew University">Hebrew University</option>
              <option value="Technion">Technion</option>
              <option value="University of Haifa">University of Haifa</option>
              <option value="Ariel University">Ariel University</option>
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
              required
            >
              <option value="" disabled>
                Select major
              </option>
              <option value="Information Science">Information Science</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Psychology">Psychology</option>
              <option value="Economics">Economics</option>
              <option value="Engineering">Engineering</option>
              <option value="Mathematics">Mathematics</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-3 rounded-lg font-semibold hover:bg-blue-800"
          >
            Register
          </button>
        </form>
      )}
    </div>
  );
}

export default Login;