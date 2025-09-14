const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Candidate Registration Process\n");

    // Get signers
    const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Deployer: ${deployer.address}`);
    console.log(`Officer 1: ${officer1.address}`);
    console.log(`Voter 1: ${voter1.address}`);
    console.log(`Candidate 1: ${candidate1.address}`);
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

    console.log("\n🔍 Step 2: Test Candidate Registration (Direct Contract Call)");
    try {
        const candidateAddress = candidate1.address;
        const name = "Test Candidate Frontend";
        const party = "Test Party Frontend";
        const securityDepositInEthers = 1; // 1 ETH
        const age = 35;
        const constituencyId = 1;
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
            const gasEstimate = await candidate.connect(candidate1).candidateRegistration.estimateGas(
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
        const tx = await candidate.connect(candidate1).candidateRegistration(
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
        console.log(`✅ Candidate registered successfully in block ${receipt.blockNumber}`);
        console.log(`Gas Used: ${receipt.gasUsed.toString()}`);
        
    } catch (e) {
        console.log(`❌ Candidate registration failed: ${e.message}`);
        console.log(`Full error: ${e}`);
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

    console.log("\n✅ Candidate Registration Test Complete!");
    console.log("\n📱 Frontend Troubleshooting:");
    console.log("1. Check if MetaMask is connected to Hardhat Local (Chain ID: 1337)");
    console.log("2. Make sure you have enough ETH for gas fees");
    console.log("3. Try increasing gas limit in MetaMask");
    console.log("4. Check browser console for detailed error messages");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
