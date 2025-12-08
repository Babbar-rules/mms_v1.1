import { useNavigate } from 'react-router-dom'
import './MetricCard.css'

const MetricCard = ({ metric, onClick, showStatus = true }) => {
    const navigate = useNavigate()

    const handleClick = () => {
        if (onClick) {
            onClick(metric)
        } else {
            navigate(`/metric/${metric.id}`)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'Pending': 'badge-warning',
            'Approved': 'badge-success',
            'Certified': 'badge-primary',
            'In Review': 'badge-secondary',
            'Draft': 'badge-secondary',
            'Deprecated': 'badge-danger'
        }
        return statusMap[status] || 'badge-secondary'
    }

    return (
        <div className="metric-card card" onClick={handleClick}>
            <div className="card-header">
                <div className="metric-card-title">
                    <h4>{metric.metricName}</h4>
                    {showStatus && (
                        <span className={`badge ${getStatusBadge(metric.status)}`}>
                            {metric.status}
                        </span>
                    )}
                </div>
                <p className="text-muted metric-uuid">{metric.uuid}</p>
            </div>
            <div className="card-body">
                <div className="metric-info">
                    <div className="metric-info-item">
                        <span className="label">Domain:</span>
                        <span className="value">{metric.domain}</span>
                    </div>
                    <div className="metric-info-item">
                        <span className="label">Category:</span>
                        <span className="value">{metric.category}</span>
                    </div>
                    <div className="metric-info-item">
                        <span className="label">Type:</span>
                        <span className="value">{metric.type}</span>
                    </div>
                </div>
                <p className="metric-description">{metric.description}</p>
            </div>
            <div className="card-footer">
                <div className="metric-meta">
                    <span className="text-muted">Owner: {metric.businessOwner}</span>
                    <span className="text-muted">v{metric.version}</span>
                </div>
            </div>
        </div>
    )
}

export default MetricCard
