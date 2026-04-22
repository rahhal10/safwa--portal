import { useState } from 'react'

function CustomerForm({ onSubmit, loading, error }) {
  const [formData, setFormData] = useState({
    nationalId: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  const validateForm = () => {
    const errors = {}

    if (!formData.nationalId.trim()) {
      errors.nationalId = 'National ID is required'
    } else if (!/^\d{10,14}$/.test(formData.nationalId.replace(/\s/g, ''))) {
      errors.nationalId = 'National ID must be 10-14 digits'
    }

    setValidationErrors(errors)
    return Object.keys(errors).length === 0
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    const formattedValue = value.replace(/\D/g, '')
    setFormData(prev => ({
      ...prev,
      [name]: formattedValue
    }))
    if (validationErrors[name]) {
      setValidationErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (validateForm()) {
      onSubmit({ nationalId: formData.nationalId })
    }
  }

  return (
    <div className="customer-form">
      <div className="form-card">
        <h2>Customer Information</h2>
        <p>Enter customer identifiers to retrieve loan records.</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label htmlFor="nationalId">
              National ID Number
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder="Enter national ID (10-14 digits)"
              className={validationErrors.nationalId ? 'error' : ''}
              disabled={loading}
              maxLength="14"
              inputMode="numeric"
            />
            {validationErrors.nationalId && (
              <span className="error-text">{validationErrors.nationalId}</span>
            )}
          </div>

          <button 
            type="submit" 
            className="submit-btn"
            disabled={loading}
          >
            {loading ? (
              <>
                <span className="spinner"></span>
                Processing...
              </>
            ) : (
              'Search Records'
            )}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm
