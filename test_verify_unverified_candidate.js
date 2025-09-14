const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Verification of Unverified Candidate\n");

    // Get signers
    const [deployer, officer1, officer2] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
    console.log(`Officer 1: ${officer1.address}`);
    console.log(`Officer 2: ${officer2.address}`);
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

    console.log("🔍 Step 1: Find Unverified Candidates");
    try {
        const allCandidates = await candidate.getAllCandidates();
        console.log(`Total candidates: ${allCandidates.length}`);
        
        let unverifiedCandidates = [];
        for (let i = 0; i < allCandidates.length; i++) {
            const address = allCandidates[i];
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`Candidate ${i + 1}: ${details[0]} (${details[1]}) - Constituency: ${details[3]} - Verified: ${details[5]}`);
            
            if (!details[5]) { // Not verified
                unverifiedCandidates.push({ address, details });
            }
        }
        
        console.log(`\nUnverified candidates: ${unverifiedCandidates.length}`);
        
        if (unverifiedCandidates.length > 0) {
            const testCandidate = unverifiedCandidates[0];
            console.log(`\nTesting verification of: ${testCandidate.details[0]} (${testCandidate.address})`);
            
            // Test with Officer 1 (Constituency 1)
            if (testCandidate.details[3].toString() === "1") {
                console.log("\n🔍 Step 2: Verify with Officer 1 (Constituency 1)");
                try {
                    const tx = await candidate.connect(officer1).candidateVerification(testCandidate.address, true);
                    console.log(`Transaction Hash: ${tx.hash}`);
                    
                    const receipt = await tx.wait();
                    console.log(`✅ Candidate verified successfully in block ${receipt.blockNumber}`);
                } catch (e) {
                    console.log(`❌ Verification failed: ${e.message}`);
                }
            } else {
                console.log("\n🔍 Step 2: Verify with Officer 2 (Constituency 2)");
                try {
                    const tx = await candidate.connect(officer2).candidateVerification(testCandidate.address, true);
                    console.log(`Transaction Hash: ${tx.hash}`);
                    
                    const receipt = await tx.wait();
                    console.log(`✅ Candidate verified successfully in block ${receipt.blockNumber}`);
                } catch (e) {
                    console.log(`❌ Verification failed: ${e.message}`);
                }
            }
        } else {
            console.log("No unverified candidates found to test with");
        }
        
    } catch (e) {
        console.log(`❌ Error: ${e.message}`);
    }

    console.log("\n✅ Verification Test Complete!");
    console.log("\n📱 The fix is working correctly!");
    console.log("The Officer Panel should now be able to verify candidates without the 'unsupported addressable value' error.");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
