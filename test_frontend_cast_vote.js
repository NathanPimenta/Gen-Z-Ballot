const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Frontend Cast Vote Connection\n");

    // Simulate frontend connection
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"); // Voter1 address

    console.log("📋 Frontend Simulation:");
    console.log(`Provider URL: http://127.0.0.1:8545`);
    console.log(`Signer Address: ${await signer.getAddress()}`);
    console.log("");

    // Contract addresses from frontend
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    // Test Voter contract (simulating frontend useContracts hook)
    console.log("🔍 Testing Voter Contract (Frontend):");
    try {
        const voterAbi = require("./frontend/src/contracts/Voter.abi.json");
        const voterContract = new ethers.Contract(addresses.Voter, voterAbi, signer);
        
        const voterDetails = await voterContract.getVoterByAddress(await signer.getAddress());
        console.log(`✅ Voter details loaded:`);
        console.log(`  Name: ${voterDetails.name}`);
        console.log(`  Constituency: ${voterDetails.constituencyId}`);
        console.log(`  Verified: ${voterDetails.isAllowedToVote}`);
        console.log(`  Has Voted: ${voterDetails.hasVoted}`);
        
    } catch (e) {
        console.log(`❌ Voter contract error: ${e.message}`);
    }

    // Test Candidate contract (simulating frontend useContracts hook)
    console.log("\n🔍 Testing Candidate Contract (Frontend):");
    try {
        const candidateAbi = require("./frontend/src/contracts/Candidate.abi.json");
        const candidateContract = new ethers.Contract(addresses.Candidate, candidateAbi, signer);
        
        const allCandidates = await candidateContract.getAllCandidates();
        console.log(`✅ All candidates loaded: ${allCandidates.length} candidates`);
        
        const voterConstituency = "1"; // From voter details above
        
        for (let i = 0; i < allCandidates.length; i++) {
            const address = allCandidates[i];
            const candidateId = await candidateContract.getCandidateIdByAddress(address);
            const details = await candidateContract.getCandidateDetails(candidateId);
            
            console.log(`\nCandidate ${i + 1}:`);
            console.log(`  Address: ${address}`);
            console.log(`  Name: ${details[0]}`);
            console.log(`  Party: ${details[1]}`);
            console.log(`  Constituency: ${details[3].toString()}`);
            console.log(`  Verified: ${details[5]}`);
            
            if (details[3].toString() === voterConstituency) {
                console.log(`  ✅ MATCHES voter constituency - will show in Cast Vote`);
            } else {
                console.log(`  ❌ Different constituency - will NOT show in Cast Vote`);
            }
        }
        
    } catch (e) {
        console.log(`❌ Candidate contract error: ${e.message}`);
    }

    // Test GeneralElections contract
    console.log("\n🔍 Testing GeneralElections Contract (Frontend):");
    try {
        const generalElectionsAbi = require("./frontend/src/contracts/GeneralElections.abi.json");
        const generalElectionsContract = new ethers.Contract(addresses.GeneralElections, generalElectionsAbi, signer);
        
        const totalVotes = await generalElectionsContract.getTotalVotes();
        console.log(`✅ Total votes: ${totalVotes}`);
        
    } catch (e) {
        console.log(`❌ GeneralElections contract error: ${e.message}`);
    }

    console.log("\n✅ Frontend Connection Test Complete!");
    console.log("\n📱 If this works but frontend doesn't show candidates:");
    console.log("1. Check browser console for JavaScript errors");
    console.log("2. Make sure MetaMask is connected to the right network");
    console.log("3. Try refreshing the Cast Vote page");
    console.log("4. Check if the frontend is using the correct contract addresses");
    console.log("5. Make sure you're connected with a verified voter account");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
