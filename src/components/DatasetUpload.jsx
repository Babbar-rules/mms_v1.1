import { useState } from 'react'
import Papa from 'papaparse'
import './DatasetUpload.css'

const DatasetUpload = ({ onDataLoaded, onColumnsSelected, selectedColumns = [] }) => {
    const [data, setData] = useState(null)
    const [columns, setColumns] = useState([])
    const [dragActive, setDragActive] = useState(false)

    const handleFile = (file) => {
        if (file && file.type === 'text/csv') {
            Papa.parse(file, {
                header: true,
                preview: 10, // Only show first 10 rows
                complete: (results) => {
                    setData(results.data)
                    setColumns(results.meta.fields || [])
                    if (onDataLoaded) {
                        onDataLoaded(results.data, results.meta.fields)
                    }
                },
                error: (error) => {
                    alert('Error parsing CSV: ' + error.message)
                }
            })
        } else {
            alert('Please upload a CSV file')
        }
    }

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0])
        }
    }

    const handleChange = (e) => {
        e.preventDefault()
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0])
        }
    }

    const toggleColumn = (column) => {
        const newSelected = selectedColumns.includes(column)
            ? selectedColumns.filter(c => c !== column)
            : [...selectedColumns, column]

        if (onColumnsSelected) {
            onColumnsSelected(newSelected)
        }
    }

    return (
        <div className="dataset-upload">
            <div
                className={`upload-area ${dragActive ? 'drag-active' : ''} ${data ? 'has-data' : ''}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="file-upload"
                    accept=".csv"
                    onChange={handleChange}
                    style={{ display: 'none' }}
                />
                <label htmlFor="file-upload" className="upload-label">
                    <div className="upload-icon">📊</div>
                    <h4>Upload Dataset</h4>
                    <p>Drag and drop a CSV file here, or click to browse</p>
                </label>
            </div>

            {data && columns.length > 0 && (
                <div className="data-preview">
                    <div className="preview-header">
                        <h4>Dataset Preview</h4>
                        <p className="text-muted">Select columns to designate as metrics</p>
                    </div>

                    <div className="column-selector">
                        {columns.map((column) => (
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

                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    {columns.map((column) => (
                                        <th key={column}>
                                            {column}
                                            {selectedColumns.includes(column) && (
                                                <span className="badge badge-primary ml-2">Metric</span>
                                            )}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {data.slice(0, 5).map((row, idx) => (
                                    <tr key={idx}>
                                        {columns.map((column) => (
                                            <td key={column}>{row[column]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    )
}

export default DatasetUpload
