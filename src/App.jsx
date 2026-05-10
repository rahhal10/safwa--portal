import { useState } from 'react'
import logo from './assets/logo.png'
import CustomerForm from './components/CustomerForm'
import LoanDisplay from './components/LoanDisplay'
import './App.css'

function App() {
  const [loanData, setLoanData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lang, setLang] = useState('en')

  const API_URL = '/api/getWFApproval'

  const toNumber = (v) => {
    const n = parseFloat(String(v ?? '').replace(/[^\d.-]/g, ''))
    return Number.isNaN(n) ? 0 : n
  }

  const splitLines = (s) => String(s ?? '')
    .replace(/\r/g, '')
    .split(/\n+/)
    .map(t => t.trim())
    .filter(t => t && t !== '.' && !/لا\s?يوجد/i.test(t))

  const transformApiResponseToLoanData = (apiJson, formData) => {
    const items = Array.isArray(apiJson?.Approvals?.Approval) ? apiJson.Approvals.Approval : []
    const loans = items.map((item) => {
      const ct2040Lines = splitLines(item?.CT2040)
      const ct2041Lines = splitLines(item?.CT2041)
      const ct2042Lines = splitLines(item?.CT2042)
      const ct2043Lines = splitLines(item?.CT2043)
      const ct2044Lines = splitLines(item?.CT2044)
      const otherCondLines = splitLines(item?.OTHER_CONDITIONS)
      const strengthPoints = [
        ...ct2040Lines,
        ...ct2042Lines,
        ...ct2044Lines
      ]
      const painPoints = [
        ...ct2043Lines
      ]
      const conditions = otherCondLines

      return {
        id: String(item?.APP_SEQ),
        installmentDate: item?.INSTALLMENT_DATE && item?.INSTALLMENT_DATE !== '01/01/0001' ? item.INSTALLMENT_DATE : null,
        totalAmount: toNumber(item?.TOTAL_AMOUNT),
        otherConditions: item?.OTHER_CONDITIONS,
        installmentValue: toNumber(item?.VALUE_INSTALLMENT),
        productPrice: toNumber(item?.PRODUCT_PRICE),
        custId: item?.CUST_ID,
        productCode: item?.PRODUCT_CODE,
        tabCode: item?.TAB_CODE,
        sectionCode: item?.SECTION_CODE,
        durationFunding: toNumber(item?.DURATION_FUNDING),
        totalInstallment: toNumber(item?.TOTAL_INSTALLMENT),
        profitsBy: toNumber(item?.PROFITS_BY),
        remainingAmount: toNumber(item?.REMAINING_AMOUNT),
        downpayment: toNumber(item?.DOWNPAYMENT),
        rowNum2: item?.ROW_NUM2,
        rowNum3: item?.ROW_NUM3,
        insurance: toNumber(item?.INSURANCE),
        maintenContract: toNumber(item?.MAINTEN_CONTRACT),
        profits: toNumber(item?.PROFITS),
        precDownpayment: toNumber(item?.PREC_DOWNPAYMENT),
        amountFunding: toNumber(item?.AMOUNT_FUNDING),
        ct2041: ct2041Lines,
        painPoints,
        strengthPoints,
        conditions
      }
    })

    return {
      customerInfo: {
        nationalId: formData.nationalId
      },
      loans
    }
  }

  const handleFormSubmit = async (formData) => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({ national_num: formData.nationalId })
      })
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }
      const json = await res.json()
      if (!Array.isArray(json?.Approvals?.Approval)) {
        throw new Error('Unexpected API response')
      }
      const mapped = transformApiResponseToLoanData(json, formData)
      if (!mapped.loans.length) {
        setError('No records found for this National ID')
        setLoanData(null)
        return
      }
      setLoanData(mapped)
    } catch (err) {
      setError('Failed to fetch loan data. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleReset = () => {
    setLoanData(null)
    setError(null)
  }

  const toggleLang = () => setLang(prev => prev === 'en' ? 'ar' : 'en')

  return (
    <div className="app">
      <header className="portal-topbar">
        <div className="portal-topbar-inner">
          <div className="brand-lockup">
            <img src={logo} alt="Safwa Islamic Bank" className="brand-logo" />
            <div className="brand-text">
              <span className="brand-name">Loan Portal</span>
              <span className="brand-subtitle">Internal operations workspace</span>
            </div>
          </div>
          <div className="topbar-meta">
            <button className="lang-toggle" onClick={toggleLang}>
              {lang === 'en' ? 'العربية' : 'English'}
            </button>
            <span className="topbar-divider"></span>
            <span className="topbar-status">Operational access</span>
            <span className="topbar-divider"></span>
            <span className="topbar-link">Retail finance</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="workspace-header">
          <div className="workspace-title-block">
            <span className="workspace-label">{lang === 'en' ? 'Loan servicing' : 'خدمة القروض'}</span>
            <h1>{lang === 'en' ? 'Customer loan records' : 'سجلات قروض العملاء'}</h1>
          </div>
        </section>

        <section className="workspace-shell">
          {!loanData ? (
            <CustomerForm
              onSubmit={handleFormSubmit}
              loading={loading}
              error={error}
              lang={lang}
            />
          ) : (
            <LoanDisplay
              data={loanData}
              onReset={handleReset}
              lang={lang}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
