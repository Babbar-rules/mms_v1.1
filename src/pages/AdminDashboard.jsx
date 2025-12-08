import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import MetricCard from '../components/MetricCard'
import './AdminDashboard.css'

const AdminDashboard = () => {
    const navigate = useNavigate()
    const { pendingMetrics } = useMetrics()

    return (
        <div className="dashboard-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Admin Dashboard</h1>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/login')}
                    >
                        Logout
                    </button>
                </div>
            </div>

            <div className="dashboard-content container">
                <div className="dashboard-section fade-in">
                    <div className="section-header">
                        <h2>Pending Approvals</h2>
                        <span className="badge badge-warning">{pendingMetrics.length}</span>
                    </div>

                    {pendingMetrics.length > 0 ? (
                        <div className="metrics-grid">
                            {pendingMetrics.map((metric) => (
                                <MetricCard
                                    key={metric.id}
                                    metric={metric}
                                    onClick={(m) => navigate(`/metric/${m.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">✅</div>
                            <h3>All Caught Up!</h3>
                            <p className="text-muted">No pending metrics to review</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AdminDashboard
