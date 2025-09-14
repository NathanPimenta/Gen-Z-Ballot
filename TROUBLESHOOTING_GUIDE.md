# 🔧 Gen-Z Ballot Troubleshooting Guide

## 🚨 **Issue: Voter Registration Shows 0 ETH but Data Not Reflecting**

### ✅ **What's Working Correctly:**
- Voter registration transactions are being submitted successfully
- Transactions are being confirmed on the blockchain
- Smart contracts are functioning properly
- Backend data is being stored correctly

### 🔍 **Root Cause:**
The issue is likely in the **frontend data refresh** after transactions complete.

## 🛠️ **Step-by-Step Fix:**

### **Step 1: Check Debug Panel**
1. Open the application at `http://localhost:5173`
2. Look for the **Debug Panel** in the top-right corner
3. Check if it shows:
   - Voters: 1 (or more)
   - Candidates: 0 (or more)
   - Votes: 0 (or more)

### **Step 2: Check Browser Console**
1. Open browser Developer Tools (F12)
2. Go to Console tab
3. Look for these messages:
   - `📊 Loading dashboard data...`
   - `📋 Contract instances loaded:`
   - Any error messages in red

### **Step 3: Manual Refresh Test**
1. Go to Dashboard page
2. Click the **🔄 Refresh** button
3. Check if data updates
4. Check console for `🔄 Manual refresh triggered`

### **Step 4: Verify MetaMask Connection**
1. Make sure MetaMask is connected
2. Check network is "Hardhat Local" (Chain ID: 1337)
3. Check account has ETH balance

## 🔧 **Quick Fixes:**

### **Fix 1: Clear Browser Cache**
```bash
# In browser, press Ctrl+Shift+R (hard refresh)
# Or clear browser cache completely
```

### **Fix 2: Restart Frontend**
```bash
# Stop frontend (Ctrl+C in terminal)
cd frontend
npm run dev
```

### **Fix 3: Check Contract Addresses**
Verify these addresses in `frontend/src/contracts/addresses.json`:
```json
{
  "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
  "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
  "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
  "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
}
```

### **Fix 4: Test with Debug Panel**
The debug panel will show real-time data. If it shows:
- ✅ Voters: 1+ → Data is working
- ❌ Error messages → Check console for details

## 🎯 **Expected Behavior:**

### **After Voter Registration:**
1. Transaction submits successfully
2. MetaMask shows transaction confirmation
3. Debug panel shows "Voters: 1"
4. Dashboard shows "Total Voters: 1"
5. Officer Panel shows the registered voter

### **After Candidate Registration:**
1. Transaction submits with ETH payment
2. MetaMask shows transaction confirmation
3. Debug panel shows "Candidates: 1"
4. Dashboard shows "Total Candidates: 1"
5. Officer Panel shows the registered candidate

## 🚨 **Common Issues & Solutions:**

### **Issue 1: "No Provider Found"**
**Solution:** Make sure MetaMask is installed and unlocked

### **Issue 2: "Wrong Network"**
**Solution:** Switch to Hardhat Local network (Chain ID: 1337)

### **Issue 3: "Transaction Failed"**
**Solution:** Check if you have enough ETH for gas fees

### **Issue 4: "Data Not Updating"**
**Solution:** 
1. Click refresh button
2. Check debug panel
3. Clear browser cache
4. Restart frontend

### **Issue 5: "Contract Not Found"**
**Solution:** Redeploy contracts:
```bash
npx hardhat run deploy_voting_system.js --network localhost
```

## 📱 **Testing Workflow:**

### **Complete Test:**
1. **Register Voter:**
   - Use Account #3 (Voter 1)
   - Fill form with Constituency 1
   - Submit transaction
   - Check debug panel shows "Voters: 1"

2. **Register Candidate:**
   - Use Account #5 (Candidate 1)
   - Fill form with Constituency 1
   - Submit transaction with 1 ETH
   - Check debug panel shows "Candidates: 1"

3. **Verify Both:**
   - Use Account #1 (Officer 1)
   - Go to Officer Panel
   - Verify voter and candidate
   - Check they show as verified

4. **Cast Vote:**
   - Use Account #3 (Voter 1)
   - Go to Cast Vote page
   - Select candidate and vote
   - Check debug panel shows "Votes: 1"

## 🔍 **Debug Information:**

### **Check Transaction Status:**
```bash
# In terminal, check if transaction was successful
npx hardhat run test_simple_voter.js --network localhost
```

### **Check Contract State:**
```bash
# Check current contract state
npx hardhat run test_frontend_connection.js --network localhost
```

### **Check Browser Console:**
Look for these messages:
- `📊 Loading dashboard data...`
- `📋 Contract instances loaded:`
- `✅ Voter data loaded:`
- `✅ Candidate data loaded:`

## ✅ **Success Indicators:**

- Debug panel shows correct counts
- Dashboard updates after refresh
- Officer Panel shows registered users
- No error messages in console
- Transactions appear in MetaMask history

## 🆘 **If Still Not Working:**

1. **Check all terminals are running:**
   - Hardhat node
   - Contract deployment
   - Frontend server

2. **Verify network connection:**
   - MetaMask connected to Hardhat Local
   - Chain ID: 1337

3. **Check contract addresses match:**
   - Compare addresses in console vs addresses.json

4. **Try different browser:**
   - Clear cache completely
   - Use incognito mode

The system is working correctly - the issue is just frontend data refresh! 🎉
