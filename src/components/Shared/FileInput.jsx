import { useState, useRef } from 'react'
import { motion } from 'framer-motion'
import { FiUploadCloud, FiImage, FiX, FiFile } from 'react-icons/fi'

export const FileInput = ({ 
  onFileSelect, 
  accept = "image/*", 
  multiple = false, 
  maxSize = 5, // MB
  preview = true,
  className = "",
  disabled = false,
  title = "Upload Files",
  description = "Drag & drop or click to select",
  showValidation = true,
  onValidationError = null
}) => {
  const [dragActive, setDragActive] = useState(false)
  const [selectedFiles, setSelectedFiles] = useState([])
  const fileInputRef = useRef(null)

  const handleFiles = (files) => {
    const fileArray = Array.from(files)
    const validFiles = []
    const errors = []

    fileArray.forEach(file => {
      if (file.size > maxSize * 1024 * 1024) {
        const error = `${file.name} is too large. Maximum size is ${maxSize}MB.`
        errors.push(error)
        if (onValidationError) {
          onValidationError(error, 'size')
        }
        return
      }
      if (accept.includes('image/') && !file.type.startsWith('image/')) {
        const error = `${file.name} is not a valid image file.`
        errors.push(error)
        if (onValidationError) {
          onValidationError(error, 'type')
        }
        return
      }
      validFiles.push(file)
    })

    if (validFiles.length > 0) {
      setSelectedFiles(multiple ? [...selectedFiles, ...validFiles] : validFiles)
      onFileSelect(multiple ? [...selectedFiles, ...validFiles] : validFiles)
    }

    return { validFiles, errors }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setDragActive(false)
    if (disabled) return
    handleFiles(e.dataTransfer.files)
  }

  const handleChange = (e) => {
    if (disabled) return
    handleFiles(e.target.files)
    // Reset input to allow selecting same file again
    e.target.value = ''
  }

  const removeFile = (index) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index)
    setSelectedFiles(newFiles)
    onFileSelect(newFiles)
  }

  const clearFiles = () => {
    setSelectedFiles([])
    onFileSelect([])
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Upload Area */}
      <div
        className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-200 ${
          dragActive
            ? 'border-green-500 bg-green-50'
            : disabled
            ? 'border-gray-200 bg-gray-50 cursor-not-allowed'
            : 'border-gray-300 bg-gray-50 hover:border-green-400 cursor-pointer'
        }`}
        onDrop={handleDrop}
        onDragOver={(e) => {
          e.preventDefault()
          if (!disabled) setDragActive(true)
        }}
        onDragLeave={(e) => {
          e.preventDefault()
          setDragActive(false)
        }}
        onClick={() => {
          if (!disabled) fileInputRef.current?.click()
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="hidden"
          disabled={disabled}
        />

        <div className="space-y-4">
          <motion.div 
            className={`mx-auto w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-300 ${
              dragActive 
                ? 'bg-gradient-to-br from-green-100 to-green-200 shadow-lg scale-110' 
                : disabled
                ? 'bg-gray-100'
                : 'bg-gradient-to-br from-gray-100 to-gray-200 hover:from-green-50 hover:to-green-100'
            }`}
            animate={{ 
              scale: dragActive ? 1.1 : 1,
              rotate: dragActive ? [0, -5, 5, 0] : 0
            }}
            transition={{ duration: 0.3 }}
          >
            <FiUploadCloud className={`w-10 h-10 transition-colors duration-300 ${
              dragActive 
                ? 'text-green-600' 
                : disabled 
                ? 'text-gray-400' 
                : 'text-gray-600 group-hover:text-green-600'
            }`} />
          </motion.div>

          <div className="text-center">
            <h3 className={`text-xl font-bold mb-2 transition-colors duration-300 ${
              disabled ? 'text-gray-400' : dragActive ? 'text-green-900' : 'text-gray-900'
            }`}>
              {dragActive ? 'Drop files here!' : title}
            </h3>
            <p className={`text-sm mb-3 transition-colors duration-300 ${
              disabled ? 'text-gray-400' : dragActive ? 'text-green-700' : 'text-gray-600'
            }`}>
              {dragActive 
                ? 'Release to upload your files' 
                : description
              }
            </p>
            {showValidation && (
              <div className="flex items-center justify-center gap-4 text-xs text-gray-500 mb-4">
                <span className="flex items-center gap-1">
                  <FiFile className="w-3 h-3" />
                  {accept.includes('image/') ? 'Images only' : 'All files'}
                </span>
                <span>•</span>
                <span>Max {maxSize}MB each</span>
                {multiple && (
                  <>
                    <span>•</span>
                    <span>Multiple files</span>
                  </>
                )}
              </div>
            )}
          </div>

          {!disabled && (
            <motion.button
              type="button"
              className="px-8 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 hover:from-green-700 hover:to-green-800"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={(e) => {
                e.stopPropagation()
                fileInputRef.current?.click()
              }}
            >
              <div className="flex items-center gap-2">
                <FiUploadCloud className="w-5 h-5" />
                Choose {multiple ? 'Files' : 'File'}
              </div>
            </motion.button>
          )}
        </div>
      </div>

      {/* File Preview */}
      {preview && selectedFiles.length > 0 && (
        <motion.div 
          className="space-y-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between">
            <h4 className="font-semibold text-gray-900 flex items-center gap-2">
              <FiImage className="w-5 h-5 text-green-600" />
              Selected Files ({selectedFiles.length})
            </h4>
            <motion.button
              onClick={clearFiles}
              className="text-sm text-red-600 hover:text-red-700 font-medium px-3 py-1 rounded-lg hover:bg-red-50 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Clear All
            </motion.button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {selectedFiles.map((file, index) => (
              <motion.div
                key={index}
                className="relative bg-white border border-gray-200 rounded-xl p-4 group hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                <div className="flex items-start gap-3">
                  {file.type.startsWith('image/') ? (
                    <div className="w-16 h-16 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0 shadow-sm">
                      <img
                        src={URL.createObjectURL(file)}
                        alt={file.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm">
                      <FiFile className="w-8 h-8 text-gray-500" />
                    </div>
                  )}

                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate mb-1">
                      {file.name}
                    </p>
                    <p className="text-xs text-gray-500 mb-2">
                      {(file.size / 1024).toFixed(1)} KB
                    </p>
                    <div className="flex items-center gap-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span className="text-xs text-green-600 font-medium">Ready</span>
                    </div>
                  </div>

                  <motion.button
                    onClick={() => removeFile(index)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <FiX className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  )
}