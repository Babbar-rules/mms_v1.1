import { useState } from 'react'
import './InfoTooltip.css'

const InfoTooltip = ({ text }) => {
    const [isVisible, setIsVisible] = useState(false)

    return (
        <div className="info-tooltip-container">
            <span
                className="info-icon"
                onMouseEnter={() => setIsVisible(true)}
                onMouseLeave={() => setIsVisible(false)}
            >
                ℹ️
            </span>
            {isVisible && (
                <div className="tooltip-popup">
                    {text}
                </div>
            )}
        </div>
    )
}

export default InfoTooltip
