# Gen-Z Ballot - Complete Demo Test Script

## 🎬 Video Demo Script

This script provides a complete walkthrough of the Gen-Z Ballot voting system for your video demonstration.

## 📋 Prerequisites Setup

### 1. Start Hardhat Network
```bash
# Terminal 1 - Start Hardhat node
npx hardhat node
```

### 2. Deploy Contracts
```bash
# Terminal 2 - Deploy contracts
npx hardhat run scripts/deploy.js --network localhost
```

### 3. Start Frontend
```bash
# Terminal 3 - Start React frontend
cd frontend
npm install
npm run dev
```

### 4. Setup MetaMask
- Open MetaMask
- Add Hardhat network:
  - Network Name: `Hardhat Local`
  - RPC URL: `http://localhost:8545`
  - Chain ID: `1337`
  - Currency Symbol: `ETH`

## 🎥 Demo Script

### Scene 1: Introduction (30 seconds)
**Narrator:** "Welcome to Gen-Z Ballot, a decentralized voting system built on Ethereum. This modern platform allows secure, transparent, and tamper-proof elections using blockchain technology."

**Action:** 
- Show the dashboard
- Point out the modern UI design
- Highlight the "Ethereum · Hardhat (1337)" badge

### Scene 2: Connect Wallet (30 seconds)
**Narrator:** "First, let's connect our MetaMask wallet to the Hardhat local network."

**Action:**
- Click "Connect Wallet"
- Show MetaMask popup
- Connect to Hardhat network
- Show connected state with address display

### Scene 3: Voter Registration (60 seconds)
**Narrator:** "Now let's register as a voter. The system requires verification by election officers, ensuring only eligible voters can participate."

**Action:**
- Navigate to "Register Voter"
- Fill out the form:
  - Name: "Alice Johnson"
  - Age: "25"
  - Aadhar: "123456789012"
  - Voter ID: "VOTER001"
  - Constituency: "1"
- Click "Register as Voter"
- Show loading state
- Show success message

### Scene 4: Candidate Registration (60 seconds)
**Narrator:** "Next, let's register as a candidate. Candidates must provide a security deposit and meet age requirements."

**Action:**
- Navigate to "Register Candidate"
- Fill out the form:
  - Name: "Bob Smith"
  - Party: "Progressive Party"
  - Age: "30"
  - Constituency: "1"
  - Security Deposit: "1.0"
- Click "Submit Candidacy"
- Show loading state
- Show success message

### Scene 5: Officer Verification (45 seconds)
**Narrator:** "Now we need to verify our registrations as an election officer. This simulates the real-world verification process."

**Action:**
- Open Hardhat console: `npx hardhat console --network localhost`
- Run verification commands:
```javascript
const [deployer, officer1] = await ethers.getSigners();
const voter = await ethers.getContractAt("Voter", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
const candidate = await ethers.getContractAt("Candidate", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");

// Verify voter
await voter.connect(officer1).verifyVoters("0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65", "0x313233343536373839303132", "VOTER001", true);

// Verify candidate
await candidate.connect(officer1).candidateVerification("0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc", true);
```

### Scene 6: Cast Vote (60 seconds)
**Narrator:** "Now let's cast our vote. The interface shows all verified candidates with their details."

**Action:**
- Navigate to "Cast Vote"
- Show candidate cards
- Select a candidate
- Click "Cast Vote"
- Show loading state
- Show success message

### Scene 7: View Results (45 seconds)
**Narrator:** "Finally, let's view the real-time election results with vote counts and percentages."

**Action:**
- Navigate to "Results"
- Show the results dashboard
- Point out vote counts and percentages
- Show progress bars
- Highlight blockchain verification info

### Scene 8: Mobile Responsiveness (30 seconds)
**Narrator:** "The system is fully responsive and works seamlessly on mobile devices."

**Action:**
- Resize browser window to mobile size
- Show responsive navigation
- Demonstrate mobile-friendly forms
- Show touch interactions

## 🎯 Key Features to Highlight

### 1. Modern UI/UX
- Dark theme with glassmorphism effects
- Smooth animations and transitions
- Professional typography
- Consistent design system

### 2. Security Features
- MetaMask integration
- Network verification
- Form validation
- Transaction confirmation

### 3. User Experience
- Intuitive navigation
- Clear feedback messages
- Loading states
- Error handling

### 4. Blockchain Integration
- Real-time contract interaction
- Transaction status updates
- Network switching
- Address verification

## 📝 Demo Checklist

- [ ] Hardhat network running on port 8545
- [ ] Contracts deployed successfully
- [ ] Frontend running on localhost:5173
- [ ] MetaMask connected to Hardhat network
- [ ] Test accounts loaded with ETH
- [ ] All pages accessible and functional
- [ ] Forms working with validation
- [ ] Transactions completing successfully
- [ ] Results updating in real-time

## 🎬 Video Tips

1. **Screen Recording**: Use OBS or similar software for high-quality recording
2. **Audio**: Clear narration explaining each step
3. **Pacing**: Don't rush - let viewers see the UI details
4. **Highlights**: Use cursor highlighting to draw attention
5. **Transitions**: Smooth transitions between sections
6. **Mobile Demo**: Show responsive design on actual mobile device

## 🚀 Quick Start Commands

```bash
# Terminal 1: Start Hardhat
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run scripts/deploy.js --network localhost

# Terminal 3: Start frontend
cd frontend && npm run dev

# Terminal 4: Verify registrations (after registration)
npx hardhat console --network localhost
```

## 📊 Expected Results

After following this script, you should have:
- ✅ Connected wallet
- ✅ Registered voter (verified)
- ✅ Registered candidate (verified)
- ✅ Cast vote successfully
- ✅ Viewed real-time results
- ✅ Demonstrated mobile responsiveness

This creates a complete, professional demonstration of your decentralized voting system!
