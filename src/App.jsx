import { useState } from 'react'
import logo from './assets/logo.png'
import CustomerForm from './components/CustomerForm'
import LoanDisplay from './components/LoanDisplay'
import './App.css'

function App() {
  const [loanData, setLoanData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

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
    const items = Array.isArray(apiJson?.data) ? apiJson.data : []
    const loans = items.map((item) => {
      const ct2040Lines = splitLines(item?.ct2040)
      const ct2042Lines = splitLines(item?.ct2042)
      const ct2043Lines = splitLines(item?.ct2043)
      const ct2044Lines = splitLines(item?.ct2044)
      const otherCondLines = splitLines(item?.other_conditions)
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
        id: String(item?.app_seq),
        installmentDate: item?.installment_date && item?.installment_date !== '01/01/0001' ? item.installment_date : null,
        totalAmount: toNumber(item?.total_amount),
        otherConditions: item?.other_conditions,
        installmentValue: toNumber(item?.value_installment),
        productPrice: toNumber(item?.product_price),
        custId: item?.cust_id,
        productCode: item?.product_code,
        tabCode: item?.tab_code,
        sectionCode: item?.section_code,
        durationFunding: toNumber(item?.duration_funding),
        totalInstallment: toNumber(item?.total_installment),
        profitsBy: toNumber(item?.profits_by),
        remainingAmount: toNumber(item?.remaining_amount),
        downpayment: toNumber(item?.downpayment),
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
      if (!Array.isArray(json?.data)) {
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
