import { useState } from 'react';
import { useContracts } from '../web3/useContracts';

function VoterRegistration() {
	const { Voter } = useContracts();
	const [name, setName] = useState('');
	const [aadhar, setAadhar] = useState('');
	const [constituency, setConstituency] = useState('');
	const [status, setStatus] = useState('');

	const register = async () => {
		try {
			setStatus('Submitting...');
			const voter = await Voter();
			// aadhar is bytes12 in contract; accept 24 hex chars or plain string -> to hex
			let aadharBytes;
			if (/^0x[0-9a-fA-F]{24}$/.test(aadhar)) {
				aadharBytes = aadhar;
			} else {
				const enc = new TextEncoder();
				const bytes = enc.encode(aadhar);
				aadharBytes = '0x' + Array.from(bytes).slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
			}
			const tx = await voter.registerAsVoter(aadharBytes, name, constituency);
			await tx.wait();
			setStatus('Registered successfully.');
		} catch (e) {
			setStatus(e?.shortMessage || e?.message || 'Failed');
		}
	};

	return (
		<div className="card">
			<h2 style={{ marginTop: 0 }}>Voter Registration</h2>
			<div className="form">
				<label className="label">Name</label>
				<input placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
				<label className="label">Aadhar (12 bytes)</label>
				<input placeholder="e.g. 0x313233343536373839303132 or text" value={aadhar} onChange={(e) => setAadhar(e.target.value)} />
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

export default VoterRegistration;




