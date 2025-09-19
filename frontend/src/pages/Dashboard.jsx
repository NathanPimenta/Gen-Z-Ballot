import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard() {
  return (
    <div className="dashboard-container">
      <div className="hero-section">
        <div className="hero-card">
          <div className="hero-content">
            <h1 className="hero-title">Welcome to Gen-Z Ballot</h1>
            <p className="hero-subtitle">A modern, secure, and transparent decentralized voting system powered by blockchain technology.</p>
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-icon">🗳️</div>
                <div className="stat-text">Secure Voting</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">🔒</div>
                <div className="stat-text">Blockchain Secured</div>
              </div>
              <div className="stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-text">Community Driven</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions-section">
        <h2 className="section-title">
          <span className="title-icon">⚡</span>
          Quick Actions
        </h2>
        
        <div className="primary-actions">
          <Link to="/voter" className="action-card primary">
            <div className="action-icon voter-icon">
              <span>👤</span>
            </div>
            <div className="action-content">
              <h3>Register as Voter</h3>
              <p>Create your secure voter profile and join the democratic process</p>
              <div className="action-badge">Get Started</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>

          <Link to="/candidate" className="action-card primary">
            <div className="action-icon candidate-icon">
              <span>🏛️</span>
            </div>
            <div className="action-content">
              <h3>Register as Candidate</h3>
              <p>Submit your candidacy and represent your community</p>
              <div className="action-badge">Apply Now</div>
            </div>
            <div className="action-arrow">→</div>
          </Link>
        </div>

        <div className="secondary-actions">
          <Link to="/vote" className="action-card secondary">
            <div className="action-icon vote-icon">
              <span>🗳️</span>
            </div>
            <div className="action-content">
              <h3>Cast Your Vote</h3>
              <p>Exercise your democratic right</p>
            </div>
          </Link>

          <Link to="/results" className="action-card secondary">
            <div className="action-icon results-icon">
              <span>📊</span>
            </div>
            <div className="action-content">
              <h3>View Results</h3>
              <p>Check election outcomes</p>
            </div>
          </Link>

          <Link to="/officer" className="action-card secondary">
            <div className="action-icon officer-icon">
              <span>⚖️</span>
            </div>
            <div className="action-content">
              <h3>Officer Panel</h3>
              <p>Administrative controls</p>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
