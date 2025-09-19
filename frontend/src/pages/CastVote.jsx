import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';
import { ethers } from 'ethers';

function CastVote() {
	const { Voter, Candidate, GeneralElections } = useContracts();
	const [candidates, setCandidates] = useState([]);
	const [selected, setSelected] = useState('');
	const [status, setStatus] = useState({ type: '', message: '' });
	const [loading, setLoading] = useState(false);
	const [loadingCandidates, setLoadingCandidates] = useState(true);

	useEffect(() => {
		loadCandidates();
	}, []);

	const loadCandidates = async () => {
		try {
			setLoadingCandidates(true);
			console.log('🗳️ Loading candidates for voting...');
			
			const candidateContract = await Candidate();
			const voterContract = await Voter();
			
			// Get current user's address
			const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
			if (!provider) {
				throw new Error('No provider found');
			}
			const signer = await provider.getSigner();
			const voterAddress = await signer.getAddress();
			
			console.log('👤 Voter address:', voterAddress);
			
			// Get voter details to find constituency
			let voterConstituency = null;
			try {
				const voterDetails = await voterContract.getVoterByAddress(voterAddress);
				voterConstituency = voterDetails.constituencyId.toString();
				console.log('📍 Voter constituency:', voterConstituency);
				console.log('✅ Voter details:', {
					name: voterDetails.name,
					age: voterDetails.age,
					constituency: voterDetails.constituencyId.toString(),
					isAllowedToVote: voterDetails.isAllowedToVote,
					hasVoted: voterDetails.hasVoted
				});
				
				// Check if voter has already voted
				if (voterDetails.hasVoted) {
					setStatus({ type: 'warning', message: 'You have already voted in this election' });
					return;
				}
				
				// Check if voter is verified
				if (!voterDetails.isAllowedToVote) {
					setStatus({ type: 'error', message: 'You must be verified by an election officer before you can vote' });
					return;
				}
			} catch (e) {
				console.log('❌ Voter not found or not registered:', e.message);
				setStatus({ type: 'error', message: 'You must be registered as a voter to cast a vote' });
				return;
			}
			
			// Get all candidates
			const candidateAddresses = await candidateContract.getAllCandidates();
			console.log('🏛️ All candidate addresses:', candidateAddresses);
			
			const candidateDetails = [];
			
			for (const address of candidateAddresses) {
				try {
					const candidateId = await candidateContract.getCandidateIdByAddress(address);
					const details = await candidateContract.getCandidateDetails(candidateId);
					
					console.log('👤 Candidate details:', {
						address,
						name: details[0],
						party: details[1],
						age: details[2],
						constituency: details[3].toString(),
						canContest: details[4],
						isVerified: details[5]
					});
					
					// Only show candidates from the voter's constituency
					if (details[3].toString() === voterConstituency) {
						candidateDetails.push({
							address: address,
							name: details[0],
							party: details[1],
							constituency: details[3].toString(),
							age: details[2].toString(),
							isVerified: details[5]
						});
						console.log('✅ Added candidate to list:', details[0]);
					} else {
						console.log('❌ Candidate not from voter constituency:', details[0], 'constituency:', details[3].toString());
					}
				} catch (e) {
					console.log('❌ Error loading candidate details for', address, e.message);
					continue;
				}
			}
			
			console.log('📋 Final candidates list:', candidateDetails);
			setCandidates(candidateDetails);
			
			if (candidateDetails.length === 0) {
				setStatus({ type: 'info', message: 'No candidates available in your constituency' });
			} else {
				console.log(`✅ Found ${candidateDetails.length} candidates for voting`);
				setStatus({ type: 'success', message: `Found ${candidateDetails.length} candidates available for voting` });
			}
		} catch (e) {
			console.error('Error loading candidates:', e);
			setStatus({ type: 'error', message: 'Failed to load candidates' });
		} finally {
			setLoadingCandidates(false);
		}
	};

	const vote = async () => {
		if (!selected) {
			setStatus({ type: 'error', message: 'Please select a candidate' });
			return;
		}

		try {
			setLoading(true);
			setStatus({ type: 'loading', message: 'Submitting your vote...' });
			
			const ge = await GeneralElections();
			const candidate = await Candidate();
			
			// Get voter ID from the connected account
			const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
			if (!provider) {
				throw new Error('No provider found');
			}
			const signer = await provider.getSigner();
			const voterAddress = await signer.getAddress();
			
			// Get voter details to find voter ID
			const voterContract = await Voter();
			
			// Get voter details
			const voterDetails = await voterContract.getVoterByAddress(voterAddress);
			const voterId = voterDetails.id;
			
			// Check if voter is verified
			if (!voterDetails.isAllowedToVote) {
				throw new Error('You must be verified by an election officer before you can vote');
			}
			
			// Get candidate ID from address
			const candidateId = await candidate.getCandidateIdByAddress(selected);
			
			// Call registerVote with voter ID and candidate ID
			const tx = await ge.registerVote(voterId, candidateId);
			
			setStatus({ type: 'loading', message: 'Waiting for confirmation...' });
			await tx.wait();
			
			setStatus({ type: 'success', message: 'Vote cast successfully! Thank you for participating in the election.' });
			setSelected('');
			
			// Refresh candidates list to show updated vote counts
			loadCandidates();
		} catch (e) {
			console.error('Voting error:', e);
			setStatus({ 
				type: 'error', 
				message: e?.shortMessage || e?.message || 'Failed to cast vote. Please try again.' 
			});
		} finally {
			setLoading(false);
		}
	};

	const CandidateCard = ({ candidate, isSelected, onSelect }) => {
		const name = candidate.name || 'Unknown Candidate';
		const party = candidate.party || 'Independent';
		const constituency = candidate.constituency || 'N/A';
		const address = candidate.address;

		return (
			<div 
				className={`candidate-card ${isSelected ? 'selected' : ''}`}
				onClick={() => onSelect(address)}
			>
				<div className="candidate-header">
					<div className="candidate-info">
						<div className="candidate-avatar">
							{name.charAt(0).toUpperCase()}
						</div>
						<div>
							<h3 className="candidate-name">{name}</h3>
							<p className="candidate-party">{party}</p>
						</div>
					</div>
					{isSelected && (
						<div className="selection-indicator">
							✓
						</div>
					)}
				</div>

				<div className="candidate-details">
					<div className="candidate-meta">
						<span className="meta-item">
							<span className="meta-icon">🗺️</span>
							Constituency {constituency}
						</span>
						{candidate.isVerified && (
							<span className="meta-item verified">
								<span className="meta-icon">✅</span>
								Verified
							</span>
						)}
					</div>
					<div className="candidate-address">
						{address.slice(0, 8)}...{address.slice(-6)}
					</div>
				</div>
			</div>
		);
	};

	if (loadingCandidates) {
		return (
			<div className="cast-vote-container">
				<div className="card loading-card">
					<div className="loading-content">
						<div className="spinner"></div>
						<h2>Loading candidates...</h2>
						<p>Please wait while we fetch the candidate list</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="cast-vote-container">
			<div className="page-header">
				<div className="card glass">
						
							<h1>🗳️ Cast Your Vote</h1>
							<p style={{ marginTop: '1rem' }}>Select your preferred candidate from the list below. You can only vote once, so choose carefully. Your vote is secure and anonymous.</p>
						
						<button style={{ marginTop: '2rem' }}
							onClick={() => {
								console.log('🔄 Refreshing candidates...');
								loadCandidates();
							}}
							className="btn-secondary"
						>
							🔄 Refresh
						</button>
				</div>
			</div>

			<div className="voting-layout">
				<div className="main-voting-section">
					{candidates.length === 0 ? (
						<div className="card empty-state">
							<div className="empty-content">
								<div className="empty-icon">🗳️</div>
								<h3>No Candidates Available</h3>
								<p>There are no registered candidates in your constituency yet. Check back later or register as a candidate yourself.</p>
								<button 
									onClick={() => window.location.href = '/candidate'}
									className="btn-primary"
								>
									Register as Candidate
								</button>
							</div>
						</div>
					) : (
						<>
							<div className="candidates-section">
								<div className="section-header">
									<h2>Available Candidates ({candidates.length})</h2>
									<p>Choose your preferred candidate by clicking on their card</p>
								</div>
								<div className="candidates-grid">
									{candidates.map((candidate, idx) => (
										<CandidateCard
											key={idx}
											candidate={candidate}
											isSelected={selected === candidate.address}
											onSelect={setSelected}
										/>
									))}
								</div>
							</div>

							{status.message && (
								<div className={`status-message ${status.type}`}>
									{status.type === 'loading' && <div className="spinner"></div>}
									{status.message}
								</div>
							)}

							<div className="voting-actions">
								<div className="action-section">
									<button 
										onClick={vote} 
										disabled={loading || !selected}
										className="btn-primary vote-button"
									>
										{loading ? (
											<>
												<div className="spinner"></div>
												Casting Vote...
											</>
										) : (
											<>
												🗳️ Cast Vote
											</>
										)}
									</button>
									
									{selected && !loading && (
										<div className="selected-info">
											<span className="selected-label">Selected:</span>
											<span className="selected-name">
												{candidates.find(c => c.address === selected)?.name || 'Unknown'}
											</span>
										</div>
									)}
								</div>
							</div>
						</>
					)}
				</div>

				<div className="sidebar-info">
					<div className="card info-card">
						<h3>🔐 Voting Information</h3>
						<div className="info-list">
							<div className="info-item">
								<span className="info-icon">🔒</span>
								<div>
									<strong>Secure & Anonymous</strong>
									<p>Your vote is encrypted and cannot be traced back to you</p>
								</div>
							</div>
							<div className="info-item">
								<span className="info-icon">⚡</span>
								<div>
									<strong>One Vote Per Person</strong>
									<p>Each registered voter can only cast one vote</p>
								</div>
							</div>
							<div className="info-item">
								<span className="info-icon">📊</span>
								<div>
									<strong>Transparent Results</strong>
									<p>All votes are recorded on the blockchain and publicly verifiable</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CastVote;




