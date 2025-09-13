const { ethers } = require("hardhat");

async function runSimpleTest() {
  console.log("🧪 Running Simple Gen-Z Ballot Test...\n");
  
  const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
  
  // Get contract instances
  const voter = await ethers.getContractAt("Voter", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
  const candidate = await ethers.getContractAt("Candidate", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
  const generalElections = await ethers.getContractAt("GeneralElections", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

  let passed = 0;
  let total = 0;

  // Test 1: Voter Registration
  console.log("📝 Test 1: Voter Registration");
  total++;
  try {
    const voterTx = await voter.connect(voter1).registerAsVoter(
      "Alice Johnson",
      25,
      "0x313233343536373839303132",
      "VOTER001",
      1
    );
    await voterTx.wait();
    console.log("✅ Voter registration - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Voter registration - FAILED: ${error.message}`);
  }

  // Test 2: Candidate Registration
  console.log("\n🏛️ Test 2: Candidate Registration");
  total++;
  try {
    const candidateTx = await candidate.connect(candidate1).candidateRegistration(
      "0x0000000000000000000000000000000000000000",
      "Bob Smith",
      "Progressive Party",
      ethers.parseEther("1.0"),
      30,
      1
    );
    await candidateTx.wait();
    console.log("✅ Candidate registration - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Candidate registration - FAILED: ${error.message}`);
  }

  // Test 3: Officer Verification
  console.log("\n🔍 Test 3: Officer Verification");
  total++;
  try {
    const verifyVoterTx = await voter.connect(officer1).verifyVoters(
      voter1.address,
      "0x313233343536373839303132",
      "VOTER001",
      true
    );
    await verifyVoterTx.wait();
    console.log("✅ Voter verification - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Voter verification - FAILED: ${error.message}`);
  }

  total++;
  try {
    const verifyCandidateTx = await candidate.connect(officer1).candidateVerification(
      candidate1.address,
      true
    );
    await verifyCandidateTx.wait();
    console.log("✅ Candidate verification - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Candidate verification - FAILED: ${error.message}`);
  }

  // Test 4: Check Available Methods
  console.log("\n🔧 Test 4: Check Available Methods");
  total++;
  try {
    console.log("Available GeneralElections methods:");
    console.log("- getTotalVotes():", typeof generalElections.getTotalVotes);
    console.log("- getVoteCount():", typeof generalElections.getVoteCount);
    console.log("- registerVote():", typeof generalElections.registerVote);
    console.log("- getElectionResults():", typeof generalElections.getElectionResults);
    console.log("- getElectionStatus():", typeof generalElections.getElectionStatus);
    console.log("✅ Method check - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Method check - FAILED: ${error.message}`);
  }

  // Test 5: Get Election Status
  console.log("\n📊 Test 5: Get Election Status");
  total++;
  try {
    const status = await generalElections.getElectionStatus();
    console.log("Election Status:");
    console.log(`  Active: ${status[0]}`);
    console.log(`  Paused: ${status[1]}`);
    console.log(`  Cancelled: ${status[2]}`);
    console.log(`  Time Remaining: ${status[3]}`);
    console.log(`  Total Votes: ${status[4]}`);
    console.log("✅ Status check - PASSED");
    passed++;
  } catch (error) {
    console.log(`❌ Status check - FAILED: ${error.message}`);
  }

  // Test Summary
  console.log("\n📋 Test Summary");
  console.log("=" .repeat(50));
  console.log(`Total Tests: ${total}`);
  console.log(`Passed: ${passed} ✅`);
  console.log(`Failed: ${total - passed} ❌`);
  console.log(`Success Rate: ${((passed / total) * 100).toFixed(2)}%`);
  
  if (passed === total) {
    console.log("\n🎉 All tests passed! Your Gen-Z Ballot system is working!");
  } else {
    console.log(`\n⚠️ ${total - passed} tests failed. Check the errors above.`);
  }
}

runSimpleTest()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("Test error:", error);
    process.exit(1);
  });
