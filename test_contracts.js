const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Contract Connections");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Contract addresses
  const VOTER_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const CANDIDATE_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // Simple ABI for testing
  const VOTER_ABI = [
    "function voterCount() external view returns (uint256)",
    "function getAllVoters() external view returns (address[] memory)"
  ];

  const CANDIDATE_ABI = [
    "function candidateCount() external view returns (uint256)",
    "function getAllCandidates() external view returns (address[] memory)"
  ];

  try {
    // Test Voter contract
    console.log("\n👥 Testing Voter Contract:");
    const voter = new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, deployer);
    
    try {
      const voterCount = await voter.voterCount();
      console.log(`✅ Voter count: ${voterCount}`);
    } catch (error) {
      console.log(`❌ Error getting voter count: ${error.message}`);
    }

    try {
      const allVoters = await voter.getAllVoters();
      console.log(`✅ All voters: ${allVoters.length} addresses`);
      if (allVoters.length > 0) {
        console.log("   Voter addresses:", allVoters);
      }
    } catch (error) {
      console.log(`❌ Error getting all voters: ${error.message}`);
    }

    // Test Candidate contract
    console.log("\n🏛️ Testing Candidate Contract:");
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);
    
    try {
      const candidateCount = await candidate.candidateCount();
      console.log(`✅ Candidate count: ${candidateCount}`);
    } catch (error) {
      console.log(`❌ Error getting candidate count: ${error.message}`);
    }

    try {
      const allCandidates = await candidate.getAllCandidates();
      console.log(`✅ All candidates: ${allCandidates.length} addresses`);
      if (allCandidates.length > 0) {
        console.log("   Candidate addresses:", allCandidates);
      }
    } catch (error) {
      console.log(`❌ Error getting all candidates: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Contract connection error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
