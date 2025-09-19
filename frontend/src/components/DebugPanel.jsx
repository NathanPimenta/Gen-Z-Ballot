import { useState, useEffect } from 'react';
import { useContracts } from '../web3/useContracts';

function DebugPanel() {
    const { Voter, Candidate, GeneralElections } = useContracts();
    const [debugData, setDebugData] = useState({});
    const [loading, setLoading] = useState(false);

    const loadDebugData = async () => {
        try {
            setLoading(true);
            console.log('🔍 Loading debug data...');
            
            const [voterContract, candidateContract, electionContract] = await Promise.all([
                Voter(),
                Candidate(),
                GeneralElections()
            ]);

            console.log('📋 Contract instances created:', {
                voter: !!voterContract,
                candidate: !!candidateContract,
                election: !!electionContract
            });

            // Test voter contract
            let voterCount = 0;
            let allVoters = [];
            try {
                voterCount = await voterContract.voterCount();
                allVoters = await voterContract.getAllVoters();
                console.log('✅ Voter data loaded:', { voterCount, allVoters });
            } catch (e) {
                console.log('❌ Voter contract error:', e.message);
            }

            // Test candidate contract
            let allCandidates = [];
            try {
                allCandidates = await candidateContract.getAllCandidates();
                console.log('✅ Candidate data loaded:', { allCandidates });
            } catch (e) {
                console.log('❌ Candidate contract error:', e.message);
            }

            // Test election contract
            let totalVotes = 0;
            try {
                totalVotes = await electionContract.getTotalVotes();
                console.log('✅ Election data loaded:', { totalVotes });
            } catch (e) {
                console.log('❌ Election contract error:', e.message);
            }

            setDebugData({
                voterCount: Number(voterCount),
                allVoters: allVoters.length,
                allCandidates: allCandidates.length,
                totalVotes: Number(totalVotes),
                timestamp: new Date().toLocaleTimeString()
            });

        } catch (error) {
            console.error('❌ Debug data loading failed:', error);
            setDebugData({
                error: error.message,
                timestamp: new Date().toLocaleTimeString()
            });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDebugData();
        
        // Auto-refresh every 3 seconds
        const interval = setInterval(loadDebugData, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
            <div style={{
                position: 'fixed',
                bottom: 0,      // flush with bottom
                right: 0,       // flush with right
                zIndex: 9999,   // make sure it stays on top
                background: 'var(--surface)',
                borderRadius: '16px 0 0 0', // rounded only top-left corner
                padding: '1rem',
                boxShadow: 'var(--shadow-floating)',
                border: '1px solid var(--text-muted)',
                opacity: 0.9,
                transition: 'all 0.3s ease',
                maxWidth: '400px',
                fontSize: '0.85rem'
            }}>
            <h4 style={{ margin: '0 0 10px 0', color: '#00ff00' }}>🔍 Debug Panel</h4>
            
            {loading && <div>⏳ Loading...</div>}
            
            {debugData.error ? (
                <div style={{ color: '#ff6b6b' }}>
                    ❌ Error: {debugData.error}
                </div>
            ) : (
                <div>
                    <div>👥 Voters: {debugData.voterCount} ({debugData.allVoters} addresses)</div>
                    <div>🏛️ Candidates: {debugData.allCandidates}</div>
                    <div>🗳️ Votes: {debugData.totalVotes}</div>
                    <div style={{ color: '#888', marginTop: '5px' }}>
                        Last updated: {debugData.timestamp}
                    </div>
                </div>
            )}
            
            <button 
                onClick={loadDebugData}
                style={{
                    marginTop: '10px',
                    padding: '5px 10px',
                    background: '#007bff',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '11px'
                }}
            >
                🔄 Refresh
            </button>
        </div>
    );
}

export default DebugPanel;
