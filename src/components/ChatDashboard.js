import React, { useEffect, useRef, useState } from 'react';

const CHAT_HISTORY_KEY = 'chatHistory';

const ChatDashboard = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const chatboxRef = useRef(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [doctorKey, setDoctorKey] = useState(null);

  useEffect(() => {
    // Load selected doctor and doctorKey
    const doc = localStorage.getItem('selectedDoctor');
    if (doc) {
      setSelectedDoctor(JSON.parse(doc));
    }
    const key = localStorage.getItem('selectedDoctorKey');
    if (key) {
      setDoctorKey(key);
      const history = localStorage.getItem('chatHistory_' + key);
      if (history) {
        setMessages(JSON.parse(history));
      } else {
        setMessages([]);
      }
    }
    // eslint-disable-next-line
  }, []);

  // Always update localStorage for this doctor when messages change
  useEffect(() => {
    if (doctorKey) {
      localStorage.setItem('chatHistory_' + doctorKey, JSON.stringify(messages));
    }
  }, [messages, doctorKey]);

  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages]);

  const addMessage = (sender, message) => {
    setMessages(prev => [...prev, [sender, message]]);
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    addMessage('User', input);
    setInput('');
    setLoading(true);
    try {
      const response = await fetch(
        'https://backend.buildpicoapps.com/aero/run/llm-api?pk=v1-Z0FBQUFBQm9ZNDlUUXhRX1BxdzdNb0JBYWFNdjRHbGhPLXp6YkVJRlpoMG5DeWUweHphS3VtN1FUbWZ6YUFpODNOVk1NNmp0LXVxOFhjN2p5aHFrUEJ1Yl94S3cyRF9hRVE9PQ==',
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input })
        }
      );
      const data = await response.json();
      setLoading(false);
      if (data.status === 'success') {
        addMessage('CHANAKYA GPT', data.text);
      } else {
        addMessage('CHANAKYA GPT', 'Sorry, there was an error processing your request.');
      }
    } catch (error) {
      setLoading(false);
      addMessage('CHANAKYA GPT', 'Unable to connect to the server. Please try again later.');
    }
  };

  const handleInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      sendMessage();
    }
  };

  return (
    <div className="bg-green-50 min-h-screen font-serif">
      <div className="max-w-2xl mx-auto p-4">
        <header style={{ backgroundColor: '#e6f9ed' }} className="text-center p-4 rounded">
          <h1 className="text-2xl font-bold text-green-700">VISHVADEV AI</h1>
          <p className="text-sm text-green-800">Experience AI Conversations</p>
          {selectedDoctor && (
            <div className="mt-4 flex flex-col items-center">
              <img src={selectedDoctor.img} alt={selectedDoctor.name} className="w-16 h-16 rounded-full object-cover border-2 border-green-200 mb-2" />
              <div className="font-semibold text-lg text-green-800">{selectedDoctor.name}</div>
              <div className="text-xs text-green-600">{selectedDoctor.desc}</div>
            </div>
          )}
        </header>
        <div ref={chatboxRef} className="bg-white shadow-md rounded p-4 mt-6 h-96 overflow-y-scroll">
          {messages.map(([sender, message], idx) => (
            <div key={idx} className="mb-4">
              {sender === 'User' ? (
                <div className="text-right">
                  <span style={{ backgroundColor: '#34d399' }} className="text-white p-2 rounded-lg inline-block">{message}</span>
                </div>
              ) : (
                <div className="text-left">
                  <span style={{ backgroundColor: '#bbf7d0' }} className="text-green-900 p-2 rounded-lg inline-block">{message}</span>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <input
            type="text"
            placeholder="Type your message..."
            className="flex-grow p-2 border border-green-300 rounded-l"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            disabled={loading}
          />
          <button
            onClick={sendMessage}
            style={{ backgroundColor: '#22c55e' }}
            className="text-white p-2 rounded-r"
            disabled={loading}
          >
            Send
          </button>
          {loading && (
            <div className="spinner ml-2" style={{ border: '4px solid rgba(0,0,0,0.1)', width: 24, height: 24, borderRadius: '50%', borderLeftColor: '#22c55e', animation: 'spin 1s ease infinite' }} />
          )}
        </div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    </div>
  );
};

export default ChatDashboard;