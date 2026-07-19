import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const [registerNumber, setRegisterNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (localStorage.getItem('authToken')) {
      navigate('/vote');
    }
  }, [navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/api/student/login', {
        register_number: registerNumber,
        email
      });

      if (response.data?.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('studentData', JSON.stringify(response.data.student));
        navigate('/vote');
      } else {
        setError(response.data?.message || 'Login failed.');
      }
    } catch (err) {
      setError(err?.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };


};

export default LoginPage;
