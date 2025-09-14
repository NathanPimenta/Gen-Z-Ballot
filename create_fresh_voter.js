const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Creating Fresh Voter for Testing\n");

    // Get signers
    const [deployer, officer1, voter1, voter2] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Officer 1: ${officer1.address}`);
    console.log(`Voter 1: ${voter1.address}`);
    console.log(`Voter 2: ${voter2.address}`);
    console.log("");

    // Get contract instances
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    const Voter = await ethers.getContractFactory("Voter");
    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");

    const voter = Voter.attach(addresses.Voter);
    const electionOfficer = ElectionOfficer.attach(addresses.ElectionOfficer);

    console.log("🔍 Step 1: Register Fresh Voter");
    try {
        const tx = await voter.connect(voter2).registerAsVoter(
            "Fresh Voter",
            28,
            "0x313233343536373839303132", // "123456789012" in hex
            "VOTER_FRESH_001",
            1 // Constituency 1
        );
        
        console.log(`Transaction Hash: ${tx.hash}`);
        const receipt = await tx.wait();
        console.log(`✅ Fresh voter registered in block ${receipt.blockNumber}`);
        
    } catch (e) {
        console.log(`❌ Fresh voter registration failed: ${e.message}`);
    }

    console.log("\n🔍 Step 2: Verify Fresh Voter");
    try {
        const verifyTx = await voter.connect(officer1).bulkVerifyVoters([voter2.address], [true]);
        console.log(`Transaction Hash: ${verifyTx.hash}`);
        const verifyReceipt = await verifyTx.wait();
        console.log(`✅ Fresh voter verified in block ${verifyReceipt.blockNumber}`);
        
    } catch (e) {
        console.log(`❌ Fresh voter verification failed: ${e.message}`);
    }

    console.log("\n🔍 Step 3: Check Fresh Voter Status");
    try {
        const voterDetails = await voter.getVoterByAddress(voter2.address);
        console.log(`Fresh Voter Details:`);
        console.log(`  Name: ${voterDetails.name}`);
        console.log(`  Constituency: ${voterDetails.constituencyId}`);
        console.log(`  Verified: ${voterDetails.isAllowedToVote}`);
        console.log(`  Has Voted: ${voterDetails.hasVoted}`);
        
    } catch (e) {
        console.log(`❌ Error checking fresh voter: ${e.message}`);
    }

    console.log("\n✅ Fresh Voter Created!");
    console.log("\n📱 Use this account for testing Cast Vote:");
    console.log(`Address: ${voter2.address}`);
    console.log(`Private Key: 0x47e179ec257488ca7df7c4e9b1d39cbbae4845eba3f2af9f084166d63c69671`);
    console.log("\nThis voter should be able to see candidates in Cast Vote page!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
