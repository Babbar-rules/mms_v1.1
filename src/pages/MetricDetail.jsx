import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import { dummyMetrics } from '../utils/dummyData'
import Modal from '../components/Modal'
import './MetricDetail.css'

const MetricDetail = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const { getMetricById, approveMetric, updateMetric, pendingMetrics } = useMetrics()

    const [metric, setMetric] = useState(null)
    const [showApprovalModal, setShowApprovalModal] = useState(false)
    const [adminName, setAdminName] = useState('')
    const [isAdmin, setIsAdmin] = useState(false)
    const [isEditMode, setIsEditMode] = useState(false)
    const [editFormData, setEditFormData] = useState(null)

    useEffect(() => {
        // Try to find metric in context first, then in dummy data
        let foundMetric = getMetricById(id)
        if (!foundMetric) {
            foundMetric = dummyMetrics.find(m => m.id === id)
        }
        setMetric(foundMetric)
        setEditFormData(foundMetric)

        // Check if this is an admin view (metric is pending)
        setIsAdmin(pendingMetrics.some(m => m.id === id))
    }, [id, getMetricById, pendingMetrics])

    const handleEditChange = (e) => {
        const { name, value } = e.target
        setEditFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSaveEdit = () => {
        // Update the metric in context with auto-incrementing version
        const updated = updateMetric(metric.id, editFormData)
        if (updated) {
            setMetric(updated)
            setEditFormData(updated)
        }
        setIsEditMode(false)
        alert('Metric updated successfully! Version incremented to ' + ((metric.version || 1) + 1))
    }

    const canEdit = () => {
        // Can edit if it's a pending metric (not approved/certified) and not from dummy data
        return metric && metric.status === 'Pending' && pendingMetrics.some(m => m.id === id)
    }

    const handleApprove = () => {
        if (!adminName.trim()) {
            alert('Please enter your admin name')
            return
        }

        approveMetric(id, adminName)
        setShowApprovalModal(false)
        navigate('/admin')
    }

    if (!metric) {
        return (
            <div className="metric-detail-page">
                <div className="container">
                    <div className="empty-state">
                        <h2>Metric not found</h2>
                        <button className="btn btn-primary" onClick={() => navigate(-1)}>
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        )
    }

    const displayMetric = isEditMode ? editFormData : metric

    return (
        <div className="metric-detail-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Metric Details</h1>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>
                </div>
            </div>

            <div className="metric-detail-container container">
                <div className="detail-card fade-in">
                    <div className="detail-header">
                        <div>
                            <h2>{displayMetric.metricName}</h2>
                            <p className="text-muted metric-uuid">{metric.uuid}</p>
                        </div>
                        <div className="header-actions">
                            {canEdit() && !isEditMode && (
                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() => setIsEditMode(true)}
                                >
                                    ✏️ Edit
                                </button>
                            )}
                            {isEditMode && (
                                <>
                                    <button
                                        className="btn btn-success btn-sm"
                                        onClick={handleSaveEdit}
                                    >
                                        💾 Save
                                    </button>
                                    <button
                                        className="btn btn-secondary btn-sm"
                                        onClick={() => {
                                            setIsEditMode(false)
                                            setEditFormData(metric)
                                        }}
                                    >
                                        ✕ Cancel
                                    </button>
                                </>
                            )}
                            <span className={`badge ${metric.status === 'Pending' ? 'badge-warning' :
                                metric.status === 'Approved' || metric.status === 'Certified' ? 'badge-success' :
                                    'badge-secondary'
                                }`}>
                                {metric.status}
                            </span>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>A. Metric Identity</h3>
                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Domain/Department</span>
                                <span className="value">{displayMetric.domain}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Category</span>
                                <span className="value">{displayMetric.category}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Type</span>
                                <span className="value">{displayMetric.type}</span>
                            </div>

                            <div className="detail-item">
                                <span className="label">Version</span>
                                <span className="value">{displayMetric.version}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Business Owner</span>
                                <span className="value">{displayMetric.businessOwner}</span>
                            </div>
                            <div className="detail-item">
                                <span className="label">Technical Steward</span>
                                <span className="value">{displayMetric.technicalSteward}</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>B. Business Definition</h3>

                        <div className="detail-item-full">
                            <span className="label">Description</span>
                            {isEditMode ? (
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={editFormData.description}
                                    onChange={handleEditChange}
                                />
                            ) : (
                                <p className="value">{displayMetric.description}</p>
                            )}
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Business Purpose</span>
                            {isEditMode ? (
                                <textarea
                                    name="businessPurpose"
                                    className="form-textarea"
                                    value={editFormData.businessPurpose}
                                    onChange={handleEditChange}
                                />
                            ) : (
                                <p className="value">{displayMetric.businessPurpose}</p>
                            )}
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Use Cases</span>
                            {isEditMode ? (
                                <textarea
                                    name="useCases"
                                    className="form-textarea"
                                    value={editFormData.useCases}
                                    onChange={handleEditChange}
                                />
                            ) : (
                                <p className="value">{displayMetric.useCases}</p>
                            )}
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Exclusion Scenarios</span>
                            {isEditMode ? (
                                <textarea
                                    name="exclusionScenarios"
                                    className="form-textarea"
                                    value={editFormData.exclusionScenarios}
                                    onChange={handleEditChange}
                                />
                            ) : (
                                <p className="value">{displayMetric.exclusionScenarios}</p>
                            )}
                        </div>

                        <div className="detail-grid">
                            <div className="detail-item">
                                <span className="label">Unit of Measure</span>
                                {isEditMode ? (
                                    <input
                                        type="text"
                                        name="unitOfMeasure"
                                        className="form-input"
                                        value={editFormData.unitOfMeasure}
                                        onChange={handleEditChange}
                                    />
                                ) : (
                                    <span className="value">{displayMetric.unitOfMeasure}</span>
                                )}
                            </div>
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Interpretation Rules</span>
                            {isEditMode ? (
                                <textarea
                                    name="interpretationRules"
                                    className="form-textarea"
                                    value={editFormData.interpretationRules}
                                    onChange={handleEditChange}
                                />
                            ) : (
                                <p className="value">{displayMetric.interpretationRules}</p>
                            )}
                        </div>
                    </div>

                    <div className="detail-section">
                        <h3>C. Abstract Business Formula</h3>

                        <div className="detail-item-full">
                            <span className="label">Abstract Inputs</span>
                            <p className="value">{displayMetric.abstractInputs}</p>
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Aggregation Logic</span>
                            <p className="value code">{displayMetric.aggregationLogic}</p>
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Window Logic</span>
                            <p className="value">{displayMetric.windowLogic}</p>
                        </div>

                        <div className="detail-item-full">
                            <span className="label">Filter Rules</span>
                            <p className="value code">{displayMetric.filterRules}</p>
                        </div>
                    </div>

                    {metric.selectedColumns && metric.selectedColumns.length > 0 && (
                        <div className="detail-section">
                            <h3>Selected Metric Columns</h3>
                            <div className="columns-display">
                                {metric.selectedColumns.map(col => (
                                    <span key={col} className="badge badge-primary">{col}</span>
                                ))}
                            </div>
                        </div>
                    )}

                    {metric.approvedBy && (
                        <div className="detail-section approval-info">
                            <h4>Approval Information</h4>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <span className="label">Approved By</span>
                                    <span className="value">{metric.approvedBy}</span>
                                </div>
                                <div className="detail-item">
                                    <span className="label">Approved At</span>
                                    <span className="value">
                                        {new Date(metric.approvedAt).toLocaleString()}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    {isAdmin && !isEditMode && (
                        <div className="approval-actions">
                            <button
                                className="btn btn-success btn-lg"
                                onClick={() => setShowApprovalModal(true)}
                            >
                                ✓ Approve Metric
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <Modal
                isOpen={showApprovalModal}
                onClose={() => setShowApprovalModal(false)}
                title="Approve Metric Contract"
            >
                <div className="approval-modal">
                    <p>Please enter your admin name to approve this metric contract:</p>
                    <div className="form-group">
                        <label className="form-label">Admin Name</label>
                        <input
                            type="text"
                            className="form-input"
                            value={adminName}
                            onChange={(e) => setAdminName(e.target.value)}
                            placeholder="Enter your name"
                            autoFocus
                        />
                    </div>
                    <div className="modal-actions">
                        <button
                            className="btn btn-secondary"
                            onClick={() => setShowApprovalModal(false)}
                        >
                            Cancel
                        </button>
                        <button
                            className="btn btn-success"
                            onClick={handleApprove}
                        >
                            Approve
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default MetricDetail
