import './LoanDisplay.css'
import { 
  Search, 
  Wallet, 
  CheckCircle2, 
  Clock, 
  XCircle, 
  HelpCircle,
  AlertTriangle,
  TrendingUp,
  FileText,
  CreditCard,
  Calendar,
  User
} from 'lucide-react'

function LoanDisplay({ data, onReset }) {
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Pending'
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getLoanStatusBadge = (status) => {
    switch (status) {
      case 'approved': return { text: 'Approved', class: 'approved', icon: <CheckCircle2 size={12} /> }
      case 'in_progress': return { text: 'In Progress', class: 'in-progress', icon: <Clock size={12} /> }
      case 'rejected': return { text: 'Rejected', class: 'rejected', icon: <XCircle size={12} /> }
      default: return { text: 'Unknown', class: 'unknown', icon: <HelpCircle size={12} /> }
    }
  }

  const totalExposure = data.loans.reduce((sum, loan) => sum + loan.amount, 0)
  const approvedLoans = data.loans.filter((loan) => loan.status === 'approved').length
  const inProgressLoans = data.loans.filter((loan) => loan.status === 'in_progress').length

  return (
    <div className="loan-display">
      <div className="loan-header">
        <div className="customer-info">
          <h2><User size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />Customer Loan Records</h2>
          <p className="customer-subtitle">Customer identification and financing summary</p>
          <div className="customer-details">
            <p><CreditCard size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /><strong>National ID:</strong> {data.customerInfo.nationalId}</p>
          </div>
        </div>
        <button className="reset-btn" onClick={onReset}>
          <Search size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />New Search
        </button>
      </div>

      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-header">
            <Wallet size={18} className="summary-icon" />
            <span className="summary-label">Total amount</span>
          </div>
          <strong>{formatCurrency(totalExposure)}</strong>
        </div>
        <div className="summary-card">
          <div className="summary-header">
            <CheckCircle2 size={18} className="summary-icon approved-icon" />
            <span className="summary-label">Approved</span>
          </div>
          <strong>{approvedLoans}</strong>
        </div>
        <div className="summary-card">
          <div className="summary-header">
            <Clock size={18} className="summary-icon progress-icon" />
            <span className="summary-label">In progress</span>
          </div>
          <strong>{inProgressLoans}</strong>
        </div>
      </div>

      <div className="loans-container">
        {data.loans.map((loan) => {
          const statusBadge = getLoanStatusBadge(loan.status)
          
          return (
            <div key={loan.id} className="loan-card">
              {/* Sidebar */}
              <div className="loan-sidebar">
                <div className="sidebar-section">
                  <span className="sidebar-label">Loan ID</span>
                  <span className="sidebar-value">{loan.id}</span>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.icon}{statusBadge.text}
                  </span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Facility Amount</span>
                  <span className="sidebar-value amount">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Start Date</span>
                  <span className="sidebar-value">{formatDate(loan.process.steps[0]?.date)}</span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Current Step</span>
                  <span className="sidebar-value" style={{ fontSize: '0.9rem', color: '#92400e' }}>
                    {loan.process.steps.find(s => s.status === 'in_progress')?.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase()) || 'Completed'}
                  </span>
                </div>
              </div>

              {/* Content Area */}
              <div className="loan-content">
                {/* Progress Bar */}
                <div className="progress-section">
                  <div className="progress-header">
                    <Clock size={14} /> Application Progress
                  </div>
                  <div className="progress-bar">
                    {loan.process.steps.map((step, index) => {
                      const isCompleted = step.status === 'completed'
                      const isCurrent = step.status === 'in_progress'
                      const stepNumber = index + 1
                      return (
                        <div key={step.name} className={`progress-step ${isCompleted ? 'completed' : ''}`}>
                          <div className={`step-indicator ${isCompleted ? 'completed' : isCurrent ? 'current' : 'pending'}`}>
                            {isCompleted ? '✓' : stepNumber}
                          </div>
                          <span className={`step-label ${isCompleted || isCurrent ? '' : 'pending'}`}>
                            {step.name.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </span>
                          <span className="step-date">{formatDate(step.date)}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Info Sections */}
                <div className="info-sections">
                  <div className="info-section">
                    <div className="info-section-header">
                      <AlertTriangle size={14} /> Issues
                    </div>
                    <div className="info-section-content">
                      {loan.painPoints.length > 0 ? (
                        <div className="points-list">
                          <ul>
                            {loan.painPoints.map((point, index) => (
                              <li key={index} className="pain-point">{point}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="no-points">No issues recorded</p>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <div className="info-section-header">
                      <TrendingUp size={14} /> Strengths
                    </div>
                    <div className="info-section-content">
                      {loan.strengthPoints.length > 0 ? (
                        <div className="points-list">
                          <ul>
                            {loan.strengthPoints.map((point, index) => (
                              <li key={index} className="strength-point">{point}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="no-points">No strengths recorded</p>
                      )}
                    </div>
                  </div>

                  <div className="info-section">
                    <div className="info-section-header">
                      <FileText size={14} /> Conditions
                    </div>
                    <div className="info-section-content">
                      {loan.conditions.length > 0 ? (
                        <div className="conditions-list">
                          <ul>
                            {loan.conditions.map((condition, index) => (
                              <li key={index} className="condition-item">{condition}</li>
                            ))}
                          </ul>
                        </div>
                      ) : (
                        <p className="no-conditions">No special conditions</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default LoanDisplay
