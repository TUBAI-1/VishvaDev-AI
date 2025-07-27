import React, { useEffect, useRef, useState } from 'react';

const CHAT_HISTORY_KEY = 'chatHistory';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const ChatDashboard = () => {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
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

  const clearChat = () => {
    setMessages([]);
  };

  const callGeminiAPI = async (content) => {
    try {
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`; 

      
      let requestBody;
      if (Array.isArray(content) && content.some(item => item.type === 'image_url')) {
        // Handle multimodal content for Gemini
        const parts = content.map(item => {
          if (item.type === 'text') {
            return { text: item.text };
          } else if (item.type === 'image_url') {
            // Extract base64 data from data URL
            const base64Data = item.image_url.url.split(',')[1];
            return {
              inlineData: {
                mimeType: 'image/jpeg', // Assuming JPEG for simplicity, can be dynamic
                data: base64Data,
              },
            };
          }
          return {};
        });

        requestBody = {
          contents: [{
            parts: parts
          }],
        };
      } else {
        // Handle text-only content for Gemini
        requestBody = {
          contents: [{
            parts: [{
              text: content,
            }],
          }],
        };
      }

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        addMessage('CHANAKYA GPT', data.candidates[0].content.parts[0].text);
      } else {
        addMessage('CHANAKYA GPT', `Error: ${data.error ? data.error.message : 'Unknown error'}`);
      }
    } catch (error) {
      setLoading(false);
      addMessage('CHANAKYA GPT', 'Unable to connect to the server. Please try again later.');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() && !selectedFile) return;

    setLoading(true);
    let currentInput = input.trim();
    setInput(''); // Clear input immediately

    let promptContent = currentInput;
    let userDisplayMessage = currentInput;

    if (selectedFile) {
      userDisplayMessage = `Uploaded file: ${selectedFile.name}`;
      addMessage('User', userDisplayMessage); // Display file upload message
      
      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        if (selectedFile.type.startsWith('image/')) {
          promptContent = [
            { type: 'text', text: 'Please provide the analysis in bullet points, highlighting important suggestions:' },
            { type: 'text', text: 'Analyze this image:' },
            { type: 'image_url', image_url: { url: fileContent } },
          ];
          await callGeminiAPI(promptContent);
        } else {
          // Assume text-based file
          promptContent = `Analyze the following prescription and provide the analysis in bullet points, highlighting important suggestions:\n\n${fileContent}`;
          await callGeminiAPI(promptContent);
        }
        setSelectedFile(null); // Clear selected file after processing
      };
      reader.readAsDataURL(selectedFile);
    } else {
      addMessage('User', userDisplayMessage); // Display text message
      await callGeminiAPI(promptContent);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
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
        <div className="flex justify-between items-center mt-4">
          <h2 className="text-xl font-bold text-green-700">Chat</h2>
          <button 
            onClick={clearChat}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Clear Chat
          </button>
        </div>
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
          <input
            type="file"
            onChange={handleFileChange}
            className="hidden"
            id="file-upload"
            disabled={loading}
          />
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white p-2 rounded-l ml-2">
            Upload File
          </label>
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