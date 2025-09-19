import { BrowserRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import './App.css';
import './index.css';
import { ThemeProvider } from './contexts/ThemeContext.jsx';
import ThemeToggle from './components/ThemeToggle.jsx';
import ConnectWallet from './components/ConnectWallet.jsx';
import DebugPanel from './components/DebugPanel.jsx';
import VoterRegistration from './pages/VoterRegistration.jsx';
import CandidateRegistration from './pages/CandidateRegistration.jsx';
import CastVote from './pages/CastVote.jsx';
import Results from './pages/Results.jsx';
import Dashboard from './pages/Dashboard.jsx';
import OfficerPanel from './pages/OfficerPanel.jsx';

function NavigationLink({ to, children, icon }) {
	const location = useLocation();
	const isActive = location.pathname === to || (to === '/voter' && location.pathname === '/');
	
	return (
		<Link to={to} className={isActive ? 'active' : ''}>
			{icon && <span className="nav-icon">{icon}</span>}
			{children}
		</Link>
	);
}

function AppContent() {
	return (
		<div className="app-container">
			<header className="header">
				<div className="brand">
					<div className="brand-icon">GZ</div>
					<div className="brand-text">
						<div>Gen‑Z Ballot</div>
						<div className="brand-subtitle">
							Decentralized Voting System
						</div>
					</div>
					<span className="badge info">Ethereum · Hardhat (1337)</span>
				</div>
				
				<nav className="nav">
					<NavigationLink to="/" icon="🏠">Dashboard</NavigationLink>
					<NavigationLink to="/voter" icon="👤">Register Voter</NavigationLink>
					<NavigationLink to="/candidate" icon="🗳️">Register Candidate</NavigationLink>
					<NavigationLink to="/vote" icon="✅">Cast Vote</NavigationLink>
					<NavigationLink to="/results" icon="📊">Results</NavigationLink>
					<NavigationLink to="/officer" icon="👮">Officer Panel</NavigationLink>
				</nav>
				
				<div className="header-actions">
					<ThemeToggle />
					<ConnectWallet />
				</div>
			</header>
			
			<main className="main-content fade-in">
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
	);
}

function App() {
	return (
		<ThemeProvider>
			<BrowserRouter>
				<AppContent />
			</BrowserRouter>
		</ThemeProvider>
	);
}

export default App;
