const { ethers } = require("hardhat");

async function main() {
  console.log("🔍 Verifying Frontend Data");
  console.log("=" .repeat(50));

  const [deployer, officer1] = await ethers.getSigners();
  
  // Contract addresses (from deployed contracts)
  const VOTER_CONTRACT = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
  const CANDIDATE_CONTRACT = "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0";
  const GENERAL_ELECTIONS_CONTRACT = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9";

  // ABI for contracts
  const VOTER_ABI = [
    "function getAllVoters() external view returns (address[] memory)",
    "function getVoterDetails(address voter) external view returns (string memory, uint256, string memory, bool, bool)"
  ];

  const CANDIDATE_ABI = [
    "function getAllCandidates() external view returns (address[] memory)",
    "function getCandidateDetails(address candidate) external view returns (string memory, string memory, string memory, uint256, bool, bool)"
  ];

  const GENERAL_ELECTIONS_ABI = [
    "function getElectionResults(uint256 constituencyId) external view returns (address[] memory, uint256[] memory, address[] memory, bool)"
  ];

  try {
    // Get contract instances
    const voter = new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, deployer);
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, deployer);
    const generalElections = new ethers.Contract(GENERAL_ELECTIONS_CONTRACT, GENERAL_ELECTIONS_ABI, deployer);

    console.log("📊 Current System Status:");
    console.log("-" .repeat(30));

    // Check voters
    console.log("\n👥 VOTERS:");
    try {
      const voterAddresses = await voter.getAllVoters();
      console.log(`Total registered voters: ${voterAddresses.length}`);
      
      for (let i = 0; i < voterAddresses.length; i++) {
        const details = await voter.getVoterDetails(voterAddresses[i]);
        console.log(`  ${i + 1}. ${details[0]} (Age: ${details[1]})`);
        console.log(`     Address: ${voterAddresses[i]}`);
        console.log(`     Aadhar: ${details[2]}`);
        console.log(`     Registered: ${details[3] ? '✅' : '❌'}`);
        console.log(`     Verified: ${details[4] ? '✅' : '❌'}`);
        console.log("");
      }
    } catch (error) {
      console.log(`❌ Error fetching voters: ${error.message}`);
    }

    // Check candidates
    console.log("\n🏛️ CANDIDATES:");
    try {
      const candidateAddresses = await candidate.getAllCandidates();
      console.log(`Total registered candidates: ${candidateAddresses.length}`);
      
      for (let i = 0; i < candidateAddresses.length; i++) {
        const details = await candidate.getCandidateDetails(candidateAddresses[i]);
        console.log(`  ${i + 1}. ${details[0]} (${details[1]})`);
        console.log(`     Address: ${candidateAddresses[i]}`);
        console.log(`     Constituency: ${details[2]}`);
        console.log(`     Age: ${details[3]}`);
        console.log(`     Registered: ${details[4] ? '✅' : '❌'}`);
        console.log(`     Verified: ${details[5] ? '✅' : '❌'}`);
        console.log("");
      }
    } catch (error) {
      console.log(`❌ Error fetching candidates: ${error.message}`);
    }

    // Check election results
    console.log("\n📈 ELECTION RESULTS:");
    try {
      const results = await generalElections.getElectionResults(1);
      console.log(`Candidates in results: ${results[0].length}`);
      console.log(`Vote counts: ${results[1].length}`);
      console.log(`Winners: ${results[2].length}`);
      console.log(`Result declared: ${results[3] ? 'Yes' : 'No'}`);
    } catch (error) {
      console.log(`❌ Error fetching results: ${error.message}`);
    }

    console.log("\n🎯 NEXT STEPS:");
    console.log("1. If voters/candidates are not verified, use the Officer Panel in frontend");
    console.log("2. Go to http://localhost:5173/officer");
    console.log("3. Connect with an officer account (account 1)");
    console.log("4. Click 'Verify' buttons for unverified entities");
    console.log("5. After verification, data will show in the frontend!");

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
