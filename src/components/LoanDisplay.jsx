import './LoanDisplay.css'
import { 
  Search, 
  Wallet, 
  CheckCircle2, 
  AlertTriangle,
  TrendingUp,
  FileText,
  CreditCard,
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
    const date = new Date(dateString)
    if (Number.isNaN(date.getTime())) return dateString
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const formatPercent = (value) => `${value}%`

  const getLoanStatusBadge = (status) => {
    switch (status) {
      case 'approved': return { text: 'Accepted', class: 'approved', icon: <CheckCircle2 size={12} /> }
      default: return { text: 'Accepted', class: 'approved', icon: <CheckCircle2 size={12} /> }
    }
  }

  const totalExposure = data.loans.reduce((sum, loan) => sum + (loan.totalAmount || loan.amount), 0)
  const approvedLoans = data.loans.filter((loan) => loan.status === 'approved').length

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
            <span className="summary-label">Accepted</span>
          </div>
          <strong>{approvedLoans}</strong>
        </div>
      </div>

      <div className="loan-actions">
        <button className="reset-btn" onClick={onReset}>
          <Search size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />New Search
        </button>
      </div>

      <div className="loans-container">
        {data.loans.map((loan) => {
          const statusBadge = getLoanStatusBadge(loan.status)
          
          return (
            <div key={loan.id} className="loan-card">
              <div className="loan-sidebar">
                <div className="sidebar-section">
                  <span className="sidebar-label">Loan ID</span>
                  <span className="sidebar-value">{loan.id}</span>
                  <span className={`status-badge ${statusBadge.class}`}>
                    {statusBadge.icon}{statusBadge.text}
                  </span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Funding Amount</span>
                  <span className="sidebar-value amount">{formatCurrency(loan.amount)}</span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Total Amount</span>
                  <span className="sidebar-value">{formatCurrency(loan.totalAmount)}</span>
                </div>
                <div className="sidebar-section">
                  <span className="sidebar-label">Remaining Amount</span>
                  <span className="sidebar-value">{formatCurrency(loan.remainingAmount)}</span>
                </div>
              </div>

              <div className="loan-content">
                <div className="financial-grid">
                  <div className="financial-card">
                    <span className="financial-label">Monthly Installment</span>
                    <strong>{formatCurrency(loan.installmentValue)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Installment Date</span>
                    <strong>{formatDate(loan.installmentDate)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Funding Duration</span>
                    <strong>{loan.durationFunding} months</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Total Installments</span>
                    <strong>{loan.totalInstallments}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Profit Rate</span>
                    <strong>{formatPercent(loan.profitRate)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Profit Value</span>
                    <strong>{formatCurrency(loan.profits)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Down Payment</span>
                    <strong>{formatCurrency(loan.downPayment)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Down Payment %</span>
                    <strong>{formatPercent(loan.downPaymentPercent)}</strong>
                  </div>
                  <div className="financial-card">
                    <span className="financial-label">Product Price</span>
                    <strong>{formatCurrency(loan.productPrice)}</strong>
                  </div>
                </div>

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
