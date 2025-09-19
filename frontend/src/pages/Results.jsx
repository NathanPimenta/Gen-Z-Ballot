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
			<div className="results-container">
				<div className="card loading-card">
					<div className="loading-content">
						<div className="spinner"></div>
						<h2>Loading election results...</h2>
						<p>Fetching the latest vote counts from the blockchain</p>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="results-container">
			<div className="page-header">
				<div className="card glass">
							<h1>📊 Election Results</h1>
							<p style={{ marginTop: '1rem' }}>Real-time election results with vote counts and percentages. Results are updated as votes are cast and verified on the blockchain.</p>
						<button style={{ marginTop: '2rem' }} 
							onClick={loadResults} 
							className="btn-secondary"
							disabled={loading}
						>
							{loading ? '🔄 Loading...' : '🔄 Refresh Results'}
						</button>
				</div>
			</div>

			{status.message && (
				<div className={`status-message ${status.type}`}>
					{status.message}
				</div>
			)}

			<div className="results-layout">
				<div className="main-results">
					{/* Summary Stats */}
					<div className="stats-grid">
						<div className="stat-card">
							<div className="stat-icon">🗳️</div>
							<div className="stat-value">{totalVotes}</div>
							<div className="stat-label">Total Votes Cast</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">👥</div>
							<div className="stat-value">{candidates.length}</div>
							<div className="stat-label">Total Candidates</div>
						</div>
						<div className="stat-card">
							<div className="stat-icon">�</div>
							<div className="stat-value">
								{results.length > 0 ? getVotePercentage(results[0].voteCount) : 0}%
							</div>
							<div className="stat-label">Leading Candidate</div>
						</div>
					</div>

					{/* Results List */}
					{results.length === 0 ? (
						<div className="card empty-state">
							<div className="empty-content">
								<div className="empty-icon">📊</div>
								<h3>No Results Available</h3>
								<p>No election results are available yet. Results will appear here once votes are cast.</p>
							</div>
						</div>
					) : (
						<div className="candidates-results">
							<div className="section-header">
								<h2>Vote Results ({results.length} Candidates)</h2>
								<p>Candidates ranked by vote count</p>
							</div>
							<div className="results-list">
								{results.map((result, idx) => (
									<div 
										key={idx} 
										className={`result-card ${idx < 3 ? 'winner' : ''}`}
									>
										<div className="result-header">
											<div className="result-rank">
												<div className="rank-badge">
													{getRankIcon(idx)}
												</div>
												<div className="candidate-info">
													<h3 className="candidate-name">{result.name}</h3>
													<p className="candidate-party">{result.party}</p>
												</div>
											</div>
											<div className="vote-stats">
												<div className="vote-count">{result.voteCount}</div>
												<div className="vote-percentage">
													{getVotePercentage(result.voteCount)}%
												</div>
											</div>
										</div>

										<div className="progress-container">
											<div className="progress-bar">
												<div 
													className={`progress-fill ${idx < 3 ? 'winner-fill' : ''}`}
													style={{ width: `${getVotePercentage(result.voteCount)}%` }}
												/>
											</div>
											<div className="progress-label">
												{result.voteCount} votes
											</div>
										</div>

										<div className="result-meta">
											<span className="meta-badge">
												🗺️ Constituency {result.constituency}
											</span>
											<span className="address-short">
												{result.address.slice(0, 8)}...{result.address.slice(-6)}
											</span>
										</div>
									</div>
								))}
							</div>
						</div>
					)}
				</div>

				<div className="sidebar-info">
					<div className="card info-card">
						<h3>🔐 About These Results</h3>
						<div className="info-list">
							<div className="info-item">
								<span className="info-icon">🔗</span>
								<div>
									<strong>Blockchain Verified</strong>
									<p>All results are recorded on the Ethereum blockchain and publicly verifiable</p>
								</div>
							</div>
							<div className="info-item">
								<span className="info-icon">⚡</span>
								<div>
									<strong>Real-time Updates</strong>
									<p>Results update automatically as new votes are cast and confirmed</p>
								</div>
							</div>
							<div className="info-item">
								<span className="info-icon">🔒</span>
								<div>
									<strong>Tamper-proof</strong>
									<p>Results cannot be altered once recorded on the blockchain</p>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Results;




