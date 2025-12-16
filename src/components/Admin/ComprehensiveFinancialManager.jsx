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
  FiLock,
  FiX,
  FiActivity,
  FiTarget,
  FiArrowUp,
  FiArrowDown
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
  const [editingRecord, setEditingRecord] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [monthlyBudget, setMonthlyBudget] = useState(null)
  const [showBudgetModal, setShowBudgetModal] = useState(false)
  const [budgetCategories, setBudgetCategories] = useState([])
  const [budgetProgress, setBudgetProgress] = useState({ 
    spent: 0, 
    remaining: 0, 
    percentage: 0, 
    actualIncome: 0, 
    netFlow: 0, 
    savings: 0, 
    overspent: 0,
    budgetEfficiency: 0,
    isOnTrack: true,
    flowStatus: 'neutral'
  })
  const [showOverview, setShowOverview] = useState(false) // Collapsed by default on mobile
  const [showBudgetDetails, setShowBudgetDetails] = useState(false) // Collapsible budget section
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set())
  const [newBudget, setNewBudget] = useState({
    period_type: 'monthly', // monthly, yearly, decades
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
    budget_amount: '',
    notes: ''
  })
  const [creatingBudget, setCreatingBudget] = useState(false)
  const [editingBudget, setEditingBudget] = useState(false)

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
      fetchBudgetData()
    }
  }, [selectedPeriod, isAuthorized])

  // Auto-scroll to results when searching
  useEffect(() => {
    if (searchTerm) {
      const resultsSection = document.querySelector('[data-search-results]')
      if (resultsSection) {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
  }, [searchTerm])

  // Smart refresh only when data changes are detected (no disruptive auto-refresh)
  // Data will refresh automatically when records are added/edited/deleted

  const fetchBudgetData = async () => {
    try {
      const currentDate = new Date()
      const month = currentDate.getMonth() + 1
      const year = currentDate.getFullYear()

      // Get monthly budget
      const { data: budget } = await supabase
        .from('monthly_budgets')
        .select('*')
        .eq('month', month)
        .eq('year', year)
        .single()

      if (budget) {
        setMonthlyBudget(budget)
        
        // Calculate proper date range (handle year rollover)
        const nextMonth = month === 12 ? 1 : month + 1
        const nextYear = month === 12 ? year + 1 : year
        
        // Get REAL expenses for this month/year
        const { data: realExpenses } = await supabase
          .from('expenses')
          .select('amount, category, date')
          .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
          .lt('date', `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`)

        // Get REAL income for this month/year  
        const { data: realIncome } = await supabase
          .from('income')
          .select('amount, source, date')
          .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
          .lt('date', `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`)

        // Calculate REAL totals
        const actualExpenses = realExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0
        const actualIncome = realIncome?.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0) || 0
        
        const budgetAmount = parseFloat(budget.budget_amount || 0)
        const remaining = budgetAmount - actualExpenses
        const percentage = budgetAmount > 0 ? (actualExpenses / budgetAmount) * 100 : 0
        const savings = remaining > 0 ? remaining : 0
        const overspent = remaining < 0 ? Math.abs(remaining) : 0
        
        // Calculate flow indicators
        const incomeVsBudget = actualIncome - budgetAmount
        const netFlow = actualIncome - actualExpenses
        const budgetEfficiency = budgetAmount > 0 ? ((budgetAmount - actualExpenses) / budgetAmount) * 100 : 0

        // Debug budget calculations
        console.log('Budget Debug:', {
          budgetAmount,
          actualExpenses,
          actualIncome,
          percentage: percentage.toFixed(2),
          remaining,
          savings,
          overspent,
          isOnTrack: percentage <= 80
        });

        setBudgetProgress({
          spent: actualExpenses || 0,
          remaining: remaining || 0,
          percentage: percentage || 0,
          savings: savings || 0,
          overspent: overspent || 0,
          actualIncome: actualIncome || 0,
          incomeVsBudget: incomeVsBudget || 0,
          netFlow: netFlow || 0,
          budgetEfficiency: budgetEfficiency || 0,
          isOnTrack: (percentage || 0) <= 80,
          flowStatus: (netFlow || 0) > 0 ? 'positive' : (netFlow || 0) < 0 ? 'negative' : 'neutral'
        })

        // Get budget categories for detailed tracking
        const { data: categories } = await supabase
          .from('budget_categories')
          .select('*')
          .eq('budget_id', budget.id)

        setBudgetCategories(categories || [])
      } else {
        // No budget set, but still calculate actual spending for reference
        const nextMonth = month === 12 ? 1 : month + 1
        const nextYear = month === 12 ? year + 1 : year
        
        const { data: realExpenses } = await supabase
          .from('expenses')
          .select('amount')
          .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
          .lt('date', `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`)

        const { data: realIncome } = await supabase
          .from('income')
          .select('amount')
          .gte('date', `${year}-${month.toString().padStart(2, '0')}-01`)
          .lt('date', `${nextYear}-${nextMonth.toString().padStart(2, '0')}-01`)

        const actualExpenses = realExpenses?.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0) || 0
        const actualIncome = realIncome?.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0) || 0
        
        setBudgetProgress({
          spent: actualExpenses || 0,
          actualIncome: actualIncome || 0,
          netFlow: (actualIncome || 0) - (actualExpenses || 0),
          flowStatus: ((actualIncome || 0) - (actualExpenses || 0)) > 0 ? 'positive' : 'negative',
          noBudget: true
        })
      }
    } catch (error) {
      console.error('Error fetching budget data:', error)
    }
  }

  const handleCreateBudget = async (e) => {
    e.preventDefault()
    setCreatingBudget(true)
    
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      const budgetData = {
        month: newBudget.month,
        year: newBudget.year,
        budget_amount: parseFloat(newBudget.budget_amount.replace(/,/g, '')),
        expense_limit: parseFloat(newBudget.budget_amount.replace(/,/g, '')) * 0.8, // 80% of budget
        income_target: parseFloat(newBudget.budget_amount.replace(/,/g, '')) * 1.2, // 120% of budget
        notes: newBudget.notes,
        created_by: user?.id
      }

      const { data, error } = await supabase
        .from('monthly_budgets')
        .insert([budgetData])
        .select()
        .single()

      if (error) throw error

      // Create default budget categories
      const defaultCategories = [
        { category_name: 'Feed', allocated_amount: budgetData.budget_amount * 0.4, category_type: 'expense' },
        { category_name: 'Medication', allocated_amount: budgetData.budget_amount * 0.15, category_type: 'expense' },
        { category_name: 'Equipment', allocated_amount: budgetData.budget_amount * 0.1, category_type: 'expense' },
        { category_name: 'Labor', allocated_amount: budgetData.budget_amount * 0.25, category_type: 'expense' },
        { category_name: 'Utilities', allocated_amount: budgetData.budget_amount * 0.1, category_type: 'expense' }
      ]

      const categoriesWithBudgetId = defaultCategories.map(cat => ({
        ...cat,
        budget_id: data.id
      }))

      await supabase
        .from('budget_categories')
        .insert(categoriesWithBudgetId)

      showSuccess(`${newBudget.period_type === 'monthly' ? 'Monthly' : newBudget.period_type === 'yearly' ? 'Yearly' : 'Decade'} budget created successfully!`)
      
      // Reset form
      setNewBudget({
        period_type: 'monthly',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        budget_amount: '',
        notes: ''
      })
      
      // Close modal and refresh data
      setShowBudgetModal(false)
      await fetchBudgetData()
      await fetchFinancialData() // Refresh financial data to show connection
    } catch (error) {
      console.error('Error creating budget:', error)
      if (error.message.includes('relation "monthly_budgets" does not exist')) {
        showError('Budget tables not found. Please run budget-system.sql in Supabase first!')
      } else {
        showError('Failed to create budget: ' + error.message)
      }
    } finally {
      setCreatingBudget(false)
    }
  }

  const handleUpdateBudget = async (e) => {
    e.preventDefault()
    setCreatingBudget(true)
    
    try {
      const budgetData = {
        budget_amount: parseFloat(newBudget.budget_amount.replace(/,/g, '')),
        expense_limit: parseFloat(newBudget.budget_amount.replace(/,/g, '')) * 0.8,
        income_target: parseFloat(newBudget.budget_amount.replace(/,/g, '')) * 1.2,
        notes: newBudget.notes,
        updated_at: new Date().toISOString()
      }

      const { error } = await supabase
        .from('monthly_budgets')
        .update(budgetData)
        .eq('id', monthlyBudget.id)

      if (error) throw error

      showSuccess('Budget updated successfully!')
      setEditingBudget(false)
      setShowBudgetModal(false)
      await fetchBudgetData()
      await fetchFinancialData()
    } catch (error) {
      console.error('Error updating budget:', error)
      showError('Failed to update budget: ' + error.message)
    } finally {
      setCreatingBudget(false)
    }
  }

  const handleDeleteBudget = async () => {
    if (!monthlyBudget) return
    
    try {
      // Delete budget categories first
      await supabase
        .from('budget_categories')
        .delete()
        .eq('budget_id', monthlyBudget.id)

      // Delete budget
      const { error } = await supabase
        .from('monthly_budgets')
        .delete()
        .eq('id', monthlyBudget.id)

      if (error) throw error

      showSuccess('Budget deleted successfully!')
      setMonthlyBudget(null)
      setBudgetCategories([])
      setBudgetProgress({ spent: 0, remaining: 0, percentage: 0 })
      setShowBudgetModal(false)
    } catch (error) {
      console.error('Error deleting budget:', error)
      showError('Failed to delete budget: ' + error.message)
    }
  }

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
      
      // Generate dynamic financial advice based on results
      const getFinancialAdvice = () => {
        const advice = []
        
        if (profit < 0) {
          advice.push('URGENT: Implement cost reduction strategies immediately')
          advice.push('Consider diversifying income sources (egg processing, organic feed sales)')
          advice.push('Review supplier contracts for better pricing on feed and medication')
        } else if (profitMargin < 10) {
          advice.push('Profit margin is low - focus on operational efficiency')
          advice.push('Explore premium product lines (organic eggs, free-range chickens)')
          advice.push('Optimize feed conversion ratios to reduce costs')
        } else if (profitMargin > 25) {
          advice.push('Excellent profitability! Consider expansion opportunities')
          advice.push('Invest in automation to scale operations')
          advice.push('Build emergency fund for market fluctuations')
        } else {
          advice.push('Healthy profit margins - maintain current strategies')
          advice.push('Monitor seasonal trends for better planning')
          advice.push('Consider gradual capacity expansion')
        }
        
        // Budget-specific advice
        if (monthlyBudget) {
          const budgetUsage = (budgetProgress.spent / parseFloat(monthlyBudget.budget_amount)) * 100
          if (budgetUsage > 100) {
            advice.push(`Budget exceeded by ${(budgetUsage - 100).toFixed(1)}% - review spending controls`)
          } else if (budgetUsage < 70) {
            advice.push('Under-budget performance - consider strategic investments')
          }
        }
        
        return advice
      }
      
      // CLEAN MINIMALIST HEADER
      doc.setTextColor(0, 0, 0) // Pure black for maximum readability
      doc.setFontSize(24)
      doc.setFont('helvetica', 'bold')
      doc.text('BLESSING POULTRIES', 105, 25, { align: 'center' })
      
      doc.setFontSize(16)
      doc.setFont('helvetica', 'normal')
      doc.text('Financial Analysis Report', 105, 35, { align: 'center' })
      
      doc.setFontSize(10)
      doc.text(`Period: ${selectedPeriod.toUpperCase()} | Generated: ${new Date().toLocaleDateString('en-GB')}`, 105, 45, { align: 'center' })
      
      // Simple clean line separator
      doc.setDrawColor(0, 0, 0)
      doc.setLineWidth(0.5)
      doc.line(20, 55, 190, 55)
      
      // CLEAN EXECUTIVE SUMMARY
      doc.setTextColor(0, 0, 0)
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text('EXECUTIVE SUMMARY', 20, 70)
      
      // Simple underline
      doc.setLineWidth(0.3)
      doc.line(20, 72, 90, 72)
      
      doc.setTextColor(0, 0, 0) // Reset to black
      doc.setFontSize(11)
      doc.setFont('helvetica', 'normal')
      
      // Clean financial metrics - black and white only
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(11)
      
      doc.text('Total Revenue:', 20, 85)
      doc.setFont('helvetica', 'bold')
      doc.text(`${currency} ${totalIncome.toLocaleString()}`, 80, 85)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Total Expenses:', 20, 92)
      doc.setFont('helvetica', 'bold')
      doc.text(`${currency} ${totalExpenses.toLocaleString()}`, 80, 92)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Net Profit:', 20, 99)
      doc.setFont('helvetica', 'bold')
      doc.text(`${currency} ${profit.toLocaleString()}`, 80, 99)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Profit Margin:', 120, 85)
      doc.setFont('helvetica', 'bold')
      doc.text(`${profitMargin.toFixed(1)}%`, 160, 85)
      
      doc.setFont('helvetica', 'normal')
      doc.text('Transactions:', 120, 92)
      doc.text(`${expenses.length + income.length}`, 160, 92)
      
      doc.text('Status:', 120, 99)
      doc.setFont('helvetica', 'bold')
      doc.text(profit >= 0 ? 'PROFITABLE' : 'LOSS', 160, 99)
      
      // Clean Budget Section
      let yPos = 115
      if (monthlyBudget) {
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(12)
        doc.setFont('helvetica', 'bold')
        doc.text('BUDGET ANALYSIS', 20, yPos)
        
        // Simple underline
        doc.setLineWidth(0.3)
        doc.line(20, yPos + 2, 75, yPos + 2)
        yPos += 10
        
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(10)
        doc.setFont('helvetica', 'normal')
        
        const budgetUsage = (budgetProgress.spent / parseFloat(monthlyBudget.budget_amount)) * 100
        doc.text(`Budget Set: ${currency} ${parseFloat(monthlyBudget.budget_amount).toLocaleString()}`, 20, yPos)
        doc.text(`Actual Spent: ${currency} ${(budgetProgress.spent || 0).toLocaleString()}`, 20, yPos + 7)
        
        doc.text(`Usage: ${budgetUsage.toFixed(1)}%`, 120, yPos)
        doc.setFont('helvetica', 'bold')
        doc.text(`${budgetUsage > 100 ? 'OVER BUDGET' : budgetUsage > 80 ? 'NEAR LIMIT' : 'ON TRACK'}`, 120, yPos + 7)
        
        yPos += 25
      }
      
      doc.setTextColor(0, 0, 0) // Reset color
      
      // Clean Recommendations Section
      // Add page break if not enough space
      if (yPos > 220) {
        doc.addPage()
        yPos = 20
      }
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(12)
      doc.text('STRATEGIC RECOMMENDATIONS', 20, yPos)
      
      // Simple underline
      doc.setLineWidth(0.3)
      doc.line(20, yPos + 2, 120, yPos + 2)
      yPos += 10
      
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'normal')
      doc.setFontSize(9)
      
      const advice = getFinancialAdvice()
      advice.slice(0, 3).forEach((tip, index) => {
        doc.text(`${index + 1}. ${tip}`, 20, yPos)
        yPos += 6
      })
      
      yPos += 10
      
      // FINANCIAL ANALYSIS SECTION
      doc.setTextColor(0, 0, 0)
      doc.setFont('helvetica', 'bold')
      doc.setFontSize(14)
      doc.text('DETAILED FINANCIAL ANALYSIS', 20, yPos)
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
      
      // Clean Expense Section
      if (expenses.length > 0) {
        // Add page break if not enough space
        if (yPos > 200) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('EXPENSE BREAKDOWN', 20, yPos)
        doc.setLineWidth(0.3)
        doc.line(20, yPos + 2, 85, yPos + 2)
        yPos += 10
        
        // Category summary with color coding
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        Object.entries(expensesByCategory)
          .sort(([,a], [,b]) => b - a)
          .forEach(([category, amount], index) => {
            const percentage = ((amount / totalExpenses) * 100).toFixed(1)
            
            // Color code by expense size
            if (percentage > 30) doc.setTextColor(220, 38, 38) // Dark red for high expenses
            else if (percentage > 15) doc.setTextColor(245, 101, 101) // Medium red
            else doc.setTextColor(107, 114, 128) // Gray for small expenses
            
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
      
      // Clean Income Section
      if (income.length > 0) {
        if (yPos > 200) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'bold')
        doc.setFontSize(12)
        doc.text('INCOME BREAKDOWN', 20, yPos)
        doc.setLineWidth(0.3)
        doc.line(20, yPos + 2, 80, yPos + 2)
        yPos += 10
        
        // Source summary with color coding
        doc.setTextColor(0, 0, 0)
        doc.setFont('helvetica', 'normal')
        doc.setFontSize(9)
        Object.entries(incomeBySource)
          .sort(([,a], [,b]) => b - a)
          .forEach(([source, amount], index) => {
            const percentage = ((amount / totalIncome) * 100).toFixed(1)
            
            // Color code by income contribution
            if (percentage > 50) doc.setTextColor(22, 163, 74) // Dark green for major sources
            else if (percentage > 25) doc.setTextColor(34, 197, 94) // Medium green
            else doc.setTextColor(107, 114, 128) // Gray for minor sources
            
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
      
      // Clean Minimalist Footer
      const pageCount = doc.internal.getNumberOfPages()
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i)
        
        // Simple line separator
        doc.setDrawColor(0, 0, 0)
        doc.setLineWidth(0.3)
        doc.line(20, 285, 190, 285)
        
        doc.setTextColor(0, 0, 0)
        doc.setFontSize(8)
        doc.setFont('helvetica', 'normal')
        doc.text('BLESSING POULTRIES', 20, 292)
        doc.text(`Page ${i} of ${pageCount}`, 105, 292, { align: 'center' })
        doc.text('CONFIDENTIAL', 190, 292, { align: 'right' })
        
        doc.setFontSize(7)
        doc.text('141, Idiroko Express Way, Oju-Ore, Ota', 105, 295, { align: 'center' })
      }
      
      const fileName = `Blessing-Poultries-Comprehensive-Report-${selectedPeriod}-${new Date().toISOString().split('T')[0]}.pdf`
      doc.save(fileName)
      showSuccess('Enhanced financial report with budget analysis and strategic recommendations exported successfully!')
      
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
      
      // Refresh both financial data and budget data immediately
      await Promise.all([
        fetchFinancialData(),
        fetchBudgetData()
      ])
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
      
      // Refresh both financial data and budget data immediately
      await Promise.all([
        fetchFinancialData(),
        fetchBudgetData()
      ])
    } catch (error) {
      console.error('Error adding income:', error)
      showError('Failed to add income records')
    } finally {
      setAddingIncome(false)
    }
  }

  const handleEditRecord = (type, record) => {
    setEditingRecord({ ...record, type })
    setShowEditModal(true)
  }

  const handleUpdateRecord = async (updatedRecord) => {
    try {
      const table = updatedRecord.type === 'expense' ? 'expenses' : 'income'
      const { type, ...recordData } = updatedRecord
      
      const { error } = await supabase
        .from(table)
        .update(recordData)
        .eq('id', recordData.id)

      if (error) throw error

      showSuccess(`${type} record updated successfully`)
      setShowEditModal(false)
      setEditingRecord(null)
      
      // Refresh both financial data and budget data immediately
      await Promise.all([
        fetchFinancialData(),
        fetchBudgetData()
      ])
    } catch (error) {
      console.error('Update error:', error)
      showError('Failed to update record')
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
      
      // Refresh both financial data and budget data immediately
      await Promise.all([
        fetchFinancialData(),
        fetchBudgetData()
      ])
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to delete record')
    }
  }

  const calculateTotals = () => {
    const filteredExpenses = expenses.filter(expense => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm || 
        expense.description.toLowerCase().includes(searchLower) ||
        expense.category.toLowerCase().includes(searchLower) ||
        expense.store_name?.toLowerCase().includes(searchLower) ||
        expense.amount.toString().includes(searchTerm) ||
        new Date(expense.date).toLocaleDateString().includes(searchTerm)
      const matchesStatus = filterStatus === 'all' || expense.status === filterStatus
      return matchesSearch && matchesStatus
    })

    const filteredIncome = income.filter(inc => {
      const searchLower = searchTerm.toLowerCase()
      const matchesSearch = !searchTerm ||
        inc.description.toLowerCase().includes(searchLower) ||
        inc.source.toLowerCase().includes(searchLower) ||
        inc.amount.toString().includes(searchTerm) ||
        new Date(inc.date).toLocaleDateString().includes(searchTerm)
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
      alerts.push({ id: 'negative-cash-flow', type: 'danger', message: 'Negative cash flow detected', icon: FiAlertTriangle })
    }
    
    const pendingCount = expenses.filter(e => e.status === 'pending').length + income.filter(i => i.status === 'pending').length
    if (pendingCount > 0) {
      alerts.push({ id: 'pending-transactions', type: 'warning', message: `${pendingCount} pending transactions`, icon: FiClock })
    }
    
    const flaggedCount = expenses.filter(e => e.status === 'flagged').length + income.filter(i => i.status === 'flagged').length
    if (flaggedCount > 0) {
      alerts.push({ id: 'flagged-transactions', type: 'danger', message: `${flaggedCount} flagged transactions need review`, icon: FiFlag })
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
              onClick={async () => {
                await Promise.all([fetchFinancialData(), fetchBudgetData()])
                showSuccess('Data refreshed successfully')
              }}
              className="hidden sm:flex p-2 hover:bg-green-100 rounded-lg transition-colors items-center gap-1"
              title="Refresh data"
            >
              <FiRefreshCw className="w-4 h-4 text-green-600" />
            </button>
            <button
              onClick={() => setShowOverview(!showOverview)}
              className="sm:hidden p-2 hover:bg-green-100 rounded-lg transition-colors"
            >
              {showOverview ? <FiMinimize2 className="w-5 h-5 text-green-600" /> : <FiMaximize2 className="w-5 h-5 text-green-600" />}
            </button>
          </div>
        </div>
        
        <div className={`${showOverview ? 'block' : 'hidden'} sm:block`}>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-4">
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
              {[...expenses, ...income].filter(item => item.status === 'pending').length}
            </div>
          </div>
          
          <div className="bg-white rounded-lg p-3 text-center border border-green-100 shadow-sm hidden lg:block">
            <div className="flex items-center justify-center mb-2">
              <FiFlag className="w-5 h-5 text-red-600 mr-2" />
              <span className="text-xs text-green-700">Flagged</span>
            </div>
            <div className="text-lg sm:text-2xl font-bold text-red-600">
              {[...expenses, ...income].filter(item => item.status === 'flagged').length}
            </div>
          </div>
          

        </div>
        </div>
      </div>

      {/* Alerts Bar */}
      {alerts.length > 0 && (
        <div className="space-y-2">
          {alerts.filter(alert => !dismissedAlerts.has(alert.id)).map((alert) => (
            <motion.div
              key={alert.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className={`flex items-center justify-between gap-3 p-3 rounded-lg ${
                alert.type === 'danger' ? 'bg-red-50 border border-red-200 text-red-800' :
                alert.type === 'warning' ? 'bg-yellow-50 border border-yellow-200 text-yellow-800' :
                'bg-blue-50 border border-blue-200 text-blue-800'
              }`}
            >
              <div className="flex items-center gap-3">
                <alert.icon className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium">{alert.message}</span>
              </div>
              <button
                onClick={() => setDismissedAlerts(prev => new Set([...prev, alert.id]))}
                className="p-1 hover:bg-black/10 rounded transition-colors"
                title="Dismiss alert"
              >
                <FiX className="w-4 h-4" />
              </button>
            </motion.div>
          ))}
        </div>
      )}

      {/* Collapsible Budget Flow Tracking Section */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-green-50/40 border border-green-200/50 rounded-xl shadow-sm"
      >
        {/* Always Visible Header */}
        <div className="flex items-center justify-between p-3 sm:p-4">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
              !monthlyBudget ? 'bg-gray-100' :
              budgetProgress.percentage > 100 ? 'bg-red-100' :
              budgetProgress.percentage > 80 ? 'bg-amber-100' : 'bg-green-100'
            }`}>
              <FiDollarSign className={`w-5 h-5 ${
                !monthlyBudget ? 'text-gray-600' :
                budgetProgress.percentage > 100 ? 'text-red-600' :
                budgetProgress.percentage > 80 ? 'text-amber-600' : 'text-green-600'
              }`} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-green-800">Budget Tracker</h3>
                {monthlyBudget && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                    budgetProgress.percentage > 100 ? 'bg-red-100 text-red-700' :
                    budgetProgress.percentage > 80 ? 'bg-amber-100 text-amber-700' : 'bg-green-100 text-green-700'
                  }`}>
                    {budgetProgress.percentage.toFixed(0)}% Used
                  </span>
                )}
              </div>
              {monthlyBudget ? (
                <p className="text-sm text-green-600">
                  ₦{(budgetProgress.spent || 0).toLocaleString()} / ₦{parseFloat(monthlyBudget.budget_amount).toLocaleString()}
                </p>
              ) : (
                <p className="text-sm text-gray-500">No budget set</p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowBudgetDetails(!showBudgetDetails)}
              className="p-2 hover:bg-green-100 rounded-lg transition-colors"
              title={showBudgetDetails ? 'Collapse Details' : 'Show Details'}
            >
              {showBudgetDetails ? <FiMinimize2 className="w-4 h-4 text-green-600" /> : <FiMaximize2 className="w-4 h-4 text-green-600" />}
            </button>
            <button
              onClick={() => {
                if (monthlyBudget) {
                  // Pre-fill form with existing budget data
                  setNewBudget({
                    period_type: 'monthly',
                    month: monthlyBudget.month,
                    year: monthlyBudget.year,
                    budget_amount: monthlyBudget.budget_amount.toString(),
                    notes: monthlyBudget.notes || ''
                  });
                  setEditingBudget(true);
                }
                setShowBudgetModal(true);
              }}
              className="px-3 py-2 bg-green-500/80 text-white rounded-lg hover:bg-green-600/90 transition-all text-sm font-medium shadow-sm"
            >
              {monthlyBudget ? 'Edit' : 'Set Budget'}
            </button>
          </div>
        </div>

        {/* Collapsible Detailed Metrics */}
        <AnimatePresence>
          {showBudgetDetails && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="px-3 pb-3 sm:px-4 sm:pb-4"
            >
              {/* Real-time Flow Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Income This Month</p>
                  <p className="font-bold text-green-600">₦{(budgetProgress.actualIncome || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Expenses This Month</p>
                  <p className="font-bold text-red-600">₦{(budgetProgress.spent || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Net Flow</p>
                  <p className={`font-bold ${(budgetProgress.netFlow || 0) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(budgetProgress.netFlow || 0) >= 0 ? '+' : ''}₦{(budgetProgress.netFlow || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white/60 rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">
                    {monthlyBudget ? ((budgetProgress.savings || 0) > 0 ? 'Savings' : 'Overspent') : 'No Budget'}
                  </p>
                  <p className={`font-bold ${
                    !monthlyBudget ? 'text-gray-600' :
                    (budgetProgress.savings || 0) > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {!monthlyBudget ? 'Set Budget' : 
                     (budgetProgress.savings || 0) > 0 ? `+₦${(budgetProgress.savings || 0).toLocaleString()}` : 
                     `-₦${(budgetProgress.overspent || 0).toLocaleString()}`}
                  </p>
                </div>
              </div>

              {/* Budget Progress Bar (only if budget exists) */}
              {monthlyBudget && (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-green-700">
                      Budget: ₦{parseFloat(monthlyBudget.budget_amount).toLocaleString()}
                    </span>
                    <span className="text-sm font-medium">
                      {(budgetProgress.percentage || 0).toFixed(1)}% used
                    </span>
                  </div>
                  <div className="w-full bg-green-200/50 rounded-full h-3">
                    <div 
                      className={`h-3 rounded-full transition-all duration-500 ${
                        (budgetProgress.percentage || 0) > 100 ? 'bg-red-500' :
                        (budgetProgress.percentage || 0) > 80 ? 'bg-amber-400' : 'bg-green-400'
                      }`}
                      style={{ width: `${Math.min(budgetProgress.percentage || 0, 100)}%` }}
                    />
                  </div>
                  {(budgetProgress.percentage || 0) > 100 && (
                    <div className="text-xs text-red-600 mt-1 text-center">
                      <FiAlertTriangle className="w-3 h-3 inline mr-1" />Over budget by ₦{(budgetProgress.overspent || 0).toLocaleString()}
                    </div>
                  )}
                </div>
              )}

              {/* Flow Status Indicator */}
              <div className={`mt-4 p-3 rounded-lg ${
                budgetProgress.flowStatus === 'positive' ? 'bg-green-100 border border-green-300' :
                budgetProgress.flowStatus === 'negative' ? 'bg-red-100 border border-red-300' :
                'bg-gray-100 border border-gray-300'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                    {budgetProgress.flowStatus === 'positive' ? <FiArrowUp className="w-5 h-5 text-green-600" /> : 
                     budgetProgress.flowStatus === 'negative' ? <FiArrowDown className="w-5 h-5 text-red-600" /> : 
                     <FiActivity className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <p className={`font-semibold text-sm ${
                      budgetProgress.flowStatus === 'positive' ? 'text-green-800' :
                      budgetProgress.flowStatus === 'negative' ? 'text-red-800' :
                      'text-gray-800'
                    }`}>
                      {budgetProgress.flowStatus === 'positive' ? 'Positive Cash Flow' :
                       budgetProgress.flowStatus === 'negative' ? 'Negative Cash Flow' :
                       'Neutral Cash Flow'}
                    </p>
                    <p className="text-xs text-gray-600">
                      {budgetProgress.flowStatus === 'positive' ? 'Income exceeds expenses' :
                       budgetProgress.flowStatus === 'negative' ? 'Expenses exceed income' :
                       'Income equals expenses'}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Mobile-Optimized Controls */}
      <div className="bg-white rounded-lg sm:rounded-xl p-3 sm:p-6 shadow-sm border border-gray-200">
        {/* Top Row - Search and Period */}
        <div className="flex flex-col sm:flex-row gap-3 mb-4">
          <div className="relative flex-1">
            <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search by description, amount, category, store, date..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full text-sm"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                title="Clear search"
              >
                <FiX className="w-4 h-4" />
              </button>
            )}
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
      <div className="bg-white rounded-lg sm:rounded-xl shadow-sm border border-gray-200 overflow-hidden" data-search-results>
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
          <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto custom-scrollbar">
            {/* Expenses */}
            {filteredExpenses.map((expense) => (
              <div key={`expense-${expense.id}`} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 truncate">{expense.description}</p>
                    <p className="text-sm text-gray-600">{expense.category}</p>
                  </div>
                  <div className="text-right ml-4">
                    <p className="font-semibold text-red-600">-₦{(expense.amount || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getStatusIcon(expense.status)}
                      <span className="text-xs capitalize">{expense.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(expense.date).toLocaleDateString()}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditRecord('expense', expense)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({
                        type: 'expense',
                        id: expense.id,
                        description: expense.description
                      })}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
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
                    <p className="font-semibold text-green-600">+₦{(inc.amount || 0).toLocaleString()}</p>
                    <div className="flex items-center gap-1 justify-end mt-1">
                      {getStatusIcon(inc.status)}
                      <span className="text-xs capitalize">{inc.status}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-500">{new Date(inc.date).toLocaleDateString()}</span>
                  <div className="flex gap-1">
                    <button
                      onClick={() => handleEditRecord('income', inc)}
                      className="text-blue-600 hover:text-blue-900 p-1"
                      title="Edit"
                    >
                      <FiEdit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirm({
                        type: 'income',
                        id: inc.id,
                        description: inc.description
                      })}
                      className="text-red-600 hover:text-red-900 p-1"
                      title="Delete"
                    >
                      <FiTrash2 className="w-4 h-4" />
                    </button>
                  </div>
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
            <tbody className="bg-white divide-y divide-gray-200 max-h-96 overflow-y-auto custom-scrollbar">
              {/* Expenses */}
              {filteredExpenses.map((expense) => (
                <tr key={`expense-${expense.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{expense.description}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{expense.category}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-red-600">
                    -₦{(expense.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(expense.status)}
                      <span className="text-sm capitalize">{expense.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditRecord('expense', expense)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({
                          type: 'expense',
                          id: expense.id,
                          description: expense.description
                        })}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
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
                    +₦{(inc.amount || 0).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(inc.status)}
                      <span className="text-sm capitalize">{inc.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleEditRecord('income', inc)}
                        className="text-blue-600 hover:text-blue-900 p-1"
                        title="Edit"
                      >
                        <FiEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm({
                          type: 'income',
                          id: inc.id,
                          description: inc.description
                        })}
                        className="text-red-600 hover:text-red-900 p-1"
                        title="Delete"
                      >
                        <FiTrash2 className="w-4 h-4" />
                      </button>
                    </div>
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
        message="FINANCIAL RECORD WARNING: This action cannot be undone and will permanently delete this record from your financial books."
        itemName={deleteConfirm?.description}
        description="Deleting financial records affects your accounting accuracy and audit trail. This action requires double confirmation for financial compliance."
        confirmText="DELETE FINANCIAL RECORD"
        cancelText="Keep Record Safe"
      />

      {/* Edit Record Modal */}
      {showEditModal && editingRecord && (
        <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Record">
          <form onSubmit={(e) => {
            e.preventDefault()
            handleUpdateRecord(editingRecord)
          }} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
              <input
                type="text"
                value={editingRecord.description}
                onChange={(e) => setEditingRecord({...editingRecord, description: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
              <SmartNumberInput
                value={editingRecord.amount}
                onChange={(value) => setEditingRecord({...editingRecord, amount: value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                placeholder="0.00"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <CustomDropdown
                options={statusOptions}
                value={editingRecord.status}
                onChange={(value) => setEditingRecord({...editingRecord, status: value})}
                placeholder="Select Status"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
              <input
                type="date"
                value={editingRecord.date}
                onChange={(e) => setEditingRecord({...editingRecord, date: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                required
              />
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700"
              >
                Update Record
              </button>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
              >
                Cancel
              </button>
            </div>
          </form>
        </Modal>
      )}

      {/* Budget Management Modal */}
      <Modal isOpen={showBudgetModal} onClose={() => setShowBudgetModal(false)} title="Budget Management">
        <div className="space-y-6">
          {/* Enhanced Budget Flow Analysis */}
          {monthlyBudget && (
            <div className="bg-green-50 rounded-lg p-4 border border-green-200">
              <h3 className="font-semibold text-green-900 mb-4 flex items-center gap-2">
                <FiBarChart className="w-5 h-5" />
                Budget Flow Analysis
              </h3>
              
              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Budget Set</p>
                  <p className="text-lg font-bold text-green-600">₦{parseFloat(monthlyBudget.budget_amount).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Actually Spent</p>
                  <p className="text-lg font-bold text-red-600">₦{(budgetProgress.spent || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Income Earned</p>
                  <p className="text-lg font-bold text-blue-600">₦{(budgetProgress.actualIncome || 0).toLocaleString()}</p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">
                    {budgetProgress.savings > 0 ? 'Saved' : 'Overspent'}
                  </p>
                  <p className={`text-lg font-bold ${budgetProgress.savings > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {budgetProgress.savings > 0 ? '+' : '-'}₦{(budgetProgress.savings || budgetProgress.overspent || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Net Flow</p>
                  <p className={`text-lg font-bold ${budgetProgress.netFlow >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {(budgetProgress.netFlow || 0) >= 0 ? '+' : ''}₦{(budgetProgress.netFlow || 0).toLocaleString()}
                  </p>
                </div>
                <div className="bg-white rounded-lg p-3 text-center">
                  <p className="text-xs text-gray-600 mb-1">Efficiency</p>
                  <p className={`text-lg font-bold ${budgetProgress.budgetEfficiency >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {budgetProgress.budgetEfficiency.toFixed(1)}%
                  </p>
                </div>
              </div>

              {/* Flow Status Indicator */}
              <div className={`p-3 rounded-lg mb-4 ${
                budgetProgress.flowStatus === 'positive' ? 'bg-green-100 border border-green-300' :
                budgetProgress.flowStatus === 'negative' ? 'bg-red-100 border border-red-300' :
                'bg-gray-100 border border-gray-300'
              }`}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-white">
                    {budgetProgress.flowStatus === 'positive' ? <FiArrowUp className="w-5 h-5 text-green-600" /> : 
                     budgetProgress.flowStatus === 'negative' ? <FiArrowDown className="w-5 h-5 text-red-600" /> : 
                     <FiActivity className="w-5 h-5 text-gray-600" />}
                  </div>
                  <div>
                    <p className={`font-semibold ${
                      budgetProgress.flowStatus === 'positive' ? 'text-green-800' :
                      budgetProgress.flowStatus === 'negative' ? 'text-red-800' :
                      'text-gray-800'
                    }`}>
                      {budgetProgress.flowStatus === 'positive' ? 'Positive Cash Flow' :
                       budgetProgress.flowStatus === 'negative' ? 'Negative Cash Flow' :
                       'Neutral Cash Flow'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {budgetProgress.flowStatus === 'positive' ? 'Income exceeds expenses - Great job!' :
                       budgetProgress.flowStatus === 'negative' ? 'Expenses exceed income - Review spending' :
                       'Income equals expenses - Monitor closely'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Visual Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-gray-700">Budget Usage</span>
                  <span className="text-sm font-bold">
                    {budgetProgress.percentage.toFixed(1)}% of budget used
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-4">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${
                      budgetProgress.percentage > 100 ? 'bg-red-500' :
                      budgetProgress.percentage > 80 ? 'bg-amber-400' : 'bg-green-500'
                    }`}
                    style={{ width: `${Math.min(budgetProgress.percentage, 100)}%` }}
                  />
                </div>
                {budgetProgress.percentage > 100 && (
                  <p className="text-sm text-red-600 text-center">
                    <FiAlertTriangle className="w-3 h-3 inline mr-1" />Over budget by ₦{(budgetProgress.overspent || 0).toLocaleString()}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Budget Categories */}
          {budgetCategories.length > 0 && (
            <div>
              <h3 className="font-semibold text-gray-900 mb-3">Budget Categories</h3>
              <div className="space-y-3 max-h-60 overflow-y-auto custom-scrollbar">
                {budgetCategories.map((category) => (
                  <div key={category.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{category.category_name}</p>
                      <p className="text-sm text-gray-600">{category.category_type}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">₦{parseFloat(category.spent_amount || 0).toLocaleString()}</p>
                      <p className="text-sm text-gray-600">of ₦{parseFloat(category.allocated_amount).toLocaleString()}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Existing Budget Form */}
          {monthlyBudget && editingBudget && (
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FiEdit className="w-5 h-5" />
                Edit Budget
              </h3>
              <form onSubmit={handleUpdateBudget} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount (₦)</label>
                    <SmartNumberInput
                      value={newBudget.budget_amount}
                      onChange={(value) => setNewBudget({...newBudget, budget_amount: value})}
                      placeholder="100,000"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Period</label>
                    <CustomDropdown
                      options={['Monthly', 'Yearly', 'Decades']}
                      value={newBudget.period_type === 'monthly' ? 'Monthly' : newBudget.period_type === 'yearly' ? 'Yearly' : 'Decades'}
                      onChange={(value) => setNewBudget({...newBudget, period_type: value.toLowerCase()})}
                      placeholder="Select Period"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes</label>
                  <textarea
                    value={newBudget.notes}
                    onChange={(e) => setNewBudget({...newBudget, notes: e.target.value})}
                    placeholder="Budget notes or goals..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="submit"
                    disabled={creatingBudget}
                    className="flex-1 bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition-all disabled:opacity-50"
                  >
                    {creatingBudget ? 'Updating...' : 'Update Budget'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingBudget(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-all"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Create New Budget Form */}
          {!monthlyBudget && (
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Create Monthly Budget</h3>
              <form onSubmit={handleCreateBudget} className="space-y-4">
                {/* Budget Period Selection */}
                <div>
                  <CustomDropdown
                    label="Budget Period"
                    options={['Monthly', 'Yearly', 'Decades']}
                    value={newBudget.period_type === 'monthly' ? 'Monthly' : newBudget.period_type === 'yearly' ? 'Yearly' : 'Decades'}
                    onChange={(value) => setNewBudget({...newBudget, period_type: value.toLowerCase()})}
                    placeholder="Select Budget Period"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {newBudget.period_type === 'monthly' && (
                    <div>
                      <CustomDropdown
                        label="Month"
                        options={Array.from({length: 12}, (_, i) => new Date(2025, i).toLocaleString('default', { month: 'long' }))}
                        value={new Date(2025, newBudget.month - 1).toLocaleString('default', { month: 'long' })}
                        onChange={(monthName) => {
                          const monthIndex = new Date(Date.parse(monthName + " 1, 2025")).getMonth() + 1;
                          setNewBudget({...newBudget, month: monthIndex});
                        }}
                        placeholder="Select Month"
                      />
                    </div>
                  )}
                  <div>
                    <CustomDropdown
                      label="Year"
                      options={Array.from({length: 10}, (_, i) => (2025 + i).toString())}
                      value={newBudget.year.toString()}
                      onChange={(value) => setNewBudget({...newBudget, year: parseInt(value)})}
                      placeholder="Select Year"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Budget Amount (₦) - {newBudget.period_type === 'monthly' ? 'Monthly' : newBudget.period_type === 'yearly' ? 'Yearly' : 'Per Decade'}
                    </label>
                    <SmartNumberInput
                      value={newBudget.budget_amount}
                      onChange={(value) => setNewBudget({...newBudget, budget_amount: value})}
                      placeholder={newBudget.period_type === 'monthly' ? '100,000' : newBudget.period_type === 'yearly' ? '1,200,000' : '12,000,000'}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Notes (Optional)</label>
                  <textarea
                    value={newBudget.notes}
                    onChange={(e) => setNewBudget({...newBudget, notes: e.target.value})}
                    placeholder="Budget notes or goals..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                </div>
                <button
                  type="submit"
                  disabled={creatingBudget}
                  className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition-all disabled:opacity-50 shadow-sm"
                >
                  {creatingBudget ? 'Creating Budget...' : `Create ${newBudget.period_type === 'monthly' ? 'Monthly' : newBudget.period_type === 'yearly' ? 'Yearly' : 'Decade'} Budget`}
                </button>
              </form>
            </div>
          )}

          {/* Quick Actions */}
          <div className="flex gap-3">
            {monthlyBudget && (
              <button
                onClick={handleDeleteBudget}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete Budget
              </button>
            )}
            <button
              onClick={() => setShowBudgetModal(false)}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </Modal>
    </div>
  )
}