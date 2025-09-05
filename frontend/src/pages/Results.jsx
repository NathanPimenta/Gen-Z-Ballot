import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';

function Results() {
	const { GeneralElections } = useContracts();
	const [results, setResults] = useState([]);
	const [status, setStatus] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const ge = await GeneralElections();
				if (ge.getElectionResults) {
					const r = await ge.getElectionResults();
					setResults(r);
				} else {
					setStatus('Results function not available in ABI');
				}
			} catch (e) {
				setStatus(e?.shortMessage || e?.message || 'Failed to load results');
			}
		})();
	}, []);

	return (
		<div className="card">
			<h2 style={{ marginTop: 0 }}>Results</h2>
			{status && <span className="badge">{status}</span>}
			<div className="grid" style={{ marginTop: 10 }}>
				{results.map((res, idx) => (
					<div key={idx} className="card" style={{ padding: 12 }}>
						<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
							<div>
								<div style={{ fontWeight: 700 }}>{(res.candidateAddress || res[0])}</div>
								<div className="label">Constituency: {res.constituency || res[2]}</div>
							</div>
							<span className="badge">Votes: {Number(res.voteCount || res[1] || 0)}</span>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export default Results;




