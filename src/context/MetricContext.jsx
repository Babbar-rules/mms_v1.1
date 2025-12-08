import { createContext, useContext, useState, useEffect } from 'react'

const MetricContext = createContext()

export const useMetrics = () => {
    const context = useContext(MetricContext)
    if (!context) {
        throw new Error('useMetrics must be used within a MetricProvider')
    }
    return context
}

export const MetricProvider = ({ children }) => {
    const [metrics, setMetrics] = useState([])
    const [pendingMetrics, setPendingMetrics] = useState([])
    const [approvedMetrics, setApprovedMetrics] = useState([])
    const [datasetColumns, setDatasetColumns] = useState([])

    // Load from localStorage on mount
    useEffect(() => {
        const savedPending = localStorage.getItem('pendingMetrics')
        const savedApproved = localStorage.getItem('approvedMetrics')

        if (savedPending) {
            setPendingMetrics(JSON.parse(savedPending))
        }
        if (savedApproved) {
            setApprovedMetrics(JSON.parse(savedApproved))
        }
    }, [])

    // Save to localStorage whenever metrics change
    useEffect(() => {
        localStorage.setItem('pendingMetrics', JSON.stringify(pendingMetrics))
    }, [pendingMetrics])

    useEffect(() => {
        localStorage.setItem('approvedMetrics', JSON.stringify(approvedMetrics))
    }, [approvedMetrics])

    const createMetric = (metricData) => {
        const newMetric = {
            ...metricData,
            id: Date.now().toString(),
            createdAt: new Date().toISOString(),
            status: 'Pending',
            version: 1  // Auto-set initial version to 1
        }
        setPendingMetrics(prev => [...prev, newMetric])
        return newMetric
    }

    const approveMetric = (metricId, adminName) => {
        const metric = pendingMetrics.find(m => m.id === metricId)
        if (metric) {
            const approvedMetric = {
                ...metric,
                status: 'Approved',
                approvedBy: adminName,
                approvedAt: new Date().toISOString()
            }
            setApprovedMetrics(prev => [...prev, approvedMetric])
            setPendingMetrics(prev => prev.filter(m => m.id !== metricId))
            return approvedMetric
        }
    }

    const getMetricById = (id) => {
        return [...pendingMetrics, ...approvedMetrics].find(m => m.id === id)
    }

    const updateMetric = (metricId, updatedData) => {
        const metric = getMetricById(metricId)
        if (metric) {
            const updatedMetric = {
                ...metric,
                ...updatedData,
                version: (metric.version || 1) + 1,  // Auto-increment version
                updatedAt: new Date().toISOString()
            }

            // Update in the appropriate list
            if (pendingMetrics.some(m => m.id === metricId)) {
                setPendingMetrics(prev => prev.map(m => m.id === metricId ? updatedMetric : m))
            } else if (approvedMetrics.some(m => m.id === metricId)) {
                setApprovedMetrics(prev => prev.map(m => m.id === metricId ? updatedMetric : m))
            }

            return updatedMetric
        }
    }

    const getDatasetColumns = () => datasetColumns

    const value = {
        metrics,
        pendingMetrics,
        approvedMetrics,
        createMetric,
        approveMetric,
        getMetricById,
        updateMetric,
        datasetColumns,
        setDatasetColumns,
        getDatasetColumns
    }

    return (
        <MetricContext.Provider value={value}>
            {children}
        </MetricContext.Provider>
    )
}
