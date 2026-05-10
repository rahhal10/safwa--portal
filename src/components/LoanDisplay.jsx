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

function LoanDisplay({ data, onReset, lang }) {
  const t = {
    en: {
      title: 'Customer Loan Records',
      subtitle: 'Customer identification and financing summary',
      nationalId: 'National ID',
      totalAmount: 'Total amount',
      totalLoans: 'Total loans',
      newSearch: 'New Search',
      loanId: 'Loan ID',
      custId: 'Customer ID',
      totalAmountLabel: 'Total Amount',
      remainingAmount: 'Remaining Amount',
      downPayment: 'Down Payment',
      monthlyInstallment: 'Monthly Installment',
      installmentDate: 'Installment Date',
      fundingDuration: 'Funding Duration',
      months: 'months',
      totalInstallments: 'Total Installments',
      profitRate: 'Profit Rate',
      totalProfits: 'Total Profits',
      productPrice: 'Product Price',
      insurance: 'Insurance',
      maintenance: 'Maintenance',
      amountFunding: 'Amount Funding',
      downpaymentPercent: 'Downpayment %',
      productCode: 'Product Code',
      tabCode: 'Tab Code',
      sectionCode: 'Section Code',
      rowNum2: 'Row Num 2',
      rowNum3: 'Row Num 3',
      issues: 'Issues (CT2043)',
      strengths: 'Strengths (CT2040/42/44)',
      ct2041: 'CT2041 Notes',
      otherConditions: 'Other Conditions',
      noIssues: 'No issues recorded',
      noStrengths: 'No strengths recorded',
      noCt2041: 'No CT2041 notes',
      noConditions: 'No special conditions'
    },
    ar: {
      title: 'سجلات قروض العميل',
      subtitle: 'معرف العميل وملخص التمويل',
      nationalId: 'الرقم الوطني',
      totalAmount: 'المبلغ الإجمالي',
      totalLoans: 'إجمالي القروض',
      newSearch: 'بحث جديد',
      loanId: 'رقم القرض',
      custId: 'معرف العميل',
      totalAmountLabel: 'المبلغ الإجمالي',
      remainingAmount: 'المبلغ المتبقي',
      downPayment: 'الدفعة الأولى',
      monthlyInstallment: 'القسط الشهري',
      installmentDate: 'تاريخ القسط',
      fundingDuration: 'مدة التمويل',
      months: 'شهر',
      totalInstallments: 'إجمالي الأقساط',
      profitRate: 'نسبة الربح',
      totalProfits: 'إجمالي الأرباح',
      productPrice: 'سعر المنتج',
      insurance: 'التأمين',
      maintenance: 'الصيانة',
      amountFunding: 'مبلغ التمويل',
      downpaymentPercent: 'نسبة الدفعة الأولى',
      productCode: 'رقم المنتج',
      tabCode: 'رقم التبويب',
      sectionCode: 'رقم القسم',
      rowNum2: 'رقم الصف 2',
      rowNum3: 'رقم الصف 3',
      issues: 'نقاط الضعف (CT2043)',
      strengths: 'نقاط القوة (CT2040/42/44)',
      ct2041: 'ملاحظات CT2041',
      otherConditions: 'شروط أخرى',
      noIssues: 'لا توجد نقاط ضعف',
      noStrengths: 'لا توجد نقاط قوة',
      noCt2041: 'لا توجد ملاحظات CT2041',
      noConditions: 'لا توجد شروط خاصة'
    }
  }

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
  const totalLoansCount = data.loans.length

  return (
    <div className="loan-display">
      <div className="loan-header">
        <div className="customer-info">
          <h2><User size={20} style={{ marginRight: '8px', verticalAlign: 'middle' }} />{t[lang].title}</h2>
          <p className="customer-subtitle">{t[lang].subtitle}</p>
          <div className="customer-details">
            <p><CreditCard size={14} style={{ marginRight: '6px', verticalAlign: 'middle' }} /><strong>{t[lang].nationalId}:</strong> {data.customerInfo.nationalId}</p>
          </div>
        </div>
      </div>

      <div className="portfolio-summary">
        <div className="summary-card">
          <div className="summary-header">
            <Wallet size={18} className="summary-icon" />
            <span className="summary-label">{t[lang].totalAmount}</span>
          </div>
          <strong>{formatCurrency(totalExposure)}</strong>
        </div>
        <div className="summary-card">
          <div className="summary-header">
            <FileText size={18} className="summary-icon" />
            <span className="summary-label">{t[lang].totalLoans}</span>
          </div>
          <strong>{totalLoansCount}</strong>
        </div>
      </div>

      <div className="loan-actions">
        <button className="reset-btn" onClick={onReset}>
          <Search size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />{t[lang].newSearch}
        </button>
      </div>

      <div className="loans-container">
        {data.loans.map((loan) => (
          <div key={loan.id} className="loan-card">
            <div className="loan-sidebar">
              <div className="sidebar-section">
                <span className="sidebar-label">{t[lang].loanId}</span>
                <span className="sidebar-value">{loan.id}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">{t[lang].custId}</span>
                <span className="sidebar-value">{loan.custId}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">{t[lang].totalAmountLabel}</span>
                <span className="sidebar-value amount">{formatCurrency(loan.totalAmount)}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">{t[lang].remainingAmount}</span>
                <span className="sidebar-value">{formatCurrency(loan.remainingAmount)}</span>
              </div>
              <div className="sidebar-section">
                <span className="sidebar-label">{t[lang].downPayment}</span>
                <span className="sidebar-value">{formatCurrency(loan.downpayment)}</span>
              </div>
            </div>

            <div className="loan-content">
                <div className="financial-grid">
                <div className="financial-card">
                  <span className="financial-label"><Hash size={12} style={{marginRight: '4px'}}/>{t[lang].monthlyInstallment}</span>
                  <strong>{formatCurrency(loan.installmentValue)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].installmentDate}</span>
                  <strong>{formatDate(loan.installmentDate)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].fundingDuration}</span>
                  <strong>{loan.durationFunding} {t[lang].months}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].totalInstallments}</span>
                  <strong>{loan.totalInstallment}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Percent size={12} style={{marginRight: '4px'}}/>{t[lang].profitRate}</span>
                  <strong>{loan.profitsBy}%</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].totalProfits}</span>
                  <strong>{formatCurrency(loan.profits)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].productPrice}</span>
                  <strong>{formatCurrency(loan.productPrice)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Shield size={12} style={{marginRight: '4px'}}/>{t[lang].insurance}</span>
                  <strong>{formatCurrency(loan.insurance)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Wrench size={12} style={{marginRight: '4px'}}/>{t[lang].maintenance}</span>
                  <strong>{formatCurrency(loan.maintenContract)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><PiggyBank size={12} style={{marginRight: '4px'}}/>{t[lang].amountFunding}</span>
                  <strong>{formatCurrency(loan.amountFunding)}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Percent size={12} style={{marginRight: '4px'}}/>{t[lang].downpaymentPercent}</span>
                  <strong>{loan.precDownpayment}%</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label"><Layers size={12} style={{marginRight: '4px'}}/>{t[lang].productCode}</span>
                  <strong>{loan.productCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].tabCode}</span>
                  <strong>{loan.tabCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].sectionCode}</span>
                  <strong>{loan.sectionCode}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].rowNum2}</span>
                  <strong>{loan.rowNum2 || '-'}</strong>
                </div>
                <div className="financial-card">
                  <span className="financial-label">{t[lang].rowNum3}</span>
                  <strong>{loan.rowNum3 || '-'}</strong>
                </div>
              </div>

                <div className="info-sections">
                <div className="info-section">
                  <div className="info-section-header">
                    <AlertTriangle size={14} /> {t[lang].issues}
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
                      <p className="no-points">{t[lang].noIssues}</p>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <div className="info-section-header">
                    <TrendingUp size={14} /> {t[lang].strengths}
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
                      <p className="no-points">{t[lang].noStrengths}</p>
                    )}
                  </div>
                </div>

                <div className="info-section">
                  <div className="info-section-header">
                    <FileText size={14} /> {t[lang].ct2041}
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
                      <p className="no-points">{t[lang].noCt2041}</p>
                    )}
                  </div>
                </div>

                <div className="info-section info-section-full">
                  <div className="info-section-header">
                    <DollarSign size={14} /> {t[lang].otherConditions}
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
                      <p className="no-conditions">{t[lang].noConditions}</p>
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
