import { useEffect, useState } from 'react';

function ConnectWallet({ onConnect }) {
	const [account, setAccount] = useState(null);
	const [chainId, setChainId] = useState(null);
	const [connecting, setConnecting] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		if (!window.ethereum) return;

		// Check if already connected
		window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
			if (accounts && accounts.length > 0) {
				setAccount(accounts[0]);
				onConnect?.(accounts[0]);
			}
		});

		// Get current chain
		window.ethereum.request({ method: 'eth_chainId' }).then((id) => {
			setChainId(id);
		});

		const onAccountsChanged = (accounts) => {
			setAccount(accounts[0] || null);
			onConnect?.(accounts[0] || null);
			setError('');
		};

		const onChainChanged = (id) => {
			setChainId(id);
			setError('');
		};

		window.ethereum.on('accountsChanged', onAccountsChanged);
		window.ethereum.on('chainChanged', onChainChanged);
		
		return () => {
			if (!window.ethereum) return;
			window.ethereum.removeListener('accountsChanged', onAccountsChanged);
			window.ethereum.removeListener('chainChanged', onChainChanged);
		};
	}, [onConnect]);

	const connect = async () => {
		if (!window.ethereum) {
			setError('MetaMask not found. Please install MetaMask to continue.');
			return;
		}

		try {
			setConnecting(true);
			setError('');
			
			const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
			setAccount(accounts[0]);
			onConnect?.(accounts[0]);

			// Check if we're on the correct network
			const currentChainId = await window.ethereum.request({ method: 'eth_chainId' });
			if (currentChainId !== '0x539') { // 1337 in hex
				setError('Please switch to Hardhat network (Chain ID: 1337)');
			}
		} catch (err) {
			console.error('Connection error:', err);
			if (err.code === 4001) {
				setError('Connection rejected by user');
			} else {
				setError('Failed to connect wallet. Please try again.');
			}
		} finally {
			setConnecting(false);
		}
	};

	const disconnect = () => {
		setAccount(null);
		onConnect?.(null);
		setError('');
	};

	const switchNetwork = async () => {
		try {
			await window.ethereum.request({
				method: 'wallet_switchEthereumChain',
				params: [{ chainId: '0x539' }],
			});
		} catch (switchError) {
			// This error code indicates that the chain has not been added to MetaMask
			if (switchError.code === 4902) {
				try {
					await window.ethereum.request({
						method: 'wallet_addEthereumChain',
						params: [{
							chainId: '0x539',
							chainName: 'Hardhat Local',
							rpcUrls: ['http://localhost:8545'],
							nativeCurrency: {
								name: 'Ethereum',
								symbol: 'ETH',
								decimals: 18
							}
						}],
					});
				} catch (addError) {
					setError('Failed to add Hardhat network to MetaMask');
				}
			} else {
				setError('Failed to switch network');
			}
		}
	};

	const isCorrectNetwork = chainId === '0x539';

	return (
		<div style={{ display: 'flex', gap: '12px', alignItems: 'center', flexWrap: 'wrap' }}>
			{chainId && (
				<span className={`badge ${isCorrectNetwork ? 'success' : 'warning'}`}>
					Chain: {parseInt(chainId, 16)}
				</span>
			)}
			
			{error && (
				<div style={{ 
					fontSize: '0.8rem', 
					color: 'var(--error)', 
					background: 'rgba(239, 68, 68, 0.1)',
					padding: '8px 12px',
					borderRadius: '8px',
					border: '1px solid var(--error)'
				}}>
					{error}
				</div>
			)}

			{!isCorrectNetwork && chainId && (
				<button onClick={switchNetwork} className="warning" style={{ fontSize: '0.8rem' }}>
					Switch to Hardhat
				</button>
			)}

			{account ? (
				<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
					<button 
						onClick={disconnect}
						style={{ 
							background: 'var(--bg-elev)', 
							border: '1px solid var(--border)',
							fontSize: '0.8rem',
							padding: '6px 12px'
						}}
					>
						Disconnect
					</button>
					<button 
						style={{
							background: 'var(--gradient-brand)',
							color: 'white',
							border: 'none',
							fontSize: '0.9rem',
							padding: '8px 16px'
						}}
					>
						{account.slice(0, 6)}...{account.slice(-4)}
					</button>
				</div>
			) : (
				<button 
					onClick={connect} 
					disabled={connecting}
					className="primary"
					style={{ minWidth: '140px' }}
				>
					{connecting ? (
						<div className="loading">
							<div className="spinner"></div>
							Connecting...
						</div>
					) : (
						'Connect Wallet'
					)}
				</button>
			)}
		</div>
	);
}

export default ConnectWallet;




