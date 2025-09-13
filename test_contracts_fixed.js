const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Contracts with Correct Methods");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Contract addresses
  const VOTER_CONTRACT = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  const CANDIDATE_CONTRACT = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  // Correct ABI for testing
  const VOTER_ABI = [
    "function voterCount() external view returns (uint256)",
    "function getAllVoters() external view returns (address[] memory)"
  ];

  const CANDIDATE_ABI = [
    "function getAllCandidates() external view returns (address[] memory)"
  ];

  try {
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

    console.log("\n🏛️ Testing Candidate Contract:");
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);
    
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
