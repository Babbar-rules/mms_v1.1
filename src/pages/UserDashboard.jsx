import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import MetricCard from '../components/MetricCard'
import './UserDashboard.css'

const UserDashboard = () => {
    const navigate = useNavigate()
    const { pendingMetrics, approvedMetrics } = useMetrics()

    // Get recent metrics (last 5)
    const recentMetrics = [...pendingMetrics, ...approvedMetrics]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 5)

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>USER DASHBOARD</h1>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/login')}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-actions">
                <button
                    className="btn btn-primary"
                    onClick={() => navigate('/create-metric')}
                >
                    ➕ Create New Metric
                </button>
                <button
                    className="btn btn-secondary"
                    onClick={() => navigate('/edit-metric')}
                >
                    ✏️ Edit Existing Metric
                </button>
            </div>

            <div className="dashboard-content container">
                <div className="dashboard-section fade-in">
                    <div className="section-header">
                        <h2>RECENTLY CREATED METRICS</h2>
                        <span className="badge badge-secondary">{recentMetrics.length}</span>
                    </div>
                    {recentMetrics.length > 0 ? (
                        <div className="metrics-grid">
                            {recentMetrics.map((metric) => (
                                <MetricCard key={metric.id} metric={metric} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="text-muted">No metrics created yet</p>
                            <button
                                className="btn btn-primary"
                                onClick={() => navigate('/create-metric')}
                            >
                                Create Your First Metric
                            </button>
                        </div>
                    )}
                </div>

                <div className="dashboard-section fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="section-header">
                        <h2>PENDING APPROVAL</h2>
                        <span className="badge badge-warning">{pendingMetrics.length}</span>
                    </div>
                    {pendingMetrics.length > 0 ? (
                        <div className="metrics-grid">
                            {pendingMetrics.map((metric) => (
                                <MetricCard key={metric.id} metric={metric} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="text-muted">No pending approvals</p>
                        </div>
                    )}
                </div>

                <div className="dashboard-section fade-in" style={{ animationDelay: '0.2s' }}>
                    <div className="section-header">
                        <h2>APPROVED METRICS</h2>
                        <span className="badge badge-success">{approvedMetrics.length}</span>
                    </div>
                    {approvedMetrics.length > 0 ? (
                        <div className="metrics-grid">
                            {approvedMetrics.slice(0, 6).map((metric) => (
                                <MetricCard key={metric.id} metric={metric} />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <p className="text-muted">No approved metrics yet</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default UserDashboard
