import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FiChevronDown, FiCheck } from 'react-icons/fi'

export const CustomDropdown = ({ 
  options, 
  value, 
  onChange, 
  placeholder = "Select option",
  className = "",
  allowOther = false,
  otherPlaceholder = "Please specify..."
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [showOtherInput, setShowOtherInput] = useState(false)
  const [otherValue, setOtherValue] = useState('')
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (option) => {
    if (option === 'Other' && allowOther) {
      setShowOtherInput(true)
      setIsOpen(false)
    } else {
      onChange(option)
      setIsOpen(false)
      setShowOtherInput(false)
    }
  }

  const handleOtherSubmit = () => {
    if (otherValue.trim()) {
      onChange(otherValue.trim())
      setShowOtherInput(false)
      setOtherValue('')
    }
  }

  const displayValue = value || placeholder

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Main Dropdown Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-left focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors flex items-center justify-between"
      >
        <span className={value ? 'text-gray-900' : 'text-gray-500'}>
          {displayValue}
        </span>
        <FiChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Options */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto"
          >
            {options.map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => handleSelect(option)}
                className="w-full px-3 py-2 text-left hover:bg-green-50 hover:text-green-700 transition-colors flex items-center justify-between"
              >
                <span>{option}</span>
                {value === option && <FiCheck className="w-4 h-4 text-green-600" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Other Input Field */}
      <AnimatePresence>
        {showOtherInput && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mt-2 flex gap-2"
          >
            <input
              type="text"
              value={otherValue}
              onChange={(e) => setOtherValue(e.target.value)}
              placeholder={otherPlaceholder}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500"
              autoFocus
            />
            <button
              type="button"
              onClick={handleOtherSubmit}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Add
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}