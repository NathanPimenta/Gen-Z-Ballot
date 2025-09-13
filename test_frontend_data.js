const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Testing Frontend Data Access");
  console.log("=" .repeat(50));

  const [deployer] = await ethers.getSigners();
  console.log("Using account:", deployer.address);

  // Contract addresses (same as frontend)
  const VOTER_CONTRACT = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  const CANDIDATE_CONTRACT = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
  const GENERAL_ELECTIONS_CONTRACT = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  // ABI for frontend testing
  const VOTER_ABI = [
    "function voterCount() external view returns (uint256)",
    "function getAllVoters() external view returns (address[] memory)",
    "function getVoterDetails(address voter) external view returns (string memory, uint256, string memory, bool, bool)"
  ];

  const CANDIDATE_ABI = [
    "function getAllCandidates() external view returns (address[] memory)",
    "function getCandidateDetails(uint candidateId) external view returns (string memory, string memory, string memory, uint256, bool, bool)"
  ];

  const GENERAL_ELECTIONS_ABI = [
    "function getElectionResults(uint256 constituencyId) external view returns (address[] memory, uint256[] memory, address[] memory, bool)"
  ];

  try {
    const voter = new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, deployer);
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);
    const generalElections = new ethers.Contract(GENERAL_ELECTIONS_CONTRACT, GENERAL_ELECTIONS_ABI, deployer);

    console.log("\n👥 VOTER DATA:");
    try {
      const voterCount = await voter.voterCount();
      console.log(`✅ Voter count: ${voterCount}`);
      
      const allVoters = await voter.getAllVoters();
      console.log(`✅ All voters: ${allVoters.length} addresses`);
      
      if (allVoters.length > 0) {
        for (let i = 0; i < allVoters.length; i++) {
          const details = await voter.getVoterDetails(allVoters[i]);
          console.log(`  Voter ${i + 1}: ${details[0]} (Age: ${details[1]})`);
          console.log(`    Address: ${allVoters[i]}`);
          console.log(`    Verified: ${details[4] ? 'Yes' : 'No'}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error with voter data: ${error.message}`);
    }

    console.log("\n🏛️ CANDIDATE DATA:");
    try {
      const allCandidates = await candidate.getAllCandidates();
      console.log(`✅ All candidates: ${allCandidates.length} addresses`);
      
      if (allCandidates.length > 0) {
        for (let i = 0; i < allCandidates.length; i++) {
          // Note: getCandidateDetails needs candidate ID, not address
          // We'll just show the address for now
          console.log(`  Candidate ${i + 1}: ${allCandidates[i]}`);
        }
      }
    } catch (error) {
      console.log(`❌ Error with candidate data: ${error.message}`);
    }

    console.log("\n📊 ELECTION RESULTS:");
    try {
      const results = await generalElections.getElectionResults(1);
      console.log(`✅ Results for constituency 1:`);
      console.log(`  Candidates: ${results[0].length}`);
      console.log(`  Vote counts: ${results[1].length}`);
      console.log(`  Winners: ${results[2].length}`);
      console.log(`  Result declared: ${results[3]}`);
    } catch (error) {
      console.log(`❌ Error with election results: ${error.message}`);
    }

    console.log("\n🎯 FRONTEND SHOULD SHOW:");
    console.log("1. Dashboard: 1 voter, 1 candidate, 0 votes");
    console.log("2. Cast Vote: 1 candidate available");
    console.log("3. Results: 0 votes cast");
    console.log("4. Officer Panel: 1 voter and 1 candidate to verify");

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
