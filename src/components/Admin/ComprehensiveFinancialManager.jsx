import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useNotification } from '../Shared/NotificationSystem'
import { Modal } from '../Shared/Modal'
import { LoadingButton } from '../Shared/LoadingButton'
import { PageLoader } from '../Shared/LoadingSpinner'
import { CustomDropdown } from '../Shared/CustomDropdown'
import { Calculator } from '../Shared/Calculator'
import { SmartNumberInput } from '../Shared/SmartNumberInput'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver'
import { 
  FiPlus, 
  FiDollarSign, 
  FiTrendingUp, 
  FiTrendingDown,
  FiCalendar,
  FiEdit,
  FiTrash2,
  FiBarChart,
  FiPieChart,
  FiDownload,
  FiGrid,
  FiSearch,
  FiFilter,
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiFlag,
  FiEye,
  FiEyeOff,
  FiMaximize2,
  FiMinimize2,
  FiRefreshCw,
  FiFileText,
  FiMail,
  FiLock
} from 'react-icons/fi'

export const ComprehensiveFinancialManager = () => {
  const [expenses, setExpenses] = useState([])
  const [income, setIncome] = useState([])
  const [showExpenseModal, setShowExpenseModal] = useState(false)
  const [showIncomeModal, setShowIncomeModal] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const [calculatorTarget, setCalculatorTarget] = useState(null)
  const [loading, setLoading] = useState(true)
  const [addingExpense, setAddingExpense] = useState(false)
  const [addingIncome, setAddingIncome] = useState(false)
  const [selectedPeriod, setSelectedPeriod] = useState('month')
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [showAdvancedTools, setShowAdvancedTools] = useState(false)
  const [compactView, setCompactView] = useState(false)
  const [showPasscodeModal, setShowPasscodeModal] = useState(false)
  const [passcode, setPasscode] = useState('')
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [showOverview, setShowOverview] = useState(false) // Collapsed by default on mobile

  // Multi-record forms
  const [expenseRecords, setExpenseRecords] = useState([{
    description: '',
    amount: '',
    category: 'Feed',
    store_name: '',
    date: new Date().toISOString().split('T')[0],
    status: 'cleared'
  }])
  
  const [incomeRecords, setIncomeRecords] = useState([{
    description: '',
    amount: '',
    source: 'Egg Sales',
    date: new Date().toISOString().split('T')[0],
    status: 'cleared'
  }])

  const { showSuccess, showError, showWarning } = useNotification()

  const expenseCategories = [
    'Feed', 'Medication', 'Equipment', 'Labor', 'Utilities', 
    'Transportation', 'Maintenance', 'Supplies', 'Other'
  ]

  const incomeSources = [
    'Egg Sales', 'Chicken Sales', 'Chick Sales', 'Equipment Sales', 'Other'
  ]

  const statusOptions = ['cleared', 'pending', 'flagged']

  useEffect(() => {
    // Check if user is super admin
    checkSuperAdminAccess()
  }, [])

  useEffect(() => {
    if (isAuthorized) {
      fetchFinancialData()
    }
  }, [selectedPeriod, isAuthorized])

  const checkSuperAdminAccess = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const { data: adminRole } = await supabase
          .from('admin_roles')
          .select('role')
          .eq('user_id', user.id)
          .single()
        
        if (adminRole?.role === 'super_admin') {
          setIsAuthorized(true)
        } else {
          setShowPasscodeModal(true)
        }
      }
    } catch (error) {
      console.error('Error checking admin access:', error)
      setShowPasscodeModal(true)
    }
  }

  const handlePasscodeSubmit = () => {
    // Simple passcode check - in production, this should be more secure
    if (passcode === 'FINANCE2024') {
      setIsAuthorized(true)
      setShowPasscodeModal(false)
      showSuccess('Access granted to Financial Management System')
    } else {
      showError('Invalid passcode. Access denied.')
      setPasscode('')
    }
  }

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      const startDate = getStartDate(selectedPeriod)
      
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (expenseError) throw expenseError

      const { data: incomeData, error: incomeError } = await supabase
        .from('income')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (incomeError) throw incomeError

      setExpenses(expenseData || [])
      setIncome(incomeData || [])
    } catch (error) {
      console.error('Error fetching financial data:', error)
      showError('Failed to load financial data')
    }
    setLoading(false)
  }

  const getStartDate = (period) => {
    const now = new Date()
    switch (period) {
      case 'week':
        const weekStart = new Date(now.setDate(now.getDate() - now.getDay()))
        return weekStart.toISOString().split('T')[0]
      case 'month':
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
      case 'year':
        return new Date(now.getFullYear(), 0, 1).toISOString().split('T')[0]
      default:
        return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0]
    }
  }

  const exportToPDF = () => {
    try {
      const doc = new jsPDF()
      const { totalExpenses, totalIncome, profit, profitMargin } = calculateTotals()
      
      // Use 'N' instead of ₦ symbol to avoid encoding issues
      const currency = 'NGN'
      
      // HEADER SECTION
      doc.setFontSize(22)
      doc.setFont('helvetica', 'bold')
      doc.text('BLESSING POULTRIES', 105, 25, { align: 'center' })
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.text('Financial Performance Report', 105, 35, { align: 'center' })
      
      doc.setFontSize(10)
      doc.text(`Report Period: ${selectedPeriod.toUpperCase()}`, 105, 45, { align: 'center' })
      doc.text(`Generated: ${new Date().toLocaleDateString('en-GB')} at ${new Date().toLocaleTimeString()}`, 105, 52, { align: 'center' })
      
      // Draw header line
      doc.setLineWidth(0.5)
      doc.line(20, 58, 190, 58)
      
      // EXECUTIVE SUMMARY BOX
      doc.setFillColor(245, 245, 245)
      doc.rect(20, 65, 170, 45, 'F')
      doc.setLineWidth(0.3)
      doc.rect(20, 65, 170, 45)
      
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('EXECUTIVE SUMMARY', 25, 75)
      
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      // Financial metrics in organized layout
      doc.text('Total Revenue:', 25, 85)
      doc.text(`${currency} ${totalIncome.toLocaleString()}`, 80, 85)
      
      doc.text('Total Expenses:', 25, 92)
      doc.text(`${currency} ${totalExpenses.toLocaleString()}`, 80, 92)
      
      doc.text('Net Profit:', 25, 99)
      doc.setFont('helvetica', 'bold')
      doc.text(`${currency} ${profit.toLocaleString()}`, 80, 99)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Profit Margin:', 120, 85)
      doc.text(`${profitMargin.toFixed(1)}%`, 160, 85)
      
      doc.text('Total Transactions:', 120, 92)
      doc.text(`${expenses.length + income.length}`, 160, 92)
      
      // Performance indicator
      doc.text('Performance:', 120, 99)
      doc.setFont('helvetica', 'bold')
      doc.text(profit >= 0 ? 'PROFITABLE' : 'LOSS', 160, 99)
      
      let yPos = 125
      
      // FINANCIAL ANALYSIS SECTION
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('FINANCIAL ANALYSIS', 20, yPos)
      yPos += 10
      
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(10)
      
      // Key insights
      const insights = []
      if (profit > 0) {
        insights.push(`• Business generated ${currency} ${profit.toLocaleString()} in net profit`)
        insights.push(`• Profit margin of ${profitMargin.toFixed(1)}% indicates ${profitMargin > 20 ? 'excellent' : profitMargin > 10 ? 'good' : 'moderate'} profitability`)
      } else {
        insights.push(`• Business recorded a loss of ${currency} ${Math.abs(profit).toLocaleString()}`)
        insights.push('• Immediate cost reduction and revenue enhancement required')
      }
      
      // Expense breakdown
      const expensesByCategory = {}
      expenses.forEach(exp => {
        expensesByCategory[exp.category] = (expensesByCategory[exp.category] || 0) + parseFloat(exp.amount)
      })
      
      const topExpenseCategory = Object.entries(expensesByCategory)
        .sort(([,a], [,b]) => b - a)[0]
      
      if (topExpenseCategory) {
        const [category, amount] = topExpenseCategory
        const percentage = ((amount / totalExpenses) * 100).toFixed(1)
        insights.push(`• Highest expense category: ${category} (${percentage}% of total expenses)`)
      }
      
      // Revenue analysis
      const incomeBySource = {}
      income.forEach(inc => {
        incomeBySource[inc.source] = (incomeBySource[inc.source] || 0) + parseFloat(inc.amount)
      })
      
      const topIncomeSource = Object.entries(incomeBySource)
        .sort(([,a], [,b]) => b - a)[0]
      
      if (topIncomeSource) {
        const [source, amount] = topIncomeSource
        const percentage = ((amount / totalIncome) * 100).toFixed(1)
        insights.push(`• Primary revenue source: ${source} (${percentage}% of total income)`)
      }
      
      insights.forEach(insight => {
        doc.text(insight, 20, yPos)
        yPos += 6
      })
      
      yPos += 10
      
      // EXPENSE BREAKDOWN
      if (expenses.length > 0) {
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('EXPENSE BREAKDOWN', 20, yPos)
        yPos += 8
        
        // Category summary
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        Object.entries(expensesByCategory)
          .sort(([,a], [,b]) => b - a)
          .forEach(([category, amount]) => {
            const percentage = ((amount / totalExpenses) * 100).toFixed(1)
            doc.text(`${category}:`, 25, yPos)
            doc.text(`${currency} ${amount.toLocaleString()} (${percentage}%)`, 80, yPos)
            yPos += 5
          })
        
        yPos += 5
        
        // Detailed expense table
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('Date', 20, yPos)
        doc.text('Description', 45, yPos)
        doc.text('Category', 110, yPos)
        doc.text('Amount', 150, yPos)
        doc.text('Status', 175, yPos)
        yPos += 3
        
        doc.setLineWidth(0.2)
        doc.line(20, yPos, 190, yPos)
        yPos += 5
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        
        expenses.forEach(exp => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          
          doc.text(new Date(exp.date).toLocaleDateString('en-GB'), 20, yPos)
          doc.text(exp.description.substring(0, 20), 45, yPos)
          doc.text(exp.category, 110, yPos)
          doc.text(`${currency} ${parseFloat(exp.amount).toLocaleString()}`, 150, yPos)
          doc.text(exp.status.toUpperCase(), 175, yPos)
          yPos += 4
        })
        
        yPos += 10
      }
      
      // INCOME BREAKDOWN
      if (income.length > 0) {
        if (yPos > 200) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('INCOME BREAKDOWN', 20, yPos)
        yPos += 8
        
        // Source summary
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        Object.entries(incomeBySource)
          .sort(([,a], [,b]) => b - a)
          .forEach(([source, amount]) => {
            const percentage = ((amount / totalIncome) * 100).toFixed(1)
            doc.text(`${source}:`, 25, yPos)
            doc.text(`${currency} ${amount.toLocaleString()} (${percentage}%)`, 80, yPos)
            yPos += 5
          })
        
        yPos += 5
        
        // Detailed income table
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(9)
        doc.text('Date', 20, yPos)
        doc.text('Description', 45, yPos)
        doc.text('Source', 110, yPos)
        doc.text('Amount', 150, yPos)
        doc.text('Status', 175, yPos)
        yPos += 3
        
        doc.setLineWidth(0.2)
        doc.line(20, yPos, 190, yPos)
        yPos += 5
        
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(8)
        
        income.forEach(inc => {
          if (yPos > 270) {
            doc.addPage()
            yPos = 20
          }
          
          doc.text(new Date(inc.date).toLocaleDateString('en-GB'), 20, yPos)
          doc.text(inc.description.substring(0, 20), 45, yPos)
          doc.text(inc.source, 110, yPos)
          doc.text(`${currency} ${parseFloat(inc.amount).toLocaleString()}`, 150, yPos)
          doc.text(inc.status.toUpperCase(), 175, yPos)
          yPos += 4
        })
      }
      
      // FOOTER
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text(`Page ${i} of ${pageCount}`, 105, 290, { align: 'center' })
        doc.text('Confidential - Blessing Poultries Financial Report', 105, 285, { align: 'center' })
      }
      
      const fileName = `Blessing-Poultries-Financial-Report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      showSuccess('Professional financial report exported successfully!')
      
    } catch (error) {
      console.error('PDF Export Error:', error)
      showError('Failed to export PDF. Please try again.')
    }
  }

  const exportToExcel = () => {
    const workbook = XLSX.utils.book_new()
    
    // Summary Sheet
    const { totalExpenses, totalIncome, profit, profitMargin } = calculateTotals()
    const summaryData = [
      ['Blessing Poultries - Financial Summary'],
      ['Period', selectedPeriod],
      ['Generated', new Date().toLocaleDateString()],
      [''],
      ['Total Income', totalIncome],
      ['Total Expenses', totalExpenses],
      ['Net Profit', profit],
      ['Profit Margin %', profitMargin.toFixed(2)]
    ]
    const summarySheet = XLSX.utils.aoa_to_sheet(summaryData)
    XLSX.utils.book_append_sheet(workbook, summarySheet, 'Summary')
    
    // Expenses Sheet
    if (expenses.length > 0) {
      const expenseSheet = XLSX.utils.json_to_sheet(expenses.map(exp => ({
        Date: new Date(exp.date).toLocaleDateString(),
        Description: exp.description,
        Category: exp.category,
        'Store Name': exp.store_name,
        Amount: exp.amount,
        Status: exp.status
      })))
      XLSX.utils.book_append_sheet(workbook, expenseSheet, 'Expenses')
    }
    
    // Income Sheet
    if (income.length > 0) {
      const incomeSheet = XLSX.utils.json_to_sheet(income.map(inc => ({
        Date: new Date(inc.date).toLocaleDateString(),
        Description: inc.description,
        Source: inc.source,
        Amount: inc.amount,
        Status: inc.status
      })))
      XLSX.utils.book_append_sheet(workbook, incomeSheet, 'Income')
    }
    
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' })
    saveAs(data, `financial-report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.xlsx`)
    showSuccess('Financial report exported to Excel')
  }

  const addExpenseRecord = () => {
    setExpenseRecords([...expenseRecords, {
      description: '',
      amount: '',
      category: 'Feed',
      store_name: '',
      date: new Date().toISOString().split('T')[0],
      status: 'cleared'
    }])
  }

  const addIncomeRecord = () => {
    setIncomeRecords([...incomeRecords, {
      description: '',
      amount: '',
      source: 'Egg Sales',
      date: new Date().toISOString().split('T')[0],
      status: 'cleared'
    }])
  }

  const removeExpenseRecord = (index) => {
    if (expenseRecords.length > 1) {
      setExpenseRecords(expenseRecords.filter((_, i) => i !== index))
    }
  }

  const removeIncomeRecord = (index) => {
    if (incomeRecords.length > 1) {
      setIncomeRecords(incomeRecords.filter((_, i) => i !== index))
    }
  }

  const updateExpenseRecord = (index, field, value) => {
    const updated = [...expenseRecords]
    updated[index][field] = value
    setExpenseRecords(updated)
  }

  const updateIncomeRecord = (index, field, value) => {
    const updated = [...incomeRecords]
    updated[index][field] = value
    setIncomeRecords(updated)
  }

  const openCalculator = (target) => {
    setCalculatorTarget(target)
    setShowCalculator(true)
  }

  const handleCalculatorResult = (result) => {
    if (calculatorTarget) {
      const [type, index] = calculatorTarget.split('-')
      if (type === 'expense') {
        updateExpenseRecord(parseInt(index), 'amount', result.toString())
      } else if (type === 'income') {
        updateIncomeRecord(parseInt(index), 'amount', result.toString())
      }
    }
  }

  const handleAddExpenses = async (e) => {
    e.preventDefault()
    setAddingExpense(true)
    
    try {
      const validRecords = expenseRecords.filter(record => 
        record.description && record.amount && parseFloat(record.amount) > 0
      )

      if (validRecords.length === 0) {
        showError('Please add at least one valid expense record')
        return
      }

      const recordsToInsert = validRecords.map(record => ({
        ...record,
        amount: parseFloat(record.amount)
      }))

      const { error } = await supabase
        .from('expenses')
        .insert(recordsToInsert)

      if (error) throw error

      showSuccess(`${validRecords.length} expense record(s) added successfully!`)
      setShowExpenseModal(false)
      setExpenseRecords([{
        description: '',
        amount: '',
        category: 'Feed',
        store_name: '',
        date: new Date().toISOString().split('T')[0],
        status: 'cleared'
      }])
      await fetchFinancialData()
    } catch (error) {
      console.error('Error adding expenses:', error)
      showError('Failed to add expense records')
    } finally {
      setAddingExpense(false)
    }
  }

  const handleAddIncome = async (e) => {
    e.preventDefault()
    setAddingIncome(true)
    
    try {
      const validRecords = incomeRecords.filter(record => 
        record.description && record.amount && parseFloat(record.amount) > 0
      )

      if (validRecords.length === 0) {
        showError('Please add at least one valid income record')
        return
      }

      const recordsToInsert = validRecords.map(record => ({
        ...record,
        amount: parseFloat(record.amount)
      }))

      const { error } = await supabase
        .from('income')
        .insert(recordsToInsert)

      if (error) throw error

      showSuccess(`${validRecords.length} income record(s) added successfully!`)
      setShowIncomeModal(false)
      setIncomeRecords([{
        description: '',
        amount: '',
        source: 'Egg Sales',
        date: new Date().toISOString().split('T')[0],
        status: 'cleared'
      }])
      await fetchFinancialData()
    } catch (error) {
      console.error('Error adding income:', error)
      showError('Failed to add income records')
    } finally {
      setAddingIncome(false)
    }
  }

  const handleDeleteRecord = async () => {
    if (!deleteConfirm) return
    
    try {
      const { type, id, description } = deleteConfirm
      const table = type === 'expense' ? 'expenses' : 'income'
      
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id)

      if (error) throw error

      showSuccess(`${type} record deleted successfully`)
      setDeleteConfirm(null)
      fetchFinancialData()
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to delete record')
    }
  }

  const calculateTotals = () => {
    const filteredExpenses = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           expense.category.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
      return matchesSearch && matchesStatus
    })

    const filteredIncome = income.filter(inc => {
      const matchesSearch = inc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           inc.source.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === 'all' || inc.status === filterStatus
      return matchesSearch && matchesStatus
    })

    const totalExpenses = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0)
    const totalIncome = filteredIncome.reduce((sum, inc) => sum + inc.amount, 0)
    const profit = totalIncome - totalExpenses
    const profitMargin = totalIncome > 0 ? ((profit / totalIncome) * 100) : 0

    return { totalExpenses, totalIncome, profit, profitMargin, filteredExpenses, filteredIncome }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'cleared':
        return <FiCheckCircle className="w-4 h-4 text-green-600" />
      case 'pending':
        return <FiClock className="w-4 h-4 text-yellow-600" />
      case 'flagged':
        return <FiFlag className="w-4 h-4 text-red-600" />
      default:
        return <FiCheckCircle className="w-4 h-4 text-gray-400" />
    }
  }

  const getAlerts = () => {
    const alerts = []
    const { totalExpenses, totalIncome, profit } = calculateTotals()
    
    if (profit < 0) {
      alerts.push({ type: 'danger', message: 'Negative cash flow detected', icon: FiAlertTriangle })
    }
    
    const pendingCount = expenses.filter(e => e.status === 'pending').length + income.filter(i => i.status === 'pending').length
    if (pendingCount > 0) {
      alerts.push({ type: 'warning', message: `${pendingCount} pending transactions`, icon: FiClock })
    }
    
    const flaggedCount = expenses.filter(e => e.status === 'flagged').length + income.filter(i => i.status === 'flagged').length
    if (flaggedCount > 0) {
      alerts.push({ type: 'danger', message: `${flaggedCount} flagged transactions need review`, icon: FiFlag })
    }
    
    return alerts
  }

  if (!isAuthorized) {
    return (
      <Modal isOpen={showPasscodeModal} onClose={() => {}} title="Financial System Access">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
            <FiLock className="w-8 h-8 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Restricted Access</h3>
            <p className="text-gray-600 mb-4">
              This financial management system requires special authorization. 
              Please enter the financial access passcode.
            </p>
          </div>
          <div>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="Enter passcode"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 text-center font-mono"
              onKeyPress={(e) => e.key === 'Enter' && handlePasscodeSubmit()}
            />
          </div>
          <LoadingButton onClick={handlePasscodeSubmit} className="w-full">
            Access Financial System
          </LoadingButton>
          <p className="text-xs text-gray-500">
            Contact super admin if you need access to this system
          </p>
        </div>
      </Modal>
    )
  }

  const { totalExpenses, totalIncome, profit, profitMargin, filteredExpenses, filteredIncome } = calculateTotals()
  const alerts = getAlerts()

  if (loading) {
    return <PageLoader text="Loading financial intelligence system..." />
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-2 sm:p-0">
      {/* Financial Dashboard Header */}
      <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl p-4 sm:p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <FiDollarSign className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-green-800">Financial Overview</h2>
              <p className="text-green-600 text-sm">Real-time financial metrics</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right hidden sm:block">
              <div className="text-sm text-green-700">Period: {selectedPeriod}</div>
              <div className="text-xs text-green-600">Last updated: {new Date().toLocaleTimeString()}</div>
            </div>
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="sm:hidden p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              {showOverview ? <FiMinimize2 className="w-5 h-5 text-green-600" /> : <FiMaximize2 className="w-5 h-5 text-green-600" />}
            </button>
          </div>
        </div>
        
        <div className={`${showOverview ? 'block' : 'hidden'} sm:block`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <FiTrendingUp className="w-5 h-5 text-green-600 mr-2" />
              <span className="text-xs text-green-700">Income</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">₦{(totalIncome/1000).toFixed(0)}K</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm">
            <div className="flex items-center justify-center mb-2">
              <FiTrendingDown className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-xs text-green-700">Expenses</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-green-800">₦{(totalExpenses/1000).toFixed(0)}K</div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm col-span-2 sm:col-span-1">
            <div className="flex items-center justify-center mb-2">
              <FiBarChart className="w-5 h-5 text-blue-600 mr-2" />
              <span className="text-xs text-green-700">Net Flow</span>
            </div>
            <div className={`text-lg sm:text-2xl font-bold ${profit >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              ₦{(profit/1000).toFixed(0)}K
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm hidden sm:block">
            <div className="flex items-center justify-center mb-2">
              <FiPieChart className="w-5 h-5 text-purple-600 mr-2" />
              <span className="text-xs text-green-700">Margin</span>
            </div>
            <div className={`text-lg sm:text-2xl font-bold ${profitMargin >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {profitMargin.toFixed(1)}%
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm hidden lg:block">
            <div className="flex items-center justify-center mb-2">
              <FiClock className="w-5 h-5 text-yellow-600 mr-2" />
              <span className="text-xs text-green-700">Pending</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-yellow-600">
              {expenses.filter(e => e.status === 'pending').length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm hidden lg:block">
            <div className="flex items-center justify-center mb-2">
              <FiFlag className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-xs text-green-700">Flagged</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              {expenses.filter(e => e.status === 'flagged').length + income.filter(i => i.status === 'flagged').length}
            </div>
          </div>
        </div>
        </div>
      </div>

      {/* Alerts Bar */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.map((alert, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className={`flex items-center gap-3 p-3 rounded-lg ${
                alert.type === 'danger' ? 'bg-red-50 border border-red-200 text-red-800' :
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              <alert.icon className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm font-medium">{alert.message}</span>
            </motion.div>
          ))}
        </div>
      )}

      {/* Mobile-Optimized Controls */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
        {/* Top Row - Search and Period */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full text-sm"
            />
          </div>
          
          <div className="flex gap-2">
            <CustomDropdown
              options={['all', 'cleared', 'pending', 'flagged']}
              value={filterStatus}
              onChange={setFilterStatus}
              placeholder="All Status"
              className="min-w-[120px]"
            />
            
            <CustomDropdown
              options={['week', 'month', 'year']}
              value={selectedPeriod}
              onChange={setSelectedPeriod}
              placeholder="Period"
              className="min-w-[100px]"
            />
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap gap-2">
          <LoadingButton
            onClick={() => setShowExpenseModal(true)}
            className="flex items-center gap-2 text-sm px-3 py-2"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span> Expenses
          </LoadingButton>
          
          <LoadingButton
            onClick={() => setShowIncomeModal(true)}
            variant="outline"
            className="flex items-center gap-2 text-sm px-3 py-2"
          >
            <FiPlus className="w-4 h-4" />
            <span className="hidden sm:inline">Add</span> Income
          </LoadingButton>

          {/* Collapsible Advanced Tools */}
          <button
            onClick={() => setShowAdvancedTools(!showAdvancedTools)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            {showAdvancedTools ? <FiEyeOff className="w-4 h-4" /> : <FiEye className="w-4 h-4" />}
            Tools
          </button>

          <button
            onClick={() => setShowCalculator(true)}
            className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
            title="Calculator"
          >
            <FiGrid className="w-4 h-4" />
            <span className="hidden sm:inline">Calc</span>
          </button>
        </div>

        {/* Advanced Tools (Collapsible) */}
        <AnimatePresence>
          {showAdvancedTools && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mt-4 pt-4 border-t border-gray-200"
            >
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={exportToPDF}
                  className="flex items-center gap-2 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                >
                  <FiFileText className="w-4 h-4" />
                  PDF
                </button>
                
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  <FiDownload className="w-4 h-4" />
                  Excel
                </button>
                
                <button
                  onClick={() => setCompactView(!compactView)}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  {compactView ? <FiMaximize2 className="w-4 h-4" /> : <FiMinimize2 className="w-4 h-4" />}
                  {compactView ? 'Expand' : 'Compact'}
                </button>
                
                <button
                  onClick={fetchFinancialData}
                  className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                >
                  <FiRefreshCw className="w-4 h-4" />
                  Refresh
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Mobile-Optimized Transaction Table */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-3 sm:p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900">Transaction Records</h3>
            <span className="text-xs sm:text-sm text-gray-500">
              {filteredExpenses.length + filteredIncome.length} records
            </span>
          </div>
        </div>
        
        {/* Mobile Card View */}
        <div className="block sm:hidden">
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
            {/* Expenses */}
            {filteredExpenses.map((expense) => (
              <div key={`expense-${expense.id}`} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-red-600">-₦{expense.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getStatusIcon(expense.status)}
                      <span className="text-xs capitalize">{expense.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</span>
                  <button
                    onClick={() => setDeleteConfirm({
                      type: 'expense',
                      id: expense.id,
                      description: expense.description
                    })}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
            
            {/* Income */}
            {filteredIncome.map((inc) => (
              <div key={`income-${inc.id}`} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{inc.description}</p>
                    <p className="text-sm text-gray-600">{inc.source}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-green-600">+₦{inc.amount.toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getStatusIcon(inc.status)}
                      <span className="text-xs capitalize">{inc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(inc.date).toLocaleDateString()}</span>
                  <button
                    onClick={() => setDeleteConfirm({
                      type: 'income',
                      id: inc.id,
                      description: inc.description
                    })}
                    className="text-red-600 hover:text-red-900 p-1"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category/Source</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 max-h-96 overflow-y-auto">
              {/* Expenses */}
              {filteredExpenses.map((expense) => (
                <tr key={`expense-${expense.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    -₦{expense.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(expense.status)}
                      <span className="text-sm capitalize">{expense.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setDeleteConfirm({
                        type: 'expense',
                        id: expense.id,
                        description: expense.description
                      })}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
              
              {/* Income */}
              {filteredIncome.map((inc) => (
                <tr key={`income-${inc.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(inc.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{inc.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{inc.source}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-green-600">
                    +₦{inc.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inc.status)}
                      <span className="text-sm capitalize">{inc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <button
                      onClick={() => setDeleteConfirm({
                        type: 'income',
                        id: inc.id,
                        description: inc.description
                      })}
                      className="text-red-600 hover:text-red-900 p-1"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      <Modal isOpen={showExpenseModal} onClose={() => setShowExpenseModal(false)} title="Add Expense Records">
        <form onSubmit={handleAddExpenses} className="space-y-6">
          {expenseRecords.map((record, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Expense Record #{index + 1}</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openCalculator(`expense-${index}`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Open Calculator"
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  {expenseRecords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeExpenseRecord(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={record.description}
                    onChange={(e) => updateExpenseRecord(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                  <SmartNumberInput
                    value={record.amount}
                    onChange={(value) => updateExpenseRecord(index, 'amount', value)}
                    placeholder="0.00"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <CustomDropdown
                    options={expenseCategories}
                    value={record.category}
                    onChange={(value) => updateExpenseRecord(index, 'category', value)}
                    allowOther={true}
                    otherPlaceholder="Please specify category..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Store Name</label>
                  <input
                    type="text"
                    value={record.store_name}
                    onChange={(e) => updateExpenseRecord(index, 'store_name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={record.date}
                    onChange={(e) => updateExpenseRecord(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <CustomDropdown
                    options={statusOptions}
                    value={record.status}
                    onChange={(value) => updateExpenseRecord(index, 'status', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={addExpenseRecord}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Another Record
            </button>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <LoadingButton type="submit" loading={addingExpense} className="flex-1">
              {addingExpense ? 'Adding Records...' : `Add ${expenseRecords.length} Record(s)`}
            </LoadingButton>
            <LoadingButton 
              type="button" 
              variant="outline" 
              onClick={() => setShowExpenseModal(false)} 
              className="flex-1"
            >
              Cancel
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Add Income Modal - Similar structure */}
      <Modal isOpen={showIncomeModal} onClose={() => setShowIncomeModal(false)} title="Add Income Records">
        <form onSubmit={handleAddIncome} className="space-y-6">
          {incomeRecords.map((record, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium text-gray-900">Income Record #{index + 1}</h4>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => openCalculator(`income-${index}`)}
                    className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                    title="Open Calculator"
                  >
                    <FiGrid className="w-4 h-4" />
                  </button>
                  {incomeRecords.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeIncomeRecord(index)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                  <input
                    type="text"
                    value={record.description}
                    onChange={(e) => updateIncomeRecord(index, 'description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Amount (₦)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={record.amount}
                    onChange={(e) => updateIncomeRecord(index, 'amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Source</label>
                  <CustomDropdown
                    options={incomeSources}
                    value={record.source}
                    onChange={(value) => updateIncomeRecord(index, 'source', value)}
                    allowOther={true}
                    otherPlaceholder="Please specify source..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                  <input
                    type="date"
                    value={record.date}
                    onChange={(e) => updateIncomeRecord(index, 'date', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                  <CustomDropdown
                    options={statusOptions}
                    value={record.status}
                    onChange={(value) => updateIncomeRecord(index, 'status', value)}
                  />
                </div>
              </div>
            </div>
          ))}
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={addIncomeRecord}
              className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              <FiPlus className="w-4 h-4" />
              Add Another Record
            </button>
          </div>
          
          <div className="flex gap-3 pt-4 border-t">
            <LoadingButton type="submit" loading={addingIncome} className="flex-1">
              {addingIncome ? 'Adding Records...' : `Add ${incomeRecords.length} Record(s)`}
            </LoadingButton>
            <LoadingButton 
              type="button" 
              variant="outline" 
              onClick={() => setShowIncomeModal(false)} 
              className="flex-1"
            >
              Cancel
            </LoadingButton>
          </div>
        </form>
      </Modal>

      {/* Calculator Modal */}
      <Calculator
        isOpen={showCalculator}
        onClose={() => setShowCalculator(false)}
        onResult={handleCalculatorResult}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDeleteRecord}
        type="danger"
        title="Delete Financial Record"
        message="⚠️ FINANCIAL RECORD WARNING: This action cannot be undone and will permanently delete this record from your financial books."
        itemName={deleteConfirm?.description}
        description="Deleting financial records affects your accounting accuracy and audit trail. This action requires double confirmation for financial compliance."
        confirmText="DELETE FINANCIAL RECORD"
        cancelText="Keep Record Safe"
      />
    </div>
  )
}