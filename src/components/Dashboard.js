import React, { useState } from 'react';
import { UserPlus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const doctors = [
  {
    name: 'General Physician',
    desc: 'Helps with everyday health concerns and common illnesses.',
    img: 'https://randomuser.me/api/portraits/men/32.jpg',
  },
  {
    name: 'Pediatrician',
    desc: "Expert in children's health, from babies to teens.",
    img: 'https://randomuser.me/api/portraits/men/33.jpg',
  },
  {
    name: 'Dermatologist',
    desc: 'Handles skin issues like rashes, acne, or infections.',
    img: 'https://randomuser.me/api/portraits/men/34.jpg',
  },
  {
    name: 'Psychologist',
    desc: 'Supports mental health and emotional well-being.',
    img: 'https://randomuser.me/api/portraits/women/44.jpg',
  },
  {
    name: 'Nutritionist',
    desc: 'Provides advice on healthy eating and weight management.',
    img: 'https://randomuser.me/api/portraits/women/45.jpg',
  },
  {
    name: 'Cardiologist',
    desc: 'Focuses on heart health and blood pressure issues.',
    img: 'https://randomuser.me/api/portraits/women/46.jpg',
  },
  {
    name: 'ENT Specialist',
    desc: 'Handles ear, nose, and throat-related problems.',
    img: 'https://randomuser.me/api/portraits/women/47.jpg',
  },
  {
    name: 'Orthopedic',
    desc: 'Helps with bone, joint, and muscle pain.',
    img: 'https://randomuser.me/api/portraits/women/48.jpg',
  },
  {
    name: 'Gynecologist',
    desc: "Cares for women's reproductive and hormonal health.",
    img: 'https://randomuser.me/api/portraits/men/35.jpg',
  },
  {
    name: 'Dentist',
    desc: 'Handles oral hygiene and dental problems.',
    img: 'https://randomuser.me/api/portraits/men/36.jpg',
  },
];

const Dashboard = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const handleStartConsultation = (doctor) => {
    if (doctor) {
      localStorage.setItem('selectedDoctor', JSON.stringify(doctor));
      localStorage.setItem('selectedDoctorKey', doctor.name);
      setShowModal(false);
      navigate('/chat');
    } else {
      setShowModal(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-medical-600">Chanakya Doctor AI</span>
          </div>
          <nav className="flex items-center space-x-8 text-gray-700 text-base font-medium">
            <a href="#" className="hover:text-medical-600">Home</a>
            <a href="#" className="hover:text-medical-600">History</a>
            <a href="#" className="hover:text-medical-600">Pricing</a>
            <a href="#" className="hover:text-medical-600">Profile</a>
            <div className="h-8 w-8 rounded-full bg-medical-100 flex items-center justify-center">
              <UserPlus className="h-5 w-5 text-medical-600" />
            </div>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="bg-white rounded-xl shadow-medical border border-gray-100 p-8 mb-10 flex flex-col items-center">
          <button className="btn-primary flex items-center space-x-2" onClick={() => handleStartConsultation()}>
            <span>+ Start a Consultation</span>
          </button>
        </div>
        {/* AI Specialist Doctors Agent */}
        <h3 className="text-2xl font-bold text-gray-900 mb-6">AI Specialist Doctors Agent</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {doctors.map((doc, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow-medical border border-gray-100 p-5 flex flex-col justify-between items-center h-80">
              <img src={doc.img} alt={doc.name} className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-medical-100" />
              <h4 className="text-lg font-semibold text-gray-900 mb-1 text-center">{doc.name}</h4>
              <p className="text-gray-500 text-sm mb-4 text-center">{doc.desc}</p>
              <div className="mt-auto w-full">
                <button
                  className="btn-secondary w-full"
                  onClick={() => handleStartConsultation(doc)}
                >
                  Start Consultation
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h2 className="text-lg font-bold mb-4">Select a Doctor</h2>
            <div className="grid grid-cols-1 gap-3 max-h-80 overflow-y-auto">
              {doctors.map((doc, idx) => (
                <div key={idx} className="flex items-center space-x-4 p-2 hover:bg-gray-100 rounded cursor-pointer" onClick={() => handleStartConsultation(doc)}>
                  <img src={doc.img} alt={doc.name} className="w-12 h-12 rounded-full object-cover border-2 border-medical-100" />
                  <div>
                    <div className="font-semibold">{doc.name}</div>
                    <div className="text-xs text-gray-500">{doc.desc}</div>
                  </div>
                </div>
              ))}
            </div>
            <button className="mt-4 btn-secondary w-full" onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 