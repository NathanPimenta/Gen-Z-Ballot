const { ethers } = require("hardhat");

async function main() {
    console.log("🔍 Checking Election Officers\n");

    // Get signers
    const [deployer, officer1, officer2, officer3, voter1, candidate1] = await ethers.getSigners();
    
    console.log("📋 Available Accounts:");
    console.log(`Account 0 (Deployer/Commissioner): ${deployer.address}`);
    console.log(`Account 1 (Officer 1): ${officer1.address}`);
    console.log(`Account 2 (Officer 2): ${officer2.address}`);
    console.log(`Account 3 (Officer 3): ${officer3.address}`);
    console.log(`Account 4 (Voter 1): ${voter1.address}`);
    console.log(`Account 5 (Candidate 1): ${candidate1.address}`);
    console.log("");

    // Get contract instance
    const electionOfficerAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
    const ElectionOfficer = await ethers.getContractFactory("ElectionOfficer");
    const electionOfficer = ElectionOfficer.attach(electionOfficerAddress);

    console.log("🔍 Checking Officer Status:");
    
    // Check each account
    const accounts = [
        { name: "Deployer/Commissioner", address: deployer.address, signer: deployer },
        { name: "Officer 1", address: officer1.address, signer: officer1 },
        { name: "Officer 2", address: officer2.address, signer: officer2 },
        { name: "Officer 3", address: officer3.address, signer: officer3 },
        { name: "Voter 1", address: voter1.address, signer: voter1 },
        { name: "Candidate 1", address: candidate1.address, signer: candidate1 }
    ];

    for (const account of accounts) {
        try {
            const isOfficer = await electionOfficer.isElecOfficer(account.address);
            if (isOfficer) {
                const officerDetails = await electionOfficer.getOfficerByAddress(account.address);
                console.log(`✅ ${account.name}: IS AN OFFICER`);
                console.log(`   Name: ${officerDetails.name}`);
                console.log(`   Constituency: ${officerDetails.allotedConstituency}`);
                console.log(`   Address: ${account.address}`);
            } else {
                console.log(`❌ ${account.name}: NOT AN OFFICER`);
            }
        } catch (e) {
            console.log(`❌ ${account.name}: Error checking - ${e.message}`);
        }
    }

    console.log("\n🔑 Private Keys for MetaMask:");
    console.log("Account 0 (Commissioner): 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80");
    console.log("Account 1 (Officer 1): 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d");
    console.log("Account 2 (Officer 2): 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a");
    console.log("Account 3 (Officer 3): 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6");
    console.log("Account 4 (Voter 1): 0x47e179ec257488ca7df7c4e9b1d39cbbae4845eba3f2af9f084166d63c69671");
    console.log("Account 5 (Candidate 1): 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba");

    console.log("\n📱 Instructions for Officer Panel:");
    console.log("1. Open MetaMask");
    console.log("2. Import Account using private key");
    console.log("3. Use Account 1, 2, or 3 (they are officers)");
    console.log("4. Make sure you're on Hardhat Local network (Chain ID: 1337)");
    console.log("5. Go to Officer Panel in the app");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Check failed:", error);
        process.exit(1);
    });
