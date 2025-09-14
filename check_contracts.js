const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Checking Contract Status\n");

    // Get signers
    const [deployer] = await ethers.getSigners();
    console.log(`Using account: ${deployer.address}`);

    // Try to get contract instances
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    console.log("📋 Contract Addresses:");
    Object.entries(addresses).forEach(([name, address]) => {
        console.log(`${name}: ${address}`);
    });

    console.log("\n🔍 Testing Contract Connections:");

    // Test ElectionOfficer
    try {
        const electionOfficer = await ethers.getContractAt("ElectionOfficer", addresses.ElectionOfficer);
        const commissioner = await electionOfficer.electionCommissioner();
        console.log(`✅ ElectionOfficer: Connected (Commissioner: ${commissioner})`);
    } catch (e) {
        console.log(`❌ ElectionOfficer: ${e.message}`);
    }

    // Test Voter
    try {
        const voter = await ethers.getContractAt("Voter", addresses.Voter);
        const voterCount = await voter.voterCount();
        console.log(`✅ Voter: Connected (Count: ${voterCount})`);
    } catch (e) {
        console.log(`❌ Voter: ${e.message}`);
    }

    // Test Candidate
    try {
        const candidate = await ethers.getContractAt("Candidate", addresses.Candidate);
        const totalCandidates = await candidate.totalCandidates();
        console.log(`✅ Candidate: Connected (Count: ${totalCandidates})`);
    } catch (e) {
        console.log(`❌ Candidate: ${e.message}`);
    }

    // Test GeneralElections
    try {
        const generalElections = await ethers.getContractAt("GeneralElections", addresses.GeneralElections);
        const totalVotes = await generalElections.getTotalVotes();
        console.log(`✅ GeneralElections: Connected (Votes: ${totalVotes})`);
    } catch (e) {
        console.log(`❌ GeneralElections: ${e.message}`);
    }

    console.log("\n🔍 Testing Voter Registration:");
    try {
        const voter = await ethers.getContractAt("Voter", addresses.Voter);
        const [deployer, officer1, voter1] = await ethers.getSigners();
        
        console.log(`Testing with voter: ${voter1.address}`);
        
        // Try to register a voter
        const tx = await voter.connect(voter1).registerAsVoter(
            "Test Voter",
            25,
            "0x313233343536373839303132",
            "VOTER_TEST_001",
            1
        );
        
        console.log(`Transaction submitted: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        
        // Check voter count after registration
        const newVoterCount = await voter.voterCount();
        console.log(`New voter count: ${newVoterCount}`);
        
    } catch (e) {
        console.log(`❌ Voter registration failed: ${e.message}`);
    }
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Check failed:", error);
        process.exit(1);
    });
