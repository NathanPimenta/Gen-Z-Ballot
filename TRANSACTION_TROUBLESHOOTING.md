# 🔧 Transaction Troubleshooting Guide

## 🚨 **Common Issues & Solutions**

### **Issue 1: "Transaction taking 0 ETH" Error**

**Problem**: Transactions appear to cost 0 ETH but fail or don't execute.

**Root Causes**:
1. Wrong function name being called
2. Incorrect parameters passed to contract functions
3. Contract not properly deployed
4. Network connection issues

**Solutions**:

#### **Check 1: Verify Contract Functions**
```bash
# Check if contracts are deployed correctly
npx hardhat run test_transactions.js --network localhost
```

#### **Check 2: Verify Network Connection**
```javascript
// In browser console (F12)
console.log("Network ID:", await window.ethereum.request({ method: 'eth_chainId' }));
console.log("Account:", await window.ethereum.request({ method: 'eth_accounts' }));
```

#### **Check 3: Check Contract Addresses**
```javascript
// Verify addresses in frontend/src/contracts/addresses.json match deployed contracts
```

---

### **Issue 2: Dashboard Not Updating**

**Problem**: Dashboard statistics don't refresh after transactions.

**Solutions**:

#### **Solution 1: Manual Refresh**
- Click the "🔄 Refresh" button on the dashboard
- Dashboard auto-refreshes every 5 seconds

#### **Solution 2: Check Browser Console**
```javascript
// Open browser console (F12) and check for errors
console.log("Contract calls working:", await window.ethereum.request({ method: 'eth_accounts' }));
```

---

### **Issue 3: Voting Function Errors**

**Problem**: Vote casting fails with various errors.

**Root Causes**:
1. Wrong function name (`castVote` vs `registerVote`)
2. Wrong parameters (address vs ID)
3. Voter not verified
4. Candidate not verified

**Solutions**:

#### **Check Voter Status**
```javascript
// Check if voter is registered and verified
const voter = await Voter();
const voterDetails = await voter.getVoterByAddress(voterAddress);
console.log("Voter verified:", voterDetails.isAllowedToVote);
```

#### **Check Candidate Status**
```javascript
// Check if candidate is registered and verified
const candidate = await Candidate();
const candidateDetails = await candidate.getCandidateDetails(candidateId);
console.log("Candidate verified:", candidateDetails.canContest);
```

---

## 🧪 **Testing Steps**

### **Step 1: Test Contract Deployment**
```bash
# Terminal 1: Start Hardhat
npx hardhat node

# Terminal 2: Deploy contracts
npx hardhat run deploy_voting_system.js --network localhost

# Terminal 3: Test transactions
npx hardhat run test_transactions.js --network localhost
```

### **Step 2: Test Frontend Connection**
1. Open `http://localhost:5173`
2. Connect MetaMask to Hardhat network
3. Check browser console for errors
4. Try registering a voter

### **Step 3: Test Complete Flow**
1. Register as voter
2. Register as candidate (with different account)
3. Switch to officer account
4. Verify voter and candidate
5. Switch to voter account
6. Cast vote
7. Check dashboard updates

---

## 🔍 **Debugging Commands**

### **Check Contract Status**
```bash
# Check if Hardhat is running
curl http://localhost:8545

# Check contract deployment
npx hardhat run test_transactions.js --network localhost
```

### **Check MetaMask Connection**
```javascript
// In browser console
console.log("MetaMask connected:", !!window.ethereum);
console.log("Current account:", await window.ethereum.request({ method: 'eth_accounts' }));
console.log("Current network:", await window.ethereum.request({ method: 'eth_chainId' }));
```

### **Check Contract Functions**
```javascript
// Test contract calls directly
const provider = new ethers.BrowserProvider(window.ethereum);
const signer = await provider.getSigner();
const voter = new ethers.Contract(voterAddress, voterABI, signer);
console.log("Voter count:", await voter.voterCount());
```

---

## 📊 **Expected Transaction Costs**

### **Typical Gas Usage**:
- Voter Registration: ~150,000 gas
- Candidate Registration: ~200,000 gas
- Voter Verification: ~80,000 gas
- Candidate Verification: ~60,000 gas
- Vote Casting: ~120,000 gas

### **Gas Price**: 0 (on Hardhat local network)

---

## ✅ **Verification Checklist**

- [ ] Hardhat node is running on port 8545
- [ ] Contracts deployed successfully
- [ ] MetaMask connected to Hardhat network (Chain ID: 1337)
- [ ] Test accounts imported with 10,000 ETH each
- [ ] Frontend loads without console errors
- [ ] Voter registration works
- [ ] Candidate registration works
- [ ] Officer verification works
- [ ] Vote casting works
- [ ] Dashboard updates after transactions

---

## 🚀 **Quick Fix Commands**

### **Reset Everything**
```bash
# Stop all processes (Ctrl+C)
# Then restart:

# Terminal 1
npx hardhat node

# Terminal 2
npx hardhat run deploy_voting_system.js --network localhost

# Terminal 3
npx hardhat run demo_setup.js --network localhost

# Terminal 4
cd frontend && npm run dev
```

### **Clear MetaMask Cache**
1. Open MetaMask
2. Go to Settings > Advanced
3. Click "Reset Account"
4. Re-import test accounts

### **Clear Browser Cache**
1. Press Ctrl+Shift+R (hard refresh)
2. Or clear browser cache completely

---

## 📞 **Still Having Issues?**

If problems persist:

1. **Check the test script output**:
   ```bash
   npx hardhat run test_transactions.js --network localhost
   ```

2. **Check browser console** for JavaScript errors

3. **Verify contract addresses** match between deployment and frontend

4. **Ensure all dependencies** are installed:
   ```bash
   npm install
   cd frontend && npm install
   ```

5. **Check network connectivity** between frontend and Hardhat node

The system should work perfectly once these issues are resolved! 🎉
