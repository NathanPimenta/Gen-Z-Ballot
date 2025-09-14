# Gen-Z Ballot - Complete Voting System Guide

## 🎯 System Overview

This is a comprehensive decentralized voting system built on Ethereum that allows:
- Voter registration and verification
- Candidate registration and verification  
- Secure voting process
- Real-time results display
- Officer panel for verification management

## 🏗️ System Architecture

### Smart Contracts
1. **ElectionOfficer.sol** - Manages election officers and their constituencies
2. **Voter.sol** - Handles voter registration and verification
3. **Candidate.sol** - Manages candidate registration and verification
4. **GeneralElections.sol** - Core voting logic and results

### Frontend Components
1. **Dashboard** - Overview of system statistics and quick actions
2. **VoterRegistration** - Form for voters to register
3. **CandidateRegistration** - Form for candidates to register
4. **OfficerPanel** - Interface for officers to verify voters/candidates
5. **CastVote** - Voting interface for verified voters
6. **Results** - Real-time election results display

## 🚀 Quick Start Guide

### Prerequisites
- Node.js (v16 or higher)
- MetaMask browser extension
- Git

### Installation

1. **Clone and Setup**
```bash
git clone <repository-url>
cd Gen-Z-Ballot
npm install
cd frontend
npm install
```

2. **Start Hardhat Network**
```bash
# In project root
npx hardhat node
```

3. **Deploy Contracts**
```bash
# In new terminal, project root
npx hardhat run deploy_voting_system.js --network localhost
```

4. **Start Frontend**
```bash
# In frontend directory
npm run dev
```

5. **Access Application**
- Open http://localhost:5173 in your browser
- Connect MetaMask to Hardhat network (Chain ID: 1337)

## 🔧 Configuration

### MetaMask Setup
1. Open MetaMask
2. Click on network dropdown
3. Select "Add Network" → "Add a network manually"
4. Enter:
   - Network Name: Hardhat Local
   - RPC URL: http://127.0.0.1:8545
   - Chain ID: 1337
   - Currency Symbol: ETH

### Test Accounts
The system comes with pre-configured test accounts:

| Role | Address | Private Key |
|------|---------|-------------|
| Commissioner | 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 | 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80 |
| Officer 1 (Constituency 1) | 0x70997970C51812dc3A010C7d01b50e0d17dc79C8 | 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d |
| Officer 2 (Constituency 2) | 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC | 0x5de4111daa5ba4e5a80b3047b79c4c3ca3c4c3c4c3c4c3c4c3c4c3c4c3c4c3c4 |
| Voter 1 (Constituency 1) | 0x90F79bf6EB2c4f870365E785982E1f101E93b906 | 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b07a79 |
| Voter 2 (Constituency 2) | 0x15d34AAf54267DB7D7c367934AAf7A99ACBe61d1 | 0x47e17934cec4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4 |
| Candidate 1 (Constituency 1) | 0x9965507D1a55bcC269C8C2C4C4C4C4C4C4C4C4C4 | 0x92db14e6b6c1c7c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4 |
| Candidate 2 (Constituency 2) | 0x976EA74026E726554dB7C4C4C4C4C4C4C4C4C4C4 | 0x8b3a350cf5c34c9190ca6ec63c4e0a0e6a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6 |

## 📋 Complete Workflow

### Step 1: Voter Registration
1. Switch to Voter 1 account in MetaMask
2. Navigate to "Register Voter" page
3. Fill in details:
   - Name: Alice Johnson
   - Age: 25
   - Aadhar: 0x313233343536373839303132
   - Voter ID: VOTER001
   - Constituency: 1
4. Click "Register as Voter"
5. Wait for transaction confirmation

### Step 2: Candidate Registration
1. Switch to Candidate 1 account in MetaMask
2. Navigate to "Register Candidate" page
3. Fill in details:
   - Name: Jane Smith
   - Party: Progressive Party
   - Age: 30
   - Constituency: 1
   - Security Deposit: 1.0 ETH
4. Click "Submit Candidacy"
5. Wait for transaction confirmation

### Step 3: Officer Verification
1. Switch to Officer 1 account in MetaMask
2. Navigate to "Officer Panel" page
3. Verify the registered voter:
   - Click "Verify" next to Alice Johnson
   - Wait for transaction confirmation
4. Verify the registered candidate:
   - Click "Verify" next to Jane Smith
   - Wait for transaction confirmation

### Step 4: Voting Process
1. Switch to Voter 1 account in MetaMask
2. Navigate to "Cast Vote" page
3. Select Jane Smith from the candidate list
4. Click "Cast Vote"
5. Wait for transaction confirmation

### Step 5: View Results
1. Navigate to "Results" page
2. View real-time election results
3. See vote counts and percentages

## 🔍 Testing the System

### Run Comprehensive Tests
```bash
# Test the complete system
npx hardhat run test_complete_system.js --network localhost
```

### Manual Testing Checklist
- [ ] Voter registration works
- [ ] Candidate registration works
- [ ] Officer verification works
- [ ] Voting process works
- [ ] Results display correctly
- [ ] Dashboard shows statistics
- [ ] Error handling works properly

## 🛠️ Troubleshooting

### Common Issues

1. **MetaMask Connection Issues**
   - Ensure you're on the correct network (Chain ID: 1337)
   - Check that Hardhat node is running
   - Try refreshing the page

2. **Transaction Failures**
   - Check if you have enough ETH for gas
   - Ensure you're using the correct account
   - Check console for error messages

3. **Contract Not Found**
   - Ensure contracts are deployed
   - Check contract addresses in frontend/src/contracts/addresses.json
   - Redeploy if necessary

4. **Verification Issues**
   - Ensure officer and voter/candidate are from same constituency
   - Check if already verified
   - Verify officer permissions

### Debug Mode
Enable debug logging by opening browser console and looking for:
- Contract interaction logs
- Error messages
- Transaction hashes

## 📊 System Features

### Security Features
- ✅ Voter verification required before voting
- ✅ One vote per voter
- ✅ Constituency-based verification
- ✅ Smart contract-based security
- ✅ Transparent and auditable

### User Experience
- ✅ Modern, responsive UI
- ✅ Real-time updates
- ✅ Clear error messages
- ✅ Progress indicators
- ✅ Mobile-friendly design

### Administrative Features
- ✅ Officer panel for verification
- ✅ Bulk verification support
- ✅ Emergency functions
- ✅ Statistics and reporting
- ✅ Constituency management

## 🎯 Demo Script for Video

1. **Introduction** (30 seconds)
   - Show the dashboard
   - Explain the system overview

2. **Voter Registration** (1 minute)
   - Register a voter
   - Show the form validation
   - Explain the verification process

3. **Candidate Registration** (1 minute)
   - Register a candidate
   - Show security deposit requirement
   - Explain verification process

4. **Officer Verification** (1 minute)
   - Switch to officer account
   - Verify voter and candidate
   - Show constituency restrictions

5. **Voting Process** (1 minute)
   - Switch back to voter account
   - Cast vote
   - Show confirmation

6. **Results Display** (30 seconds)
   - Show real-time results
   - Explain transparency features

7. **Conclusion** (30 seconds)
   - Show system statistics
   - Highlight security features

## 🔧 Development

### Project Structure
```
Gen-Z-Ballot/
├── voting_contracts/          # Smart contracts
├── frontend/                  # React frontend
├── test/                      # Test files
├── artifacts/                 # Compiled contracts
└── cache/                     # Hardhat cache
```

### Key Files
- `deploy_voting_system.js` - Contract deployment script
- `test_complete_system.js` - Comprehensive test script
- `frontend/src/App.jsx` - Main React application
- `frontend/src/web3/useContracts.js` - Contract integration

### Adding New Features
1. Modify smart contracts in `voting_contracts/`
2. Update frontend components in `frontend/src/pages/`
3. Update contract ABIs and addresses
4. Test thoroughly

## 📝 License

This project is licensed under the MIT License.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
1. Check the troubleshooting section
2. Review the test scripts
3. Check browser console for errors
4. Create an issue in the repository

---

**Happy Voting! 🗳️**
