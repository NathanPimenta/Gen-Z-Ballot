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

	const FormField = ({ label, field, type = 'text', placeholder, helpText, icon }) => (
		<div className="form-group">
			<label className="label">
				{icon && <span>{icon}</span>}
				{label}
			</label>
			<div className="input-group">
				<input 
					type={type}
					placeholder={placeholder}
					value={formData[field]}
					onChange={(e) => handleInputChange(field, e.target.value)}
					disabled={loading}
					style={{
						borderColor: errors[field] ? 'var(--error)' : undefined,
						boxShadow: errors[field] ? 'var(--shadow-inset), 0 0 0 2px var(--error)' : undefined
					}}
				/>
			</div>
			{helpText && (
				<div className="form-help-text">
					💡 {helpText}
				</div>
			)}
			{errors[field] && (
				<div className="form-error-text">
					⚠️ {errors[field]}
				</div>
			)}
		</div>
	);

	return (
		<div className="form-container">
			<div className="card">
				<div className="card-header">
					<div className="card-icon">👤</div>
					<div>
						<h1 className="card-title">Voter Registration</h1>
						<p style={{ color: 'var(--text-muted)', margin: 0, fontSize: '0.9rem' }}>
							Register to participate in decentralized elections
						</p>
					</div>
				</div>

				<div className="form form-wide">
					<div className="form-row">
						<FormField
							label="Full Name"
							field="name"
							placeholder="Enter your full legal name"
							helpText="Use your official name as it appears on government documents"
							icon="📝"
						/>
						<FormField
							label="Age"
							field="age"
							type="number"
							placeholder="Enter your age"
							helpText="Must be 18 years or older to vote"
							icon="🎂"
						/>
					</div>

					<FormField
						label="Aadhar Number"
						field="aadhar"
						placeholder="Enter your Aadhar number or hex format (0x...)"
						helpText="You can enter your Aadhar number directly or in hex format"
						icon="🆔"
					/>

					<div className="form-row">
						<FormField
							label="Voter ID"
							field="voterId"
							placeholder="Enter your voter ID number"
							helpText="Your official voter identification number"
							icon="🗳️"
						/>
						<FormField
							label="Constituency ID"
							field="constituency"
							type="number"
							placeholder="Enter constituency number"
							helpText="The constituency number where you are registered to vote"
							icon="🏛️"
						/>
					</div>

					{status.message && (
						<div className={`status-message ${status.type}`}>
							{status.type === 'loading' && <div className="spinner"></div>}
							{status.message}
						</div>
					)}

					<div className="form-actions">
						<button 
							onClick={register} 
							disabled={loading}
							className="primary"
							style={{ minWidth: '180px' }}
						>
							{loading ? (
								<div className="loading">
									<div className="spinner"></div>
									Registering...
								</div>
							) : (
								<div className="button-content">
									<span>✅</span>
									Register as Voter
								</div>
							)}
						</button>
						<button 
							type="button"
							onClick={() => {
								setFormData({
									name: '',
									age: '',
									aadhar: '',
									voterId: '',
									constituency: ''
								});
								setErrors({});
								setStatus({ type: '', message: '' });
							}}
							className="ghost"
							disabled={loading}
						>
							<div className="button-content">
								<span>🔄</span>
								Reset Form
							</div>
						</button>
					</div>
				</div>
			</div>

			{/* Information Card */}
			<div className="card">
				<div className="card-header">
					<div className="card-icon">ℹ️</div>
					<h3 className="card-title">Registration Information</h3>
				</div>
				<div className="info-list">
					<div className="info-item">
						<span className="info-icon">📋</span>
						<div>
							<div className="info-title">Required Documents</div>
							<div className="info-description">Valid Aadhar Card and Voter ID</div>
						</div>
					</div>
					<div className="info-item">
						<span className="info-icon">⏱️</span>
						<div>
							<div className="info-title">Processing Time</div>
							<div className="info-description">Registration requires officer verification</div>
						</div>
					</div>
					<div className="info-item">
						<span className="info-icon">🔒</span>
						<div>
							<div className="info-title">Security</div>
							<div className="info-description">All data is stored on blockchain</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}

export default VoterRegistration;




