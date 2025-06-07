import React from 'react'
import './Toggle.css'

const Toggle = ({handleChange, isChecked}) => {
  return (
    <div className="toggle-container">
      <input 
        type="checkbox" 
        className="toggle" 
        id="theme-toggle"
        onChange={handleChange} 
        checked={isChecked}
      />
      <label htmlFor="theme-toggle" className="toggle-label">
        <span className="toggle-icon">
          {isChecked ? '☀️' : '🌙'}
        </span>
      </label>
    </div>
  )
}

export default Toggle
