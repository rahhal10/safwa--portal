import './LoanDisplay.css'
import {
  Search,
  Wallet,
  AlertTriangle,
  TrendingUp,
  FileText,
  CreditCard,
  User,
  Shield,
  Wrench,
  Percent,
  PiggyBank,
  DollarSign,
  Hash,
  Layers
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

  const totalExposure = data.loans.reduce((sum, loan) => sum + (loan.totalAmount || 0), 0)
  const totalLoans = data.loans.length

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
            <FileText size={18} className="summary-icon" />
            <span className="summary-label">Total loans</span>
          </div>
          <strong>{totalLoans}</strong>
        </div>
      </div>

      <div className="loan-actions">
        <button className="reset-btn" onClick={onReset}>
          <Search size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />New Search
        </button>
      </div>

      <div className="loans-container">
        {data.loans.map((loan) => (
          <div key={loan.id} className="loan-card">
            <div className="loan-sidebar">
              <div className="sidebar-section">
                <span className="sidebar-label">Loan ID</span>
                <span className="sidebar-value">{loan.id}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">Customer ID</span>
                <span className="sidebar-value">{loan.custId}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">Total Amount</span>
                <span className="sidebar-value amount">{formatCurrency(loan.totalAmount)}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">Remaining Amount</span>
                <span className="sidebar-value">{formatCurrency(loan.remainingAmount)}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">Down Payment</span>
                <span className="sidebar-value">{formatCurrency(loan.downpayment)}</span>
              </div>
            </div>

            <div className="loan-content">
              <div className="financial-grid">
                <div className="financial-card">
                  <span className="financial-label"><Hash size={12} style={{marginRight: '4px'}}/>Monthly Installment</span>
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
                  <strong>{loan.totalInstallment}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Percent size={12} style={{marginRight: '4px'}}/>Profit Rate</span>
                  <strong>{loan.profitsBy}%</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Total Profits</span>
                  <strong>{formatCurrency(loan.profits)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Product Price</span>
                  <strong>{formatCurrency(loan.productPrice)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Shield size={12} style={{marginRight: '4px'}}/>Insurance</span>
                  <strong>{formatCurrency(loan.insurance)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Wrench size={12} style={{marginRight: '4px'}}/>Maintenance</span>
                  <strong>{formatCurrency(loan.maintenContract)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><PiggyBank size={12} style={{marginRight: '4px'}}/>Amount Funding</span>
                  <strong>{formatCurrency(loan.amountFunding)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Percent size={12} style={{marginRight: '4px'}}/>Downpayment %</span>
                  <strong>{loan.precDownpayment}%</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Layers size={12} style={{marginRight: '4px'}}/>Product Code</span>
                  <strong>{loan.productCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Tab Code</span>
                  <strong>{loan.tabCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Section Code</span>
                  <strong>{loan.sectionCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Row Num 2</span>
                  <strong>{loan.rowNum2 || '-'}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">Row Num 3</span>
                  <strong>{loan.rowNum3 || '-'}</strong>
                </div>
              </div>

              <div className="info-sections">
                <div className="info-section">
                  <div className="info-section-header">
                    <AlertTriangle size={14} /> Issues (CT2043)
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
                    <TrendingUp size={14} /> Strengths (CT2040/42/44)
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
                    <FileText size={14} /> CT2041 Notes
                  </div>
                  <div className="info-section-content">
                    {loan.ct2041.length > 0 ? (
                      <div className="points-list">
                        <ul>
                          {loan.ct2041.map((point, index) => (
                            <li key={index} className="condition-item">{point}</li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <p className="no-points">No CT2041 notes</p>
                    )}
                  </div>
                </div>

                <div className="info-section info-section-full">
                  <div className="info-section-header">
                    <DollarSign size={14} /> Other Conditions
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
        ))}
      </div>
    </div>
  )
}

export default LoanDisplay
