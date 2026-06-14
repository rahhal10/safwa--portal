import './LoanDisplay.css'
import logo from '../assets/logo.png'
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
  Layers,
  Printer
} from 'lucide-react'

function LoanDisplay({ data, onReset, lang }) {
  const t = {
    en: {
      title: 'Customer Guarantee Records',
      subtitle: 'Customer identification and financing summary',
      nationalId: 'National ID',
      totalAmount: 'Total amount',
      totalLoans: 'Total guarantees',
      newSearch: 'New Search',
      loanId: 'Guarantee ID',
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
      noConditions: 'No special conditions',
      exportPdf: 'Export PDF',
      guaranteeType: 'Guarantee Type'
    },
    ar: {
      title: 'سجلات تمويلات العميل',
      subtitle: 'معرف العميل وملخص التمويل',
      nationalId: 'الرقم الوطني',
      totalAmount: 'المبلغ الإجمالي',
      totalLoans: 'إجمالي التمويلات',
      newSearch: 'بحث جديد',
      loanId: 'رقم التمويل',
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
      noConditions: 'لا توجد شروط خاصة',
      exportPdf: 'تصدير PDF',
      guaranteeType: 'نوع التمويل'
    }
  }

  const handlePrint = async () => {
    // Embed logo as base64 so the new window can display it
    let logoDataUrl = ''
    try {
      const resp = await fetch(logo)
      const blob = await resp.blob()
      logoDataUrl = await new Promise((res) => {
        const reader = new FileReader()
        reader.onloadend = () => res(reader.result)
        reader.readAsDataURL(blob)
      })
    } catch (_) { /* logo optional */ }

    // Helpers used inside the HTML string
    const fmtNum = (n) => {
      if (!n && n !== 0) return 'لا يوجد'
      return new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 3 }).format(n)
    }
    const fmtDate = (d) => d || 'قيد الانتظار'

    // Table row: label | value | label | value
    const row = (l1, v1, l2 = '', v2 = '', hi1 = false, hi2 = false) =>
      `<tr>
        <td class="lbl">${l1}</td>
        <td class="val${hi1 ? ' hi' : ''}">${v1}</td>
        ${l2 !== '' ? `<td class="lbl">${l2}</td><td class="val${hi2 ? ' hi' : ''}">${v2}</td>` : '<td class="lbl"></td><td class="val"></td>'}
      </tr>`

    // Bordered section with a green header
    const section = (title, inner) =>
      `<div class="section">
        <div class="sec-title">${title}</div>
        ${inner}
      </div>`

    // Section with a bullet list
    const listSection = (title, items, emptyMsg = 'لا يوجد') =>
      `<div class="section">
        <div class="sec-title">${title}</div>
        <div class="list-body">
          ${items.length > 0
            ? items.map(i => `<div class="list-item">▪ ${i}</div>`).join('')
            : `<div class="list-item empty">${emptyMsg}</div>`}
        </div>
      </div>`

    const blocks = data.loans.map((loan, idx) => `
      <div class="guarantee-block">
        <div class="guarantee-title">ملخص تمويل رقم ${loan.id}</div>

        ${section('المعلومات الأساسية :', `<table>
          ${row('رقم التمويل', loan.id, 'رقم العميل', loan.custId)}
          ${row('نوع التمويل', loan.guaranteeType || '—', 'رمز المنتج', loan.productCode)}
          ${row('رمز التبويب', loan.tabCode, 'رمز القسم', loan.sectionCode)}
        </table>`)}

        ${section('معلومات التمويل :', `<table>
          ${row('سعر المنتج', fmtNum(loan.productPrice), 'مبلغ التمويل', fmtNum(loan.amountFunding))}
          ${row('قيمة الدفعة الأولى', fmtNum(loan.downpayment), 'نسبة الدفعة الأولى', loan.precDownpayment + '%', true, true)}
          ${row('نسبة الأرباح', loan.profitsBy + '%', 'قيمة الأرباح', fmtNum(loan.profits))}
          ${row('إجمالي المبلغ', fmtNum(loan.remainingAmount), 'مدة التمويل', loan.durationFunding + ' شهر')}
          ${row('إجمالي الأقساط', loan.totalInstallment, 'قيمة القسط الشهري', fmtNum(loan.installmentValue))}
          ${row('تاريخ القسط', fmtDate(loan.installmentDate), 'التأمين', loan.insurance ? fmtNum(loan.insurance) : 'لا يوجد')}
          ${row('عقد الصيانة', loan.maintenContract ? fmtNum(loan.maintenContract) : 'لا يوجد', '', '')}
        </table>`)}

        ${listSection('نقاط القوة :', loan.strengthPoints)}
        ${listSection('نقاط الضعف :', loan.painPoints)}
        ${listSection('ملاحظات CT2041 :', loan.ct2041)}
        ${listSection('الشروط الأخرى :', loan.conditions)}
      </div>
      ${idx < data.loans.length - 1 ? '<div class="page-break"></div>' : ''}
    `).join('')

    const html = `<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
<meta charset="UTF-8">
<title>سجل التمويلات - ${data.customerInfo.nationalId}</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body {
    font-family: 'Arial', 'Tahoma', sans-serif;
    font-size: 11.5px;
    color: #1a1a1a;
    direction: rtl;
    background: #fff;
    padding: 22px 32px;
  }
  /* ---- Page Header ---- */
  .page-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-bottom: 10px;
    border-bottom: 2.5px solid #2d7a45;
    margin-bottom: 14px;
  }
  .bank-name { font-size: 14px; font-weight: bold; color: #1f5c32; }
  .bank-name-en { font-size: 10px; color: #555; margin-top: 2px; }
  .logo-img { height: 54px; }
  /* ---- Customer header row ---- */
  .customer-row {
    display: flex;
    border: 1.5px solid #333;
    margin-bottom: 18px;
  }
  .customer-row .lbl {
    background: #eaf3ed;
    font-weight: bold;
    padding: 7px 14px;
    border-left: 1.5px solid #333;
    min-width: 140px;
    white-space: nowrap;
  }
  .customer-row .val {
    padding: 7px 14px;
    font-size: 12px;
    color: #1a3a6b;
    font-weight: bold;
  }
  /* ---- Guarantee block ---- */
  .guarantee-block { margin-bottom: 24px; }
  .guarantee-title {
    text-align: center;
    font-size: 13px;
    font-weight: bold;
    background: #f0f7f2;
    border: 1.5px solid #9ec9ad;
    padding: 8px;
    margin-bottom: 10px;
    color: #1a3d26;
    letter-spacing: 0.02em;
  }
  /* ---- Sections ---- */
  .section {
    border: 1.5px solid #b0bfb5;
    margin-bottom: 9px;
    page-break-inside: avoid;
  }
  .sec-title {
    background: #eaf3ed;
    padding: 6px 11px;
    font-weight: bold;
    font-size: 11.5px;
    border-bottom: 1px solid #b0bfb5;
    color: #1f3126;
  }
  /* ---- KV Table ---- */
  table { width: 100%; border-collapse: collapse; }
  td {
    padding: 5px 10px;
    border: 1px solid #cdd6d0;
    vertical-align: middle;
  }
  td.lbl {
    background: #f5f9f6;
    font-weight: bold;
    width: 17%;
    white-space: nowrap;
    color: #2a3d32;
    font-size: 10.5px;
    text-align: right;
  }
  td.val {
    width: 30%;
    color: #111;
    font-size: 11.5px;
    text-align: right;
  }
  td.val.hi { color: #b35c00; font-weight: bold; }
  /* ---- List sections ---- */
  .list-body { padding: 8px 16px; }
  .list-item {
    padding: 4px 4px;
    border-bottom: 1px dashed #d8e4da;
    font-size: 11.5px;
    color: #222;
  }
  .list-item:last-child { border-bottom: none; }
  .list-item.empty { color: #888; font-style: italic; }
  /* ---- Page break ---- */
  .page-break { border-top: 2px dashed #bbb; margin: 20px 0; }
  @media print {
    body { padding: 10px 18px; }
    .guarantee-block { page-break-inside: avoid; }
    .page-break { page-break-before: always; border: none; }
  }
</style>
</head>
<body>

  <div class="page-header">
    <div>
      <div class="bank-name">بنك صفوة الإسلامي</div>
      <div class="bank-name-en">Safwa Islamic Bank</div>
    </div>
    ${logoDataUrl ? `<img class="logo-img" src="${logoDataUrl}" alt="Safwa">` : ''}
  </div>

  <div class="customer-row">
    <div class="lbl">الرقم الوطني</div>
    <div class="val">${data.customerInfo.nationalId}</div>
  </div>

  ${blocks}

  <script>setTimeout(function(){ window.print(); }, 500);<\/script>
</body>
</html>`

    const win = window.open('', '_blank', 'width=960,height=750')
    if (win) {
      win.document.open()
      win.document.write(html)
      win.document.close()
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
        <button className="print-btn" onClick={handlePrint}>
          <Printer size={16} style={{ marginRight: '6px', verticalAlign: 'middle' }} />{t[lang].exportPdf}
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
              {loan.guaranteeType && (
                <div className="sidebar-section">
                  <span className="sidebar-label">{t[lang].guaranteeType}</span>
                  <span className="sidebar-value guarantee-type-badge">{loan.guaranteeType}</span>
                </div>
              )}
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
