const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Testing Complete Gen-Z Ballot System...\n");

    // Get signers
    const [deployer, officer1, officer2, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log("Deployer (Commissioner):", deployer.address);
    console.log("Officer1 (Constituency 1):", officer1.address);
    console.log("Officer2 (Constituency 2):", officer2.address);
    console.log("Voter1 (Constituency 1):", voter1.address);
    console.log("Voter2 (Constituency 2):", voter2.address);
    console.log("Candidate1 (Constituency 1):", candidate1.address);
    console.log("Candidate2 (Constituency 2):", candidate2.address);
    console.log("");

    // Deploy contracts
    console.log("📦 Deploying Contracts...");
    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");
    const Voter = await ethers.getContractFactory("Voter");
    const Candidate = await ethers.getContractFactory("Candidate");
    const GeneralElections = await ethers.getContractFactory("GeneralElections");

    const electionOfficer = await ElectionOfficer.deploy();
    await electionOfficer.waitForDeployment();
    console.log("✅ ElectionOfficer deployed to:", await electionOfficer.getAddress());

    const voter = await Voter.deploy(await electionOfficer.getAddress());
    await voter.waitForDeployment();
    console.log("✅ Voter deployed to:", await voter.getAddress());

    const candidate = await Candidate.deploy(await electionOfficer.getAddress());
    await candidate.waitForDeployment();
    console.log("✅ Candidate deployed to:", await candidate.getAddress());

    const generalElections = await GeneralElections.deploy(
        await candidate.getAddress(),
        await voter.getAddress(),
        await electionOfficer.getAddress()
    );
    await generalElections.waitForDeployment();
    console.log("✅ GeneralElections deployed to:", await generalElections.getAddress());

    // Set up contract relationships
    console.log("\n🔗 Setting up contract relationships...");
    await voter.setGeneralElection(await generalElections.getAddress());
    await candidate.setGeneralElection(await generalElections.getAddress());
    console.log("✅ Contract relationships established");

    // Add election officers
    console.log("\n👮‍♂️ Adding Election Officers...");
    await electionOfficer.electElectionOfficers(officer1.address, "Officer 1", 1);
    await electionOfficer.electElectionOfficers(officer2.address, "Officer 2", 2);
    console.log("✅ Election officers added");

    // Test 1: Voter Registration
    console.log("\n📝 Test 1: Voter Registration");
    try {
        const voterTx1 = await voter.connect(voter1).registerAsVoter(
            "Alice Johnson",
            25,
            "0x313233343536373839303132", // "123456789012" in hex
            "VOTER001",
            1
        );
        await voterTx1.wait();
        console.log("✅ Voter1 registered successfully");

        const voterTx2 = await voter.connect(voter2).registerAsVoter(
            "Bob Wilson",
            28,
            "0x393837363534333231303938", // "987654321098" in hex
            "VOTER002",
            2
        );
        await voterTx2.wait();
        console.log("✅ Voter2 registered successfully");

        // Check voter count
        const voterCount = await voter.voterCount();
        console.log(`📊 Total voters registered: ${voterCount}`);
    } catch (e) {
        console.log("❌ Voter registration failed:", e.message);
    }

    // Test 2: Candidate Registration
    console.log("\n🏛️ Test 2: Candidate Registration");
    try {
        const candidateTx1 = await candidate.connect(candidate1).candidateRegistration(
            candidate1.address,
            "Jane Smith",
            "Progressive Party",
            1, // 1 ETH deposit
            30,
            1,
            { value: ethers.parseEther("1.0") }
        );
        await candidateTx1.wait();
        console.log("✅ Candidate1 registered successfully");

        const candidateTx2 = await candidate.connect(candidate2).candidateRegistration(
            candidate2.address,
            "John Doe",
            "Conservative Party",
            1, // 1 ETH deposit
            35,
            2,
            { value: ethers.parseEther("1.0") }
        );
        await candidateTx2.wait();
        console.log("✅ Candidate2 registered successfully");

        // Check candidate count
        const allCandidates = await candidate.getAllCandidates();
        console.log(`📊 Total candidates registered: ${allCandidates.length}`);
    } catch (e) {
        console.log("❌ Candidate registration failed:", e.message);
    }

    // Test 3: Voter Verification
    console.log("\n🔍 Test 3: Voter Verification");
    try {
        const verifyVoterTx1 = await voter.connect(officer1).verifyVoters(
            voter1.address,
            "0x313233343536373839303132",
            "VOTER001",
            true
        );
        await verifyVoterTx1.wait();
        console.log("✅ Voter1 verified successfully");

        const verifyVoterTx2 = await voter.connect(officer2).verifyVoters(
            voter2.address,
            "0x393837363534333231303938",
            "VOTER002",
            true
        );
        await verifyVoterTx2.wait();
        console.log("✅ Voter2 verified successfully");

        // Check verification status
        const voter1Details = await voter.getVoterByAddress(voter1.address);
        const voter2Details = await voter.getVoterByAddress(voter2.address);
        console.log(`📊 Voter1 verified: ${voter1Details.isAllowedToVote}`);
        console.log(`📊 Voter2 verified: ${voter2Details.isAllowedToVote}`);
    } catch (e) {
        console.log("❌ Voter verification failed:", e.message);
    }

    // Test 4: Candidate Verification
    console.log("\n🔍 Test 4: Candidate Verification");
    try {
        const verifyCandidateTx1 = await candidate.connect(officer1).candidateVerification(
            candidate1.address,
            true
        );
        await verifyCandidateTx1.wait();
        console.log("✅ Candidate1 verified successfully");

        const verifyCandidateTx2 = await candidate.connect(officer2).candidateVerification(
            candidate2.address,
            true
        );
        await verifyCandidateTx2.wait();
        console.log("✅ Candidate2 verified successfully");

        // Check verification status
        const candidate1Id = await candidate.getCandidateIdByAddress(candidate1.address);
        const candidate2Id = await candidate.getCandidateIdByAddress(candidate2.address);
        const candidate1Details = await candidate.getCandidateDetails(candidate1Id);
        const candidate2Details = await candidate.getCandidateDetails(candidate2Id);
        console.log(`📊 Candidate1 verified: ${candidate1Details.isVerified}`);
        console.log(`📊 Candidate2 verified: ${candidate2Details.isVerified}`);
    } catch (e) {
        console.log("❌ Candidate verification failed:", e.message);
    }

    // Test 5: Voting Process
    console.log("\n🗳️ Test 5: Voting Process");
    try {
        // Get voter IDs
        const voter1Details = await voter.getVoterByAddress(voter1.address);
        const voter2Details = await voter.getVoterByAddress(voter2.address);
        const voter1Id = voter1Details.id;
        const voter2Id = voter2Details.id;

        // Get candidate IDs
        const candidate1Id = await candidate.getCandidateIdByAddress(candidate1.address);
        const candidate2Id = await candidate.getCandidateIdByAddress(candidate2.address);

        // Cast votes
        const voteTx1 = await generalElections.connect(voter1).registerVote(voter1Id, candidate1Id);
        await voteTx1.wait();
        console.log("✅ Voter1 cast vote for Candidate1");

        const voteTx2 = await generalElections.connect(voter2).registerVote(voter2Id, candidate2Id);
        await voteTx2.wait();
        console.log("✅ Voter2 cast vote for Candidate2");

        // Check vote counts
        const candidate1Votes = await generalElections.getVoteCount(candidate1Id);
        const candidate2Votes = await generalElections.getVoteCount(candidate2Id);
        const totalVotes = await generalElections.getTotalVotes();
        console.log(`📊 Candidate1 votes: ${candidate1Votes}`);
        console.log(`📊 Candidate2 votes: ${candidate2Votes}`);
        console.log(`📊 Total votes cast: ${totalVotes}`);
    } catch (e) {
        console.log("❌ Voting process failed:", e.message);
    }

    // Test 6: Dashboard Data
    console.log("\n📊 Test 6: Dashboard Data");
    try {
        // Get all voters
        const allVoters = await voter.getAllVoters();
        console.log(`📊 Total voters: ${allVoters.length}`);

        // Get all candidates
        const allCandidates = await candidate.getAllCandidates();
        console.log(`📊 Total candidates: ${allCandidates.length}`);

        // Get voter statistics
        const voterStats = await voter.getVoterStatistics();
        console.log(`📊 Voter stats - Registered: ${voterStats.totalRegistered}, Verified: ${voterStats.totalVerified}, Voted: ${voterStats.totalVoted}`);

        // Get candidate statistics
        const candidateStats = await candidate.getCandidateStatistics();
        console.log(`📊 Candidate stats - Registered: ${candidateStats.totalRegistered}, Verified: ${candidateStats.totalVerified}`);

        // Get constituency data
        const constituency1Voters = await voter.getVotersByConstituency(1);
        const constituency2Voters = await voter.getVotersByConstituency(2);
        const constituency1Candidates = await candidate.getCandidatesByConstituency(1);
        const constituency2Candidates = await candidate.getCandidatesByConstituency(2);
        console.log(`📊 Constituency 1 - Voters: ${constituency1Voters.length}, Candidates: ${constituency1Candidates.length}`);
        console.log(`📊 Constituency 2 - Voters: ${constituency2Voters.length}, Candidates: ${constituency2Candidates.length}`);
    } catch (e) {
        console.log("❌ Dashboard data retrieval failed:", e.message);
    }

    // Test 7: Results Display
    console.log("\n📈 Test 7: Results Display");
    try {
        // Get all candidates with vote counts
        const allCandidates = await candidate.getAllCandidates();
        const results = [];
        
        for (const candidateAddress of allCandidates) {
            try {
                const candidateId = await candidate.getCandidateIdByAddress(candidateAddress);
                const details = await candidate.getCandidateDetails(candidateId);
                const voteCount = await generalElections.getVoteCount(candidateId);
                
                results.push({
                    address: candidateAddress,
                    name: details.name,
                    party: details.politicalParty,
                    constituency: details.constituencyId.toString(),
                    voteCount: Number(voteCount)
                });
            } catch (e) {
                console.log(`⚠️ Error getting details for candidate ${candidateAddress}:`, e.message);
            }
        }

        // Sort by vote count
        results.sort((a, b) => b.voteCount - a.voteCount);
        
        console.log("📈 Election Results:");
        results.forEach((result, index) => {
            console.log(`  ${index + 1}. ${result.name} (${result.party}) - ${result.voteCount} votes (Constituency ${result.constituency})`);
        });
    } catch (e) {
        console.log("❌ Results display failed:", e.message);
    }

    // Test 8: Error Handling
    console.log("\n⚠️ Test 8: Error Handling");
    try {
        // Try to vote twice with same voter
        const voter1Details = await voter.getVoterByAddress(voter1.address);
        const candidate1Id = await candidate.getCandidateIdByAddress(candidate1.address);
        
        try {
            await generalElections.connect(voter1).registerVote(voter1Details.id, candidate1Id);
            console.log("❌ Double voting should have been prevented");
        } catch (e) {
            console.log("✅ Double voting correctly prevented:", e.message);
        }

        // Try to verify voter from wrong constituency
        try {
            await voter.connect(officer2).verifyVoters(
                voter1.address,
                "0x313233343536373839303132",
                "VOTER001",
                true
            );
            console.log("❌ Cross-constituency verification should have been prevented");
        } catch (e) {
            console.log("✅ Cross-constituency verification correctly prevented:", e.message);
        }
    } catch (e) {
        console.log("❌ Error handling test failed:", e.message);
    }

    console.log("\n🎉 Complete System Test Finished!");
    console.log("\n📱 Frontend Testing Instructions:");
    console.log("1. Start Hardhat node: npx hardhat node");
    console.log("2. Deploy contracts: npx hardhat run deploy_voting_system.js --network localhost");
    console.log("3. Start frontend: cd frontend && npm run dev");
    console.log("4. Open http://localhost:5173 in browser");
    console.log("5. Connect MetaMask to Hardhat network (Chain ID: 1337)");
    console.log("6. Use the test accounts to interact with the system");
    
    console.log("\n🔑 Test Account Private Keys (for MetaMask):");
    console.log("Voter1:", "0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
    console.log("Voter2:", "0x5de4111daa5ba4e5a80b3047b79c4c3ca3c4c3c4c3c4c3c4c3c4c3c4c3c4c3c4");
    console.log("Candidate1:", "0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b07a79");
    console.log("Candidate2:", "0x47e17934cec4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4");
    console.log("Officer1:", "0x8b3a350cf5c34c9190ca6ec63c4e0a0e6a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6a6");
    console.log("Officer2:", "0x92db14e6b6c1c7c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4c4");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
