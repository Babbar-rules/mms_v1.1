import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useMetrics } from '../context/MetricContext'
import DatasetUpload from '../components/DatasetUpload'
import './OnboardDataProduct.css'

const OnboardDataProduct = () => {
    const navigate = useNavigate()
    const { setDatasetColumns } = useMetrics()
    const [columns, setColumns] = useState([])
    const [hasData, setHasData] = useState(false)

    const handleDataLoaded = (data, cols) => {
        setColumns(cols)
        setHasData(true)
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
        <div className="onboard-page">
            <div className="onboard-header">
                <div className="header-content">
                    <div className="header-text">
                        <h1>Onboard Data Product</h1>
                    </div>
                </div>
            </div>

            {hasData && (
                <div className="header-subtext">
                    <span>Dataset Uploaded Successfully! Your dataset has been loaded with {columns.length} columns.</span>
                </div>
            )}

            <div className="onboard-container">
                {!hasData ? (
                    <div className="upload-section fade-in">
                        <DatasetUpload
                            onDataLoaded={handleDataLoaded}
                            onColumnsSelected={() => { }}
                            selectedColumns={[]}
                        />
                    </div>
                ) : (
                    <div className="login-options-section fade-in">
                        <div className="login-options">
                            <div className="login-card" onClick={handleUserLogin}>
                                <div className="login-icon">👤</div>
                                <h3>User Login</h3>
                                <p>Create and manage metric contracts</p>
                                <button className="btn btn-primary btn-lg">
                                    LOGIN
                                </button>
                            </div>

                            <div className="login-card" onClick={handleAdminLogin}>
                                <div className="login-icon">⚙️</div>
                                <h3>Admin Login</h3>
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

export default OnboardDataProduct
