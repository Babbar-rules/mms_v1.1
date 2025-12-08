import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import OnboardDataProduct from './pages/OnboardDataProduct'
import UserDashboard from './pages/UserDashboard'
import AdminDashboard from './pages/AdminDashboard'
import CreateMetric from './pages/CreateMetric'
import EditMetric from './pages/EditMetric'
import MetricDetail from './pages/MetricDetail'

function App() {
    return (
        <Routes>
            <Route path="/" element={<OnboardDataProduct />} />
            <Route path="/login" element={<Home />} />
            <Route path="/user" element={<UserDashboard />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/create-metric" element={<CreateMetric />} />
            <Route path="/edit-metric" element={<EditMetric />} />
            <Route path="/metric/:id" element={<MetricDetail />} />
        </Routes>
    )
}

export default App
