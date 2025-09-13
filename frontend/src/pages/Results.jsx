import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';

function Results() {
	const { GeneralElections, Candidate } = useContracts();
	const [results, setResults] = useState([]);
	const [candidates, setCandidates] = useState([]);
	const [status, setStatus] = useState({ type: '', message: '' });
	const [loading, setLoading] = useState(true);
	const [totalVotes, setTotalVotes] = useState(0);

	useEffect(() => {
		loadResults();
		
		// Auto-refresh every 10 seconds
		const interval = setInterval(() => {
			loadResults();
		}, 10000);
		
		return () => clearInterval(interval);
	}, []);

	const loadResults = async () => {
		try {
			setLoading(true);
			const [ge, candidate] = await Promise.all([
				GeneralElections(),
				Candidate()
			]);

			let resultsData = [];
			let candidatesData = [];
			let total = 0;

			// Get all candidates first
			try {
				if (candidate.getAllCandidates) {
					const candidateAddresses = await candidate.getAllCandidates();
					
					// Get detailed candidate information
					for (const address of candidateAddresses) {
						try {
							const candidateId = await candidate.getCandidateIdByAddress(address);
							const details = await candidate.getCandidateDetails(candidateId);
							
							candidatesData.push({
								address: address,
								candidateId: candidateId,
								name: details[0],
								party: details[1],
								age: details[2].toString(),
								constituency: details[3].toString(),
								isVerified: details[5]
							});
						} catch (e) {
							console.log('Error loading candidate details for', address, e.message);
							continue;
						}
					}
				}
			} catch (e) {
				console.log('Candidates list not available');
			}

			// Get vote counts for each candidate
			const candidateResults = [];
			for (const candidateInfo of candidatesData) {
				try {
					console.log('Getting vote count for candidate ID:', candidateInfo.candidateId.toString());
					const voteCount = await ge.getVoteCount(candidateInfo.candidateId);
					console.log('Vote count for', candidateInfo.name, ':', voteCount.toString());
					
					candidateResults.push({
						...candidateInfo,
						voteCount: Number(voteCount)
					});
					total += Number(voteCount);
				} catch (e) {
					console.log('Error getting vote count for candidate', candidateInfo.candidateId, e.message);
					candidateResults.push({
						...candidateInfo,
						voteCount: 0
					});
				}
			}

			// Sort by vote count (descending)
			candidateResults.sort((a, b) => b.voteCount - a.voteCount);

			setResults(candidateResults);
			setCandidates(candidatesData);
			setTotalVotes(total);
			setStatus({ type: 'success', message: 'Results loaded successfully' });
		} catch (e) {
			console.error('Error loading results:', e);
			setStatus({ 
				type: 'error', 
				message: e?.shortMessage || e?.message || 'Failed to load results' 
			});
		} finally {
			setLoading(false);
		}
	};

	const getVotePercentage = (votes) => {
		if (totalVotes === 0) return 0;
		return ((votes / totalVotes) * 100).toFixed(1);
	};

	const getRankIcon = (index) => {
		switch (index) {
			case 0: return '🥇';
			case 1: return '🥈';
			case 2: return '🥉';
			default: return `#${index + 1}`;
		}
	};

	if (loading) {
		return (
			<div className="card" style={{ textAlign: 'center', padding: '48px' }}>
				<div className="loading">
					<div className="spinner"></div>
					Loading election results...
				</div>
			</div>
		);
	}

	return (
		<div className="grid">
			<div className="card">
				<div style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
					<div>
						<h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Election Results</h1>
						<p style={{ color: 'var(--text-muted)', margin: 0 }}>
							Real-time election results with vote counts and percentages. 
							Results are updated as votes are cast and verified on the blockchain.
						</p>
					</div>
					<button 
						onClick={loadResults} 
						className="btn primary"
						disabled={loading}
						style={{ marginLeft: '16px' }}
					>
						{loading ? '🔄 Loading...' : '🔄 Refresh Results'}
					</button>
				</div>

				{status.message && (
					<div className={`status-message ${status.type}`} style={{ marginBottom: '24px' }}>
						{status.message}
					</div>
				)}

				{/* Summary Stats */}
				<div style={{ 
					display: 'grid', 
					gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
					gap: '16px',
					marginBottom: '32px'
				}}>
					<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
						<div style={{ fontSize: '2rem', marginBottom: '8px' }}>🗳️</div>
						<div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
							{totalVotes}
						</div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
							Total Votes Cast
						</div>
					</div>
					<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
						<div style={{ fontSize: '2rem', marginBottom: '8px' }}>👥</div>
						<div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
							{candidates.length}
						</div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
							Total Candidates
						</div>
					</div>
					<div className="card" style={{ textAlign: 'center', padding: '20px' }}>
						<div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
						<div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
							{results.length > 0 ? getVotePercentage(results[0].voteCount) : 0}%
						</div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
							Leading Candidate
						</div>
					</div>
				</div>

				{/* Results List */}
				{results.length === 0 ? (
					<div style={{ 
						textAlign: 'center', 
						padding: '48px 24px',
						color: 'var(--text-muted)'
					}}>
						<div style={{ fontSize: '3rem', marginBottom: '16px' }}>📊</div>
						<h3 style={{ margin: '0 0 8px 0' }}>No Results Available</h3>
						<p style={{ margin: 0 }}>
							No election results are available yet. Results will appear here once votes are cast.
						</p>
					</div>
				) : (
					<div style={{ display: 'grid', gap: '16px' }}>
						{results.map((result, idx) => (
							<div 
								key={idx} 
								className="card" 
								style={{ 
									padding: '20px',
									background: idx < 3 ? 'rgba(59, 130, 246, 0.05)' : 'var(--bg-card)',
									border: idx < 3 ? '1px solid var(--brand)' : '1px solid var(--border)'
								}}
							>
								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
									<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
										<div style={{ 
											fontSize: '1.5rem',
											minWidth: '40px',
											textAlign: 'center'
										}}>
											{getRankIcon(idx)}
										</div>
										<div>
											<h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem' }}>
												{result.name}
											</h3>
											<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
												{result.party}
											</div>
										</div>
									</div>
									<div style={{ textAlign: 'right' }}>
										<div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '4px' }}>
											{result.voteCount}
										</div>
										<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
											votes ({getVotePercentage(result.voteCount)}%)
										</div>
									</div>
								</div>

								{/* Progress Bar */}
								<div style={{ 
									width: '100%', 
									height: '8px', 
									background: 'var(--bg-elev)', 
									borderRadius: '4px',
									overflow: 'hidden',
									marginBottom: '12px'
								}}>
									<div style={{
										width: `${getVotePercentage(result.voteCount)}%`,
										height: '100%',
										background: idx < 3 ? 'var(--gradient-brand)' : 'var(--brand)',
										transition: 'width 0.3s ease'
									}} />
								</div>

								<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
									<div className="badge">
										Constituency {result.constituency}
									</div>
									<div style={{ 
										fontSize: '0.8rem', 
										color: 'var(--text-dim)',
										fontFamily: 'monospace'
									}}>
										{(result.candidateAddress || result[0] || '').slice(0, 6)}...{(result.candidateAddress || result[0] || '').slice(-4)}
									</div>
								</div>
							</div>
						))}
					</div>
				)}
			</div>

			{/* Election Information */}
			<div className="card">
				<h3 style={{ margin: '0 0 16px 0' }}>About These Results</h3>
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
							🔗
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Blockchain Verified</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								All results are recorded on the Ethereum blockchain and publicly verifiable
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
							<div style={{ fontWeight: '600' }}>Real-time Updates</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Results update automatically as new votes are cast and confirmed
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
							🔒
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Tamper-proof</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Results cannot be altered once recorded on the blockchain
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Results;




