import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { uploadImage } from '../../lib/utils'
import { Button } from '../Shared/Button'
import { Modal } from '../Shared/Modal'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
import { FileInput } from '../Shared/FileInput'
import { useNotification } from '../Shared/NotificationSystem'
import { FiTrash2, FiUploadCloud, FiImage } from 'react-icons/fi'

// Image compression utility
const compressImage = (file, maxWidth = 1200, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      // Calculate new dimensions
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      
      // Draw and compress
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob((blob) => {
        // Preserve original file name and type
        blob.name = file.name
        blob.lastModified = Date.now()
        resolve(blob)
      }, 'image/jpeg', quality)
    }
    
    img.onerror = () => {
      console.error('Failed to load image for compression')
      resolve(file) // Return original file if compression fails
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const ManageGallery = () => {
  const [images, setImages] = useState([])
  const [uploading, setUploading] = useState(false)
  const [loading, setLoading] = useState(true)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [uploadProgress, setUploadProgress] = useState('')
  const [pendingFiles, setPendingFiles] = useState([])
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [fileDescriptions, setFileDescriptions] = useState({})
  
  const { showSuccess, showError, showWarning } = useNotification()

  useEffect(() => {
    fetchGallery()
  }, [])

  const fetchGallery = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase.from('gallery').select('*').order('created_at', { ascending: false })
      
      if (error) {
        console.error('Error fetching gallery:', error)
        setImages([])
      } else {
        setImages(data || [])
      }
    } catch (error) {
      console.error('Error fetching gallery:', error)
      setImages([])
    } finally {
      setLoading(false)
    }
  }

  const processFilesWithDescriptions = async (files, descriptions) => {
    setUploading(true)
    setUploadProgress('')

    try {
      const fileArray = Array.from(files)
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        const desc = descriptions[i] || {}
        
        setUploadProgress(`Processing ${i + 1}/${fileArray.length}: ${file.name}`)
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not an image file`, {
            title: 'Invalid File Type'
          })
          continue
        }
        
        // Validate file size (max 5MB before compression)
        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 5MB allowed.`, {
            title: 'File Too Large'
          })
          continue
        }
        
        // Show original size
        const originalSize = (file.size / 1024).toFixed(1)
        setUploadProgress(`🔄 Compressing ${file.name} (${originalSize}KB)...`)
        
        // Compress image
        const compressedFile = await compressImage(file)
        const compressedSize = (compressedFile.size / 1024).toFixed(1)
        const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1)
        
        setUploadProgress(`📤 Uploading ${file.name} (${compressedSize}KB, ${savings}% smaller)...`)
        
        // Upload compressed image to gallery-images bucket
        const imageUrl = await uploadImage(supabase, 'gallery-images', compressedFile)
        
        // Insert into gallery table with proper column names
        await supabase.from('gallery').insert([{ 
          image_url: imageUrl,
          caption: desc.name || file.name.split('.')[0].replace(/[-_]/g, ' ')
        }])
        
        setUploadProgress(`✅ ${file.name} uploaded successfully!`)
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      
      fetchGallery()
      showSuccess(`Successfully uploaded ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}!`, {
        title: 'Upload Complete'
      })
      setUploadProgress('')
    } catch (error) {
      console.error('Upload error:', error)
      showError('Failed to upload images. Please try again.', {
        title: 'Upload Error'
      })
      setUploadProgress('')
    } finally {
      setUploading(false)
    }
  }

  const processFiles = async (files) => {
    setUploading(true)
    setUploadProgress('')

    try {
      const fileArray = Array.from(files)
      
      for (let i = 0; i < fileArray.length; i++) {
        const file = fileArray[i]
        setUploadProgress(`Processing ${i + 1}/${fileArray.length}: ${file.name}`)
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
          showError(`${file.name} is not an image file`, {
            title: 'Invalid File Type'
          })
          continue
        }
        
        // Validate file size (max 5MB before compression)
        if (file.size > 5 * 1024 * 1024) {
          showError(`${file.name} is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum 5MB allowed.`, {
            title: 'File Too Large'
          })
          continue
        }
        
        // Show original size
        const originalSize = (file.size / 1024).toFixed(1)
        setUploadProgress(`🔄 Compressing ${file.name} (${originalSize}KB)...`)
        
        // Compress image
        const compressedFile = await compressImage(file)
        
        const compressedSize = (compressedFile.size / 1024).toFixed(1)
        const savings = ((1 - compressedFile.size / file.size) * 100).toFixed(1)
        
        setUploadProgress(`📤 Uploading ${file.name} (${compressedSize}KB, ${savings}% smaller)...`)
        
        // Upload compressed image to gallery-images bucket
        const imageUrl = await uploadImage(supabase, 'gallery-images', compressedFile)
        await supabase.from('gallery').insert([{ 
          image_url: imageUrl,
          caption: file.caption || file.name.split('.')[0].replace(/[-_]/g, ' ')
        }])
        
        setUploadProgress(`✅ ${file.name} uploaded successfully!`)
        await new Promise(resolve => setTimeout(resolve, 800))
      }
      
      fetchGallery()
      showSuccess(`Successfully uploaded ${fileArray.length} image${fileArray.length > 1 ? 's' : ''}!`, {
        title: 'Upload Complete'
      })
      setUploadProgress('')
    } catch (error) {
      console.error('Upload error:', error)
      showError('Failed to upload images. Please try again.', {
        title: 'Upload Error'
      })
      setUploadProgress('')
    } finally {
      setUploading(false)
    }
  }

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      setPendingFiles(files)
      
      // Initialize descriptions with file names
      const descriptions = {}
      files.forEach((file, index) => {
        descriptions[index] = {
          name: file.name.split('.')[0].replace(/[-_]/g, ' '),
          description: ''
        }
      })
      setFileDescriptions(descriptions)
      setShowUploadModal(true)
    }
  }

  const handleValidationError = (error, type) => {
    if (type === 'size') {
      showError(error, { title: 'File Too Large' })
    } else if (type === 'type') {
      showError(error, { title: 'Invalid File Type' })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    
    try {
      const { id, imageUrl, caption } = deleteConfirm
      
      // Delete from database
      const { error: dbError } = await supabase.from('gallery').delete().eq('id', id)
      
      if (dbError) throw dbError
      
      // Delete from storage if it's a Supabase storage URL
      if (imageUrl && imageUrl.includes('supabase')) {
        const fileName = imageUrl.split('/').pop()
        await supabase.storage.from('gallery-images').remove([fileName])
      }
      
      // Refresh gallery
      fetchGallery()
      
      // Clear any cached images
      if ('caches' in window) {
        caches.keys().then(names => {
          names.forEach(name => {
            caches.open(name).then(cache => {
              cache.delete(imageUrl)
            })
          })
        })
      }
      
      showSuccess(`Successfully deleted "${caption}"`, {
        title: 'Image Deleted'
      })
      
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to delete image. Please try again.', {
        title: 'Delete Error'
      })
    }
  }

  const confirmUpload = async () => {
    setShowUploadModal(false)
    
    // Process files with descriptions
    await processFilesWithDescriptions(pendingFiles, fileDescriptions)
    setPendingFiles([])
    setFileDescriptions({})
  }

  const cancelUpload = () => {
    setShowUploadModal(false)
    setPendingFiles([])
    setFileDescriptions({})
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">Manage Gallery</h2>

      {/* Upload Zone */}
      {uploading ? (
        <div className="border-2 border-dashed border-blue-400 bg-blue-50 rounded-xl p-6 md:p-8 text-center mb-8">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <h4 className="text-lg font-semibold text-blue-900 mb-2">Processing Images...</h4>
          <div className="bg-white rounded-lg p-3 mb-4 border border-blue-200 max-w-md mx-auto">
            <p className="text-sm text-blue-800 font-mono">{uploadProgress}</p>
          </div>
          <div className="w-full max-w-md mx-auto bg-blue-200 rounded-full h-3">
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 h-3 rounded-full animate-pulse transition-all duration-500" style={{ width: '60%' }}></div>
          </div>
        </div>
      ) : (
        <div className="mb-8">
          <FileInput
            onFileSelect={handleFileSelect}
            onValidationError={handleValidationError}
            accept="image/*"
            multiple={true}
            maxSize={5}
            preview={false}
            disabled={uploading}
            title="Upload Gallery Images"
            description="Drag & drop images here or click to select multiple files"
            className="group"
          />
        </div>
      )}



      {/* Images Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading gallery...</p>
        </div>
      ) : images.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiUploadCloud className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No images yet</h3>
          <p className="text-gray-600">Upload your first images to get started</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {images.map((img, index) => (
            <div
              key={img.id}
              className="relative group"
            >
              {/* Image Card */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                <div className="w-full h-48 bg-gray-50 flex items-center justify-center">
                  <img 
                    src={img.image_url} 
                    alt={img.caption || `Gallery image ${index + 1}`}
                    className="max-w-full max-h-full object-contain"
                    style={{ 
                      display: 'block',
                      width: 'auto',
                      height: 'auto',
                      maxWidth: '100%',
                      maxHeight: '100%'
                    }}
                    onError={(e) => {
                      console.error('Failed to load:', img.image_url)
                      e.target.style.display = 'none'
                      e.target.parentNode.innerHTML = `
                        <div class="flex flex-col items-center justify-center h-full text-gray-400">
                          <svg class="w-12 h-12 mb-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clip-rule="evenodd" />
                          </svg>
                          <p class="text-sm">Image not found</p>
                          <p class="text-xs mt-1 px-2 text-center break-all">${img.image_url}</p>
                        </div>
                      `
                    }}
                    onLoad={() => {
                      console.log('Loaded successfully:', img.image_url)
                    }}
                  />
                </div>
                
                {/* Image Info */}
                <div className="p-3">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {img.caption || `Gallery Image ${index + 1}`}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Added: {new Date(img.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    
                    {/* Delete Button - Always visible on mobile, hover on desktop */}
                    <button
                      className="flex-shrink-0 p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors md:opacity-0 md:group-hover:opacity-100"
                      onClick={() => setDeleteConfirm({
                        id: img.id,
                        imageUrl: img.image_url,
                        caption: img.caption || `Gallery Image ${index + 1}`
                      })}
                      title="Delete image"
                    >
                      <FiTrash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upload Confirmation Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 bg-black/50 z-[9999] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900">Add Image Details</h3>
              <p className="text-sm text-gray-600 mt-1">
                Add names and descriptions for your {pendingFiles.length} image{pendingFiles.length > 1 ? 's' : ''}
              </p>
            </div>
            
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-6">
              {pendingFiles.map((file, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex items-start gap-4">
                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <img 
                        src={URL.createObjectURL(file)} 
                        alt="Preview" 
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                    
                    <div className="flex-1 space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Image Name
                        </label>
                        <input
                          type="text"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={fileDescriptions[index]?.name || ''}
                          onChange={(e) => setFileDescriptions(prev => ({
                            ...prev,
                            [index]: { ...prev[index], name: e.target.value }
                          }))}
                          placeholder="Enter image name"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Description (Optional)
                        </label>
                        <textarea
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                          value={fileDescriptions[index]?.description || ''}
                          onChange={(e) => setFileDescriptions(prev => ({
                            ...prev,
                            [index]: { ...prev[index], description: e.target.value }
                          }))}
                          placeholder="Describe this image..."
                          rows={2}
                        />
                      </div>
                      
                      <div className="text-xs text-gray-500">
                        File: {file.name} ({(file.size / 1024).toFixed(1)}KB)
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="p-6 border-t border-gray-200 flex gap-3">
              <button
                onClick={cancelUpload}
                className="flex-1 px-4 py-2.5 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={confirmUpload}
                className="flex-1 px-4 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
              >
                Upload {pendingFiles.length} Image{pendingFiles.length > 1 ? 's' : ''}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        type="danger"
        title="Delete Image"
        message="Are you sure you want to delete this image?"
        itemName={deleteConfirm?.caption}
        description="This will permanently remove the image from your gallery and storage."
        confirmText="Delete Image"
        cancelText="Cancel"
      />
    </div>
  )
}
