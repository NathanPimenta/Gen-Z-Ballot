import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';

const OfficerPanel = () => {
  const [account, setAccount] = useState(null);
  const [contracts, setContracts] = useState({});
  const [voters, setVoters] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Contract addresses (from deployed contracts)
  const VOTER_CONTRACT = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318";
  const CANDIDATE_CONTRACT = "0x610178dA211FEF7D417bC0e6FeD39F05609AD788";
  const GENERAL_ELECTIONS_CONTRACT = "0xB7f8BC63BbcaD18155201308C8f3540b07f84F5e";

  // ABI for contracts (simplified)
  const VOTER_ABI = [
    "function verifyVoters(address voter, bytes32 aadhar, string memory voterId, bool status) external",
    "function getVoterDetails(address voter) external view returns (string memory, uint256, string memory, bool, bool)",
    "function getAllVoters() external view returns (address[] memory)"
  ];

  const CANDIDATE_ABI = [
    "function candidateVerification(address candidate, bool status) external",
    "function getCandidateDetails(address candidate) external view returns (string memory, string memory, string memory, uint256, bool, bool)",
    "function getAllCandidates() external view returns (address[] memory)"
  ];

  const GENERAL_ELECTIONS_ABI = [
    "function getElectionResults(uint256 constituencyId) external view returns (address[] memory, uint256[] memory, address[] memory, bool)"
  ];

  useEffect(() => {
    connectWallet();
  }, []);

  const connectWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
        
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        
        setContracts({
          voter: new ethers.Contract(VOTER_CONTRACT, VOTER_ABI, signer),
          candidate: new ethers.Contract(CANDIDATE_CONTRACT, CANDIDATE_ABI, signer),
          generalElections: new ethers.Contract(GENERAL_ELECTIONS_CONTRACT, GENERAL_ELECTIONS_ABI, signer)
        });
        
        loadData();
      } else {
        setMessage('Please install MetaMask to use this feature');
      }
    } catch (error) {
      setMessage(`Wallet connection failed: ${error.message}`);
    }
  };

  const loadData = async () => {
    if (!contracts.voter || !contracts.candidate) return;
    
    try {
      setLoading(true);
      
      // Load voters
      const voterAddresses = await contracts.voter.getAllVoters();
      const voterDetails = await Promise.all(
        voterAddresses.map(async (address) => {
          const details = await contracts.voter.getVoterDetails(address);
          return {
            address,
            name: details[0],
            age: details[1].toString(),
            aadhar: details[2],
            isRegistered: details[3],
            isVerified: details[4]
          };
        })
      );
      setVoters(voterDetails);
      
      // Load candidates
      const candidateAddresses = await contracts.candidate.getAllCandidates();
      const candidateDetails = await Promise.all(
        candidateAddresses.map(async (address) => {
          const details = await contracts.candidate.getCandidateDetails(address);
          return {
            address,
            name: details[0],
            party: details[1],
            constituency: details[2],
            age: details[3].toString(),
            isRegistered: details[4],
            isVerified: details[5]
          };
        })
      );
      setCandidates(candidateDetails);
      
    } catch (error) {
      setMessage(`Error loading data: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyVoter = async (voterAddress, aadhar, voterId) => {
    try {
      setLoading(true);
      const tx = await contracts.voter.verifyVoters(voterAddress, aadhar, voterId, true);
      await tx.wait();
      setMessage('Voter verified successfully!');
      loadData(); // Refresh data
    } catch (error) {
      setMessage(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const verifyCandidate = async (candidateAddress) => {
    try {
      setLoading(true);
      const tx = await contracts.candidate.candidateVerification(candidateAddress, true);
      await tx.wait();
      setMessage('Candidate verified successfully!');
      loadData(); // Refresh data
    } catch (error) {
      setMessage(`Verification failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div className="container">
        <div className="card">
          <h2>🔐 Election Officer Panel</h2>
          <p>Please connect your wallet to access the officer panel.</p>
          <button onClick={connectWallet} className="btn primary">
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <h1>🏛️ Election Officer Panel</h1>
        <p>Manage voter and candidate verification</p>
      </div>

      {message && (
        <div className={`status-message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      <div className="grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        {/* Voters Section */}
        <div className="card">
          <h3>👥 Voter Verification</h3>
          {loading ? (
            <div className="loading">Loading voters...</div>
          ) : (
            <div className="voter-list">
              {voters.length === 0 ? (
                <p>No voters registered yet.</p>
              ) : (
                voters.map((voter, index) => (
                  <div key={index} className="voter-item">
                    <div className="voter-info">
                      <strong>{voter.name}</strong>
                      <p>Age: {voter.age}</p>
                      <p>Aadhar: {voter.aadhar}</p>
                      <p>Status: {voter.isVerified ? '✅ Verified' : '❌ Pending'}</p>
                    </div>
                    {!voter.isVerified && (
                      <button
                        onClick={() => verifyVoter(voter.address, voter.aadhar, `VOTER${index + 1}`)}
                        className="btn success"
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
        <div className="card">
          <h3>🏛️ Candidate Verification</h3>
          {loading ? (
            <div className="loading">Loading candidates...</div>
          ) : (
            <div className="candidate-list">
              {candidates.length === 0 ? (
                <p>No candidates registered yet.</p>
              ) : (
                candidates.map((candidate, index) => (
                  <div key={index} className="candidate-item">
                    <div className="candidate-info">
                      <strong>{candidate.name}</strong>
                      <p>Party: {candidate.party}</p>
                      <p>Constituency: {candidate.constituency}</p>
                      <p>Age: {candidate.age}</p>
                      <p>Status: {candidate.isVerified ? '✅ Verified' : '❌ Pending'}</p>
                    </div>
                    {!candidate.isVerified && (
                      <button
                        onClick={() => verifyCandidate(candidate.address)}
                        className="btn success"
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

      <div className="card">
        <h3>📊 Quick Actions</h3>
        <div className="form-row">
          <button onClick={loadData} className="btn primary" disabled={loading}>
            🔄 Refresh Data
          </button>
          <button onClick={() => setMessage('')} className="btn secondary">
            Clear Messages
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerPanel;
