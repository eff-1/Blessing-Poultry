import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { useNotification } from '../Shared/NotificationSystem'
import { Modal } from '../Shared/Modal'
import { LoadingButton } from '../Shared/LoadingButton'
import { PageLoader } from '../Shared/LoadingSpinner'
import { CustomDropdown } from '../Shared/CustomDropdown'
import { Calculator } from '../Shared/Calculator'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
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
  FiFlag
} from 'react-icons/fi'

export const EnhancedFinancialManager = () => {
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
    fetchFinancialData()
  }, [selectedPeriod])

  const fetchFinancialData = async () => {
    setLoading(true)
    try {
      const startDate = getStartDate(selectedPeriod)
      
      // Fetch expenses
      const { data: expenseData, error: expenseError } = await supabase
        .from('expenses')
        .select('*')
        .gte('date', startDate)
        .order('date', { ascending: false })

      if (expenseError) throw expenseError

      // Fetch income
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

  const { totalExpenses, totalIncome, profit, profitMargin, filteredExpenses, filteredIncome } = calculateTotals()

  if (loading) {
    return <PageLoader text="Loading financial intelligence..." />
  }

  return (
    <div className="space-y-6">
      {/* Command Strip - Critical KPIs */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-xl p-6">
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-400">₦{totalIncome.toLocaleString()}</div>
            <div className="text-xs text-gray-300">Total Income</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">₦{totalExpenses.toLocaleString()}</div>
            <div className="text-xs text-gray-300">Total Expenses</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${profit >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              ₦{profit.toLocaleString()}
            </div>
            <div className="text-xs text-gray-300">Net Cash Flow</div>
          </div>
          <div className="text-center">
            <div className={`text-2xl font-bold ${profitMargin >= 0 ? 'text-green-400' : 'text-red-400'}`}>
              {profitMargin.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-300">Profit Margin</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-400">
              {expenses.filter(e => e.status === 'pending').length}
            </div>
            <div className="text-xs text-gray-300">Pending</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-400">
              {expenses.filter(e => e.status === 'flagged').length + income.filter(i => i.status === 'flagged').length}
            </div>
            <div className="text-xs text-gray-300">Flagged</div>
          </div>
        </div>
      </div>

      {/* Controls & Filters */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="flex flex-col sm:flex-row gap-4 flex-1">
            <div className="relative">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 w-full sm:w-64"
              />
            </div>
            
            <div className="flex gap-2">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Status</option>
                <option value="cleared">Cleared</option>
                <option value="pending">Pending</option>
                <option value="flagged">Flagged</option>
              </select>
              
              <select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              >
                <option value="week">This Week</option>
                <option value="month">This Month</option>
                <option value="year">This Year</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2">
            <LoadingButton
              onClick={() => setShowExpenseModal(true)}
              className="flex items-center gap-2"
            >
              <FiPlus />
              Add Expenses
            </LoadingButton>
            <LoadingButton
              onClick={() => setShowIncomeModal(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <FiPlus />
              Add Income
            </LoadingButton>
          </div>
        </div>
      </div>

      {/* Transaction Control Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Transaction Records</h3>
        </div>
        
        <div className="overflow-x-auto">
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
            <tbody className="bg-white divide-y divide-gray-200">
              {/* Expenses */}
              {filteredExpenses.map((expense) => (
                <tr key={`expense-${expense.id}`} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {new Date(expense.date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">{expense.description}</td>
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
                  <td className="px-6 py-4 text-sm text-gray-900">{inc.description}</td>
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
                  <input
                    type="number"
                    step="0.01"
                    value={record.amount}
                    onChange={(e) => updateExpenseRecord(index, 'amount', e.target.value)}
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
        message="This action cannot be undone. This will permanently delete the financial record from your books."
        itemName={deleteConfirm?.description}
        description="⚠️ WARNING: Deleting financial records affects your accounting accuracy and audit trail. Make sure this is intentional."
        confirmText="Delete Record"
        cancelText="Keep Record"
      />
    </div>
  )
}