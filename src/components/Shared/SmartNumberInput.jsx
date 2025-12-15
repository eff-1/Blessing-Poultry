import { useState, useEffect } from 'react'

export const SmartNumberInput = ({ 
  value, 
  onChange, 
  placeholder = "0.00",
  className = "",
  ...props 
}) => {
  const [displayValue, setDisplayValue] = useState('')
  const [isFocused, setIsFocused] = useState(false)

  useEffect(() => {
    if (value && !isFocused) {
      // Format the number with commas for display when not focused
      const numValue = parseFloat(value.toString().replace(/,/g, ''))
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toLocaleString())
      } else {
        setDisplayValue(value)
      }
    } else if (!value) {
      setDisplayValue('')
    }
  }, [value, isFocused])

  const formatAsYouType = (inputValue) => {
    // Remove all non-numeric characters except decimal point
    let cleanValue = inputValue.replace(/[^0-9.]/g, '')
    
    // Ensure only one decimal point
    const parts = cleanValue.split('.')
    if (parts.length > 2) {
      cleanValue = parts[0] + '.' + parts.slice(1).join('')
    }
    
    // Limit decimal places to 2
    if (parts.length === 2 && parts[1].length > 2) {
      cleanValue = parts[0] + '.' + parts[1].substring(0, 2)
    }
    
    // Limit to reasonable number (prevent overflow)
    const numValue = parseFloat(cleanValue)
    if (numValue > 999999999) {
      return displayValue // Don't allow numbers larger than 999,999,999
    }
    
    // Format with commas as user types (but preserve decimal input)
    if (cleanValue) {
      const [integerPart, decimalPart] = cleanValue.split('.')
      const formattedInteger = parseInt(integerPart || '0').toLocaleString()
      
      if (decimalPart !== undefined) {
        return formattedInteger + '.' + decimalPart
      } else if (cleanValue.endsWith('.')) {
        return formattedInteger + '.'
      } else {
        return formattedInteger
      }
    }
    
    return cleanValue
  }

  const handleChange = (e) => {
    const inputValue = e.target.value
    const formattedValue = formatAsYouType(inputValue)
    
    setDisplayValue(formattedValue)
    
    // Send raw number to parent (without commas)
    const rawValue = formattedValue.replace(/,/g, '')
    onChange(rawValue)
  }

  const handleFocus = (e) => {
    setIsFocused(true)
    // Show raw number when focused for easier editing
    if (value) {
      const rawValue = value.toString().replace(/,/g, '')
      setDisplayValue(rawValue)
    }
  }

  const handleBlur = (e) => {
    setIsFocused(false)
    // Format with commas when focus is lost
    if (value) {
      const numValue = parseFloat(value.toString().replace(/,/g, ''))
      if (!isNaN(numValue)) {
        setDisplayValue(numValue.toLocaleString())
      }
    }
  }

  return (
    <input
      type="text"
      value={displayValue}
      onChange={handleChange}
      onFocus={handleFocus}
      onBlur={handleBlur}
      placeholder={placeholder}
      className={`${className}`}
      inputMode="decimal"
      {...props}
    />
  )
}