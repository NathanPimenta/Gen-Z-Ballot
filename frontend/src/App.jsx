import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import ConnectWallet from './components/ConnectWallet.jsx';
import DebugPanel from './components/DebugPanel.jsx';
import VoterRegistration from './pages/VoterRegistration.jsx';
import CandidateRegistration from './pages/CandidateRegistration.jsx';
import CastVote from './pages/CastVote.jsx';
import Results from './pages/Results.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OfficerPanel from './pages/OfficerPanelNew.jsx';

function NavigationLink({ to, children }) {
	const location = useLocation();
	const isActive = location.pathname === to || (to === '/voter' && location.pathname === '/');
	
	return (
		<Link to={to} className={isActive ? 'active' : ''}>
			{children}
		</Link>
	);
}

function App() {
	return (
		<BrowserRouter>
			<div className="container">
				<header className="header">
					<div className="brand">
						<div className="brand-icon">GZ</div>
						<div>
							<div>Gen‑Z Ballot</div>
							<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
								Decentralized Voting System
							</div>
						</div>
						<span className="badge">Ethereum · Hardhat (1337)</span>
					</div>
					<nav className="nav">
						<NavigationLink to="/">Dashboard</NavigationLink>
						<NavigationLink to="/voter">Register Voter</NavigationLink>
						<NavigationLink to="/candidate">Register Candidate</NavigationLink>
						<NavigationLink to="/vote">Cast Vote</NavigationLink>
						<NavigationLink to="/results">Results</NavigationLink>
						<NavigationLink to="/officer">Officer Panel</NavigationLink>
					</nav>
					<ConnectWallet />
				</header>
				<main>
					<Routes>
						<Route path="/" element={<Dashboard />} />
						<Route path="/voter" element={<VoterRegistration />} />
						<Route path="/candidate" element={<CandidateRegistration />} />
						<Route path="/vote" element={<CastVote />} />
						<Route path="/results" element={<Results />} />
						<Route path="/officer" element={<OfficerPanel />} />
					</Routes>
				</main>
				<DebugPanel />
			</div>
		</BrowserRouter>
	);
}

export default App;
