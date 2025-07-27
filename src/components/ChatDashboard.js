import React, { useEffect, useRef, useState } from 'react';

const CHAT_HISTORY_KEY = 'chatHistory';
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

const ChatDashboard = () => {
  const [input, setInput] = useState('');
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const [speaking, setSpeaking] = useState(false);
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

  useEffect(() => {
    // Initialize SpeechRecognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onstart = () => {
        setIsListening(true);
        console.log('Voice recognition started. Speak into the microphone.');
      };

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        console.log('Transcript:', transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        console.log('Voice recognition ended.');
      };
    } else {
      console.warn('Speech Recognition API not supported in this browser.');
    }
  }, []);

  const toggleListening = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        setInput(''); // Clear previous input before starting new recognition
        recognitionRef.current.start();
      }
    }
  };

  const addMessage = (sender, message) => {
    setMessages(prev => [...prev, [sender, message]]);
  };

  const speakText = (text) => {
    if ('speechSynthesis' in window) {
      if (window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
        setSpeaking(false);
      } else {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.onstart = () => setSpeaking(true);
        utterance.onend = () => setSpeaking(false);
        utterance.onerror = () => setSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    } else {
      console.warn('Speech Synthesis API is not supported by this browser.');
    }
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

    let promptContent;
    let userDisplayMessage = currentInput;

    // Check if it's the very first message in the chat session
    const isFirstUserMessage = messages.length === 0;

    if (isFirstUserMessage) {
      // For the very first message, AI asks for patient details
      promptContent = `The user has initiated the conversation. Please respond with a greeting, then ask for the patient's name, age, and disease. Each point should be on a new line.`;
    } else if (messages.length === 2) { // This means user is sending their second message, after AI's initial greeting
      // For the second message, AI should process the patient info provided by the user
      // and then confirm it before proceeding to prescription format.
      // I will instruct Gemini to acknowledge the information and then state it's ready for further queries.
      promptContent = `The user has provided information. Please acknowledge the patient's name, age, and disease/symptoms from the following input: "${currentInput}". Confirm that you have received this information and state that you are now ready to provide medical advice or prescriptions based on further queries. Do NOT generate a prescription yet. Each point should be on a new line.`;
    } else {
      // For all subsequent messages (after patient info is acknowledged)
      promptContent = `Please provide the response in the format of a doctor's prescription, including sections for 'Impressions', 'Medicines', and 'Next Follow-up'. Each item within these sections should be on a new line. ${currentInput}`; 
    }

    if (selectedFile) {
      userDisplayMessage = `Uploaded file: ${selectedFile.name}`;
      addMessage('User', userDisplayMessage); // Display file upload message

      const reader = new FileReader();
      reader.onload = async (event) => {
        const fileContent = event.target.result;
        if (selectedFile.type.startsWith('image/')) {
          if (!isFirstUserMessage && messages.length !== 2) { // Only include image for prescription phase
            promptContent = [
              { type: 'text', text: promptContent },
              { type: 'image_url', image_url: { url: fileContent } }
            ];
          }
        } else {
          if (!isFirstUserMessage && messages.length !== 2) { // Only include file content for prescription phase
            promptContent = `${promptContent}\n\nFile Content:\n${fileContent}`;
          }
        }
        await callGeminiAPI(promptContent);
        setSelectedFile(null); // Clear selected file after sending
      };
      reader.readAsDataURL(selectedFile);
    } else {
      // Text-only message
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
              <button
                onClick={() => speakText(message)}
                className="ml-2 p-1 rounded-full bg-gray-200 text-gray-700 hover:bg-gray-300 focus:outline-none"
              >
                <i className={`fas ${speaking ? 'fa-volume-up' : 'fa-volume-down'}`}></i>
              </button>
                </div>
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center mt-4">
          <button
            onClick={toggleListening}
            className={`px-4 py-2 rounded-l-lg ${isListening ? 'bg-red-500 hover:bg-red-600' : 'bg-blue-500 hover:bg-blue-600'} text-white`}
            title={isListening ? 'Stop Listening' : 'Start Voice Input'}
          >
            <i className="fas fa-microphone"></i> {isListening ? 'Stop' : 'Mic'}
          </button>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleInputKeyDown}
            placeholder="Type your message..."
            className="flex-grow p-2 border border-gray-300 focus:outline-none focus:border-green-500"
          />
          <label htmlFor="file-upload" className="cursor-pointer bg-blue-500 text-white p-2 hover:bg-blue-600">
            Upload File
          </label>
          <input
            id="file-upload"
            type="file"
            className="hidden"
            onChange={handleFileChange}
          />
          <button
            onClick={sendMessage}
            className="px-4 py-2 bg-green-500 text-white rounded-r-lg hover:bg-green-600"
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