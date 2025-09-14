import { useState } from 'react';
import { ethers } from 'ethers';
import { useContracts } from '../web3/useContracts';

function CandidateRegistration() {
	const { Candidate } = useContracts();
	const [formData, setFormData] = useState({
		name: '',
		party: '',
		age: '',
		constituency: '',
		deposit: '1'
	});
	const [status, setStatus] = useState({ type: '', message: '' });
	const [loading, setLoading] = useState(false);
	const [errors, setErrors] = useState({});

	const handleInputChange = (field, value) => {
		setFormData(prev => ({ ...prev, [field]: value }));
		// Clear error when user starts typing
		if (errors[field]) {
			setErrors(prev => ({ ...prev, [field]: '' }));
		}
	};

	const validateForm = () => {
		const newErrors = {};
		
		if (!formData.name.trim()) {
			newErrors.name = 'Candidate name is required';
		}
		
		if (!formData.party.trim()) {
			newErrors.party = 'Party name is required';
		}
		
		if (!formData.age || parseInt(formData.age) < 25) {
			newErrors.age = 'Age must be 25 or older to run for office';
		}
		
		if (!formData.constituency || parseInt(formData.constituency) < 1) {
			newErrors.constituency = 'Valid constituency ID is required';
		}
		
		if (!formData.deposit || parseFloat(formData.deposit) < 0.1) {
			newErrors.deposit = 'Security deposit must be at least 0.1 ETH';
		}

		setErrors(newErrors);
		return Object.keys(newErrors).length === 0;
	};

	const register = async () => {
		if (!validateForm()) {
			setStatus({ type: 'error', message: 'Please fix the errors below' });
			return;
		}

		try {
			setLoading(true);
			setStatus({ type: 'loading', message: 'Submitting candidacy...' });
			
			// Get current user's address
			const provider = window.ethereum ? new ethers.BrowserProvider(window.ethereum) : null;
			if (!provider) {
				throw new Error('No provider found');
			}
			const signer = await provider.getSigner();
			const candidateAddress = await signer.getAddress();
			
			const candidate = await Candidate();
			
			// Prepare transaction parameters
			const name = formData.name.trim();
			const party = formData.party.trim();
			const securityDepositInEthers = parseFloat(formData.deposit);
			const age = parseInt(formData.age);
			const constituencyId = parseInt(formData.constituency);
			const value = ethers.parseEther(formData.deposit);
			
			console.log('📝 Candidate registration parameters:', {
				candidateAddress,
				name,
				party,
				securityDepositInEthers,
				age,
				constituencyId,
				value: ethers.formatEther(value) + ' ETH'
			});
			
			// Estimate gas first
			let gasEstimate;
			try {
				gasEstimate = await candidate.candidateRegistration.estimateGas(
					candidateAddress,
					name,
					party,
					securityDepositInEthers,
					age,
					constituencyId,
					{ value: value }
				);
				console.log('⛽ Gas estimate:', gasEstimate.toString());
			} catch (e) {
				console.log('❌ Gas estimation failed:', e.message);
				throw new Error(`Gas estimation failed: ${e.message}`);
			}
			
			// Execute transaction with explicit gas limit
			const tx = await candidate.candidateRegistration(
				candidateAddress,
				name,
				party,
				securityDepositInEthers,
				age,
				constituencyId,
				{ 
					value: value,
					gasLimit: gasEstimate * 120n / 100n // Add 20% buffer
				}
			);
			
			setStatus({ type: 'loading', message: 'Waiting for confirmation...' });
			await tx.wait();
			
			setStatus({ type: 'success', message: 'Candidacy submitted successfully! Your registration is pending officer verification.' });
			
			// Reset form
			setFormData({
				name: '',
				party: '',
				age: '',
				constituency: '',
				deposit: '1'
			});
		} catch (e) {
			console.error('Registration error:', e);
			
			// Provide specific error messages
			let errorMessage = 'Registration failed. Please try again.';
			
			if (e.message.includes('Following candidate is already registered')) {
				errorMessage = 'This address is already registered as a candidate.';
			} else if (e.message.includes('Incorrect deposit sent')) {
				errorMessage = 'Incorrect security deposit amount. Please check the deposit field.';
			} else if (e.message.includes('Gas estimation failed')) {
				errorMessage = 'Transaction failed during gas estimation. Please try again or contact support.';
			} else if (e.message.includes('insufficient funds')) {
				errorMessage = 'Insufficient funds. Please ensure you have enough ETH for the security deposit and gas fees.';
			} else if (e.message.includes('user rejected')) {
				errorMessage = 'Transaction was rejected. Please try again.';
			} else if (e.message.includes('network')) {
				errorMessage = 'Network error. Please check your connection and try again.';
			} else if (e.shortMessage) {
				errorMessage = e.shortMessage;
			} else if (e.message) {
				errorMessage = e.message;
			}
			
			setStatus({ 
				type: 'error', 
				message: errorMessage
			});
		} finally {
			setLoading(false);
		}
	};

	const FormField = ({ label, field, type = 'text', placeholder, helpText, min, step }) => (
		<div className="form-group">
			<label className="label">{label}</label>
			<input 
				type={type}
				placeholder={placeholder}
				value={formData[field]}
				onChange={(e) => handleInputChange(field, e.target.value)}
				disabled={loading}
				min={min}
				step={step}
				style={{
					borderColor: errors[field] ? 'var(--error)' : undefined
				}}
			/>
			{helpText && (
				<div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '4px' }}>
					{helpText}
				</div>
			)}
			{errors[field] && (
				<div style={{ fontSize: '0.8rem', color: 'var(--error)', marginTop: '4px' }}>
					{errors[field]}
				</div>
			)}
		</div>
	);

	return (
		<div className="grid">
			<div className="card">
				<div style={{ marginBottom: '24px' }}>
					<h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Candidate Registration</h1>
					<p style={{ color: 'var(--text-muted)', margin: 0 }}>
						Submit your candidacy for the election. A security deposit is required and will be refunded 
						after the election if you receive a minimum number of votes.
					</p>
				</div>

				<div className="form">
					<div className="form-row">
						<FormField
							label="Candidate Name"
							field="name"
							placeholder="Enter your full name"
							helpText="Your official name as it will appear on the ballot"
						/>

						<FormField
							label="Political Party"
							field="party"
							placeholder="Enter party name"
							helpText="The political party you represent (or 'Independent')"
						/>
					</div>

					<div className="form-row">
						<FormField
							label="Age"
							field="age"
							type="number"
							placeholder="Enter your age"
							min="25"
							helpText="Must be 25 years or older to run for office"
						/>

						<FormField
							label="Constituency ID"
							field="constituency"
							type="number"
							placeholder="Enter constituency number"
							min="1"
							helpText="The constituency you wish to represent"
						/>
					</div>

					<FormField
						label="Security Deposit (ETH)"
						field="deposit"
						type="number"
						placeholder="1.0"
						min="0.1"
						step="0.1"
						helpText="Minimum 0.1 ETH. This deposit will be refunded if you receive sufficient votes."
					/>

					{status.message && (
						<div className={`status-message ${status.type}`}>
							{status.type === 'loading' && <div className="spinner"></div>}
							{status.message}
						</div>
					)}

					<div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginTop: '8px' }}>
						<button 
							onClick={register} 
							disabled={loading}
							className="primary"
							style={{ minWidth: '160px' }}
						>
							{loading ? (
								<div className="loading">
									<div className="spinner"></div>
									Submitting...
								</div>
							) : (
								'Submit Candidacy'
							)}
						</button>
						
						{loading && (
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								This may take a few moments...
							</div>
						)}
					</div>
				</div>
			</div>

			{/* Requirements Card */}
			<div className="card">
				<h3 style={{ margin: '0 0 16px 0' }}>Eligibility Requirements</h3>
				<div style={{ display: 'grid', gap: '12px' }}>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--success)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							✓
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Age Requirement</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Must be at least 25 years old
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--success)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							✓
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Security Deposit</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Minimum 0.1 ETH deposit required
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
						<div style={{ 
							width: '20px', 
							height: '20px', 
							borderRadius: '50%', 
							background: 'var(--success)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.7rem',
							fontWeight: 'bold',
							marginTop: '2px',
							flexShrink: 0
						}}>
							✓
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Officer Verification</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								All information will be verified by election officers
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Deposit Information */}
			<div className="card">
				<h3 style={{ margin: '0 0 16px 0' }}>Security Deposit Information</h3>
				<div style={{ color: 'var(--text-muted)', lineHeight: '1.6' }}>
					<p style={{ margin: '0 0 12px 0' }}>
						The security deposit serves as a commitment to participate seriously in the election process. 
						It helps prevent frivolous candidacies and ensures candidates are serious about their campaign.
					</p>
					<p style={{ margin: '0 0 12px 0' }}>
						<strong>Refund Policy:</strong> Your deposit will be fully refunded if you receive a minimum 
						number of votes (as defined in the smart contract). This encourages genuine participation 
						while discouraging spam candidates.
					</p>
					<p style={{ margin: 0 }}>
						<strong>Note:</strong> The deposit is held in the smart contract and cannot be withdrawn 
						until after the election results are finalized.
					</p>
				</div>
			</div>
		</div>
	);
}

export default CandidateRegistration;




