# Gen-Z Ballot Frontend

A modern, responsive React frontend for the Gen-Z Ballot decentralized voting system. Built with React, Vite, and Ethers.js for seamless blockchain integration.

## 🚀 Features

### 🎨 Modern UI/UX
- **Dark Theme**: Sleek, modern dark theme with gradient accents
- **Responsive Design**: Fully responsive across all device sizes
- **Smooth Animations**: Subtle animations and transitions for better UX
- **Glassmorphism**: Modern glassmorphism effects with backdrop blur

### 🗳️ Core Functionality
- **Dashboard**: Comprehensive overview with election statistics and quick actions
- **Voter Registration**: Secure voter registration with form validation
- **Candidate Registration**: Candidate submission with security deposit handling
- **Voting Interface**: Intuitive candidate selection with visual feedback
- **Real-time Results**: Live election results with progress bars and rankings

### 🔗 Blockchain Integration
- **MetaMask Integration**: Seamless wallet connection with network detection
- **Smart Contract Interaction**: Direct interaction with deployed contracts
- **Transaction Handling**: Proper loading states and error handling
- **Network Management**: Automatic network switching to Hardhat local

### 📱 Responsive Design
- **Mobile-First**: Optimized for mobile devices
- **Tablet Support**: Great experience on tablet devices
- **Desktop Enhanced**: Rich desktop experience with larger layouts

## 🛠️ Technology Stack

- **React 19** - Modern React with latest features
- **Vite** - Fast build tool and development server
- **Ethers.js 6** - Ethereum blockchain interaction
- **React Router** - Client-side routing
- **CSS3** - Modern CSS with custom properties and grid
- **Inter Font** - Clean, modern typography

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Hardhat local network running on port 8545

### Installation

1. **Install Dependencies**
   ```bash
   cd frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```

3. **Open in Browser**
   Navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` directory.

## 📁 Project Structure

```
frontend/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   └── ConnectWallet.jsx      # Wallet connection component
│   ├── contracts/
│   │   ├── addresses.json         # Contract addresses
│   │   ├── *.abi.json            # Contract ABIs
│   │   └── index.js              # Contract configuration
│   ├── pages/
│   │   ├── Dashboard.jsx          # Main dashboard
│   │   ├── VoterRegistration.jsx  # Voter registration form
│   │   ├── CandidateRegistration.jsx # Candidate registration form
│   │   ├── CastVote.jsx          # Voting interface
│   │   └── Results.jsx           # Election results display
│   ├── web3/
│   │   └── useContracts.js       # Contract interaction hooks
│   ├── App.jsx                   # Main app component
│   ├── App.css                   # App-specific styles
│   ├── index.css                 # Global styles and CSS variables
│   └── main.jsx                  # App entry point
├── package.json
├── vite.config.js
└── README.md
```

## 🎨 Design System

### Color Palette
- **Primary**: `#3b82f6` (Blue)
- **Background**: `#0a0e1a` (Dark blue)
- **Surface**: `#0f1419` (Lighter dark)
- **Text**: `#f1f5f9` (Light gray)
- **Success**: `#10b981` (Green)
- **Warning**: `#f59e0b` (Orange)
- **Error**: `#ef4444` (Red)

### Typography
- **Font Family**: Inter (Google Fonts)
- **Weights**: 400, 500, 600, 700, 800
- **Responsive**: Scales appropriately across devices

### Components
- **Cards**: Glassmorphism effect with subtle borders
- **Buttons**: Multiple variants (primary, secondary, success, warning, error)
- **Forms**: Consistent styling with validation states
- **Badges**: Status indicators with color coding
- **Loading States**: Spinners and skeleton loaders

## 🔧 Configuration

### Contract Addresses
Update contract addresses in `src/contracts/addresses.json`:

```json
{
  "ElectionOfficer": "0x...",
  "Voter": "0x...",
  "Candidate": "0x...",
  "GeneralElections": "0x..."
}
```

### Network Configuration
The app is configured for Hardhat local network (Chain ID: 1337). To change:

1. Update network detection in `ConnectWallet.jsx`
2. Update RPC URL in network switching logic
3. Update contract addresses for the new network

## 📱 Responsive Breakpoints

- **Mobile**: < 480px
- **Tablet**: 480px - 768px
- **Desktop**: > 768px

## 🚀 Features in Detail

### Dashboard
- Election statistics overview
- Quick action buttons
- Recent candidates list
- System information

### Voter Registration
- Form validation with real-time feedback
- Aadhar number handling (text or hex)
- Age verification (18+)
- Registration process explanation

### Candidate Registration
- Security deposit handling
- Age verification (25+)
- Eligibility requirements display
- Deposit refund information

### Voting Interface
- Visual candidate cards
- Selection feedback
- Vote confirmation
- Security information

### Results Display
- Real-time vote counts
- Progress bars
- Ranking system
- Percentage calculations
- Blockchain verification info

## 🔒 Security Features

- **Input Validation**: Client-side validation for all forms
- **Error Handling**: Comprehensive error handling and user feedback
- **Transaction Confirmation**: Clear transaction status updates
- **Network Verification**: Automatic network detection and switching

## 🎯 Performance Optimizations

- **Code Splitting**: Automatic code splitting with Vite
- **Lazy Loading**: Components loaded as needed
- **Optimized Images**: SVG icons and optimized assets
- **CSS Optimization**: Minimal CSS with efficient selectors

## 🐛 Troubleshooting

### Common Issues

1. **MetaMask Not Found**
   - Ensure MetaMask is installed and enabled
   - Check browser permissions

2. **Wrong Network**
   - Use the "Switch to Hardhat" button
   - Manually add Hardhat network to MetaMask

3. **Contract Interaction Fails**
   - Verify contracts are deployed
   - Check contract addresses in `addresses.json`
   - Ensure you're on the correct network

4. **Build Errors**
   - Clear node_modules and reinstall
   - Check Node.js version compatibility

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- **Ethers.js** for blockchain interaction
- **React** for the UI framework
- **Vite** for the build tool
- **Inter Font** for typography
- **Hardhat** for local blockchain development