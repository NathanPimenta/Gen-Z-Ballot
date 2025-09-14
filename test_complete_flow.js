const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Complete Voting Flow\n");

    // Get signers
    const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Officer1: ${officer1.address}`);
    console.log(`Voter1: ${voter1.address}`);
    console.log(`Candidate1: ${candidate1.address}`);
    console.log("");

    // Get contract instances
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");
    const Voter = await ethers.getContractFactory("Voter");
    const Candidate = await ethers.getContractFactory("Candidate");
    const GeneralElections = await ethers.getContractFactory("GeneralElections");

    const electionOfficer = ElectionOfficer.attach(addresses.ElectionOfficer);
    const voter = Voter.attach(addresses.Voter);
    const candidate = Candidate.attach(addresses.Candidate);
    const generalElections = GeneralElections.attach(addresses.GeneralElections);

    console.log("🔍 Step 1: Check Initial State");
    try {
        const voterCount = await voter.voterCount();
        const allCandidates = await candidate.getAllCandidates();
        const totalVotes = await generalElections.getTotalVotes();
        
        console.log(`✅ Voters: ${voterCount}`);
        console.log(`✅ Candidates: ${allCandidates.length}`);
        console.log(`✅ Total Votes: ${totalVotes}`);
    } catch (e) {
        console.log(`❌ Error checking initial state: ${e.message}`);
    }

    console.log("\n🔍 Step 2: Register Candidate");
    try {
        const candidateTx = await candidate.connect(candidate1).candidateRegistration(
            candidate1.address, // candidate address
            "Test Candidate",
            "Test Party", 
            1, // security deposit in ethers
            35, // age
            1, // Constituency 1
            { value: ethers.parseEther("1.0") } // 1 ETH security deposit
        );
        
        console.log(`Transaction Hash: ${candidateTx.hash}`);
        const candidateReceipt = await candidateTx.wait();
        console.log(`✅ Candidate registered in block ${candidateReceipt.blockNumber}`);
        
    } catch (e) {
        console.log(`❌ Candidate registration failed: ${e.message}`);
    }

    console.log("\n🔍 Step 3: Verify Candidate (as Officer)");
    try {
        const candidateAddresses = await candidate.getAllCandidates();
        console.log(`Candidate addresses: ${candidateAddresses}`);
        
        if (candidateAddresses.length > 0) {
            const candidateAddress = candidateAddresses[0];
            console.log(`Verifying candidate at address: ${candidateAddress}`);
            
            const verifyTx = await candidate.connect(officer1).candidateVerification(candidateAddress, true);
            console.log(`Transaction Hash: ${verifyTx.hash}`);
            const verifyReceipt = await verifyTx.wait();
            console.log(`✅ Candidate verified in block ${verifyReceipt.blockNumber}`);
        } else {
            console.log(`❌ No candidates found to verify`);
        }
        
    } catch (e) {
        console.log(`❌ Candidate verification failed: ${e.message}`);
    }

    console.log("\n🔍 Step 4: Verify Voter (as Officer)");
    try {
        const voterAddresses = await voter.getAllVoters();
        const verifyVoterTx = await voter.connect(officer1).bulkVerifyVoters([voterAddresses[0]], [true]);
        console.log(`Transaction Hash: ${verifyVoterTx.hash}`);
        const verifyVoterReceipt = await verifyVoterTx.wait();
        console.log(`✅ Voter verified in block ${verifyVoterReceipt.blockNumber}`);
        
    } catch (e) {
        console.log(`❌ Voter verification failed: ${e.message}`);
    }

    console.log("\n🔍 Step 5: Cast Vote");
    try {
        const voterAddresses = await voter.getAllVoters();
        const voterDetails = await voter.getVoterByAddress(voterAddresses[0]);
        const voterId = voterDetails.id;
        
        const candidateAddresses = await candidate.getAllCandidates();
        const candidateId = await candidate.getCandidateIdByAddress(candidateAddresses[0]);
        
        const voteTx = await generalElections.connect(voter1).registerVote(voterId, candidateId);
        console.log(`Transaction Hash: ${voteTx.hash}`);
        const voteReceipt = await voteTx.wait();
        console.log(`✅ Vote cast in block ${voteReceipt.blockNumber}`);
        
    } catch (e) {
        console.log(`❌ Voting failed: ${e.message}`);
    }

    console.log("\n🔍 Step 6: Check Final State");
    try {
        const voterCount = await voter.voterCount();
        const allCandidates = await candidate.getAllCandidates();
        const totalVotes = await generalElections.getTotalVotes();
        
        console.log(`✅ Final Voters: ${voterCount}`);
        console.log(`✅ Final Candidates: ${allCandidates.length}`);
        console.log(`✅ Final Votes: ${totalVotes}`);
        
        // Check candidate details
        for (const address of allCandidates) {
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`  Candidate: ${details[0]} (${details[1]}) - Constituency: ${details[3]} - Verified: ${details[5]}`);
        }
        
    } catch (e) {
        console.log(`❌ Error checking final state: ${e.message}`);
    }

    console.log("\n✅ Complete Flow Test Finished!");
    console.log("\n📱 Frontend Testing:");
    console.log("1. Open http://localhost:5173");
    console.log("2. Connect with Officer 1 account");
    console.log("3. Go to Officer Panel - should see verified voters and candidates");
    console.log("4. Connect with Voter 1 account");
    console.log("5. Go to Cast Vote - should see the candidate");
    console.log("6. Cast your vote");
    console.log("7. Check Results page");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
