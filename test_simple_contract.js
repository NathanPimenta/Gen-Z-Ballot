const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Simple Contract Calls");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Contract addresses
  const VOTER_CONTRACT = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  const CANDIDATE_CONTRACT = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  // Very simple ABI - just basic functions
  const VOTER_ABI = [
    "function startTime() external view returns (uint256)",
    "function endTime() external view returns (uint256)"
  ];

  const CANDIDATE_ABI = [
    "function startTime() external view returns (uint256)",
    "function endTime() external view returns (uint256)"
  ];

  try {
    console.log("\n👥 Testing Voter Contract Basic Functions:");
    const voter = new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, deployer);
    
    try {
      const startTime = await voter.startTime();
      console.log(`✅ Voter startTime: ${startTime}`);
    } catch (error) {
      console.log(`❌ Error getting startTime: ${error.message}`);
    }

    try {
      const endTime = await voter.endTime();
      console.log(`✅ Voter endTime: ${endTime}`);
    } catch (error) {
      console.log(`❌ Error getting endTime: ${error.message}`);
    }

    console.log("\n🏛️ Testing Candidate Contract Basic Functions:");
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);
    
    try {
      const startTime = await candidate.startTime();
      console.log(`✅ Candidate startTime: ${startTime}`);
    } catch (error) {
      console.log(`❌ Error getting startTime: ${error.message}`);
    }

    try {
      const endTime = await candidate.endTime();
      console.log(`✅ Candidate endTime: ${endTime}`);
    } catch (error) {
      console.log(`❌ Error getting endTime: ${error.message}`);
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
