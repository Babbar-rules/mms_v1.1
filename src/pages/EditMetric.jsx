import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import { dummyMetrics } from '../utils/dummyData'
import MetricCard from '../components/MetricCard'
import './EditMetric.css'

const EditMetric = () => {
    const navigate = useNavigate()
    const { approvedMetrics, pendingMetrics } = useMetrics()

    // Combine pending, approved metrics with dummy data
    const allMetrics = [...pendingMetrics, ...approvedMetrics, ...dummyMetrics]

    const [searchTerm, setSearchTerm] = useState('')
    const [filterCategory, setFilterCategory] = useState('All')
    const [filterDomain, setFilterDomain] = useState('All')

    // Get unique domains and categories
    const domains = ['All', ...new Set(allMetrics.map(m => m.domain))]
    const categories = ['All', ...new Set(allMetrics.map(m => m.category))]

    // Filter metrics
    const filteredMetrics = allMetrics.filter(metric => {
        const matchesSearch = metric.metricName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            metric.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            metric.description.toLowerCase().includes(searchTerm.toLowerCase())
        const matchesCategory = filterCategory === 'All' || metric.category === filterCategory
        const matchesDomain = filterDomain === 'All' || metric.domain === filterDomain

        return matchesSearch && matchesCategory && matchesDomain
    })

    return (
        <div className="edit-metric-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Edit Existing Metrics</h1>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/user')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="edit-metric-container container">
                <div className="search-section fade-in">
                    <div className="search-bar">
                        <input
                            type="text"
                            className="form-input search-input"
                            placeholder="🔍 Search by metric name, domain, or description..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <div className="filters">
                        <div className="filter-group">
                            <label className="form-label">Department</label>
                            <select
                                className="form-select"
                                value={filterDomain}
                                onChange={(e) => setFilterDomain(e.target.value)}
                            >
                                {domains.map(domain => (
                                    <option key={domain} value={domain}>{domain}</option>
                                ))}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label className="form-label">Category</label>
                            <select
                                className="form-select"
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                            >
                                {categories.map(category => (
                                    <option key={category} value={category}>{category}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                <div className="metrics-section fade-in" style={{ animationDelay: '0.1s' }}>
                    <div className="section-header">
                        <h2>AVAILABLE METRICS</h2>
                        <span className="badge badge-primary">{filteredMetrics.length}</span>
                    </div>

                    {filteredMetrics.length > 0 ? (
                        <div className="metrics-grid">
                            {filteredMetrics.map((metric) => (
                                <MetricCard
                                    key={metric.id}
                                    metric={metric}
                                    onClick={(m) => navigate(`/metric/${m.id}`)}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="empty-state">
                            <div className="empty-icon">🔍</div>
                            <h3>No Metrics Found</h3>
                            <p className="text-muted">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EditMetric
