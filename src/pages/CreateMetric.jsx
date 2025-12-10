import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import InfoTooltip from '../components/InfoTooltip'
import Modal from '../components/Modal'
import './CreateMetric.css'

// Helper function to get field type icon
const getFieldIcon = (fieldName) => {
    const fieldIcons = {
        // Text input fields
        metricName: '📋',
        domain: '🏛️',
        businessOwner: '👥',
        technicalSteward: '⚙️',
        description: '📝',
        businessPurpose: '🎯',
        useCases: '✓',
        exclusionScenarios: 'ⓧ',
        interpretationRules: '📖',
        abstractInputs: '⬇️',
        aggregationLogic: '∑',
        windowLogic: '⏳',
        filterRules: '◆',
        unitOfMeasure: '⊗'
    }
    return fieldIcons[fieldName] || '◎'
}

const CreateMetric = () => {
    const navigate = useNavigate()
    const { createMetric, datasetColumns } = useMetrics()

    const [selectedColumns, setSelectedColumns] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [formData, setFormData] = useState({
        // Metric Identity (UUID removed - will be auto-generated)
        metricName: '',
        domain: '',
        businessOwner: '',
        technicalSteward: '',

        // Business Definition
        description: '',
        businessPurpose: '',
        useCases: '',
        exclusionScenarios: '',
        unitOfMeasure: '',
        interpretationRules: '',

        // Abstract Business Formula
        abstractInputs: '',
        aggregationLogic: '',
        windowLogic: '',
        filterRules: ''
    })

    // Redirect to root if no dataset columns available
    useEffect(() => {
        if (!datasetColumns || datasetColumns.length === 0) {
            alert('Please upload a dataset first')
            navigate('/')
        }
    }, [])

    const generateUUID = (metricName, domain) => {
        const prefix = metricName.split(' ').map(w => w[0]).join('').toUpperCase()
        const domainPrefix = domain.substring(0, 3).toUpperCase()
        const timestamp = Date.now().toString().slice(-6)
        return `${prefix}-${domainPrefix}-${timestamp}`
    }

    const handleInputChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const toggleColumn = (column) => {
        setSelectedColumns(prev =>
            prev.includes(column)
                ? prev.filter(c => c !== column)
                : [...prev, column]
        )
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        // Validate required fields
        if (!formData.metricName || !formData.domain || !formData.businessOwner) {
            alert('Please fill in all required fields')
            return
        }

        // Auto-generate UUID
        const uuid = generateUUID(formData.metricName, formData.domain)

        // Create metric with selected columns and generated UUID
        // Status and version are auto-set in context
        const metricData = {
            ...formData,
            uuid,
            selectedColumns
        }

        createMetric(metricData)
        setShowModal(true)
    }

    const handleModalClose = () => {
        setShowModal(false)
        navigate('/user')
    }

    return (
        <div className="create-metric-page">
            <div className="dashboard-header">
                <div className="header-content">
                    <h1>Create New Metric</h1>
                    <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => navigate('/user')}
                    >
                        ← Back to Dashboard
                    </button>
                </div>
            </div>

            <div className="create-metric-container">
                <div className="metric-form-wrapper">
                    {/* Dataset Columns Selection at Top */}
                    {datasetColumns && datasetColumns.length > 0 && (
                        <div className="dataset-columns-section fade-in">
                            <h3>Available Dataset Columns</h3>
                            <p className="text-muted">Select columns to include in this metric</p>
                            <div className="columns-grid">
                                {datasetColumns.map((column) => (
                                    <label key={column} className="column-checkbox">
                                        <input
                                            type="checkbox"
                                            checked={selectedColumns.includes(column)}
                                            onChange={() => toggleColumn(column)}
                                        />
                                        <span>{column}</span>
                                    </label>
                                ))}
                            </div>
                            {selectedColumns.length > 0 && (
                                <div className="selected-columns-preview">
                                    <strong>Selected:</strong>
                                    {selectedColumns.map(col => (
                                        <span key={col} className="badge badge-primary">{col}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="metric-form">
                        <div className="form-section">
                            <h3>A. Metric Identity</h3>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('metricName')}</span>
                                    Metric Name *
                                    <InfoTooltip text="A clear, descriptive name for your metric (e.g., 'Monthly Active Users', 'Revenue Per Customer')" />
                                </label>
                                <input
                                    type="text"
                                    name="metricName"
                                    className="form-input"
                                    value={formData.metricName}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('domain')}</span>
                                    Domain/Department *
                                    <InfoTooltip text="The business domain or department this metric belongs to (e.g., 'Sales', 'Marketing', 'Finance')" />
                                </label>
                                <input
                                    type="text"
                                    name="domain"
                                    className="form-input"
                                    value={formData.domain}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('businessOwner')}</span>
                                    Business Owner *
                                    <InfoTooltip text="The person responsible for the business definition and usage of this metric" />
                                </label>
                                <input
                                    type="text"
                                    name="businessOwner"
                                    className="form-input"
                                    value={formData.businessOwner}
                                    onChange={handleInputChange}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('technicalSteward')}</span>
                                    Technical Steward
                                    <InfoTooltip text="The person responsible for the technical implementation and data quality of this metric" />
                                </label>
                                <input
                                    type="text"
                                    name="technicalSteward"
                                    className="form-input"
                                    value={formData.technicalSteward}
                                    onChange={handleInputChange}
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>B. Business Definition</h3>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('description')}</span>
                                    Description
                                    <InfoTooltip text="A plain-English explanation of what this metric measures and why it matters" />
                                </label>
                                <textarea
                                    name="description"
                                    className="form-textarea"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    placeholder="Plain-English explanation of the metric"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('businessPurpose')}</span>
                                    Business Purpose
                                    <InfoTooltip text="Why this metric exists and what business decisions it supports" />
                                </label>
                                <textarea
                                    name="businessPurpose"
                                    className="form-textarea"
                                    value={formData.businessPurpose}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('useCases')}</span>
                                    Use Cases
                                    <InfoTooltip text="Specific scenarios or reports where this metric is used" />
                                </label>
                                <textarea
                                    name="useCases"
                                    className="form-textarea"
                                    value={formData.useCases}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('exclusionScenarios')}</span>
                                    Exclusion Scenarios
                                    <InfoTooltip text="Cases or data that should be excluded from this metric calculation" />
                                </label>
                                <textarea
                                    name="exclusionScenarios"
                                    className="form-textarea"
                                    value={formData.exclusionScenarios}
                                    onChange={handleInputChange}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('unitOfMeasure')}</span>
                                    Unit of Measure
                                    <InfoTooltip text="The unit this metric is measured in (e.g., USD, count, percent, days)" />
                                </label>
                                <input
                                    type="text"
                                    name="unitOfMeasure"
                                    className="form-input"
                                    value={formData.unitOfMeasure}
                                    onChange={handleInputChange}
                                    placeholder="e.g., USD, count, percent"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('interpretationRules')}</span>
                                    Interpretation Rules
                                    <InfoTooltip text="Guidelines for how to interpret the metric values (e.g., rounding rules, handling negative values, time cutoffs)" />
                                </label>
                                <textarea
                                    name="interpretationRules"
                                    className="form-textarea"
                                    value={formData.interpretationRules}
                                    onChange={handleInputChange}
                                    placeholder="Rules for rounding, negative values, time cutoffs"
                                />
                            </div>
                        </div>

                        <div className="form-section">
                            <h3>C. Abstract Business Formula</h3>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('abstractInputs')}</span>
                                    Abstract Inputs
                                    <InfoTooltip text="The conceptual data elements needed for this calculation (e.g., 'transaction_amount', 'customer_count')" />
                                </label>
                                <input
                                    type="text"
                                    name="abstractInputs"
                                    className="form-input"
                                    value={formData.abstractInputs}
                                    onChange={handleInputChange}
                                    placeholder="e.g., transaction_amount, refund_amount"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('aggregationLogic')}</span>
                                    Aggregation Logic
                                    <InfoTooltip text="The mathematical operation to perform (e.g., SUM, AVG, COUNT, MAX, MIN)" />
                                </label>
                                <textarea
                                    name="aggregationLogic"
                                    className="form-textarea"
                                    value={formData.aggregationLogic}
                                    onChange={handleInputChange}
                                    placeholder="e.g., SUM(amount), AVG(value), COUNT(*)"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('windowLogic')}</span>
                                    Window Logic
                                    <InfoTooltip text="The time period or window over which to calculate (e.g., 'Daily', 'Monthly rolling 30 days')" />
                                </label>
                                <input
                                    type="text"
                                    name="windowLogic"
                                    className="form-input"
                                    value={formData.windowLogic}
                                    onChange={handleInputChange}
                                    placeholder="e.g., Monthly rolling window"
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">
                                    <span className="field-icon">{getFieldIcon('filterRules')}</span>
                                    Filter Rules
                                    <InfoTooltip text="Business-level conditions that must be met for data to be included in the calculation" />
                                </label>
                                <textarea
                                    name="filterRules"
                                    className="form-textarea"
                                    value={formData.filterRules}
                                    onChange={handleInputChange}
                                    placeholder="Business-level exclusion and filter rules"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-lg submit-btn">
                            Create Metric
                        </button>
                    </form>
                </div>
            </div>

            <Modal isOpen={showModal} onClose={handleModalClose} title="Success">
                <div className="success-modal">
                    <div className="success-icon">✅</div>
                    <h3>Metric Contract Created!</h3>
                    <p>Your new metric contract has been sent to the admin for review.</p>
                    <button className="btn btn-primary" onClick={handleModalClose}>
                        Back to Dashboard
                    </button>
                </div>
            </Modal>
        </div>
    )
}

export default CreateMetric
