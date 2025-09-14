# 🎯 **Gen-Z Ballot Demo Accounts Guide**

## 📋 **Fresh Demo Accounts for Testing**

### **🏛️ Election Officers (Can verify voters and candidates)**

#### **Officer 1 (Constituency 1)**
- **Address:** `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`
- **Private Key:** `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
- **Can verify:** Voters and candidates from Constituency 1

#### **Officer 2 (Constituency 2)**
- **Address:** `0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC`
- **Private Key:** `0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`
- **Can verify:** Voters and candidates from Constituency 2

#### **Officer 3 (Constituency 3)**
- **Address:** `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- **Private Key:** `0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`
- **Can verify:** Voters and candidates from Constituency 3

### **🗳️ Voters (Can register and vote)**

#### **Fresh Voter 1 (Constituency 1) - RECOMMENDED**
- **Address:** `0x90F79bf6EB2c4f870365E785982E1f101E93b906`
- **Private Key:** `0x47e179ec257488ca7df7c4e9b1d39cbbae4845eba3f2af9f084166d63c69671`
- **Status:** ✅ Registered, ✅ Verified, ❌ Has NOT voted yet
- **Best for:** Testing Cast Vote functionality

#### **Fresh Voter 2 (Constituency 2)**
- **Address:** `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key:** `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`
- **Status:** ✅ Registered, ✅ Verified, ❌ Has NOT voted yet

### **🏛️ Candidates (Can register and contest)**

#### **Fresh Candidate 1 (Constituency 2) - RECOMMENDED**
- **Address:** `0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65`
- **Private Key:** `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`
- **Status:** ✅ Registered, ❌ Not verified yet
- **Best for:** Testing Candidate Registration

#### **Existing Candidates**
- **John (Progressive Party)** - Constituency 1 - ✅ Verified
- **Test Candidate (Test Party)** - Constituency 1 - ❌ Not verified
- **Fresh Candidate (Fresh Party)** - Constituency 2 - ❌ Not verified

## 🚀 **Complete Demo Workflow**

### **Step 1: Test Officer Panel**
1. **Import Officer 1** in MetaMask:
   - Private Key: `0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`
2. **Go to Officer Panel**
3. **Verify voters and candidates** from Constituency 1

### **Step 2: Test Candidate Registration**
1. **Import Fresh Candidate 1** in MetaMask:
   - Private Key: `0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`
2. **Go to Candidate Registration**
3. **Fill the form** with:
   - Name: "Demo Candidate"
   - Party: "Demo Party"
   - Age: 30
   - Constituency: 2
   - Security Deposit: 1 ETH
4. **Submit** - should work without gas estimation errors

### **Step 3: Test Voter Registration**
1. **Import Fresh Voter 1** in MetaMask:
   - Private Key: `0x47e179ec257488ca7df7c4e9b1d39cbbae4845eba3f2af9f084166d63c69671`
2. **Go to Voter Registration**
3. **Fill the form** and submit
4. **Switch to Officer 1** and verify the voter

### **Step 4: Test Voting**
1. **Use Fresh Voter 1** (already verified)
2. **Go to Cast Vote**
3. **Should see candidates** from Constituency 1
4. **Cast your vote**

### **Step 5: Test Results**
1. **Go to Results page**
2. **Should see vote counts** and percentages

## 🔧 **Troubleshooting**

### **If Candidate Registration Fails:**
- ✅ **Use Fresh Candidate 1** (not already registered)
- ✅ **Check MetaMask** is on Hardhat Local (Chain ID: 1337)
- ✅ **Ensure sufficient ETH** for deposit + gas fees
- ✅ **Check browser console** for detailed error messages

### **If Cast Vote Shows No Candidates:**
- ✅ **Use Fresh Voter 1** (verified and hasn't voted)
- ✅ **Check constituency matching** (voter and candidates must be same constituency)
- ✅ **Refresh the page** after switching accounts

### **If Officer Panel Shows Authorization Error:**
- ✅ **Use Officer 1, 2, or 3** accounts (not voter/candidate accounts)
- ✅ **Check MetaMask** is connected to correct account

## 📱 **MetaMask Setup**

1. **Open MetaMask**
2. **Click account circle** (top right)
3. **Click "Import Account"**
4. **Select "Private Key"**
5. **Paste the private key** from above
6. **Click "Import"**
7. **Make sure you're on "Hardhat Local"** network (Chain ID: 1337)

## ✅ **Expected Results**

- **Officer Panel:** Beautiful UI with voter/candidate verification
- **Candidate Registration:** Works without gas estimation errors
- **Voter Registration:** Works with 0 ETH (correct behavior)
- **Cast Vote:** Shows available candidates for voting
- **Results:** Displays vote counts and percentages

## 🎉 **All Systems Working!**

The Gen-Z Ballot system is now fully functional with:
- ✅ **Modern UI** with dark theme and gradients
- ✅ **Complete voting workflow** from registration to results
- ✅ **Proper error handling** and user feedback
- ✅ **Real-time data updates** and debugging
- ✅ **Multi-constituency support** with officer verification

**Ready for demo! 🚀**
