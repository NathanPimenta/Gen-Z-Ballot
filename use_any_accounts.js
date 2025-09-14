const { ethers } = require("hardhat");

async function main() {
    console.log("🎯 Using Any Accounts for Gen-Z Ballot Testing\n");

    // Get all available accounts
    const accounts = await ethers.getSigners();
    
    console.log("📋 Available Test Accounts:");
    console.log("===========================");
    
    for (let i = 0; i < Math.min(10, accounts.length); i++) {
        console.log(`Account #${i}: ${accounts[i].address}`);
    }
    
    console.log("\n🎯 Example: Using Different Accounts");
    console.log("====================================");
    
    // Example: Use Account #7 as voter, Account #8 as candidate, etc.
    const voter = accounts[7];  // Any account
    const candidate = accounts[8];  // Any account
    const officer = accounts[1];  // Must be an existing officer
    
    console.log(`Voter: ${voter.address} (Account #7)`);
    console.log(`Candidate: ${candidate.address} (Account #8)`);
    console.log(`Officer: ${officer.address} (Account #1 - Constituency 1)`);
    
    console.log("\n📝 Steps to Use Any Accounts:");
    console.log("=============================");
    console.log("1. Import any account into MetaMask");
    console.log("2. Register as voter/candidate with SAME constituency number");
    console.log("3. Use an existing officer to verify them");
    console.log("4. Vote and view results");
    
    console.log("\n⚠️  Important Rules:");
    console.log("===================");
    console.log("• Voter and Candidate must have SAME constituency number");
    console.log("• Officer must be from the SAME constituency");
    console.log("• Commissioner (Account #0) is already set up");
    console.log("• Officers (Account #1, #2) are already added");
    
    console.log("\n✅ You can use ANY account - just follow the constituency rules!");
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("❌ Error:", error);
        process.exit(1);
    });
