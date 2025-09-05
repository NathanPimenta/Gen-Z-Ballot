import { useMemo } from 'react';
import { ethers } from 'ethers';
import { CONTRACTS } from '../contracts';

export function getProvider() {
	if (window.ethereum) {
		return new ethers.BrowserProvider(window.ethereum);
	}
	throw new Error('No injected provider found');
}

export function useContracts() {
	return useMemo(() => {
		const provider = getProvider();
		const signerPromise = provider.getSigner();
		return {
			provider,
			getSigner: () => signerPromise,
			ElectionOfficer: async () => new ethers.Contract(CONTRACTS.ElectionOfficer.address, CONTRACTS.ElectionOfficer.abi, await signerPromise),
			Voter: async () => new ethers.Contract(CONTRACTS.Voter.address, CONTRACTS.Voter.abi, await signerPromise),
			Candidate: async () => new ethers.Contract(CONTRACTS.Candidate.address, CONTRACTS.Candidate.abi, await signerPromise),
			GeneralElections: async () => new ethers.Contract(CONTRACTS.GeneralElections.address, CONTRACTS.GeneralElections.abi, await signerPromise),
		};
	}, []);
}




