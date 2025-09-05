import addresses from './addresses.json';
import ElectionOfficerAbi from './ElectionOfficer.abi.json';
import VoterAbi from './Voter.abi.json';
import CandidateAbi from './Candidate.abi.json';
import GeneralElectionsAbi from './GeneralElections.abi.json';

export const CONTRACTS = {
	ElectionOfficer: { address: addresses.ElectionOfficer, abi: ElectionOfficerAbi },
	Voter: { address: addresses.Voter, abi: VoterAbi },
	Candidate: { address: addresses.Candidate, abi: CandidateAbi },
	GeneralElections: { address: addresses.GeneralElections, abi: GeneralElectionsAbi },
};




