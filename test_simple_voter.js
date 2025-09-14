const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Simple Voter Registration Test\n");

    // Get signers
    const [deployer, officer1, voter1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Officer1: ${officer1.address}`);
    console.log(`Voter1: ${voter1.address}`);
    console.log("");

    // Get contract instances using the deployed addresses
    const voterAddress = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";
    const electionOfficerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

    console.log("📝 Step 1: Register Voter");
    try {
        // Get the Voter contract factory and deploy a new instance to test
        const Voter = await ethers.getContractFactory("Voter");
        const voter = Voter.attach(voterAddress);
        
        console.log("Attempting voter registration...");
        const tx = await voter.connect(voter1).registerAsVoter(
            "Test Voter",
            25,
            "0x313233343536373839303132", // "123456789012" in hex
            "VOTER_TEST_001",
            1
        );
        
        console.log(`Transaction Hash: ${tx.hash}`);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait();
        console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        console.log(`Status: ${receipt.status === 1 ? 'Success' : 'Failed'}`);
        
        // Try to get voter count
        try {
            const voterCount = await voter.voterCount();
            console.log(`✅ Voter count after registration: ${voterCount}`);
        } catch (e) {
            console.log(`⚠️ Could not get voter count: ${e.message}`);
        }
        
    } catch (e) {
        console.log(`❌ Registration failed: ${e.message}`);
        console.log(`Error details: ${e}`);
    }

    console.log("\n🔍 Step 2: Check Voter Details");
    try {
        const Voter = await ethers.getContractFactory("Voter");
        const voter = Voter.attach(voterAddress);
        
        const voterDetails = await voter.getVoterByAddress(voter1.address);
        console.log("✅ Voter Details Retrieved:");
        console.log(`  Name: ${voterDetails.name}`);
        console.log(`  Age: ${voterDetails.age}`);
        console.log(`  Constituency: ${voterDetails.constituencyId}`);
        console.log(`  Has Registered: ${voterDetails.hasRegistered}`);
        console.log(`  Is Allowed to Vote: ${voterDetails.isAllowedToVote}`);
        console.log(`  Has Voted: ${voterDetails.hasVoted}`);
    } catch (e) {
        console.log(`❌ Error getting voter details: ${e.message}`);
    }

    console.log("\n✅ Test Complete!");
    console.log("\n📱 Frontend Troubleshooting:");
    console.log("1. Make sure MetaMask is connected to Hardhat Local (Chain ID: 1337)");
    console.log("2. Check browser console for errors");
    console.log("3. Try refreshing the page after registration");
    console.log("4. Check if the transaction appears in MetaMask history");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
