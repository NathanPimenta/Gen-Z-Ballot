import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';

function CastVote() {
	const { Candidate, GeneralElections } = useContracts();
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
			const candidate = await Candidate();
			if (candidate.getAllCandidates) {
				const list = await candidate.getAllCandidates();
				setCandidates(list);
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
			const tx = await ge.castVote(selected);
			
			setStatus({ type: 'loading', message: 'Waiting for confirmation...' });
			await tx.wait();
			
			setStatus({ type: 'success', message: 'Vote cast successfully! Thank you for participating in the election.' });
			setSelected('');
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
		const name = candidate.name || candidate[0] || 'Unknown Candidate';
		const party = candidate.party || candidate[2] || 'Independent';
		const constituency = candidate.constituency || candidate[3] || 'N/A';
		const address = candidate.candidateAddress || candidate.addr || candidate;

		return (
			<div 
				className="card" 
				style={{
					cursor: 'pointer',
					border: isSelected ? '2px solid var(--brand)' : '1px solid var(--border)',
					background: isSelected ? 'rgba(59, 130, 246, 0.1)' : 'var(--bg-card)',
					transform: isSelected ? 'translateY(-2px)' : 'none',
					transition: 'all 0.2s ease'
				}}
				onClick={() => onSelect(address)}
			>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
					<div>
						<h3 style={{ margin: '0 0 8px 0', fontSize: '1.2rem' }}>{name}</h3>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
							{party}
						</div>
					</div>
					{isSelected && (
						<div style={{ 
							width: '24px', 
							height: '24px', 
							borderRadius: '50%', 
							background: 'var(--brand)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.8rem',
							fontWeight: 'bold'
						}}>
							✓
						</div>
					)}
				</div>
				<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
					<div className="badge">
						Constituency {constituency}
					</div>
					<div style={{ 
						fontSize: '0.8rem', 
						color: 'var(--text-dim)',
						fontFamily: 'monospace'
					}}>
						{address.slice(0, 6)}...{address.slice(-4)}
					</div>
				</div>
			</div>
		);
	};

	if (loadingCandidates) {
		return (
			<div className="card" style={{ textAlign: 'center', padding: '48px' }}>
				<div className="loading">
					<div className="spinner"></div>
					Loading candidates...
				</div>
			</div>
		);
	}

	return (
		<div className="grid">
			<div className="card">
				<div style={{ marginBottom: '24px' }}>
					<h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Cast Your Vote</h1>
					<p style={{ color: 'var(--text-muted)', margin: 0 }}>
						Select your preferred candidate from the list below. You can only vote once, 
						so choose carefully. Your vote is secure and anonymous.
					</p>
				</div>

				{candidates.length === 0 ? (
					<div style={{ 
						textAlign: 'center', 
						padding: '48px 24px',
						color: 'var(--text-muted)'
					}}>
						<div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗳️</div>
						<h3 style={{ margin: '0 0 8px 0' }}>No Candidates Available</h3>
						<p style={{ margin: 0 }}>
							There are no registered candidates yet. Check back later or 
							<button 
								onClick={() => window.location.href = '/candidate'}
								style={{ 
									background: 'none', 
									border: 'none', 
									color: 'var(--brand)', 
									textDecoration: 'underline',
									cursor: 'pointer',
									fontSize: 'inherit'
								}}
							>
								register as a candidate
							</button>.
						</p>
					</div>
				) : (
					<>
						<div style={{ marginBottom: '24px' }}>
							<h3 style={{ margin: '0 0 16px 0' }}>Available Candidates</h3>
							<div style={{ 
								display: 'grid', 
								gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
								gap: '16px' 
							}}>
								{candidates.map((candidate, idx) => (
									<CandidateCard
										key={idx}
										candidate={candidate}
										isSelected={selected === (candidate.candidateAddress || candidate.addr || candidate)}
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

						<div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
							<button 
								onClick={vote} 
								disabled={loading || !selected}
								className="primary"
								style={{ minWidth: '140px' }}
							>
								{loading ? (
									<div className="loading">
										<div className="spinner"></div>
										Casting Vote...
									</div>
								) : (
									'Cast Vote'
								)}
							</button>
							
							{selected && !loading && (
								<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
									Selected: {candidates.find(c => 
										(c.candidateAddress || c.addr || c) === selected
									)?.name || 'Unknown'}
								</div>
							)}
						</div>
					</>
				)}
			</div>

			{/* Voting Information */}
			<div className="card">
				<h3 style={{ margin: '0 0 16px 0' }}>Voting Information</h3>
				<div style={{ display: 'grid', gap: '12px' }}>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--brand)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							🔒
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Secure & Anonymous</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Your vote is encrypted and cannot be traced back to you
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--brand)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							⚡
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>One Vote Per Person</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Each registered voter can only cast one vote
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--brand)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							📊
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Transparent Results</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								All votes are recorded on the blockchain and publicly verifiable
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default CastVote;




