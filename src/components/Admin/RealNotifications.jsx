import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { 
  FiAlertTriangle, 
  FiClock, 
  FiTrendingDown, 
  FiTrendingUp,
  FiFlag,
  FiCheckCircle,
  FiInfo,
  FiDollarSign
} from 'react-icons/fi'

export const RealNotifications = () => {
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    generateRealNotifications()
  }, [])

  const generateRealNotifications = async () => {
    try {
      const realNotifications = []
      
      // Get financial data
      const { data: expenses } = await supabase
        .from('expenses')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      const { data: income } = await supabase
        .from('income')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (expenses && income) {
        // Calculate totals
        const totalExpenses = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount || 0), 0)
        const totalIncome = income.reduce((sum, inc) => sum + parseFloat(inc.amount || 0), 0)
        const netFlow = totalIncome - totalExpenses

        // Check for negative cash flow
        if (netFlow < 0) {
          realNotifications.push({
            id: 'negative-flow',
            type: 'error',
            icon: FiTrendingDown,
            title: 'Negative Cash Flow Alert',
            message: `Your expenses (₦${totalExpenses.toLocaleString()}) exceeded income (₦${totalIncome.toLocaleString()}) by ₦${Math.abs(netFlow).toLocaleString()}`,
            time: 'Current period',
            priority: 'high'
          })
        }

        // Check for pending transactions
        const pendingExpenses = expenses.filter(e => e.status === 'pending').length
        const pendingIncome = income.filter(i => i.status === 'pending').length
        const totalPending = pendingExpenses + pendingIncome

        if (totalPending > 0) {
          realNotifications.push({
            id: 'pending-transactions',
            type: 'warning',
            icon: FiClock,
            title: 'Pending Transactions',
            message: `${totalPending} transaction${totalPending > 1 ? 's' : ''} require verification (${pendingExpenses} expenses, ${pendingIncome} income)`,
            time: 'Requires attention',
            priority: 'medium'
          })
        }

        // Check for flagged transactions
        const flaggedExpenses = expenses.filter(e => e.status === 'flagged').length
        const flaggedIncome = income.filter(i => i.status === 'flagged').length
        const totalFlagged = flaggedExpenses + flaggedIncome

        if (totalFlagged > 0) {
          realNotifications.push({
            id: 'flagged-transactions',
            type: 'error',
            icon: FiFlag,
            title: 'Flagged Transactions',
            message: `${totalFlagged} transaction${totalFlagged > 1 ? 's' : ''} flagged for review (${flaggedExpenses} expenses, ${flaggedIncome} income)`,
            time: 'Immediate attention required',
            priority: 'high'
          })
        }

        // Check for large transactions (over 100k)
        const largeTransactions = [
          ...expenses.filter(e => parseFloat(e.amount) > 100000),
          ...income.filter(i => parseFloat(i.amount) > 100000)
        ]

        if (largeTransactions.length > 0) {
          realNotifications.push({
            id: 'large-transactions',
            type: 'info',
            icon: FiDollarSign,
            title: 'Large Transactions Detected',
            message: `${largeTransactions.length} transaction${largeTransactions.length > 1 ? 's' : ''} over ₦100,000 recorded recently`,
            time: 'Last 7 days',
            priority: 'low'
          })
        }

        // Check for positive trends
        if (netFlow > 0 && totalIncome > totalExpenses * 1.2) {
          realNotifications.push({
            id: 'positive-trend',
            type: 'success',
            icon: FiTrendingUp,
            title: 'Strong Financial Performance',
            message: `Excellent profit margin of ${((netFlow / totalIncome) * 100).toFixed(1)}%. Income exceeds expenses by ₦${netFlow.toLocaleString()}`,
            time: 'Current period',
            priority: 'low'
          })
        }

        // Recent activity notification
        const recentTransactions = [...expenses, ...income]
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          .slice(0, 5)

        if (recentTransactions.length > 0) {
          realNotifications.push({
            id: 'recent-activity',
            type: 'info',
            icon: FiInfo,
            title: 'Recent Financial Activity',
            message: `${recentTransactions.length} new transaction${recentTransactions.length > 1 ? 's' : ''} recorded. Latest: ${recentTransactions[0].description}`,
            time: new Date(recentTransactions[0].created_at).toLocaleDateString(),
            priority: 'low'
          })
        }
      }

      // If no real notifications, show system status
      if (realNotifications.length === 0) {
        realNotifications.push({
          id: 'all-clear',
          type: 'success',
          icon: FiCheckCircle,
          title: 'All Systems Normal',
          message: 'No issues detected. Your financial system is running smoothly.',
          time: 'Current status',
          priority: 'low'
        })
      }

      // Sort by priority
      const priorityOrder = { high: 3, medium: 2, low: 1 }
      realNotifications.sort((a, b) => priorityOrder[b.priority] - priorityOrder[a.priority])

      setNotifications(realNotifications)
    } catch (error) {
      console.error('Error generating notifications:', error)
      setNotifications([{
        id: 'error',
        type: 'error',
        icon: FiAlertTriangle,
        title: 'System Error',
        message: 'Unable to load notifications. Please refresh the page.',
        time: 'Now',
        priority: 'high'
      }])
    } finally {
      setLoading(false)
    }
  }

  const getNotificationStyle = (type) => {
    switch (type) {
      case 'error':
        return 'bg-red-50 border-red-200 text-red-900'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 text-yellow-900'
      case 'success':
        return 'bg-green-50 border-green-200 text-green-900'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-900'
    }
  }

  const getIconColor = (type) => {
    switch (type) {
      case 'error':
        return 'text-red-500'
      case 'warning':
        return 'text-yellow-500'
      case 'success':
        return 'text-green-500'
      default:
        return 'text-blue-500'
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-gray-600">
          Showing {notifications.length} real-time system notification{notifications.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={generateRealNotifications}
          className="text-sm text-green-600 hover:text-green-700 font-medium"
        >
          Refresh
        </button>
      </div>

      {notifications.map((notification, index) => {
        const Icon = notification.icon
        return (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 border rounded-lg ${getNotificationStyle(notification.type)}`}
          >
            <div className="flex items-start gap-3">
              <Icon className={`w-5 h-5 mt-0.5 ${getIconColor(notification.type)}`} />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <h4 className="font-medium">{notification.title}</h4>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    notification.priority === 'high' 
                      ? 'bg-red-100 text-red-700'
                      : notification.priority === 'medium'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-gray-100 text-gray-700'
                  }`}>
                    {notification.priority}
                  </span>
                </div>
                <p className="text-sm mt-1 opacity-90">{notification.message}</p>
                <p className="text-xs mt-2 opacity-75">{notification.time}</p>
              </div>
            </div>
          </motion.div>
        )
      })}
    </div>
  )
}