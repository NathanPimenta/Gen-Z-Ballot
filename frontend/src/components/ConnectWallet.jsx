import { useEffect, useState } from 'react';

function ConnectWallet({ onConnect }) {
	const [account, setAccount] = useState(null);
	const [chainId, setChainId] = useState(null);

	useEffect(() => {
		if (!window.ethereum) return;

		window.ethereum.request({ method: 'eth_accounts' }).then((accounts) => {
			if (accounts && accounts.length > 0) {
				setAccount(accounts[0]);
				onConnect?.(accounts[0]);
			}
		});

		const onAccountsChanged = (accounts) => {
			setAccount(accounts[0] || null);
			onConnect?.(accounts[0] || null);
		};
		const onChainChanged = (id) => setChainId(id);
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
			alert('MetaMask not found. Please install it to continue.');
			return;
		}
		const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
		setAccount(accounts[0]);
		onConnect?.(accounts[0]);
	};

	return (
		<div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
			{chainId && (
				<span className="badge">Chain: {parseInt(chainId, 16)}</span>
			)}
			<button onClick={connect} style={{
				background: 'linear-gradient(135deg, #6366f1, #22d3ee)',
				color: '#0b1220',
				border: 'none'
			}}>
				{account ? `${account.slice(0, 6)}...${account.slice(-4)}` : 'Connect Wallet'}
			</button>
		</div>
	);
}

export default ConnectWallet;




