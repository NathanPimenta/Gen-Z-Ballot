const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Voter Registration Transaction\n");

    // Get signers
    const [deployer, officer1, voter1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Officer1: ${officer1.address}`);
    console.log(`Voter1: ${voter1.address}`);
    console.log("");

    // Get contract instances
    const voter = await ethers.getContractAt("Voter", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    const electionOfficer = await ethers.getContractAt("ElectionOfficer", "0x5FbDB2315678afecb367f032d93F642f64180aa3");

    console.log("📊 Initial State:");
    console.log(`Voter Count: ${await voter.voterCount()}`);
    console.log(`All Voters: ${await voter.getAllVoters()}`);
    console.log("");

    console.log("📝 Step 1: Register Voter");
    try {
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
        
    } catch (e) {
        console.log(`❌ Registration failed: ${e.message}`);
        return;
    }

    console.log("\n📊 After Registration:");
    console.log(`Voter Count: ${await voter.voterCount()}`);
    
    try {
        const allVoters = await voter.getAllVoters();
        console.log(`All Voters: ${allVoters.length} voters found`);
        
        for (let i = 0; i < allVoters.length; i++) {
            const voterAddress = allVoters[i];
            const voterDetails = await voter.getVoterByAddress(voterAddress);
            console.log(`  Voter ${i + 1}: ${voterDetails.name} (${voterAddress})`);
        }
    } catch (e) {
        console.log(`❌ Error getting voters: ${e.message}`);
    }

    console.log("\n🔍 Step 2: Check Voter Details");
    try {
        const voterDetails = await voter.getVoterByAddress(voter1.address);
        console.log("Voter Details:");
        console.log(`  Name: ${voterDetails.name}`);
        console.log(`  Age: ${voterDetails.age}`);
        console.log(`  Constituency: ${voterDetails.constituencyId}`);
        console.log(`  Has Registered: ${voterDetails.hasRegistered}`);
        console.log(`  Is Allowed to Vote: ${voterDetails.isAllowedToVote}`);
        console.log(`  Has Voted: ${voterDetails.hasVoted}`);
    } catch (e) {
        console.log(`❌ Error getting voter details: ${e.message}`);
    }

    console.log("\n🔍 Step 3: Check Officer Panel Data");
    try {
        const isOfficer = await electionOfficer.isElecOfficer(officer1.address);
        console.log(`Is Officer1 an officer: ${isOfficer}`);
        
        if (isOfficer) {
            const officerDetails = await electionOfficer.getOfficerByAddress(officer1.address);
            console.log(`Officer Details:`);
            console.log(`  Name: ${officerDetails.name}`);
            console.log(`  Constituency: ${officerDetails.allotedConstituency}`);
        }
    } catch (e) {
        console.log(`❌ Error checking officer: ${e.message}`);
    }

    console.log("\n✅ Voter Registration Test Complete!");
    console.log("\n📱 Next Steps:");
    console.log("1. Check if the transaction appears in MetaMask");
    console.log("2. Refresh the Dashboard page");
    console.log("3. Check the Officer Panel");
    console.log("4. If data doesn't show, try refreshing the browser");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
