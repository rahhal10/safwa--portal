import { useState } from 'react'
import logo from './assets/logo.png'
import CustomerForm from './components/CustomerForm'
import LoanDisplay from './components/LoanDisplay'
import './App.css'

function App() {
  const [loanData, setLoanData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  // Use Vite dev proxy to avoid CORS during development
  const API_URL = '/api/GET'

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
    const items = Array.isArray(apiJson?.data) ? apiJson.data : []
    const loans = items.map((item, index) => {
      const oc = String(item?.OTHER_CONDITIONS ?? '').trim()
      const hasNoOtherConds = /لا\s?يوجد/i.test(oc)
      const hasExceptions = Boolean(item?.EXCEPTIONS_POLICY || item?.EXCEPTIONS_POLICY_SPECIFY)
      const status = !hasExceptions && hasNoOtherConds ? 'approved' : 'in_progress'

      const baseSteps = ['application', 'document_verification', 'credit_check', 'initial_approval', 'final_approval']
      const installDate = item?.INSTALLMENT_DATE && item.INSTALLMENT_DATE !== '01/01/0001' ? item.INSTALLMENT_DATE : null
      const steps = status === 'approved'
        ? baseSteps.map((name, i) => ({ name, status: 'completed', date: i === baseSteps.length - 1 ? installDate : null }))
        : baseSteps.map((name, i) => (
            i < 2
              ? { name, status: 'completed', date: null }
              : i === 2
                ? { name, status: 'in_progress', date: null }
                : { name, status: 'pending', date: null }
          ))

      const ct2040Lines = splitLines(item?.CT2040)
      const otherCondLines = splitLines(item?.OTHER_CONDITIONS)
      const strengthFrom2040 = ct2040Lines.filter(l => /ايجاب|إيجاب|مواف|جيد|ممتاز/i.test(l))
      const conditions = [...ct2040Lines.filter(l => !/ايجاب|إيجاب|مواف|جيد|ممتاز/i.test(l)), ...otherCondLines]

      const painPoints = [
        ...splitLines(item?.CT2041),
        ...splitLines(item?.CT2043)
      ]
      const strengthPoints = [
        ...strengthFrom2040
      ]

      return {
        id: String(item?.APP_SEQ ?? index + 1),
        amount: toNumber(item?.AMOUNT_FUNDING ?? item?.TOTAL_AMOUNT ?? 0),
        totalAmount: toNumber(item?.TOTAL_AMOUNT ?? 0),
        remainingAmount: toNumber(item?.REMAINING_AMOUNT ?? 0),
        installmentValue: toNumber(item?.VALUE_INSTALLMENT ?? 0),
        installmentDate: item?.INSTALLMENT_DATE && item?.INSTALLMENT_DATE !== '01/01/0001' ? item.INSTALLMENT_DATE : null,
        durationFunding: toNumber(item?.DURATION_FUNDING ?? 0),
        totalInstallments: toNumber(item?.TOTAL_INSTALLMENT ?? 0),
        profitRate: toNumber(item?.PROFITS_BY ?? 0),
        profits: toNumber(item?.PROFITS ?? 0),
        downPayment: toNumber(item?.DOWNPAYMENT ?? 0),
        downPaymentPercent: toNumber(item?.PREC_DOWNPAYMENT ?? 0),
        productPrice: toNumber(item?.PRODUCT_PRICE ?? 0),
        status,
        process: { steps },
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
      if (json?.status !== 'success' || !Array.isArray(json?.data)) {
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
            <span className="topbar-status">Operational access</span>
            <span className="topbar-divider"></span>
            <span className="topbar-link">Retail finance</span>
          </div>
        </div>
      </header>

      <main className="app-main">
        <section className="workspace-header">
          <div className="workspace-title-block">
            <span className="workspace-label">Loan servicing</span>
            <h1>Customer loan records</h1>
          </div>
        </section>

        <section className="workspace-shell">
          {!loanData ? (
            <CustomerForm
              onSubmit={handleFormSubmit} 
              loading={loading}
              error={error}
            />
          ) : (
            <LoanDisplay
              data={loanData}
              onReset={handleReset}
            />
          )}
        </section>
      </main>
    </div>
  )
}

export default App
