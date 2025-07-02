import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gray-50">
      <div className="bg-white rounded-xl shadow-medical border border-gray-100 p-10 flex flex-col items-center">
        <h1 className="text-4xl font-bold text-medical-600 mb-4">CHANAKYA DOCTOR AI</h1>
        <p className="text-lg text-gray-700 mb-8 text-center max-w-xl">
          Welcome to Chanakya Doctor AI! Experience 24/7 intelligent medical support using conversational AI. Triage symptoms, book appointments, and get expert advice from AI-powered specialist agents.
        </p>
        <div className="flex space-x-4">
          <button className="btn-primary px-6 py-2" onClick={() => navigate('/signin')}>Sign In</button>
          <button className="btn-secondary px-6 py-2" onClick={() => navigate('/signup')}>Sign Up</button>
        </div>
      </div>
    </div>
  );
};

export default LandingPage; 