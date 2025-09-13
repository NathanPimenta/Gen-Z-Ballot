import { useState } from 'react';
import { useContracts } from '../web3/useContracts';

function VoterRegistration() {
	const { Voter } = useContracts();
	const [formData, setFormData] = useState({
		name: '',
		age: '',
		aadhar: '',
		voterId: '',
		constituency: ''
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
			newErrors.name = 'Name is required';
		}
		
		if (!formData.age || parseInt(formData.age) < 18) {
			newErrors.age = 'Age must be 18 or older';
		}
		
		if (!formData.aadhar.trim()) {
			newErrors.aadhar = 'Aadhar is required';
		}
		
		if (!formData.voterId.trim()) {
			newErrors.voterId = 'Voter ID is required';
		}
		
		if (!formData.constituency || parseInt(formData.constituency) < 1) {
			newErrors.constituency = 'Valid constituency ID is required';
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
			setStatus({ type: 'loading', message: 'Submitting registration...' });
			
			const voter = await Voter();
			
			// Convert aadhar to bytes12 format
			let aadharBytes;
			if (/^0x[0-9a-fA-F]{24}$/.test(formData.aadhar)) {
				aadharBytes = formData.aadhar;
			} else {
				const enc = new TextEncoder();
				const bytes = enc.encode(formData.aadhar);
				aadharBytes = '0x' + Array.from(bytes).slice(0, 12).map(b => b.toString(16).padStart(2, '0')).join('');
			}
			
			const tx = await voter.registerAsVoter(
				formData.name.trim(), 
				parseInt(formData.age), 
				aadharBytes, 
				formData.voterId.trim(), 
				parseInt(formData.constituency)
			);
			
			setStatus({ type: 'loading', message: 'Waiting for confirmation...' });
			await tx.wait();
			
			setStatus({ type: 'success', message: 'Registration successful! Your voter registration has been submitted.' });
			
			// Reset form
			setFormData({
				name: '',
				age: '',
				aadhar: '',
				voterId: '',
				constituency: ''
			});
		} catch (e) {
			console.error('Registration error:', e);
			setStatus({ 
				type: 'error', 
				message: e?.shortMessage || e?.message || 'Registration failed. Please try again.' 
			});
		} finally {
			setLoading(false);
		}
	};

	const FormField = ({ label, field, type = 'text', placeholder, helpText }) => (
		<div className="form-group">
			<label className="label">{label}</label>
			<input 
				type={type}
				placeholder={placeholder}
				value={formData[field]}
				onChange={(e) => handleInputChange(field, e.target.value)}
				disabled={loading}
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
					<h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>Voter Registration</h1>
					<p style={{ color: 'var(--text-muted)', margin: 0 }}>
						Register as a voter to participate in the decentralized election system. 
						All fields are required and will be verified by election officers.
					</p>
				</div>

				<div className="form">
					<FormField
						label="Full Name"
						field="name"
						placeholder="Enter your full legal name"
						helpText="Use your official name as it appears on government documents"
					/>

					<FormField
						label="Age"
						field="age"
						type="number"
						placeholder="Enter your age"
						helpText="Must be 18 years or older to vote"
					/>

					<FormField
						label="Aadhar Number"
						field="aadhar"
						placeholder="Enter your Aadhar number or hex format (0x...)"
						helpText="You can enter your Aadhar number directly or in hex format (0x313233343536373839303132)"
					/>

					<FormField
						label="Voter ID"
						field="voterId"
						placeholder="Enter your voter ID number"
						helpText="Your official voter identification number"
					/>

					<FormField
						label="Constituency ID"
						field="constituency"
						type="number"
						placeholder="Enter constituency number"
						helpText="The constituency number where you are registered to vote"
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
							style={{ minWidth: '140px' }}
						>
							{loading ? (
								<div className="loading">
									<div className="spinner"></div>
									Registering...
								</div>
							) : (
								'Register as Voter'
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

			{/* Information Card */}
			<div className="card">
				<h3 style={{ margin: '0 0 16px 0' }}>Registration Process</h3>
				<div style={{ display: 'grid', gap: '12px' }}>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div style={{ 
							width: '24px', 
							height: '24px', 
							borderRadius: '50%', 
							background: 'var(--brand)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.8rem',
							fontWeight: 'bold'
						}}>
							1
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Submit Registration</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Fill out the form with your details
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div style={{ 
							width: '24px', 
							height: '24px', 
							borderRadius: '50%', 
							background: 'var(--text-muted)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.8rem',
							fontWeight: 'bold'
						}}>
							2
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Officer Verification</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Election officers will verify your information
							</div>
						</div>
					</div>
					<div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
						<div style={{ 
							width: '24px', 
							height: '24px', 
							borderRadius: '50%', 
							background: 'var(--text-muted)', 
							color: 'white',
							display: 'flex',
							alignItems: 'center',
							justifyContent: 'center',
							fontSize: '0.8rem',
							fontWeight: 'bold'
						}}>
							3
						</div>
						<div>
							<div style={{ fontWeight: '600' }}>Approval</div>
							<div style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
								Once approved, you can participate in voting
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VoterRegistration;




