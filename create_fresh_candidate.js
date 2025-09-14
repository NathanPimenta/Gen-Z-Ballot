const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Creating Fresh Candidate for Testing\n");

    // Get signers - use a different account for candidate
    const [deployer, officer1, voter1, candidate1, freshCandidate] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Officer 1: ${officer1.address}`);
    console.log(`Fresh Candidate: ${freshCandidate.address}`);
    console.log("");

    // Get contract instances
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    const Candidate = await ethers.getContractFactory("Candidate");
    const candidate = Candidate.attach(addresses.Candidate);

    console.log("🔍 Step 1: Check Current Candidate Count");
    try {
        const currentCount = await candidate.totalCandidates();
        console.log(`Current candidate count: ${currentCount}`);
    } catch (e) {
        console.log(`❌ Error getting candidate count: ${e.message}`);
    }

    console.log("\n🔍 Step 2: Register Fresh Candidate");
    try {
        const candidateAddress = freshCandidate.address;
        const name = "Fresh Candidate";
        const party = "Fresh Party";
        const securityDepositInEthers = 1; // 1 ETH
        const age = 32;
        const constituencyId = 2; // Different constituency
        const value = ethers.parseEther("1.0"); // 1 ETH in wei

        console.log("Registration parameters:");
        console.log(`  Candidate Address: ${candidateAddress}`);
        console.log(`  Name: ${name}`);
        console.log(`  Party: ${party}`);
        console.log(`  Security Deposit: ${securityDepositInEthers} ETH`);
        console.log(`  Age: ${age}`);
        console.log(`  Constituency: ${constituencyId}`);
        console.log(`  Value: ${ethers.formatEther(value)} ETH`);

        // Estimate gas first
        try {
            const gasEstimate = await candidate.connect(freshCandidate).candidateRegistration.estimateGas(
                candidateAddress,
                name,
                party,
                securityDepositInEthers,
                age,
                constituencyId,
                { value: value }
            );
            console.log(`✅ Gas estimate: ${gasEstimate.toString()}`);
        } catch (e) {
            console.log(`❌ Gas estimation failed: ${e.message}`);
        }

        // Try the actual transaction
        const tx = await candidate.connect(freshCandidate).candidateRegistration(
            candidateAddress,
            name,
            party,
            securityDepositInEthers,
            age,
            constituencyId,
            { 
                value: value,
                gasLimit: 500000 // Set explicit gas limit
            }
        );
        
        console.log(`Transaction Hash: ${tx.hash}`);
        console.log("Waiting for confirmation...");
        
        const receipt = await tx.wait();
        console.log(`✅ Fresh candidate registered successfully in block ${receipt.blockNumber}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        
    } catch (e) {
        console.log(`❌ Fresh candidate registration failed: ${e.message}`);
    }

    console.log("\n🔍 Step 3: Check Updated Candidate Count");
    try {
        const newCount = await candidate.totalCandidates();
        console.log(`New candidate count: ${newCount}`);
        
        // Get all candidates
        const allCandidates = await candidate.getAllCandidates();
        console.log(`All candidate addresses: ${allCandidates}`);
        
        for (let i = 0; i < allCandidates.length; i++) {
            const address = allCandidates[i];
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`Candidate ${i + 1}: ${details[0]} (${details[1]}) - Constituency: ${details[3]}`);
        }
        
    } catch (e) {
        console.log(`❌ Error checking updated count: ${e.message}`);
    }

    console.log("\n✅ Fresh Candidate Created!");
    console.log("\n📱 Use this account for testing Candidate Registration:");
    console.log(`Address: ${freshCandidate.address}`);
    console.log(`Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`);
    console.log("\nThis candidate should be able to register successfully!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
