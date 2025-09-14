const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Testing Frontend Contract Connection\n");

    // Simulate what the frontend does
    const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545");
    const signer = await provider.getSigner("0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC"); // Voter1 address

    console.log("📋 Provider and Signer:");
    console.log(`Provider URL: http://127.0.0.1:8545`);
    console.log(`Signer Address: ${await signer.getAddress()}`);
    console.log(`Signer Balance: ${ethers.formatEther(await provider.getBalance(await signer.getAddress()))} ETH`);
    console.log("");

    // Contract addresses from frontend
    const addresses = {
        "ElectionOfficer": "0x5FbDB2315678afecb367f032d93F642f64180aa3",
        "Voter": "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
        "Candidate": "0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0",
        "GeneralElections": "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"
    };

    // Test Voter contract
    console.log("🔍 Testing Voter Contract:");
    try {
        const voterAbi = require("./frontend/src/contracts/Voter.abi.json");
        const voterContract = new ethers.Contract(addresses.Voter, voterAbi, signer);
        
        const voterCount = await voterContract.voterCount();
        console.log(`✅ Voter count: ${voterCount}`);
        
        const allVoters = await voterContract.getAllVoters();
        console.log(`✅ All voters: ${allVoters.length} voters found`);
        
        for (let i = 0; i < allVoters.length; i++) {
            const voterAddress = allVoters[i];
            const voterDetails = await voterContract.getVoterByAddress(voterAddress);
            console.log(`  Voter ${i + 1}: ${voterDetails.name} (${voterAddress})`);
        }
        
    } catch (e) {
        console.log(`❌ Voter contract error: ${e.message}`);
    }

    // Test Candidate contract
    console.log("\n🔍 Testing Candidate Contract:");
    try {
        const candidateAbi = require("./frontend/src/contracts/Candidate.abi.json");
        const candidateContract = new ethers.Contract(addresses.Candidate, candidateAbi, signer);
        
        const allCandidates = await candidateContract.getAllCandidates();
        console.log(`✅ All candidates: ${allCandidates.length} candidates found`);
        
        for (let i = 0; i < allCandidates.length; i++) {
            const candidateAddress = allCandidates[i];
            const candidateId = await candidateContract.getCandidateIdByAddress(candidateAddress);
            const candidateDetails = await candidateContract.getCandidateDetails(candidateId);
            console.log(`  Candidate ${i + 1}: ${candidateDetails.name} (${candidateAddress})`);
        }
        
    } catch (e) {
        console.log(`❌ Candidate contract error: ${e.message}`);
    }

    // Test GeneralElections contract
    console.log("\n🔍 Testing GeneralElections Contract:");
    try {
        const generalElectionsAbi = require("./frontend/src/contracts/GeneralElections.abi.json");
        const generalElectionsContract = new ethers.Contract(addresses.GeneralElections, generalElectionsAbi, signer);
        
        const totalVotes = await generalElectionsContract.getTotalVotes();
        console.log(`✅ Total votes: ${totalVotes}`);
        
    } catch (e) {
        console.log(`❌ GeneralElections contract error: ${e.message}`);
    }

    console.log("\n✅ Frontend Connection Test Complete!");
    console.log("\n📱 If this works but frontend doesn't:");
    console.log("1. Check browser console for JavaScript errors");
    console.log("2. Make sure MetaMask is connected to the right network");
    console.log("3. Try refreshing the page");
    console.log("4. Check if the frontend is using the correct contract addresses");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Test failed:", error);
        process.exit(1);
    });
