const { ethers } = require("hardhat");

async function main() {
    console.log("🚀 Setting up Gen-Z Ballot Demo...\n");

    // Get signers
    const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Demo Accounts:");
    console.log("Deployer:", deployer.address);
    console.log("Officer1:", officer1.address);
    console.log("Voter1:", voter1.address);
    console.log("Candidate1:", candidate1.address);
    console.log("");

    // Get contract instances
    const voter = await ethers.getContractAt("Voter", "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512");
    const candidate = await ethers.getContractAt("Candidate", "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0");
    const generalElections = await ethers.getContractAt("GeneralElections", "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9");

    console.log("📝 Step 1: Register Voter");
    try {
        const voterTx = await voter.connect(voter1).registerAsVoter(
            "Alice Johnson",
            25,
            "0x313233343536373839303132", // "123456789012" in hex
            "VOTER001",
            1
        );
        await voterTx.wait();
        console.log("✅ Voter registered successfully");
    } catch (e) {
        console.log("ℹ️  Voter may already be registered");
    }

    console.log("\n📝 Step 2: Register Candidate");
    try {
        const candidateTx = await candidate.connect(candidate1).candidateRegistration(
            "0x0000000000000000000000000000000000000000", // Will be set by contract
            "Bob Smith",
            "Progressive Party",
            ethers.parseEther("1.0"), // 1 ETH deposit
            30,
            1
        );
        await candidateTx.wait();
        console.log("✅ Candidate registered successfully");
    } catch (e) {
        console.log("ℹ️  Candidate may already be registered");
    }

    console.log("\n🔍 Step 3: Verify Voter");
    try {
        const verifyVoterTx = await voter.connect(officer1).verifyVoters(
            voter1.address,
            "0x313233343536373839303132",
            "VOTER001",
            true
        );
        await verifyVoterTx.wait();
        console.log("✅ Voter verified successfully");
    } catch (e) {
        console.log("ℹ️  Voter may already be verified");
    }

    console.log("\n🔍 Step 4: Verify Candidate");
    try {
        const verifyCandidateTx = await candidate.connect(officer1).candidateVerification(
            candidate1.address,
            true
        );
        await verifyCandidateTx.wait();
        console.log("✅ Candidate verified successfully");
    } catch (e) {
        console.log("ℹ️  Candidate may already be verified");
    }

    console.log("\n🗳️ Step 5: Cast Vote");
    try {
        const voteTx = await generalElections.connect(voter1).castVote(candidate1.address);
        await voteTx.wait();
        console.log("✅ Vote cast successfully");
    } catch (e) {
        console.log("ℹ️  Vote may already be cast");
    }

    console.log("\n📊 Step 6: Check Results");
    try {
        const results = await generalElections.getElectionResults();
        console.log("📈 Election Results:");
        results.forEach((result, index) => {
            const candidateAddress = result.candidateAddress || result[0];
            const voteCount = result.voteCount || result[1];
            console.log(`  ${index + 1}. ${candidateAddress}: ${voteCount} votes`);
        });
    } catch (e) {
        console.log("ℹ️  Results may not be available yet");
    }

    console.log("\n🎉 Demo setup complete!");
    console.log("\n📱 Next steps for your video:");
    console.log("1. Open http://localhost:5173 in your browser");
    console.log("2. Connect MetaMask to Hardhat network (Chain ID: 1337)");
    console.log("3. Use the voter1 account to vote");
    console.log("4. Follow the demo script for your video");
    console.log("\n🔑 Demo Account Details:");
    console.log("Voter Account:", voter1.address);
    console.log("Candidate Account:", candidate1.address);
    console.log("Officer Account:", officer1.address);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
