const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Creating Dummy Voters for Testing\n");

    // Get signers - we'll use accounts 6-15 for new voters
    const [deployer, officer1, officer2, officer3, voter1, candidate1, voter6, voter7, voter8, voter9, voter10, voter11, voter12, voter13, voter14, voter15] = await ethers.getSigners();
    
    console.log("📋 Available Accounts for Voters:");
    console.log(`Voter 6: ${voter6.address}`);
    console.log(`Voter 7: ${voter7.address}`);
    console.log(`Voter 8: ${voter8.address}`);
    console.log(`Voter 9: ${voter9.address}`);
    console.log(`Voter 10: ${voter10.address}`);
    console.log(`Voter 11: ${voter11.address}`);
    console.log(`Voter 12: ${voter12.address}`);
    console.log(`Voter 13: ${voter13.address}`);
    console.log(`Voter 14: ${voter14.address}`);
    console.log(`Voter 15: ${voter15.address}`);
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

    // Dummy voter data
    const dummyVoters = [
        { account: voter6, name: "Alice Johnson", age: 25, constituency: 1, voterId: "VOTER_ALICE_001" },
        { account: voter7, name: "Bob Smith", age: 30, constituency: 1, voterId: "VOTER_BOB_002" },
        { account: voter8, name: "Carol Davis", age: 28, constituency: 2, voterId: "VOTER_CAROL_003" },
        { account: voter9, name: "David Wilson", age: 35, constituency: 2, voterId: "VOTER_DAVID_004" },
        { account: voter10, name: "Emma Brown", age: 22, constituency: 3, voterId: "VOTER_EMMA_005" },
        { account: voter11, name: "Frank Miller", age: 40, constituency: 3, voterId: "VOTER_FRANK_006" },
        { account: voter12, name: "Grace Lee", age: 27, constituency: 1, voterId: "VOTER_GRACE_007" },
        { account: voter13, name: "Henry Taylor", age: 33, constituency: 2, voterId: "VOTER_HENRY_008" },
        { account: voter14, name: "Ivy Chen", age: 29, constituency: 3, voterId: "VOTER_IVY_009" },
        { account: voter15, name: "Jack Anderson", age: 31, constituency: 1, voterId: "VOTER_JACK_010" }
    ];

    console.log("🔍 Step 1: Register Dummy Voters");
    for (let i = 0; i < dummyVoters.length; i++) {
        const voterData = dummyVoters[i];
        try {
            const tx = await voter.connect(voterData.account).registerAsVoter(
                voterData.name,
                voterData.age,
                `0x${Buffer.from(voterData.voterId, 'utf8').toString('hex').padStart(24, '0')}`, // Convert to hex
                voterData.voterId,
                voterData.constituency
            );
            
            console.log(`✅ ${voterData.name} registered - Tx: ${tx.hash}`);
            await tx.wait();
            
        } catch (e) {
            console.log(`❌ ${voterData.name} registration failed: ${e.message}`);
        }
    }

    console.log("\n🔍 Step 2: Verify Voters by Constituency");
    
    // Group voters by constituency for verification
    const votersByConstituency = {
        1: [],
        2: [],
        3: []
    };
    
    for (const voterData of dummyVoters) {
        votersByConstituency[voterData.constituency].push(voterData);
    }

    // Verify voters for each constituency
    for (const [constituency, voters] of Object.entries(votersByConstituency)) {
        if (voters.length > 0) {
            console.log(`\nVerifying voters for Constituency ${constituency}:`);
            const officer = constituency === "1" ? officer1 : constituency === "2" ? officer2 : officer3;
            const addresses = voters.map(v => v.account.address);
            const decisions = new Array(addresses.length).fill(true);
            
            try {
                const tx = await voter.connect(officer).bulkVerifyVoters(addresses, decisions);
                console.log(`✅ Verified ${addresses.length} voters for Constituency ${constituency} - Tx: ${tx.hash}`);
                await tx.wait();
            } catch (e) {
                console.log(`❌ Verification failed for Constituency ${constituency}: ${e.message}`);
            }
        }
    }

    console.log("\n🔍 Step 3: Check Final Voter Count");
    try {
        const voterCount = await voter.voterCount();
        console.log(`Total voters registered: ${voterCount}`);
        
        const allVoters = await voter.getAllVoters();
        console.log(`All voter addresses: ${allVoters.length}`);
        
    } catch (e) {
        console.log(`❌ Error checking voter count: ${e.message}`);
    }

    console.log("\n✅ Dummy Voters Created Successfully!");
    console.log("\n📱 DUMMY VOTER ACCOUNTS FOR TESTING:");
    console.log("=" * 60);
    
    for (let i = 0; i < dummyVoters.length; i++) {
        const voterData = dummyVoters[i];
        console.log(`\n${i + 1}. ${voterData.name}`);
        console.log(`   Address: ${voterData.account.address}`);
        console.log(`   Private Key: ${voterData.account.privateKey}`);
        console.log(`   Constituency: ${voterData.constituency}`);
        console.log(`   Status: ✅ Registered & Verified`);
    }
    
    console.log("\n" + "=" * 60);
    console.log("🎯 Use these accounts for testing the voting system!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
