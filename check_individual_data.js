const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Checking Individual Data");
  console.log("=" .repeat(50));

  const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
  
  // Contract addresses
  const VOTER_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const CANDIDATE_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";

  // ABI for individual data
  const VOTER_ABI = [
    "function getVoterByAddress(address _voterAddress) external view returns (uint id, string memory name, uint age, bytes32 aadharNumber, bytes32 voterIdNumber, uint ConstituencyId, bool hasVoted, bool hasRegistered, bool isAllowedToVote)",
    "function voterCount() external view returns (uint256)"
  ];

  const CANDIDATE_ABI = [
    "function getCandidateByAddress(address _candidateAddress) external view returns (uint id, string memory name, string memory politicalParty, uint securityDepositInEthers, uint age, uint constituencyId, bool hasRegistered, bool isVerified)",
    "function candidateCount() external view returns (uint256)"
  ];

  try {
    const voter = new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, deployer);
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);

    console.log("👥 Voter Data:");
    console.log("Voter address:", voter1.address);
    
    try {
      const voterData = await voter.getVoterByAddress(voter1.address);
      console.log("✅ Voter data found:");
      console.log(`  ID: ${voterData[0]}`);
      console.log(`  Name: ${voterData[1]}`);
      console.log(`  Age: ${voterData[2]}`);
      console.log(`  Aadhar: ${voterData[3]}`);
      console.log(`  Voter ID: ${voterData[4]}`);
      console.log(`  Constituency: ${voterData[5]}`);
      console.log(`  Has Voted: ${voterData[6]}`);
      console.log(`  Has Registered: ${voterData[7]}`);
      console.log(`  Is Allowed to Vote: ${voterData[8]}`);
    } catch (error) {
      console.log(`❌ Error getting voter data: ${error.message}`);
    }

    console.log("\n🏛️ Candidate Data:");
    console.log("Candidate address:", candidate1.address);
    
    try {
      const candidateData = await candidate.getCandidateByAddress(candidate1.address);
      console.log("✅ Candidate data found:");
      console.log(`  ID: ${candidateData[0]}`);
      console.log(`  Name: ${candidateData[1]}`);
      console.log(`  Party: ${candidateData[2]}`);
      console.log(`  Security Deposit: ${candidateData[3]}`);
      console.log(`  Age: ${candidateData[4]}`);
      console.log(`  Constituency: ${candidateData[5]}`);
      console.log(`  Has Registered: ${candidateData[6]}`);
      console.log(`  Is Verified: ${candidateData[7]}`);
    } catch (error) {
      console.log(`❌ Error getting candidate data: ${error.message}`);
    }

    // Check counts
    try {
      const voterCount = await voter.voterCount();
      console.log(`\n📊 Total voters: ${voterCount}`);
    } catch (error) {
      console.log(`❌ Error getting voter count: ${error.message}`);
    }

    try {
      const candidateCount = await candidate.candidateCount();
      console.log(`📊 Total candidates: ${candidateCount}`);
    } catch (error) {
      console.log(`❌ Error getting candidate count: ${error.message}`);
    }

  } catch (error) {
    console.error("❌ Error:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
