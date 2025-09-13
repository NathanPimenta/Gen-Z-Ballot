@echo off
echo 🧪 Running Gen-Z Ballot Test Suite...
echo.

echo 📊 Generating test data...
node generate_test_data.js

echo.
echo 🚀 Running comprehensive tests...
npx hardhat run test_runner.js --network localhost

echo.
echo ✅ Test suite complete!
pause
