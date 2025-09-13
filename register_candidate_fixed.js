const { ethers } = require("hardhat");

async function main() {
  console.log("🏛️ Registering Candidate with Correct Deposit");
  console.log("=" .repeat(50));

  const [deployer, candidate1] = await ethers.getSigners();
  
  // Contract address
  const CANDIDATE_CONTRACT = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";

  // ABI for candidate registration
  const CANDIDATE_ABI = [
    "function candidateRegistration(address candidateAddress, string calldata name, string calldata politicalParty, uint securityDepositInEthers, uint age, uint constituencyId) public payable"
  ];

  try {
    const candidate = new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, candidate1);

    console.log("Registering candidate with correct deposit...");
    
    // Send 0.1 ETH as security deposit
    const depositAmount = ethers.parseEther("0.1");
    
    const tx = await candidate.candidateRegistration(
      candidate1.address,
      "Bob Smith",
      "Progressive Party",
      1, // securityDepositInEthers (1 ETH)
      30,
      1,
      { value: ethers.parseEther("1") } // Send 1 ETH to match the parameter
    );
    
    await tx.wait();
    console.log("✅ Candidate 'Bob Smith' registered successfully with 0.1 ETH deposit");
    
  } catch (error) {
    console.error("❌ Registration failed:", error.message);
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
