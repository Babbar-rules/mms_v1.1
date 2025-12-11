import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import DatasetUpload from '../components/DatasetUpload'
import './Home.css'

const Home = () => {
    const navigate = useNavigate()
    const { setDatasetColumns, datasetColumns } = useMetrics()
    const [columns, setColumns] = useState([])
    const [hasData, setHasData] = useState(false)
    const [showSuccessMessage, setShowSuccessMessage] = useState(false)

    // Check if dataset columns already exist in context (from previous upload)
    useEffect(() => {
        if (datasetColumns && datasetColumns.length > 0) {
            setColumns(datasetColumns)
            setHasData(true)
            // Don't show success message when returning to login page
            setShowSuccessMessage(false)
        }
    }, [datasetColumns])

    const handleDataLoaded = (data, cols) => {
        setColumns(cols)
        setHasData(true)
        setShowSuccessMessage(true) // Only show success message after fresh upload
        // Store columns in context for use in metric creation
        setDatasetColumns(cols)
    }

    const handleUserLogin = () => {
        navigate('/user')
    }

    const handleAdminLogin = () => {
        navigate('/admin')
    }

    return (
        <div className="home-page">
            <div className="home-header-box">
                <div className="home-header-content">
                    <h1>METRIC MANAGEMENT SYSTEM</h1>
                </div>
            </div>

            <div className="home-container">
                {!hasData ? (
                    <div className="upload-section-home fade-in" style={{ animationDelay: '0.1s' }}>
                        <h2>Upload Your Dataset</h2>
                        <p className="text-muted">Please upload a CSV dataset to get started</p>
                        <DatasetUpload
                            onDataLoaded={handleDataLoaded}
                            onColumnsSelected={() => { }}
                            selectedColumns={[]}
                        />
                    </div>
                ) : (
                    <div className="login-options fade-in" style={{ animationDelay: '0.1s' }}>
                        {showSuccessMessage && (
                            <div className="success-message-home">
                                <div className="success-icon">✅</div>
                                <h2>Dataset Uploaded Successfully!</h2>
                                <p>Your dataset has been loaded with {columns.length} columns. Please select your login type to continue.</p>
                            </div>
                        )}

                        <div className="login-cards">
                            <div className="login-card fade-in" style={{ animationDelay: '0.2s' }} onClick={handleUserLogin}>
                                <div className="login-icon">👤</div>
                                <h2>USER</h2>
                                <p>Create and manage metric contracts</p>
                                <button className="btn btn-primary btn-lg">
                                    LOGIN
                                </button>
                            </div>

                            <div className="login-card fade-in" style={{ animationDelay: '0.3s' }} onClick={handleAdminLogin}>
                                <div className="login-icon">⚙️</div>
                                <h2>ADMIN</h2>
                                <p>Review and approve metric contracts</p>
                                <button className="btn btn-primary btn-lg">
                                    LOGIN
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
