const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Debugging Cast Vote System\n");

    // Get signers
    const [deployer, officer1, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Test Accounts:");
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

    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");
    const Voter = await ethers.getContractFactory("Voter");
    const Candidate = await ethers.getContractFactory("Candidate");

    const electionOfficer = ElectionOfficer.attach(addresses.ElectionOfficer);
    const voter = Voter.attach(addresses.Voter);
    const candidate = Candidate.attach(addresses.Candidate);

    console.log("🔍 Step 1: Check Voter Details");
    try {
        const voterAddresses = await voter.getAllVoters();
        console.log(`Total voters: ${voterAddresses.length}`);
        
        for (let i = 0; i < voterAddresses.length; i++) {
            const address = voterAddresses[i];
            const details = await voter.getVoterByAddress(address);
            console.log(`Voter ${i + 1}:`);
            console.log(`  Address: ${address}`);
            console.log(`  Name: ${details.name}`);
            console.log(`  Constituency: ${details.constituencyId}`);
            console.log(`  Verified: ${details.isAllowedToVote}`);
            console.log(`  Has Voted: ${details.hasVoted}`);
            console.log("");
        }
    } catch (e) {
        console.log(`❌ Error checking voters: ${e.message}`);
    }

    console.log("🔍 Step 2: Check Candidate Details");
    try {
        const candidateAddresses = await candidate.getAllCandidates();
        console.log(`Total candidates: ${candidateAddresses.length}`);
        
        for (let i = 0; i < candidateAddresses.length; i++) {
            const address = candidateAddresses[i];
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            console.log(`Candidate ${i + 1}:`);
            console.log(`  Address: ${address}`);
            console.log(`  Name: ${details[0]}`);
            console.log(`  Party: ${details[1]}`);
            console.log(`  Age: ${details[2]}`);
            console.log(`  Constituency: ${details[3]}`);
            console.log(`  Can Contest: ${details[4]}`);
            console.log(`  Verified: ${details[5]}`);
            console.log("");
        }
    } catch (e) {
        console.log(`❌ Error checking candidates: ${e.message}`);
    }

    console.log("🔍 Step 3: Check Constituency Matching");
    try {
        // Check voter1 constituency
        const voter1Details = await voter.getVoterByAddress(voter1.address);
        const voter1Constituency = voter1Details.constituencyId.toString();
        console.log(`Voter 1 constituency: ${voter1Constituency}`);
        
        // Check which candidates match voter1's constituency
        const candidateAddresses = await candidate.getAllCandidates();
        const matchingCandidates = [];
        
        for (const address of candidateAddresses) {
            const candidateId = await candidate.getCandidateIdByAddress(address);
            const details = await candidate.getCandidateDetails(candidateId);
            const candidateConstituency = details[3].toString();
            
            if (candidateConstituency === voter1Constituency) {
                matchingCandidates.push({
                    address,
                    name: details[0],
                    party: details[1],
                    constituency: candidateConstituency,
                    verified: details[5]
                });
            }
        }
        
        console.log(`Candidates matching voter1's constituency (${voter1Constituency}): ${matchingCandidates.length}`);
        matchingCandidates.forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.name} (${c.party}) - Verified: ${c.verified}`);
        });
        
    } catch (e) {
        console.log(`❌ Error checking constituency matching: ${e.message}`);
    }

    console.log("🔍 Step 4: Test Cast Vote Logic");
    try {
        // Simulate the Cast Vote page logic
        const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
        const signer = await provider.getSigner(voter1.address);
        const voterAddress = await signer.getAddress();
        
        console.log(`Testing with voter address: ${voterAddress}`);
        
        // Get voter details
        const voterDetails = await voter.getVoterByAddress(voterAddress);
        const voterConstituency = voterDetails.constituencyId.toString();
        console.log(`Voter constituency: ${voterConstituency}`);
        
        // Get all candidates
        const candidateAddresses = await candidate.getAllCandidates();
        console.log(`All candidate addresses: ${candidateAddresses}`);
        
        const candidateDetails = [];
        
        for (const address of candidateAddresses) {
            try {
                const candidateId = await candidate.getCandidateIdByAddress(address);
                const details = await candidate.getCandidateDetails(candidateId);
                
                console.log(`Candidate ${details[0]}: constituency ${details[3]}, verified ${details[5]}`);
                
                // Only show candidates from the voter's constituency
                if (details[3].toString() === voterConstituency) {
                    candidateDetails.push({
                        address: address,
                        name: details[0],
                        party: details[1],
                        constituency: details[3].toString(),
                        age: details[2].toString(),
                        isVerified: details[5]
                    });
                    console.log(`✅ Added to voting list: ${details[0]}`);
                } else {
                    console.log(`❌ Not from voter constituency: ${details[0]}`);
                }
            } catch (e) {
                console.log(`❌ Error loading candidate ${address}: ${e.message}`);
            }
        }
        
        console.log(`\nFinal candidates for voting: ${candidateDetails.length}`);
        candidateDetails.forEach((c, i) => {
            console.log(`  ${i + 1}. ${c.name} (${c.party}) - Verified: ${c.isVerified}`);
        });
        
    } catch (e) {
        console.log(`❌ Error testing cast vote logic: ${e.message}`);
    }

    console.log("\n🔍 Step 5: Check if Voter is Verified");
    try {
        const voterDetails = await voter.getVoterByAddress(voter1.address);
        console.log(`Voter verification status: ${voterDetails.isAllowedToVote}`);
        
        if (!voterDetails.isAllowedToVote) {
            console.log("❌ Voter is not verified - this might prevent voting");
        } else {
            console.log("✅ Voter is verified");
        }
    } catch (e) {
        console.log(`❌ Error checking voter verification: ${e.message}`);
    }

    console.log("\n✅ Debug Complete!");
    console.log("\n📱 Frontend Troubleshooting:");
    console.log("1. Make sure you're connected with a verified voter account");
    console.log("2. Check browser console for errors");
    console.log("3. Try refreshing the Cast Vote page");
    console.log("4. Check if candidates are from the same constituency as voter");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Debug failed:", error);
        process.exit(1);
    });
