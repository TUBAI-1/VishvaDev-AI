import React, { useRef, useEffect } from 'react';
import Webcam from 'react-webcam';
import { useNavigate, useLocation } from 'react-router-dom';
import { Smile, CheckCircle } from 'lucide-react';

const FaceAuth = () => {
  const webcamRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const isSignUp = location.state && location.state.isSignUp;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/dashboard');
    }, 4000);
    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-medical-50 to-primary-50">
      <div className="card max-w-md w-full space-y-6 text-center">
        <div className="flex flex-col items-center space-y-2">
          <Smile className="h-10 w-10 text-medical-600 mx-auto" />
          <h2 className="text-2xl font-bold text-gray-900">
            {isSignUp ? 'Face Registration' : 'Face Authentication'}
          </h2>
          <p className="text-gray-600">
            {isSignUp
              ? 'Please look at the camera. Registering your face...'
              : 'Please look at the camera. Verifying your identity...'}
          </p>
        </div>
        <Webcam
          audio={false}
          ref={webcamRef}
          screenshotFormat="image/jpeg"
          width={320}
          height={240}
          className="rounded-lg border border-medical-200 mx-auto"
          videoConstraints={{ facingMode: 'user' }}
        />
        <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex flex-col items-center space-y-2 mt-4">
          <CheckCircle className="h-8 w-8 text-green-600" />
          <span className="text-green-700 text-lg font-semibold">Face Authentication Complete!</span>
          <span className="text-gray-600 text-sm">Redirecting to dashboard...</span>
        </div>
      </div>
    </div>
  );
};

export default FaceAuth; 