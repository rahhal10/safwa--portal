import { useState } from 'react'

function CustomerForm({ onSubmit, loading, error, lang }) {
  const [formData, setFormData] = useState({
    nationalId: ''
  })
  const [validationErrors, setValidationErrors] = useState({})

  const t = {
    en: {
      title: 'Customer Information',
      subtitle: 'Enter customer identifiers to retrieve guarantee records.',
      nationalId: 'National ID Number',
      required: 'National ID is required',
      invalid: 'National ID must be 10-14 digits',
      placeholder: 'Enter national ID (10-14 digits)',
      search: 'Search Records',
      processing: 'Processing...'
    },
    ar: {
      title: 'معلومات العميل',
      subtitle: 'أدخل معرفات العميل لاسترداد سجلات التمويلات.',
      nationalId: 'الرقم الوطني',
      required: 'الرقم الوطني مطلوب',
      invalid: 'يجب أن يكون الرقم الوطني 10-14 رقم',
      placeholder: 'أدخل الرقم الوطني (10-14 رقم)',
      search: 'بحث السجلات',
      processing: 'جاري المعالجة...'
    }
  }

  const validateForm = () => {
    const errors = {}

    if (!formData.nationalId.trim()) {
      errors.nationalId = t[lang].required
    } else if (!/^\d{10,14}$/.test(formData.nationalId.replace(/\s/g, ''))) {
      errors.nationalId = t[lang].invalid
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
        <h2>{t[lang].title}</h2>
        <p>{t[lang].subtitle}</p>

        {error && (
          <div className="error-message">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="loan-form">
          <div className="form-group">
            <label htmlFor="nationalId">
              {t[lang].nationalId}
              <span className="required">*</span>
            </label>
            <input
              type="text"
              id="nationalId"
              name="nationalId"
              value={formData.nationalId}
              onChange={handleInputChange}
              placeholder={t[lang].placeholder}
              className={validationErrors.nationalId ? 'error' : ''}
              disabled={loading}
              maxLength="14"
              inputMode="numeric"
            />
            {validationErrors.nationalId && (
              <span className="error-text">{validationErrors.nationalId}</span>
            )}
          </div>

          <div className="form-actions">
            <button
              type="submit"
              className="submit-btn"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  {t[lang].processing}
                </>
              ) : (
                t[lang].search
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default CustomerForm
