import { useEffect, useState } from 'react';
import { useContracts } from '../web3/useContracts';

function CastVote() {
	const { Candidate, GeneralElections } = useContracts();
	const [candidates, setCandidates] = useState([]);
	const [selected, setSelected] = useState('');
	const [status, setStatus] = useState('');

	useEffect(() => {
		(async () => {
			try {
				const candidate = await Candidate();
				if (candidate.getAllCandidates) {
					const list = await candidate.getAllCandidates();
					setCandidates(list);
				}
			} catch (e) {
				// ignore if ABI doesn't expose listing
			}
		})();
	}, []);

	const vote = async () => {
		try {
			if (!selected) return;
			setStatus('Submitting vote...');
			const ge = await GeneralElections();
			const tx = await ge.castVote(selected);
			await tx.wait();
			setStatus('Vote cast!');
		} catch (e) {
			setStatus(e?.shortMessage || e?.message || 'Failed');
		}
	};

	return (
		<div className="card">
			<h2 style={{ marginTop: 0 }}>Cast Vote</h2>
			<div className="form">
				<select value={selected} onChange={(e) => setSelected(e.target.value)}>
					<option value="">Select Candidate</option>
					{candidates.map((c, idx) => (
						<option key={idx} value={c.candidateAddress || c.addr || c}>
							{c.name || c[0] || 'Unknown'} {c.party || c[2] ? `— ${c.party || c[2]}` : ''}
						</option>
					))}
				</select>
				<div style={{ display: 'flex', gap: 10 }}>
					<button onClick={vote}>Vote</button>
					{status && <span className="badge">{status}</span>}
				</div>
			</div>
		</div>
	);
}

export default CastVote;




