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
		<div className="wallet-container">
			{chainId && (
				<span className={`badge ${isCorrectNetwork ? 'success' : 'warning'}`}>
					⛓️ Chain: {parseInt(chainId, 16)}
				</span>
			)}
			
			{error && (
				<div className="status-message error">
					⚠️ {error}
				</div>
			)}

			{!isCorrectNetwork && chainId && (
				<button onClick={switchNetwork} className="warning">
					🔄 Switch to Hardhat
				</button>
			)}

			{account ? (
				<div className="wallet-connected">
					<button onClick={disconnect} className="ghost">
						🔌 Disconnect
					</button>
					<div className="wallet-address">
						<span className="wallet-icon">👤</span>
						{account.slice(0, 6)}...{account.slice(-4)}
					</div>
				</div>
			) : (
				<button 
					onClick={connect} 
					disabled={connecting}
					className="primary"
				>
					{connecting ? (
						<div className="loading">
							<div className="spinner"></div>
							Connecting...
						</div>
					) : (
						<>
							<span style={{ marginRight: '0.5rem' }}>🔗</span>
							Connect Wallet
						</>
					)}
				</button>
			)}
		</div>
	);
}

export default ConnectWallet;




