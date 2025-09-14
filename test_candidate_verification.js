const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Candidate Verification Fix\n");

    // Get signers
    const [deployer, officer1, officer2, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Officer 1: ${officer1.address}`);
    console.log(`Officer 2: ${officer2.address}`);
    console.log(`Candidate 1: ${candidate1.address}`);
    console.log("");

    // Get contract instances
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");
    const Candidate = await ethers.getContractFactory("Candidate");

    const electionOfficer = ElectionOfficer.attach(addresses.ElectionOfficer);
    const candidate = Candidate.attach(addresses.Candidate);

    console.log("🔍 Step 1: Check Current Candidates");
    try {
        const allCandidates = await candidate.getAllCandidates();
        console.log(`Total candidates: ${allCandidates.length}`);
        
        for (let i = 0; i < allCandidates.length; i++) {
            const address = allCandidates[i];
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`Candidate ${i + 1}: ${details[0]} (${details[1]}) - Constituency: ${details[3]} - Verified: ${details[5]}`);
        }
    } catch (e) {
        console.log(`❌ Error checking candidates: ${e.message}`);
    }

    console.log("\n🔍 Step 2: Test Candidate Verification (WRONG WAY - using ID)");
    try {
        const allCandidates = await candidate.getAllCandidates();
        if (allCandidates.length > 0) {
            const candidateAddress = allCandidates[0];
            const candidateId = await candidate.getCandidateIdByAddress(candidateAddress);
            
            console.log(`Testing with candidate address: ${candidateAddress}`);
            console.log(`Candidate ID: ${candidateId}`);
            
            // This should fail (using ID instead of address)
            const tx = await candidate.connect(officer1).candidateVerification(candidateId, true);
            console.log(`❌ This should have failed but didn't`);
        }
    } catch (e) {
        console.log(`✅ Expected error (using ID): ${e.message}`);
    }

    console.log("\n🔍 Step 3: Test Candidate Verification (CORRECT WAY - using address)");
    try {
        const allCandidates = await candidate.getAllCandidates();
        if (allCandidates.length > 0) {
            const candidateAddress = allCandidates[0];
            
            console.log(`Testing with candidate address: ${candidateAddress}`);
            
            // This should work (using address)
            const tx = await candidate.connect(officer1).candidateVerification(candidateAddress, true);
            console.log(`Transaction Hash: ${tx.hash}`);
            
            const receipt = await tx.wait();
            console.log(`✅ Candidate verified successfully in block ${receipt.blockNumber}`);
        }
    } catch (e) {
        console.log(`❌ Verification failed: ${e.message}`);
    }

    console.log("\n🔍 Step 4: Check Updated Candidate Status");
    try {
        const allCandidates = await candidate.getAllCandidates();
        console.log(`Total candidates: ${allCandidates.length}`);
        
        for (let i = 0; i < allCandidates.length; i++) {
            const address = allCandidates[i];
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`Candidate ${i + 1}: ${details[0]} (${details[1]}) - Constituency: ${details[3]} - Verified: ${details[5]}`);
        }
    } catch (e) {
        console.log(`❌ Error checking updated candidates: ${e.message}`);
    }

    console.log("\n✅ Candidate Verification Test Complete!");
    console.log("\n📱 Frontend should now work correctly:");
    console.log("1. Use Officer 1 account in Officer Panel");
    console.log("2. Try to verify candidates");
    console.log("3. Should work without 'unsupported addressable value' error");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
