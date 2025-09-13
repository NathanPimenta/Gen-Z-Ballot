# 🧪 Gen-Z Ballot Test Cases & Sample Data

## 📋 Test Case 1: Voter Registration

### Test Data Set 1 - Valid Voters
```json
{
  "voters": [
    {
      "name": "Alice Johnson",
      "age": 25,
      "aadhar": "123456789012",
      "aadharHex": "0x313233343536373839303132",
      "voterId": "VOTER001",
      "constituency": 1,
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Bob Smith",
      "age": 30,
      "aadhar": "987654321098",
      "aadharHex": "0x393837363534333231303938",
      "voterId": "VOTER002",
      "constituency": 2,
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Carol Davis",
      "age": 22,
      "aadhar": "555555555555",
      "aadharHex": "0x353535353535353535353535",
      "voterId": "VOTER003",
      "constituency": 1,
      "expectedResult": "SUCCESS"
    },
    {
      "name": "David Wilson",
      "age": 35,
      "aadhar": "111111111111",
      "aadharHex": "0x313131313131313131313131",
      "voterId": "VOTER004",
      "constituency": 3,
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Eva Brown",
      "age": 28,
      "aadhar": "999999999999",
      "aadharHex": "0x393939393939393939393939",
      "voterId": "VOTER005",
      "constituency": 2,
      "expectedResult": "SUCCESS"
    }
  ]
}
```

### Test Data Set 2 - Invalid Voters (Edge Cases)
```json
{
  "invalidVoters": [
    {
      "name": "Young Voter",
      "age": 17,
      "aadhar": "123456789012",
      "voterId": "VOTER006",
      "constituency": 1,
      "expectedResult": "FAIL - Age under 18"
    },
    {
      "name": "",
      "age": 25,
      "aadhar": "123456789012",
      "voterId": "VOTER007",
      "constituency": 1,
      "expectedResult": "FAIL - Empty name"
    },
    {
      "name": "No Aadhar",
      "age": 25,
      "aadhar": "",
      "voterId": "VOTER008",
      "constituency": 1,
      "expectedResult": "FAIL - Empty Aadhar"
    },
    {
      "name": "Invalid Constituency",
      "age": 25,
      "aadhar": "123456789012",
      "voterId": "VOTER009",
      "constituency": 0,
      "expectedResult": "FAIL - Invalid constituency"
    }
  ]
}
```

## 🏛️ Test Case 2: Candidate Registration

### Test Data Set 1 - Valid Candidates
```json
{
  "candidates": [
    {
      "name": "John Progressive",
      "party": "Progressive Party",
      "age": 30,
      "constituency": 1,
      "deposit": "1.0",
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Sarah Conservative",
      "party": "Conservative Alliance",
      "age": 35,
      "constituency": 2,
      "deposit": "2.5",
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Mike Independent",
      "party": "Independent",
      "age": 28,
      "constituency": 1,
      "deposit": "0.5",
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Lisa Green",
      "party": "Green Party",
      "age": 32,
      "constituency": 3,
      "deposit": "1.5",
      "expectedResult": "SUCCESS"
    },
    {
      "name": "Tom Liberal",
      "party": "Liberal Democrats",
      "age": 40,
      "constituency": 2,
      "deposit": "3.0",
      "expectedResult": "SUCCESS"
    }
  ]
}
```

### Test Data Set 2 - Invalid Candidates (Edge Cases)
```json
{
  "invalidCandidates": [
    {
      "name": "Young Candidate",
      "party": "Youth Party",
      "age": 24,
      "constituency": 1,
      "deposit": "1.0",
      "expectedResult": "FAIL - Age under 25"
    },
    {
      "name": "",
      "party": "Empty Party",
      "age": 30,
      "constituency": 1,
      "deposit": "1.0",
      "expectedResult": "FAIL - Empty name"
    },
    {
      "name": "Low Deposit",
      "party": "Cheap Party",
      "age": 30,
      "constituency": 1,
      "deposit": "0.05",
      "expectedResult": "FAIL - Deposit too low"
    },
    {
      "name": "No Party",
      "party": "",
      "age": 30,
      "constituency": 1,
      "deposit": "1.0",
      "expectedResult": "FAIL - Empty party"
    }
  ]
}
```

## 🗳️ Test Case 3: Voting Scenarios

### Test Data Set 1 - Valid Votes
```json
{
  "votes": [
    {
      "voterAddress": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "candidateAddress": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "expectedResult": "SUCCESS"
    },
    {
      "voterAddress": "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
      "candidateAddress": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "expectedResult": "SUCCESS"
    }
  ]
}
```

### Test Data Set 2 - Invalid Votes
```json
{
  "invalidVotes": [
    {
      "voterAddress": "0x0000000000000000000000000000000000000000",
      "candidateAddress": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "expectedResult": "FAIL - Invalid voter address"
    },
    {
      "voterAddress": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "candidateAddress": "0x0000000000000000000000000000000000000000",
      "expectedResult": "FAIL - Invalid candidate address"
    }
  ]
}
```

## 📊 Test Case 4: Results Verification

### Expected Results After Test Votes
```json
{
  "expectedResults": [
    {
      "candidateAddress": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "candidateName": "Bob Smith",
      "party": "Progressive Party",
      "constituency": 1,
      "voteCount": 2,
      "percentage": "100.0"
    }
  ],
  "totalVotes": 2,
  "totalCandidates": 1,
  "totalVoters": 5
}
```

## 🔧 Test Case 5: Officer Verification

### Verification Test Data
```json
{
  "verifications": [
    {
      "type": "voter",
      "address": "0x15d34AAf54267DB7D7c367839AAf71A00a2C6A65",
      "aadhar": "0x313233343536373839303132",
      "voterId": "VOTER001",
      "status": true,
      "expectedResult": "SUCCESS"
    },
    {
      "type": "candidate",
      "address": "0x9965507D1a55bcC2695C58ba16FB37d819B0A4dc",
      "status": true,
      "expectedResult": "SUCCESS"
    }
  ]
}
```

## 🎯 Complete Test Scenario

### Scenario 1: Full Election Flow
```javascript
// Step 1: Register 5 voters
const voters = [
  { name: "Alice Johnson", age: 25, aadhar: "123456789012", voterId: "VOTER001", constituency: 1 },
  { name: "Bob Smith", age: 30, aadhar: "987654321098", voterId: "VOTER002", constituency: 2 },
  { name: "Carol Davis", age: 22, aadhar: "555555555555", voterId: "VOTER003", constituency: 1 },
  { name: "David Wilson", age: 35, aadhar: "111111111111", voterId: "VOTER004", constituency: 3 },
  { name: "Eva Brown", age: 28, aadhar: "999999999999", voterId: "VOTER005", constituency: 2 }
];

// Step 2: Register 3 candidates
const candidates = [
  { name: "John Progressive", party: "Progressive Party", age: 30, constituency: 1, deposit: "1.0" },
  { name: "Sarah Conservative", party: "Conservative Alliance", age: 35, constituency: 2, deposit: "2.5" },
  { name: "Mike Independent", party: "Independent", age: 28, constituency: 1, deposit: "0.5" }
];

// Step 3: Verify all registrations
// (Use officer account to verify)

// Step 4: Cast votes
const votes = [
  { voter: "Alice", candidate: "John Progressive" },
  { voter: "Bob", candidate: "Sarah Conservative" },
  { voter: "Carol", candidate: "John Progressive" },
  { voter: "David", candidate: "Mike Independent" },
  { voter: "Eva", candidate: "Sarah Conservative" }
];

// Step 5: Check results
// Expected: John Progressive: 2 votes, Sarah Conservative: 2 votes, Mike Independent: 1 vote
```

## 🧪 Automated Test Script

### Test Script Data
```javascript
const testData = {
  // Voter test cases
  validVoters: [
    { name: "Test Voter 1", age: 25, aadhar: "123456789012", voterId: "TV001", constituency: 1 },
    { name: "Test Voter 2", age: 30, aadhar: "987654321098", voterId: "TV002", constituency: 2 },
    { name: "Test Voter 3", age: 22, aadhar: "555555555555", voterId: "TV003", constituency: 1 }
  ],
  
  // Candidate test cases
  validCandidates: [
    { name: "Test Candidate 1", party: "Test Party 1", age: 30, constituency: 1, deposit: "1.0" },
    { name: "Test Candidate 2", party: "Test Party 2", age: 35, constituency: 2, deposit: "2.0" }
  ],
  
  // Edge cases
  edgeCases: {
    underageVoter: { name: "Young Voter", age: 17, aadhar: "123456789012", voterId: "TV004", constituency: 1 },
    underageCandidate: { name: "Young Candidate", party: "Youth Party", age: 24, constituency: 1, deposit: "1.0" },
    lowDeposit: { name: "Cheap Candidate", party: "Cheap Party", age: 30, constituency: 1, deposit: "0.05" },
    emptyName: { name: "", party: "Empty Party", age: 30, constituency: 1, deposit: "1.0" }
  }
};
```

## 📱 UI Test Cases

### Responsive Design Test Data
```json
{
  "screenSizes": [
    { "name": "Mobile", "width": 375, "height": 667 },
    { "name": "Tablet", "width": 768, "height": 1024 },
    { "name": "Desktop", "width": 1920, "height": 1080 },
    { "name": "Large Desktop", "width": 2560, "height": 1440 }
  ]
}
```

### Form Validation Test Data
```json
{
  "formTests": [
    {
      "field": "name",
      "validInputs": ["Alice Johnson", "Bob Smith", "Carol Davis"],
      "invalidInputs": ["", "   ", "A", "123456789012345678901234567890123456789012345678901234567890"]
    },
    {
      "field": "age",
      "validInputs": [18, 25, 30, 65],
      "invalidInputs": [17, 0, -5, "abc", ""]
    },
    {
      "field": "aadhar",
      "validInputs": ["123456789012", "0x313233343536373839303132"],
      "invalidInputs": ["", "12345678901", "1234567890123", "abc"]
    }
  ]
}
```

## 🎬 Demo Video Test Data

### Quick Demo Data
```javascript
// For your video demo, use this simplified data:
const demoData = {
  voter: {
    name: "Alice Johnson",
    age: 25,
    aadhar: "123456789012",
    voterId: "VOTER001",
    constituency: 1
  },
  candidate: {
    name: "Bob Smith",
    party: "Progressive Party",
    age: 30,
    constituency: 1,
    deposit: "1.0"
  },
  expectedResults: {
    totalVoters: 1,
    totalCandidates: 1,
    totalVotes: 1
  }
};
```

This comprehensive test data covers all aspects of your Gen-Z Ballot system and provides realistic scenarios for testing and demonstration purposes! 🧪✨
