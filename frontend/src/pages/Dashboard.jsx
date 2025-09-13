import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';
import { Link } from 'react-router-dom';

function Dashboard() {
	const { Voter, Candidate, GeneralElections } = useContracts();
	const [stats, setStats] = useState({
		totalVoters: 0,
		totalCandidates: 0,
		totalVotes: 0,
		electionStatus: 'Unknown'
	});
	const [loading, setLoading] = useState(true);
	const [recentCandidates, setRecentCandidates] = useState([]);

	useEffect(() => {
		loadDashboardData();
	}, []);

	const loadDashboardData = async () => {
		try {
			setLoading(true);
			
			// Load basic stats
			const [voterContract, candidateContract, electionContract] = await Promise.all([
				Voter(),
				Candidate(),
				GeneralElections()
			]);

			// Get voter count
			let voterCount = 0;
			try {
				voterCount = await voterContract.voterCount();
			} catch (e) {
				console.log('Voter count not available:', e.message);
			}

			// Get candidate count
			let candidateCount = 0;
			try {
				const allCandidates = await candidateContract.getAllCandidates();
				candidateCount = allCandidates.length;
			} catch (e) {
				console.log('Candidate count not available:', e.message);
			}

			// Get total votes
			let totalVotes = 0;
			try {
				if (electionContract.getTotalVotes) {
					totalVotes = await electionContract.getTotalVotes();
				}
			} catch (e) {
				console.log('Total votes not available');
			}

			// Get recent candidates
			let candidates = [];
			try {
				if (candidateContract.getAllCandidates) {
					candidates = await candidateContract.getAllCandidates();
					candidates = candidates.slice(-5); // Get last 5
				}
			} catch (e) {
				console.log('Candidates list not available');
			}

			setStats({
				totalVoters: Number(voterCount),
				totalCandidates: Number(candidateCount),
				totalVotes: Number(totalVotes),
				electionStatus: 'Active'
			});
			setRecentCandidates(candidates);
		} catch (error) {
			console.error('Error loading dashboard data:', error);
		} finally {
			setLoading(false);
		}
	};

	const StatCard = ({ title, value, icon, color = 'brand' }) => (
		<div className="card" style={{ textAlign: 'center' }}>
			<div style={{ 
				fontSize: '2rem', 
				marginBottom: '8px',
				color: `var(--${color})`
			}}>
				{icon}
			</div>
			<div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '4px' }}>
				{value}
			</div>
			<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
				{title}
			</div>
		</div>
	);

	const QuickAction = ({ to, title, description, icon }) => (
		<Link to={to} className="card" style={{ textDecoration: 'none', display: 'block' }}>
			<div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
				<div style={{ 
					fontSize: '1.5rem',
					color: 'var(--brand)'
				}}>
					{icon}
				</div>
				<div>
					<div style={{ fontWeight: '600', marginBottom: '4px' }}>
						{title}
					</div>
					<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
						{description}
					</div>
				</div>
			</div>
		</Link>
	);

	if (loading) {
		return (
			<div className="card" style={{ textAlign: 'center', padding: '48px' }}>
				<div className="loading">
					<div className="spinner"></div>
					Loading dashboard...
				</div>
			</div>
		);
	}

	return (
		<div className="grid">
			{/* Welcome Section */}
			<div className="card">
				<h1 style={{ margin: '0 0 16px 0', fontSize: '2rem' }}>
					Welcome to Gen-Z Ballot
				</h1>
				<p style={{ 
					color: 'var(--text-muted)', 
					fontSize: '1.1rem',
					margin: '0 0 24px 0',
					lineHeight: '1.6'
				}}>
					A decentralized voting system built on Ethereum. Register as a voter or candidate, 
					cast your vote, and view real-time results in a secure, transparent environment.
				</p>
				<div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
					<Link to="/voter" className="button primary">
						Register as Voter
					</Link>
					<Link to="/candidate" className="button">
						Register as Candidate
					</Link>
					<Link to="/vote" className="button">
						Cast Vote
					</Link>
				</div>
			</div>

			{/* Statistics */}
			<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
				<StatCard 
					title="Total Voters" 
					value={stats.totalVoters} 
					icon="👥" 
					color="brand"
				/>
				<StatCard 
					title="Total Candidates" 
					value={stats.totalCandidates} 
					icon="🏛️" 
					color="success"
				/>
				<StatCard 
					title="Total Votes Cast" 
					value={stats.totalVotes} 
					icon="🗳️" 
					color="warning"
				/>
				<StatCard 
					title="Election Status" 
					value={stats.electionStatus} 
					icon="✅" 
					color="success"
				/>
			</div>

			{/* Quick Actions */}
			<div className="card">
				<h2 style={{ margin: '0 0 20px 0' }}>Quick Actions</h2>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '16px' }}>
					<QuickAction
						to="/voter"
						title="Register as Voter"
						description="Join the voting system by registering with your details"
						icon="📝"
					/>
					<QuickAction
						to="/candidate"
						title="Register as Candidate"
						description="Submit your candidacy for the election"
						icon="🎯"
					/>
					<QuickAction
						to="/vote"
						title="Cast Your Vote"
						description="Vote for your preferred candidate"
						icon="🗳️"
					/>
					<QuickAction
						to="/results"
						title="View Results"
						description="See real-time election results and statistics"
						icon="📊"
					/>
				</div>
			</div>

			{/* Recent Candidates */}
			{recentCandidates.length > 0 && (
				<div className="card">
					<h2 style={{ margin: '0 0 20px 0' }}>Recent Candidates</h2>
					<div style={{ display: 'grid', gap: '12px' }}>
						{recentCandidates.map((candidate, idx) => (
							<div key={idx} style={{
								padding: '16px',
								background: 'var(--bg-elev)',
								border: '1px solid var(--border)',
								borderRadius: '12px',
								display: 'flex',
								justifyContent: 'space-between',
								alignItems: 'center'
							}}>
								<div>
									<div style={{ fontWeight: '600' }}>
										{candidate.name || candidate[0] || 'Unknown Candidate'}
									</div>
									<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
										{candidate.party || candidate[2] || 'Independent'}
									</div>
								</div>
								<div className="badge">
									Constituency {candidate.constituency || candidate[3] || 'N/A'}
								</div>
							</div>
						))}
					</div>
				</div>
			)}

			{/* System Info */}
			<div className="card">
				<h2 style={{ margin: '0 0 16px 0' }}>System Information</h2>
				<div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
					<div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
							Network
						</div>
						<div style={{ fontWeight: '600' }}>Hardhat Local (Chain ID: 1337)</div>
					</div>
					<div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
							Blockchain
						</div>
						<div style={{ fontWeight: '600' }}>Ethereum</div>
					</div>
					<div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
							Security
						</div>
						<div style={{ fontWeight: '600' }}>Smart Contract Based</div>
					</div>
					<div>
						<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '4px' }}>
							Transparency
						</div>
						<div style={{ fontWeight: '600' }}>Fully Transparent</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
