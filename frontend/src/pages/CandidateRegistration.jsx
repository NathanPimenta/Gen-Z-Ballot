import { useState } from 'react';
import { useContracts } from '../web3/useContracts';

function CandidateRegistration() {
	const { Candidate } = useContracts();
	const [name, setName] = useState('');
	const [party, setParty] = useState('');
	const [constituency, setConstituency] = useState('');
	const [status, setStatus] = useState('');

	const register = async () => {
		try {
			setStatus('Submitting...');
			const candidate = await Candidate();
			const tx = await candidate.candidateRegistration(name, constituency, party);
			await tx.wait();
			setStatus('Registered successfully.');
		} catch (e) {
			setStatus(e?.shortMessage || e?.message || 'Failed');
		}
	};

	return (
		<div className="card">
			<h2 style={{ marginTop: 0 }}>Candidate Registration</h2>
			<div className="form">
				<label className="label">Name</label>
				<input placeholder="Candidate name" value={name} onChange={(e) => setName(e.target.value)} />
				<label className="label">Party</label>
				<input placeholder="Party name" value={party} onChange={(e) => setParty(e.target.value)} />
				<label className="label">Constituency</label>
				<input placeholder="e.g. Constituency A" value={constituency} onChange={(e) => setConstituency(e.target.value)} />
				<div style={{ display: 'flex', gap: 10 }}>
					<button onClick={register}>Register</button>
					{status && <span className="badge">{status}</span>}
				</div>
			</div>
		</div>
	);
}

export default CandidateRegistration;




