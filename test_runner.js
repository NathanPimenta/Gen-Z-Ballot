const { ethers } = require("hardhat");

// Test data from test_cases_data.md
const testData = {
  validVoters: [
    { name: "Alice Johnson", age: 25, aadhar: "123456789012", voterId: "VOTER001", constituency: 1 },
    { name: "Bob Smith", age: 30, aadhar: "987654321098", voterId: "VOTER002", constituency: 2 },
    { name: "Carol Davis", age: 22, aadhar: "555555555555", voterId: "VOTER003", constituency: 1 },
    { name: "David Wilson", age: 35, aadhar: "111111111111", voterId: "VOTER004", constituency: 3 },
    { name: "Eva Brown", age: 28, aadhar: "999999999999", voterId: "VOTER005", constituency: 2 }
  ],
  validCandidates: [
    { name: "John Progressive", party: "Progressive Party", age: 30, constituency: 1, deposit: "1.0" },
    { name: "Sarah Conservative", party: "Conservative Alliance", age: 35, constituency: 2, deposit: "2.5" },
    { name: "Mike Independent", party: "Independent", age: 28, constituency: 1, deposit: "0.5" },
    { name: "Lisa Green", party: "Green Party", age: 32, constituency: 3, deposit: "1.5" },
    { name: "Tom Liberal", party: "Liberal Democrats", age: 40, constituency: 2, deposit: "3.0" }
  ],
  invalidVoters: [
    { name: "Young Voter", age: 17, aadhar: "123456789012", voterId: "VOTER006", constituency: 1, expectedError: "Age under 18" },
    { name: "", age: 25, aadhar: "123456789012", voterId: "VOTER007", constituency: 1, expectedError: "Empty name" },
    { name: "No Aadhar", age: 25, aadhar: "", voterId: "VOTER008", constituency: 1, expectedError: "Empty Aadhar" },
    { name: "Invalid Constituency", age: 25, aadhar: "123456789012", voterId: "VOTER009", constituency: 0, expectedError: "Invalid constituency" }
  ],
  invalidCandidates: [
    { name: "Young Candidate", party: "Youth Party", age: 24, constituency: 1, deposit: "1.0", expectedError: "Age under 25" },
    { name: "", party: "Empty Party", age: 30, constituency: 1, deposit: "1.0", expectedError: "Empty name" },
    { name: "Low Deposit", party: "Cheap Party", age: 30, constituency: 1, deposit: "0.05", expectedError: "Deposit too low" },
    { name: "No Party", party: "", age: 30, constituency: 1, deposit: "1.0", expectedError: "Empty party" }
  ]
};

async function runTests() {
  console.log("🧪 Starting Gen-Z Ballot Test Suite...\n");
  
  const [deployer, officer1, voter1, voter2, voter3, candidate1, candidate2] = await ethers.getSigners();
  
  // Get contract instances
  const voter = await ethers.getContractAt("Voter", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const candidate = await ethers.getContractAt("Candidate", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  const generalElections = await ethers.getContractAt("GeneralElections", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

  let testResults = {
    passed: 0,
    failed: 0,
    total: 0
  };

  // Test 1: Valid Voter Registration
  console.log("📝 Test 1: Valid Voter Registration");
  console.log("=" .repeat(50));
  
  for (let i = 0; i < testData.validVoters.length; i++) {
    const voterData = testData.validVoters[i];
    testResults.total++;
    
    try {
      // Convert aadhar to hex if needed
      let aadharHex = voterData.aadhar;
      if (!aadharHex.startsWith('0x')) {
        const enc = new TextEncoder();
        const bytes = enc.encode(aadharHex);
        aadharHex = '0x' + Array.from(bytes).slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      
      const tx = await voter.connect(voter1).registerAsVoter(
        voterData.name,
        voterData.age,
        aadharHex,
        voterData.voterId,
        voterData.constituency
      );
      await tx.wait();
      
      console.log(`✅ Voter ${i + 1}: ${voterData.name} - PASSED`);
      testResults.passed++;
    } catch (error) {
      console.log(`❌ Voter ${i + 1}: ${voterData.name} - FAILED: ${error.message}`);
      testResults.failed++;
    }
  }

  // Test 2: Valid Candidate Registration
  console.log("\n🏛️ Test 2: Valid Candidate Registration");
  console.log("=" .repeat(50));
  
  for (let i = 0; i < testData.validCandidates.length; i++) {
    const candidateData = testData.validCandidates[i];
    testResults.total++;
    
    try {
      const tx = await candidate.connect(candidate1).candidateRegistration(
        "0x0000000000000000000000000000000000000000",
        candidateData.name,
        candidateData.party,
        ethers.parseEther(candidateData.deposit),
        candidateData.age,
        candidateData.constituency
      );
      await tx.wait();
      
      console.log(`✅ Candidate ${i + 1}: ${candidateData.name} - PASSED`);
      testResults.passed++;
    } catch (error) {
      console.log(`❌ Candidate ${i + 1}: ${candidateData.name} - FAILED: ${error.message}`);
      testResults.failed++;
    }
  }

  // Test 3: Officer Verification
  console.log("\n🔍 Test 3: Officer Verification");
  console.log("=" .repeat(50));
  
  try {
    // Verify first voter
    const verifyVoterTx = await voter.connect(officer1).verifyVoters(
      voter1.address,
      "0x313233343536373839303132",
      "VOTER001",
      true
    );
    await verifyVoterTx.wait();
    console.log("✅ Voter verification - PASSED");
    testResults.passed++;
  } catch (error) {
    console.log(`❌ Voter verification - FAILED: ${error.message}`);
    testResults.failed++;
  }
  testResults.total++;

  try {
    // Verify first candidate
    const verifyCandidateTx = await candidate.connect(officer1).candidateVerification(
      candidate1.address,
      true
    );
    await verifyCandidateTx.wait();
    console.log("✅ Candidate verification - PASSED");
    testResults.passed++;
  } catch (error) {
    console.log(`❌ Candidate verification - FAILED: ${error.message}`);
    testResults.failed++;
  }
  testResults.total++;

  // Test 4: Voting
  console.log("\n🗳️ Test 4: Voting");
  console.log("=" .repeat(50));
  
  try {
    // First, we need to get voter and candidate IDs
    // For now, let's use a simple approach with voterId = 1, candidateId = 1
    const voteTx = await generalElections.connect(voter1).registerVote(1, 1);
    await voteTx.wait();
    console.log("✅ Vote casting - PASSED");
    testResults.passed++;
  } catch (error) {
    console.log(`❌ Vote casting - FAILED: ${error.message}`);
    testResults.failed++;
  }
  testResults.total++;

  // Test 5: Results
  console.log("\n📊 Test 5: Results");
  console.log("=" .repeat(50));
  
  try {
    // Get results for constituency 1
    const results = await generalElections.getElectionResults(1);
    console.log("📈 Election Results for Constituency 1:");
    console.log(`  Candidates: ${results[0].length}`);
    console.log(`  Vote Counts: ${results[1].length}`);
    console.log(`  Winners: ${results[2].length}`);
    console.log(`  Result Declared: ${results[3]}`);
    console.log("✅ Results retrieval - PASSED");
    testResults.passed++;
  } catch (error) {
    console.log(`❌ Results retrieval - FAILED: ${error.message}`);
    testResults.failed++;
  }
  testResults.total++;

  // Test 6: Invalid Voter Registration (Edge Cases)
  console.log("\n⚠️ Test 6: Invalid Voter Registration (Edge Cases)");
  console.log("=" .repeat(50));
  
  for (let i = 0; i < testData.invalidVoters.length; i++) {
    const voterData = testData.invalidVoters[i];
    testResults.total++;
    
    try {
      // Convert aadhar to hex if needed
      let aadharHex = voterData.aadhar;
      if (aadharHex && !aadharHex.startsWith('0x')) {
        const enc = new TextEncoder();
        const bytes = enc.encode(aadharHex);
        aadharHex = '0x' + Array.from(bytes).slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
      }
      
      const tx = await voter.connect(voter2).registerAsVoter(
        voterData.name,
        voterData.age,
        aadharHex || "0x000000000000000000000000",
        voterData.voterId,
        voterData.constituency
      );
      await tx.wait();
      
      console.log(`❌ Invalid Voter ${i + 1}: ${voterData.name} - SHOULD HAVE FAILED`);
      testResults.failed++;
    } catch (error) {
      console.log(`✅ Invalid Voter ${i + 1}: ${voterData.name} - CORRECTLY FAILED (${voterData.expectedError})`);
      testResults.passed++;
    }
  }

  // Test 7: Invalid Candidate Registration (Edge Cases)
  console.log("\n⚠️ Test 7: Invalid Candidate Registration (Edge Cases)");
  console.log("=" .repeat(50));
  
  for (let i = 0; i < testData.invalidCandidates.length; i++) {
    const candidateData = testData.invalidCandidates[i];
    testResults.total++;
    
    try {
      const tx = await candidate.connect(candidate2).candidateRegistration(
        "0x0000000000000000000000000000000000000000",
        candidateData.name,
        candidateData.party,
        ethers.parseEther(candidateData.deposit),
        candidateData.age,
        candidateData.constituency
      );
      await tx.wait();
      
      console.log(`❌ Invalid Candidate ${i + 1}: ${candidateData.name} - SHOULD HAVE FAILED`);
      testResults.failed++;
    } catch (error) {
      console.log(`✅ Invalid Candidate ${i + 1}: ${candidateData.name} - CORRECTLY FAILED (${candidateData.expectedError})`);
      testResults.passed++;
    }
  }

  // Test Summary
  console.log("\n📋 Test Summary");
  console.log("=" .repeat(50));
  console.log(`Total Tests: ${testResults.total}`);
  console.log(`Passed: ${testResults.passed} ✅`);
  console.log(`Failed: ${testResults.failed} ❌`);
  console.log(`Success Rate: ${((testResults.passed / testResults.total) * 100).toFixed(2)}%`);
  
  if (testResults.failed === 0) {
    console.log("\n🎉 All tests passed! Your Gen-Z Ballot system is working perfectly!");
  } else {
    console.log(`\n⚠️ ${testResults.failed} tests failed. Please check the errors above.`);
  }
}

// Run the tests
runTests()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test runner error:", error);
    process.exit(1);
  });
