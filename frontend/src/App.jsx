import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import './index.css';
import ConnectWallet from './components/ConnectWallet.jsx';
import VoterRegistration from './pages/VoterRegistration.jsx';
import CandidateRegistration from './pages/CandidateRegistration.jsx';
import CastVote from './pages/CastVote.jsx';
import Results from './pages/Results.jsx';

function App() {
	return (
		<BrowserRouter>
			<div className="container grid">
				<header className="header">
					<div className="brand">
						<span style={{
							display: 'inline-block', width: 10, height: 10, borderRadius: 999,
							background: 'linear-gradient(135deg, #6366f1, #22d3ee)'
						}} />
						<span>Gen‑Z Ballot</span>
						<span className="badge">Ethereum · Hardhat (1337)</span>
					</div>
					<nav className="nav">
						<Link to="/voter">Voter</Link>
						<Link to="/candidate">Candidate</Link>
						<Link to="/vote">Cast Vote</Link>
						<Link to="/results">Results</Link>
					</nav>
					<ConnectWallet />
				</header>
				<main className="grid">
					<Routes>
						<Route path="/" element={<VoterRegistration />} />
						<Route path="/voter" element={<VoterRegistration />} />
						<Route path="/candidate" element={<CandidateRegistration />} />
						<Route path="/vote" element={<CastVote />} />
						<Route path="/results" element={<Results />} />
					</Routes>
				</main>
			</div>
		</BrowserRouter>
	);
}

export default App;
