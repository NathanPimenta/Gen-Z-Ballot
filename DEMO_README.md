# 🎬 Gen-Z Ballot Demo Guide

## Quick Start for Video Demo

### Option 1: Automated Setup (Recommended)

**For Windows:**
```bash
# Make sure Hardhat node is running in another terminal first
npx hardhat node

# Then run the demo setup
start_demo.bat
```

**For Mac/Linux:**
```bash
# Make sure Hardhat node is running in another terminal first
npx hardhat node

# Then run the demo setup
./start_demo.sh
```

### Option 2: Manual Setup

1. **Start Hardhat Network**
   ```bash
   npx hardhat node
   ```

2. **Deploy Contracts**
   ```bash
   npx hardhat run scripts/deploy.js --network localhost
   ```

3. **Setup Demo Data**
   ```bash
   npx hardhat run demo_setup.js --network localhost
   ```

4. **Start Frontend**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🎥 Video Demo Script

### Scene 1: Introduction (30s)
- Show dashboard with modern UI
- Highlight "Ethereum · Hardhat (1337)" badge
- Point out clean, professional design

### Scene 2: Connect Wallet (30s)
- Click "Connect Wallet"
- Show MetaMask connection
- Demonstrate network switching to Hardhat

### Scene 3: Voter Registration (60s)
- Navigate to "Register Voter"
- Fill form with sample data:
  - Name: "Alice Johnson"
  - Age: "25"
  - Aadhar: "123456789012"
  - Voter ID: "VOTER001"
  - Constituency: "1"
- Show validation and success message

### Scene 4: Candidate Registration (60s)
- Navigate to "Register Candidate"
- Fill form with sample data:
  - Name: "Bob Smith"
  - Party: "Progressive Party"
  - Age: "30"
  - Constituency: "1"
  - Security Deposit: "1.0"
- Show success message

### Scene 5: Cast Vote (60s)
- Navigate to "Cast Vote"
- Show candidate cards
- Select candidate
- Cast vote
- Show confirmation

### Scene 6: View Results (45s)
- Navigate to "Results"
- Show vote counts and percentages
- Highlight progress bars
- Point out blockchain verification

### Scene 7: Mobile Demo (30s)
- Resize browser to mobile
- Show responsive design
- Demonstrate touch interactions

## 🔑 Demo Account Details

The setup script creates these test accounts:

- **Voter Account**: `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Candidate Account**: `0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc`
- **Officer Account**: `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`

## 📱 MetaMask Setup

1. Open MetaMask
2. Click network dropdown
3. Add network manually:
   - Network Name: `Hardhat Local`
   - RPC URL: `http://localhost:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`
4. Import test accounts using private keys from Hardhat

## 🎯 Key Features to Highlight

### UI/UX Features
- ✅ Modern dark theme
- ✅ Glassmorphism effects
- ✅ Smooth animations
- ✅ Responsive design
- ✅ Professional typography

### Functionality Features
- ✅ Wallet integration
- ✅ Form validation
- ✅ Real-time feedback
- ✅ Transaction handling
- ✅ Results visualization

### Security Features
- ✅ Blockchain verification
- ✅ Network validation
- ✅ Transaction confirmation
- ✅ Error handling

## 🚨 Troubleshooting

### Common Issues

1. **"MetaMask not found"**
   - Install MetaMask browser extension
   - Refresh the page

2. **"Wrong network"**
   - Switch to Hardhat network in MetaMask
   - Use the "Switch to Hardhat" button

3. **"Transaction failed"**
   - Check if Hardhat node is running
   - Verify contract addresses
   - Check account balance

4. **"Frontend not loading"**
   - Run `npm install` in frontend directory
   - Check if port 5173 is available

## 📊 Expected Demo Flow

1. ✅ Connect wallet successfully
2. ✅ Register voter (pre-verified by setup script)
3. ✅ Register candidate (pre-verified by setup script)
4. ✅ Cast vote successfully
5. ✅ View real-time results
6. ✅ Demonstrate mobile responsiveness

## 🎬 Video Production Tips

1. **Screen Resolution**: Use 1920x1080 for best quality
2. **Browser**: Use Chrome or Firefox for best compatibility
3. **Audio**: Use clear narration explaining each step
4. **Pacing**: Don't rush - let viewers see the UI details
5. **Highlights**: Use cursor highlighting to draw attention
6. **Transitions**: Smooth transitions between sections

## 🚀 Ready to Record!

Your Gen-Z Ballot demo is now ready for video production. The system includes:

- ✅ Clean, modern UI
- ✅ Complete functionality
- ✅ Pre-configured test data
- ✅ Responsive design
- ✅ Professional appearance

**Happy recording! 🎥**
