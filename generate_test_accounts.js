const { ethers } = require("hardhat");

async function main() {
    console.log("🔑 Generating Test Accounts for Gen-Z Ballot System\n");

    // Get signers (these are the accounts from your Hardhat node)
    const [deployer, officer1, officer2, voter1, voter2, candidate1, candidate2] = await ethers.getSigners();
    
    console.log("📋 Test Account Details:");
    console.log("========================");
    
    console.log("\n👑 COMMISSIONER (Deployer):");
    console.log(`Address: ${deployer.address}`);
    console.log(`Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`);
    console.log(`Role: Election Commissioner (can add officers)`);
    
    console.log("\n👮‍♂️ ELECTION OFFICERS:");
    console.log(`Officer 1 (Constituency 1):`);
    console.log(`  Address: ${officer1.address}`);
    console.log(`  Private Key: 0x59c6995e998f97a5a0044966f0945389dc9e86dae88c7a8412f4603b6b78690d`);
    console.log(`  Role: Verifies voters and candidates from Constituency 1`);
    
    console.log(`\nOfficer 2 (Constituency 2):`);
    console.log(`  Address: ${officer2.address}`);
    console.log(`  Private Key: 0x5de4111afa1a4b94908f83103eb1f1706367c2e68ca870fc3fb9a804cdab365a`);
    console.log(`  Role: Verifies voters and candidates from Constituency 2`);
    
    console.log("\n👥 VOTERS:");
    console.log(`Voter 1 (Constituency 1):`);
    console.log(`  Address: ${voter1.address}`);
    console.log(`  Private Key: 0x7c852118294e51e653712a81e05800f419141751be58f605c371e15141b007a6`);
    console.log(`  Role: Can vote for candidates in Constituency 1`);
    
    console.log(`\nVoter 2 (Constituency 2):`);
    console.log(`  Address: ${voter2.address}`);
    console.log(`  Private Key: 0x47e179ec197488593b187f80a00eb0da91f1b9d0b13f8733639f19c30a34926a`);
    console.log(`  Role: Can vote for candidates in Constituency 2`);
    
    console.log("\n🏛️ CANDIDATES:");
    console.log(`Candidate 1 (Constituency 1):`);
    console.log(`  Address: ${candidate1.address}`);
    console.log(`  Private Key: 0x8b3a350cf5c34c9194ca85829a2df0ec3153be0318b5e2d3348e872092edffba`);
    console.log(`  Role: Runs for office in Constituency 1`);
    
    console.log(`\nCandidate 2 (Constituency 2):`);
    console.log(`  Address: ${candidate2.address}`);
    console.log(`  Private Key: 0x92db14e403b83dfe3df233f83dfa3a0d7096f21ca9b0d6d6b8d88b2b4ec1564e`);
    console.log(`  Role: Runs for office in Constituency 2`);
    
    console.log("\n📱 MetaMask Import Instructions:");
    console.log("=================================");
    console.log("1. Open MetaMask");
    console.log("2. Click account icon (top right)");
    console.log("3. Click 'Import Account'");
    console.log("4. Select 'Private Key'");
    console.log("5. Copy and paste the private key for the account you want");
    console.log("6. Click 'Import'");
    console.log("7. Repeat for each account you want to test with");
    
    console.log("\n🎯 Recommended Testing Order:");
    console.log("============================");
    console.log("1. Import Voter 1 → Register as voter");
    console.log("2. Import Candidate 1 → Register as candidate");
    console.log("3. Import Officer 1 → Verify voter and candidate");
    console.log("4. Switch to Voter 1 → Cast vote");
    console.log("5. Import Voter 2 → Register as voter");
    console.log("6. Import Candidate 2 → Register as candidate");
    console.log("7. Import Officer 2 → Verify voter and candidate");
    console.log("8. Switch to Voter 2 → Cast vote");
    console.log("9. View results in the Results page");
    
    console.log("\n⚠️  Important Notes:");
    console.log("===================");
    console.log("• These are TEST accounts with fake ETH");
    console.log("• Never use these private keys on mainnet");
    console.log("• Each account has 10,000 test ETH");
    console.log("• Make sure you're on Hardhat Local network (Chain ID: 1337)");
    
    console.log("\n✅ Ready to test your Gen-Z Ballot system!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error generating accounts:", error);
        process.exit(1);
    });
