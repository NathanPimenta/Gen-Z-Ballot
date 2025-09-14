import React, { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../web3/useContracts';

const OfficerPanelNew = () => {
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
      
      // Load voters
      const voterAddresses = await voterContract.getAllVoters();
      const voterDetails = [];
      
      for (const address of voterAddresses) {
        try {
          const details = await voterContract.getVoterByAddress(address);
          const voterData = {
            address: address,
            name: details.name,
            age: details.age.toString(),
            constituency: details.constituencyId.toString(),
            hasVoted: details.hasVoted,
            isVerified: details.isAllowedToVote
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
      
      // Load candidates
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
      const candidateConstituency = candidateDetails[3]; // constituencyId
      
      // Check if officer and candidate are from same constituency
      if (officerConstituency.toString() !== candidateConstituency.toString()) {
        setMessage(`Error: You can only verify candidates from your assigned constituency (${officerConstituency}). This candidate is from constituency ${candidateConstituency}`);
        return;
      }
      
      // Check if candidate is already verified
      if (candidateDetails[5]) { // isVerified
        setMessage('Error: This candidate is already verified');
        return;
      }
      
      // Verify the candidate (use address, not ID)
      const tx = await candidateContract.candidateVerification(candidateAddress, true);
      await tx.wait();
      
      setMessage('Candidate verified successfully!');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Verification error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot verify the candidate as both are from different constituencies')) {
        setMessage('Error: You can only verify candidates from your assigned constituency');
      } else if (error.message.includes('Candidate is already verified')) {
        setMessage('Error: This candidate is already verified');
      } else if (error.message.includes('Candidate not found')) {
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

  const deleteCandidate = async (candidateAddress) => {
    try {
      setLoading(true);
      setMessage('Removing candidate...');
      
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
      const candidateConstituency = candidateDetails[3]; // constituencyId
      
      // Check if officer and candidate are from same constituency
      if (officerConstituency.toString() !== candidateConstituency.toString()) {
        setMessage(`Error: You can only remove candidates from your assigned constituency (${officerConstituency}). This candidate is from constituency ${candidateConstituency}`);
        return;
      }
      
      // Confirm deletion
      if (!window.confirm(`Are you sure you want to remove candidate "${candidateDetails[0]}"? This action cannot be undone and will refund their security deposit.`)) {
        setMessage('Candidate removal cancelled');
        return;
      }
      
      // Remove the candidate
      const tx = await candidateContract.removeCandidate(candidateAddress);
      await tx.wait();
      
      setMessage('Candidate removed successfully! Security deposit refunded.');
      loadData(); // Refresh data
    } catch (error) {
      console.error('Deletion error:', error);
      
      // Provide more specific error messages
      if (error.message.includes('Cannot remove candidate from different constituency')) {
        setMessage('Error: You can only remove candidates from your assigned constituency');
      } else if (error.message.includes('Candidate not found')) {
        setMessage('Error: Candidate not found in the system');
      } else if (error.message.includes('Only Election Officer can perform this action')) {
        setMessage('Error: You are not authorized as an election officer');
      } else {
        setMessage(`Deletion failed: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!account) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(20px)',
          borderRadius: '20px',
          padding: '40px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.2)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          maxWidth: '500px',
          width: '100%'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔐</div>
          <h2 style={{ 
            color: 'white', 
            fontSize: '2rem', 
            marginBottom: '16px',
            fontWeight: '700'
          }}>
            Election Officer Panel
          </h2>
          <p style={{ 
            color: 'rgba(255,255,255,0.8)', 
            fontSize: '1.1rem',
            marginBottom: '32px',
            lineHeight: '1.6'
          }}>
            Please connect your wallet to access the officer panel.
          </p>
          <button 
            onClick={connectWallet}
            style={{
              background: 'linear-gradient(45deg, #667eea, #764ba2)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '16px 32px',
              fontSize: '1.1rem',
              cursor: 'pointer',
              fontWeight: '600',
              boxShadow: '0 4px 15px rgba(102,126,234,0.4)',
              transition: 'all 0.3s ease',
              textTransform: 'uppercase',
              letterSpacing: '1px'
            }}
            onMouseOver={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102,126,234,0.6)';
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102,126,234,0.4)';
            }}
          >
            Connect Wallet
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      padding: '20px'
    }}>
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header Section */}
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
          borderRadius: '20px', 
          padding: '32px',
          marginBottom: '32px',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
          backdropFilter: 'blur(10px)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '2.5rem', 
                color: 'white',
                fontWeight: '700',
                textShadow: '0 2px 4px rgba(0,0,0,0.3)'
              }}>
                🏛️ Election Officer Panel
              </h1>
              <p style={{ 
                color: 'rgba(255,255,255,0.9)', 
                fontSize: '1.2rem',
                margin: '8px 0 0 0',
                fontWeight: '300'
              }}>
                Manage voter and candidate verification
              </p>
            </div>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              padding: '12px 20px', 
              borderRadius: '12px',
              border: '1px solid rgba(255,255,255,0.2)',
              backdropFilter: 'blur(10px)'
            }}>
              <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginBottom: '4px' }}>
                Last update
              </div>
              <div style={{ fontSize: '1.1rem', color: 'white', fontWeight: '600' }}>
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
          
          <div style={{ 
            background: 'rgba(255,255,255,0.15)', 
            padding: '16px 20px', 
            borderRadius: '12px',
            border: '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '16px'
          }}>
            <div style={{ 
              width: '12px', 
              height: '12px', 
              borderRadius: '50%', 
              background: '#4ade80',
              boxShadow: '0 0 10px rgba(74,222,128,0.5)'
            }}></div>
            <div>
              <div style={{ fontSize: '1rem', color: 'white', fontWeight: '600' }}>
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
              {officerInfo && (
                <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.8)', marginTop: '4px' }}>
                  Officer: {officerInfo.name} | Constituency: {officerInfo.constituency}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Officer Info or Warning */}
        {officerInfo && (
          <div style={{ 
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)', 
            padding: '20px', 
            borderRadius: '16px', 
            marginBottom: '24px',
            border: '1px solid rgba(74,222,128,0.3)',
            boxShadow: '0 4px 15px rgba(74,222,128,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.5rem' }}>👮‍♂️</div>
              <h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                Officer Information
              </h4>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
              <div style={{ color: 'white' }}>
                <strong>Name:</strong> {officerInfo.name}
              </div>
              <div style={{ color: 'white' }}>
                <strong>Constituency:</strong> {officerInfo.constituency}
              </div>
              <div style={{ color: 'white' }}>
                <strong>Officer ID:</strong> {officerInfo.id}
              </div>
            </div>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              margin: '12px 0 0 0',
              fontSize: '0.9rem',
              fontStyle: 'italic'
            }}>
              You can only verify voters and candidates from your assigned constituency.
            </p>
          </div>
        )}

        {!officerInfo && account && (
          <div style={{ 
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', 
            padding: '20px', 
            borderRadius: '16px', 
            marginBottom: '24px',
            border: '1px solid rgba(245,158,11,0.3)',
            boxShadow: '0 4px 15px rgba(245,158,11,0.2)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
              <div style={{ fontSize: '1.5rem' }}>⚠️</div>
              <h4 style={{ margin: 0, color: 'white', fontSize: '1.2rem', fontWeight: '600' }}>
                Authorization Required
              </h4>
            </div>
            <p style={{ 
              color: 'rgba(255,255,255,0.9)', 
              margin: 0,
              fontSize: '1rem',
              lineHeight: '1.6'
            }}>
              Your account is not registered as an election officer. Please contact the election commissioner to be assigned as an officer.
            </p>
          </div>
        )}

        {/* Status Message */}
        {message && (
          <div style={{
            background: message.includes('success') ? 
              'linear-gradient(135deg, #10b981 0%, #059669 100%)' : 
              'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '12px',
            marginBottom: '24px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ fontSize: '1.2rem' }}>
              {message.includes('success') ? '✅' : '❌'}
            </div>
            <div style={{ flex: 1 }}>
              {message}
            </div>
            <button 
              onClick={() => setMessage('')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                borderRadius: '6px',
                color: 'white',
                padding: '4px 8px',
                cursor: 'pointer',
                fontSize: '0.8rem'
              }}
            >
              ✕
            </button>
          </div>
        )}

        {/* Main Content Grid */}
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
          gap: '24px',
          marginBottom: '32px'
        }}>
          {/* Voters Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>👥</div>
              <h3 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                Voter Verification
              </h3>
            </div>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                Loading voters...
              </div>
            ) : (
              <div>
                {voters.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
                    No voters registered yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {voters.map((voter, index) => (
                      <div key={index} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '600', 
                            color: 'white',
                            marginBottom: '8px'
                          }}>
                            {voter.name}
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                            gap: '8px',
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.8)'
                          }}>
                            <div>Age: {voter.age}</div>
                            <div>Constituency: {voter.constituency}</div>
                            <div>Voted: {voter.hasVoted ? '✅ Yes' : '❌ No'}</div>
                            <div>Status: {voter.isVerified ? '✅ Verified' : '❌ Pending'}</div>
                          </div>
                        </div>
                        {!voter.isVerified && (
                          <button
                            onClick={() => verifyVoter(voter.address)}
                            disabled={loading}
                            style={{
                              background: 'linear-gradient(45deg, #10b981, #059669)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
                              transition: 'all 0.3s ease',
                              opacity: loading ? 0.6 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(16,185,129,0.4)';
                              }
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(16,185,129,0.3)';
                            }}
                          >
                            Verify
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Candidates Section */}
          <div style={{
            background: 'rgba(255,255,255,0.1)',
            backdropFilter: 'blur(20px)',
            borderRadius: '20px',
            padding: '24px',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
              <div style={{ fontSize: '1.5rem' }}>🏛️</div>
              <h3 style={{ 
                margin: 0, 
                color: 'white', 
                fontSize: '1.3rem',
                fontWeight: '600'
              }}>
                Candidate Verification
              </h3>
            </div>
            
            {loading ? (
              <div style={{ 
                textAlign: 'center', 
                padding: '40px',
                color: 'rgba(255,255,255,0.8)'
              }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>⏳</div>
                Loading candidates...
              </div>
            ) : (
              <div>
                {candidates.length === 0 ? (
                  <div style={{ 
                    textAlign: 'center', 
                    padding: '40px',
                    color: 'rgba(255,255,255,0.6)'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📝</div>
                    No candidates registered yet.
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {candidates.map((candidate, index) => (
                      <div key={index} style={{
                        background: 'rgba(255,255,255,0.05)',
                        borderRadius: '12px',
                        padding: '16px',
                        border: '1px solid rgba(255,255,255,0.1)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        transition: 'all 0.3s ease'
                      }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            fontSize: '1.1rem', 
                            fontWeight: '600', 
                            color: 'white',
                            marginBottom: '8px'
                          }}>
                            {candidate.name}
                          </div>
                          <div style={{ 
                            display: 'grid', 
                            gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', 
                            gap: '8px',
                            fontSize: '0.9rem',
                            color: 'rgba(255,255,255,0.8)'
                          }}>
                            <div>Party: {candidate.party}</div>
                            <div>Age: {candidate.age}</div>
                            <div>Constituency: {candidate.constituency}</div>
                            <div>Status: {candidate.isVerified ? '✅ Verified' : '❌ Pending'}</div>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {!candidate.isVerified && (
                            <button
                              onClick={() => verifyCandidate(candidate.address)}
                              disabled={loading}
                              style={{
                                background: 'linear-gradient(45deg, #3b82f6, #1d4ed8)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                padding: '8px 16px',
                                cursor: loading ? 'not-allowed' : 'pointer',
                                fontWeight: '600',
                                fontSize: '0.9rem',
                                boxShadow: '0 2px 8px rgba(59,130,246,0.3)',
                                transition: 'all 0.3s ease',
                                opacity: loading ? 0.6 : 1
                              }}
                              onMouseOver={(e) => {
                                if (!loading) {
                                  e.target.style.transform = 'translateY(-1px)';
                                  e.target.style.boxShadow = '0 4px 12px rgba(59,130,246,0.4)';
                                }
                              }}
                              onMouseOut={(e) => {
                                e.target.style.transform = 'translateY(0)';
                                e.target.style.boxShadow = '0 2px 8px rgba(59,130,246,0.3)';
                              }}
                            >
                              Verify
                            </button>
                          )}
                          <button
                            onClick={() => deleteCandidate(candidate.address)}
                            disabled={loading}
                            style={{
                              background: 'linear-gradient(45deg, #ef4444, #dc2626)',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '8px 16px',
                              cursor: loading ? 'not-allowed' : 'pointer',
                              fontWeight: '600',
                              fontSize: '0.9rem',
                              boxShadow: '0 2px 8px rgba(239,68,68,0.3)',
                              transition: 'all 0.3s ease',
                              opacity: loading ? 0.6 : 1
                            }}
                            onMouseOver={(e) => {
                              if (!loading) {
                                e.target.style.transform = 'translateY(-1px)';
                                e.target.style.boxShadow = '0 4px 12px rgba(239,68,68,0.4)';
                              }
                            }}
                            onMouseOut={(e) => {
                              e.target.style.transform = 'translateY(0)';
                              e.target.style.boxShadow = '0 2px 8px rgba(239,68,68,0.3)';
                            }}
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Refresh Button */}
        <div style={{ textAlign: 'center' }}>
          <button 
            onClick={loadData}
            disabled={loading}
            style={{
              background: 'linear-gradient(45deg, #8b5cf6, #7c3aed)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              padding: '12px 24px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontWeight: '600',
              fontSize: '1rem',
              boxShadow: '0 4px 15px rgba(139,92,246,0.3)',
              transition: 'all 0.3s ease',
              opacity: loading ? 0.6 : 1
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(139,92,246,0.4)';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(139,92,246,0.3)';
            }}
          >
            🔄 Refresh Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default OfficerPanelNew;
