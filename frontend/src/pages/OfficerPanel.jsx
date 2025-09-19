import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../web3/useContracts';

const OfficerPanel = () => {
  const [account, setAccount] = useState(null);
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [officerInfo, setOfficerInfo] = useState(null);

  // Use the contracts from the hook
  const { Voter, Candidate, GeneralElections, ElectionOfficer } = useContracts();

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        loadData();
      } else {
        setMessage('Please install MetaMask to use this feature');
      }
    } catch (error) {
      setMessage(`Wallet connection failed: ${error.message}`);
    }
  };

  const loadData = async () => {
    if (!Voter || !Candidate || !ElectionOfficer) return;
    
    try {
      setLoading(true);
      setMessage('Loading data...');
      
      // Get contract instances
      const voterContract = await Voter();
      const candidateContract = await Candidate();
      const electionOfficerContract = await ElectionOfficer();
      
      // Load officer information
      try {
        const isOfficer = await electionOfficerContract.isElecOfficer(account);
        if (isOfficer) {
          const officerDetails = await electionOfficerContract.getOfficerByAddress(account);
          setOfficerInfo({
            name: officerDetails.name,
            constituency: officerDetails.allotedConstituency.toString(),
            id: officerDetails.id.toString()
          });
        } else {
          setOfficerInfo(null);
        }
      } catch (e) {
        console.log('Error loading officer info:', e.message);
        setOfficerInfo(null);
      }
      
      // Load voters using getAllVoters function
      const voterAddresses = await voterContract.getAllVoters();
      const voterDetails = [];
      
      for (const address of voterAddresses) {
        try {
          const details = await voterContract.getVoterByAddress(address);
          const voterData = {
            address: address,
            name: details[1], // name
            age: details[2].toString(), // age
            constituency: details[3].toString(), // constituencyId
            hasVoted: details[4], // hasVoted
            isVerified: details[5] // isAllowedToVote
          };
          
          // Only show voters from the officer's constituency (if officer is logged in)
          if (!officerInfo || voterData.constituency === officerInfo.constituency) {
            voterDetails.push(voterData);
          }
        } catch (e) {
          console.log('Error loading voter details for', address, e.message);
          continue;
        }
      }
      setVoters(voterDetails);
      
      // Load candidates using getAllCandidates function
      const candidateAddresses = await candidateContract.getAllCandidates();
      const candidateDetails = [];
      
      for (const address of candidateAddresses) {
        try {
          const candidateId = await candidateContract.getCandidateIdByAddress(address);
          const details = await candidateContract.getCandidateDetails(candidateId);
          const candidateData = {
            address: address,
            name: details[0], // name
            party: details[1], // politicalParty
            constituency: details[3].toString(), // constituencyId
            age: details[2].toString(), // age
            isVerified: details[5] // isVerified (canContest is details[4])
          };
          
          // Only show candidates from the officer's constituency (if officer is logged in)
          if (!officerInfo || candidateData.constituency === officerInfo.constituency) {
            candidateDetails.push(candidateData);
          }
        } catch (e) {
          console.log('Error loading candidate details for', address, e.message);
          continue;
        }
      }
      setCandidates(candidateDetails);
      
      setMessage(`Loaded ${voterDetails.length} voters and ${candidateDetails.length} candidates`);
      
    } catch (error) {
      console.error('Error loading data:', error);
      setMessage(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyVoter = async (voterAddress) => {
    try {
      setLoading(true);
      setMessage('Verifying voter...');
      
      // Get contract instances
      const voterContract = await Voter();
      const electionOfficerContract = await ElectionOfficer();
      
      // Check if current account is an election officer
      const isOfficer = await electionOfficerContract.isElecOfficer(account);
      if (!isOfficer) {
        setMessage('Error: You are not authorized as an election officer');
        return;
      }
      
      // Get officer details to check constituency
      const officerDetails = await electionOfficerContract.getOfficerByAddress(account);
      const officerConstituency = officerDetails.allotedConstituency;
      
      // Get voter details to check constituency
      const voterDetails = await voterContract.getVoterByAddress(voterAddress);
      const voterConstituency = voterDetails.constituencyId;
      
      // Check if officer and voter are from same constituency
      if (officerConstituency.toString() !== voterConstituency.toString()) {
        setMessage(`Error: You can only verify voters from your assigned constituency (${officerConstituency}). This voter is from constituency ${voterConstituency}`);
        return;
      }
      
      // Check if voter is already verified
      if (voterDetails.isAllowedToVote) {
        setMessage('Error: This voter is already verified');
        return;
      }
      
      // For demo purposes, we'll use a simplified verification approach
      // In a real system, the officer would input the actual Aadhar and Voter ID
      // For now, we'll use the bulk verification function which doesn't require Aadhar/Voter ID matching
      const tx = await voterContract.bulkVerifyVoters([voterAddress], [true]);
      await tx.wait();
      
      setMessage('Voter verified successfully!');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Verification error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot verify the voter as both are from different constituencies')) {
        setMessage('Error: You can only verify voters from your assigned constituency');
      } else if (error.message.includes('Voter is already verified')) {
        setMessage('Error: This voter is already verified');
      } else if (error.message.includes('Voter not found')) {
        setMessage('Error: Voter not found in the system');
      } else if (error.message.includes('Only Election Officer can perform this action')) {
        setMessage('Error: You are not authorized as an election officer');
      } else {
        setMessage(`Verification failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  const verifyCandidate = async (candidateAddress) => {
    try {
      setLoading(true);
      setMessage('Verifying candidate...');
      
      // Get contract instances
      const candidateContract = await Candidate();
      const electionOfficerContract = await ElectionOfficer();
      
      // Check if current account is an election officer
      const isOfficer = await electionOfficerContract.isElecOfficer(account);
      if (!isOfficer) {
        setMessage('Error: You are not authorized as an election officer');
        return;
      }
      
      // Get officer details to check constituency
      const officerDetails = await electionOfficerContract.getOfficerByAddress(account);
      const officerConstituency = officerDetails.allotedConstituency;
      
      // Get candidate details to check constituency
      const candidateId = await candidateContract.getCandidateIdByAddress(candidateAddress);
      const candidateDetails = await candidateContract.getCandidateDetails(candidateId);
      const candidateConstituency = candidateDetails.constituencyId;
      
      // Check if officer and candidate are from same constituency
      if (officerConstituency.toString() !== candidateConstituency.toString()) {
        setMessage(`Error: You can only verify candidates from your assigned constituency (${officerConstituency}). This candidate is from constituency ${candidateConstituency}`);
        return;
      }
      
      // Check if candidate is already verified
      if (candidateDetails.isVerified) {
        setMessage('Error: This candidate is already verified');
        return;
      }
      
      const tx = await candidateContract.candidateVerification(candidateAddress, true);
      await tx.wait();
      setMessage('Candidate verified successfully!');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Candidate verification error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot verify the candidate as both are from different constituencies')) {
        setMessage('Error: You can only verify candidates from your assigned constituency');
      } else if (error.message.includes('already verified')) {
        setMessage('Error: This candidate is already verified');
      } else if (error.message.includes('not found')) {
        setMessage('Error: Candidate not found in the system');
      } else if (error.message.includes('Only Election Officer can perform this action')) {
        setMessage('Error: You are not authorized as an election officer');
      } else {
        setMessage(`Verification failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="connect-wallet-container">
        <div className="connect-wallet-card card">
          <h2>🔐 Election Officer Panel</h2>
          <p>Please connect your wallet to access the officer panel.</p>
          <button onClick={connectWallet} className="btn-primary">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="officer-panel-container">
      <div className="header">
        <h1>🏛️ Election Officer Panel</h1>
        <p>Manage voter and candidate verification</p>
        {officerInfo && (
          <div className="officer-info">
            <h4>👮‍♂️ Officer Information</h4>
            <p><strong>Name:</strong> {officerInfo.name}</p>
            <p><strong>Constituency:</strong> {officerInfo.constituency}</p>
            <p><strong>Officer ID:</strong> {officerInfo.id}</p>
            <p><em>You can only verify voters and candidates from your assigned constituency.</em></p>
          </div>
        )}
        {!officerInfo && account && (
          <div className="officer-warning">
            <h4>⚠️ Authorization Required</h4>
            <p>Your account is not registered as an election officer. Please contact the election commissioner to be assigned as an officer.</p>
          </div>
        )}
      </div>

      {message && (
        <div className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      
      <div className="grid">
        {/* Voters Section */}
        <div className="verification-section card">
          <h3>👥 Voter Verification</h3>
          {loading ? (
            <div className="loading">Loading voters...</div>
          ) : (
            <div className="voter-list">
              {voters.length === 0 ? (
                <p className="empty-message">No voters registered yet.</p>
              ) : (
                voters.map((voter, index) => (
                  <div key={index} className="voter-item">
                    <div className="voter-info">
                      <strong>{voter.name}</strong>
                      <p>Age: {voter.age}</p>
                      <p>Constituency: {voter.constituency}</p>
                      <p>Has Voted: {voter.hasVoted ? "✅ Yes" : "❌ No"}</p>
                      <p>Status: <span className={voter.isVerified ? "status-verified" : "status-pending"}>{voter.isVerified ? "✅ Verified" : "❌ Pending"}</span></p>
                    </div>
                    {!voter.isVerified && (
                      <button
                        onClick={() => verifyVoter(voter.address)}
                        className="verify-button"
                        disabled={loading}
                      >
                        Verify
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>


        {/* Candidates Section */}
        <div className="verification-section card">
          <h3>🏛️ Candidate Verification</h3>
          {loading ? (
            <div className="loading">Loading candidates...</div>
          ) : (
            <div className="candidate-list">
              {candidates.length === 0 ? (
                <p className="empty-message">No candidates registered yet.</p>
              ) : (
                candidates.map((candidate, index) => (
                  <div key={index} className="candidate-item">
                    <div className="candidate-info">
                      <strong>{candidate.name}</strong>
                      <p>Party: {candidate.party}</p>
                      <p>Constituency: {candidate.constituency}</p>
                      <p>Age: {candidate.age}</p>
                      <p>Status: <span className={candidate.isVerified ? "status-verified" : "status-pending"}>{candidate.isVerified ? '✅ Verified' : '❌ Pending'}</span></p>
                    </div>
                    {!candidate.isVerified && (
                      <button
                        onClick={() => verifyCandidate(candidate.address)}
                        className="verify-button"
                        disabled={loading}
                      >
                        Verify
                      </button>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      <div className="quick-actions card">
        <h3>📊 Quick Actions</h3>
        <div className="form-row">
          <button onClick={loadData} className="btn-primary" disabled={loading}>
            🔄 Refresh Data
          </button>
          <button onClick={() => setMessage('')} className="btn-secondary">
            Clear Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerPanel;
