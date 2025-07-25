# VishvaDev AI - Medical Chatbot

A modern, responsive web application featuring a medical AI chatbot with user authentication and a beautiful medical-themed interface.

## Features

### 🔐 Authentication System
- **Sign In**: Secure login with email and password
- **Sign Up**: User registration with password strength validation
- **Remember Me**: Persistent login sessions
- **Form Validation**: Real-time validation and error handling
- **Password Visibility Toggle**: Show/hide password functionality

### 🏥 Medical Chatbot Interface
- **Real-time Chat**: Interactive conversation with AI medical assistant
- **Message History**: Persistent chat conversations
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Medical Disclaimer**: Clear health information disclaimers

### 🎨 Modern UI/UX
- **Medical Theme**: Professional healthcare color scheme
- **Responsive Layout**: Mobile-first design approach
- **Smooth Animations**: Enhanced user experience with transitions
- **Accessibility**: WCAG compliant design patterns

### 🛡️ Security Features
- **Protected Routes**: Authentication-based access control
- **Session Management**: Secure user session handling
- **Input Validation**: Comprehensive form validation
- **Error Handling**: User-friendly error messages

## Technology Stack

- **Frontend**: React 18 with Hooks
- **Styling**: Tailwind CSS with custom medical theme
- **Routing**: React Router DOM v6
- **Icons**: Lucide React
- **State Management**: React Context API
- **Build Tool**: Create React App

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd chanakya-doctor-ai
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (irreversible)

## Project Structure

```
src/
├── components/          # React components
│   ├── SignIn.js       # Sign in page
│   ├── SignUp.js       # Sign up page
│   └── Dashboard.js    # Main dashboard with chat
├── context/            # React context
│   └── AuthContext.js  # Authentication context
├── App.js             # Main app component
├── index.js           # App entry point
└── index.css          # Global styles
```

## Features in Detail

### Authentication Flow

1. **Sign Up Process**:
   - Full name, email, and password input
   - Password strength validation with visual indicators
   - Terms and conditions agreement
   - Real-time form validation

2. **Sign In Process**:
   - Email and password authentication
   - Remember me functionality
   - Forgot password link (placeholder)
   - Error handling for invalid credentials

3. **Session Management**:
   - Local storage for persistent sessions
   - Automatic redirect to dashboard if authenticated
   - Protected route implementation

### Chatbot Interface

1. **Chat Features**:
   - Real-time message exchange
   - Message timestamps
   - User and bot message differentiation
   - Scrollable chat history

2. **User Experience**:
   - Typing indicators
   - Message validation
   - Responsive chat layout
   - Professional medical styling

### Dashboard Features

1. **User Profile**:
   - User information display
   - Account details
   - Member since information

2. **Quick Actions**:
   - Start new consultation
   - View chat history
   - Account settings

3. **Medical Disclaimer**:
   - Clear health information warnings
   - Professional medical disclaimers

## Customization

### Styling

The application uses Tailwind CSS with a custom medical theme. You can customize:

- **Colors**: Modify `tailwind.config.js` for custom color schemes
- **Components**: Update component classes in individual files
- **Typography**: Change font families and sizes in `index.css`

### Authentication

To integrate with a real backend:

1. Update the `signIn` and `signUp` functions in `AuthContext.js`
2. Replace localStorage with secure session management
3. Add proper API error handling
4. Implement JWT or similar token-based authentication

### Chatbot Integration

To connect with a real AI service:

1. Replace the simulated responses in `Dashboard.js`
2. Add API calls to your AI service
3. Implement proper error handling for API failures
4. Add loading states for better UX

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration application. For production use, ensure proper security measures, backend integration, and compliance with healthcare regulations.
