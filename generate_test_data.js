const { ethers } = require("hardhat");

// Generate realistic test data for Gen-Z Ballot
function generateTestData() {
  const names = [
    "Alice Johnson", "Bob Smith", "Carol Davis", "David Wilson", "Eva Brown",
    "Frank Miller", "Grace Lee", "Henry Taylor", "Ivy Chen", "Jack Anderson",
    "Kate Martinez", "Leo Rodriguez", "Maya Patel", "Noah Kim", "Olivia White"
  ];
  
  const parties = [
    "Progressive Party", "Conservative Alliance", "Liberal Democrats", "Green Party",
    "Independent", "Unity Party", "Reform Party", "People's Party", "Future Party"
  ];
  
  const constituencies = [1, 2, 3, 4, 5];
  
  // Generate voters
  const voters = [];
  for (let i = 0; i < 10; i++) {
    const name = names[i % names.length];
    const age = Math.floor(Math.random() * 30) + 18; // 18-47
    const aadhar = Math.floor(Math.random() * 900000000000) + 100000000000; // 12 digits
    voters.push({
      name: name,
      age: age,
      aadhar: aadhar.toString(),
      voterId: `VOTER${String(i + 1).padStart(3, '0')}`,
      constituency: constituencies[Math.floor(Math.random() * constituencies.length)]
    });
  }
  
  // Generate candidates
  const candidates = [];
  for (let i = 0; i < 5; i++) {
    const name = names[(i + 10) % names.length];
    const party = parties[i % parties.length];
    const age = Math.floor(Math.random() * 20) + 25; // 25-44
    const deposit = (Math.random() * 4 + 0.5).toFixed(1); // 0.5-4.5 ETH
    candidates.push({
      name: name,
      party: party,
      age: age,
      constituency: constituencies[Math.floor(Math.random() * constituencies.length)],
      deposit: deposit
    });
  }
  
  return { voters, candidates };
}

async function setupTestData() {
  console.log("🎲 Generating test data for Gen-Z Ballot...\n");
  
  const testData = generateTestData();
  
  console.log("📝 Generated Voters:");
  testData.voters.forEach((voter, index) => {
    console.log(`${index + 1}. ${voter.name} (Age: ${voter.age}, Constituency: ${voter.constituency})`);
  });
  
  console.log("\n🏛️ Generated Candidates:");
  testData.candidates.forEach((candidate, index) => {
    console.log(`${index + 1}. ${candidate.name} - ${candidate.party} (Age: ${candidate.age}, Constituency: ${candidate.constituency}, Deposit: ${candidate.deposit} ETH)`);
  });
  
  // Save to JSON file for easy access
  const fs = require('fs');
  fs.writeFileSync('test_data.json', JSON.stringify(testData, null, 2));
  console.log("\n💾 Test data saved to test_data.json");
  
  return testData;
}

// Export for use in other scripts
module.exports = { generateTestData, setupTestData };

// Run if called directly
if (require.main === module) {
  setupTestData()
    .then(() => {
      console.log("\n✅ Test data generation complete!");
      console.log("You can now use this data for testing your Gen-Z Ballot system.");
    })
    .catch(console.error);
}
