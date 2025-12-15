import { useState } from 'react'
import { X } from 'lucide-react'

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/80 backdrop-blur-sm">
      <div className="relative w-full max-w-sm bg-gray-900 rounded-2xl overflow-hidden shadow-2xl">
        <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
          <h2 className="text-base font-semibold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/60 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

const CalculatorComponent = ({ isOpen, onClose, onResult }) => {
  const [display, setDisplay] = useState('0')
  const [previousValue, setPreviousValue] = useState(null)
  const [operation, setOperation] = useState(null)
  const [waitingForOperand, setWaitingForOperand] = useState(false)

  const inputNumber = (num) => {
    if (waitingForOperand) {
      setDisplay(String(num))
      setWaitingForOperand(false)
    } else {
      setDisplay(display === '0' ? String(num) : display + num)
    }
  }

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.')
      setWaitingForOperand(false)
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.')
    }
  }

  const clear = () => {
    setDisplay('0')
    setPreviousValue(null)
    setOperation(null)
    setWaitingForOperand(false)
  }

  const performOperation = (nextOperation) => {
    const inputValue = parseFloat(display)

    if (previousValue === null) {
      setPreviousValue(inputValue)
    } else if (operation) {
      const currentValue = previousValue || 0
      const newValue = calculate(currentValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(newValue)
    }

    setWaitingForOperand(true)
    setOperation(nextOperation)
  }

  const calculate = (firstValue, secondValue, operation) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue
      case '-':
        return firstValue - secondValue
      case '×':
        return firstValue * secondValue
      case '÷':
        return firstValue / secondValue
      default:
        return secondValue
    }
  }

  const handleEquals = () => {
    const inputValue = parseFloat(display)

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation)
      setDisplay(String(newValue))
      setPreviousValue(null)
      setOperation(null)
      setWaitingForOperand(true)
    }
  }

  const useResult = () => {
    const result = parseFloat(display)
    onResult(result)
    onClose()
  }

  const handleButtonClick = (btn) => {
    if (btn >= '0' && btn <= '9') {
      inputNumber(parseInt(btn))
    } else if (btn === '.') {
      inputDecimal()
    } else if (btn === 'C') {
      clear()
    } else if (btn === '=') {
      handleEquals()
    } else if (['+', '-', '×', '÷'].includes(btn)) {
      performOperation(btn)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Calculator">
      <div className="p-2 sm:p-3">
        {/* Compact Display */}
        <div 
          className="rounded-lg p-1.5 sm:p-2 mb-1.5 sm:mb-2 border border-white/10"
          style={{
            background: 'linear-gradient(145deg, rgba(0,0,0,0.4), rgba(0,0,0,0.2))'
          }}
        >
          <div 
            className="text-right text-white font-light overflow-hidden break-all"
            style={{ 
              fontSize: display.length > 8 ? '1.1rem' : '1.3rem'
            }}
          >
            ₦{parseFloat(display || 0).toLocaleString()}
          </div>
        </div>

        {/* Compact Button Grid */}
        <div className="space-y-1 sm:space-y-1.5">
          {/* Row 1: C, ÷ */}
          <div className="grid grid-cols-2 gap-1 sm:gap-1.5">
            <button
              onClick={() => handleButtonClick('C')}
              className="h-8 sm:h-10 rounded-lg font-medium text-xs sm:text-sm text-black active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #9ca3af, #6b7280)'
              }}
            >
              C
            </button>
            <button
              onClick={() => handleButtonClick('÷')}
              className="h-8 sm:h-10 rounded-lg font-medium text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #10b981, #059669)'
              }}
            >
              ÷
            </button>
          </div>

          {/* Row 2: 7, 8, 9, × */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {['7', '8', '9'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="h-8 sm:h-10 rounded-lg font-light text-sm sm:text-base text-white active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #4b5563, #374151)'
                }}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleButtonClick('×')}
              className="h-8 sm:h-10 rounded-lg font-medium text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #10b981, #059669)'
              }}
            >
              ×
            </button>
          </div>

          {/* Row 3: 4, 5, 6, - */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {['4', '5', '6'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="h-8 sm:h-10 rounded-lg font-light text-sm sm:text-base text-white active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #4b5563, #374151)'
                }}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleButtonClick('-')}
              className="h-8 sm:h-10 rounded-lg font-medium text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #10b981, #059669)'
              }}
            >
              −
            </button>
          </div>

          {/* Row 4: 1, 2, 3, + */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {['1', '2', '3'].map((btn) => (
              <button
                key={btn}
                onClick={() => handleButtonClick(btn)}
                className="h-8 sm:h-10 rounded-lg font-light text-sm sm:text-base text-white active:scale-95 transition-all"
                style={{
                  background: 'linear-gradient(145deg, #4b5563, #374151)'
                }}
              >
                {btn}
              </button>
            ))}
            <button
              onClick={() => handleButtonClick('+')}
              className="h-8 sm:h-10 rounded-lg font-medium text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #10b981, #059669)'
              }}
            >
              +
            </button>
          </div>

          {/* Row 5: 0, ., = */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            <button
              onClick={() => handleButtonClick('0')}
              className="h-8 sm:h-10 rounded-lg font-light text-sm sm:text-base col-span-2 text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #4b5563, #374151)'
              }}
            >
              0
            </button>
            <button
              onClick={() => handleButtonClick('.')}
              className="h-8 sm:h-10 rounded-lg font-light text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #4b5563, #374151)'
              }}
            >
              .
            </button>
            <button
              onClick={() => handleButtonClick('=')}
              className="h-8 sm:h-10 rounded-lg font-medium text-sm sm:text-base text-white active:scale-95 transition-all"
              style={{
                background: 'linear-gradient(145deg, #3b82f6, #2563eb)'
              }}
            >
              =
            </button>
          </div>

          {/* Compact Use Result Button */}
          <button
            onClick={useResult}
            className="w-full h-8 sm:h-10 rounded-lg font-semibold text-xs sm:text-sm text-white active:scale-95 transition-all"
            style={{
              background: 'linear-gradient(145deg, #10b981, #059669)'
            }}
          >
            Use ₦{parseFloat(display).toLocaleString()}
          </button>
        </div>
      </div>
    </Modal>
  )
}

// Named export for use in your app
export const Calculator = CalculatorComponent

// Default export for preview
export default function App() {
  const [isOpen, setIsOpen] = useState(true)
  
  const handleResult = (result) => {
    alert(`Result used: ₦${result.toLocaleString()}`)
    setIsOpen(false)
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <button
        onClick={() => setIsOpen(true)}
        className="px-8 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold text-lg shadow-xl hover:shadow-2xl active:scale-95 transition-all"
      >
        Open Calculator
      </button>
      
      <CalculatorComponent 
        isOpen={isOpen} 
        onClose={() => setIsOpen(false)}
        onResult={handleResult}
      />
    </div>
  )
}