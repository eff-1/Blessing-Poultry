import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { Modal } from '../Shared/Modal'
import { Button } from '../Shared/Button'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
import { FileInput } from '../Shared/FileInput'
import { CustomSelect } from '../Shared/CustomSelect'
import { useNotification } from '../Shared/NotificationSystem'
import { uploadImage } from '../../lib/utils'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

// Image compression utility
const compressImage = (file, maxWidth = 800, quality = 0.8) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      let { width, height } = img
      if (width > maxWidth) {
        height = (height * maxWidth) / width
        width = maxWidth
      }
      
      canvas.width = width
      canvas.height = height
      ctx.drawImage(img, 0, 0, width, height)
      canvas.toBlob(resolve, 'image/jpeg', quality)
    }
    
    img.src = URL.createObjectURL(file)
  })
}

export const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Eggs',
    in_stock: true,
    stock_quantity: 0,
    stock_status: 'in_stock', // 'in_stock', 'few_left', 'out_of_stock'
  })
  const [imageFiles, setImageFiles] = useState([])
  
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = editingProduct?.image_url

    try {
      if (imageFiles.length > 0) {
        const imageFile = imageFiles[0] // Take first file for single image upload
        
        // Compress image
        const compressedFile = await compressImage(imageFile)
        imageUrl = await uploadImage(supabase, 'product-images', compressedFile)
      }

      const productData = { 
        ...formData, 
        image_url: imageUrl, 
        price: parseFloat(formData.price),
        stock_quantity: parseInt(formData.stock_quantity) || 0
      }

      console.log('Updating product with data:', productData) // Debug log

      if (editingProduct) {
        const { error } = await supabase.from('products').update(productData).eq('id', editingProduct.id)
        if (error) throw error
      } else {
        const { error } = await supabase.from('products').insert([productData])
        if (error) throw error
      }

      fetchProducts()
      showSuccess(
        editingProduct ? 'Product updated successfully!' : 'Product created successfully!',
        { title: editingProduct ? 'Product Updated' : 'Product Created' }
      )
      resetForm()
    } catch (error) {
      console.error('Error saving product:', error)
      showError('Failed to save product. Please try again.', {
        title: 'Save Error'
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    
    try {
      const { id, name, imageUrl } = deleteConfirm
      
      // Delete from database
      const { error: dbError } = await supabase.from('products').delete().eq('id', id)
      
      if (dbError) throw dbError
      
      // Delete image from storage if it's a Supabase storage URL
      if (imageUrl && imageUrl.includes('supabase')) {
        const fileName = imageUrl.split('/').pop()
        await supabase.storage.from('product-images').remove([fileName])
      }
      
      // Refresh products list
      fetchProducts()
      
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
      
      showSuccess(`Successfully deleted "${name}"`, {
        title: 'Product Deleted'
      })
      
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to delete product. Please try again.', {
        title: 'Delete Error'
      })
    }
  }

  const handleEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      category: product.category,
      in_stock: product.in_stock,
      stock_quantity: product.stock_quantity || 0,
      stock_status: product.stock_status || 'in_stock',
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({ 
      name: '', 
      description: '', 
      price: '', 
      category: 'Eggs', 
      in_stock: true,
      stock_quantity: 0,
      stock_status: 'in_stock'
    })
    setImageFiles([])
  }

  const handleImageSelect = (files) => {
    setImageFiles(files)
  }

  const handleValidationError = (error, type) => {
    if (type === 'size') {
      showError(error, { title: 'File Too Large' })
    } else if (type === 'type') {
      showError(error, { title: 'Invalid File Type' })
    }
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Manage Products</h2>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto flex items-center justify-center gap-2">
          <FiPlus size={18} />
          Add Product
        </Button>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex gap-4">
              <img 
                src={product.image_url} 
                alt={product.name} 
                className="w-16 h-16 object-cover rounded-lg flex-shrink-0" 
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900 truncate">{product.name}</h3>
                <p className="text-sm text-gray-600">{product.category}</p>
                <p className="text-lg font-bold text-green-600">₦{product.price}</p>
                <div className="flex items-center gap-2 mt-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    product.stock_status === 'in_stock' 
                      ? 'bg-green-100 text-green-800' 
                      : product.stock_status === 'few_left'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {product.stock_status === 'in_stock' ? 'In Stock' : 
                     product.stock_status === 'few_left' ? `Few Left (${product.stock_quantity || 0})` : 
                     'Out of Stock'}
                  </span>
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(product)}
                >
                  <FiEdit size={18} />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setDeleteConfirm({
                    id: product.id,
                    name: product.name,
                    imageUrl: product.image_url
                  })}
                  title="Delete product"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Image</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Category</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Price</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Stock</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4">
                  <img 
                    src={product.image_url} 
                    alt={product.name} 
                    className="w-12 h-12 object-cover rounded-lg" 
                  />
                </td>
                <td className="px-6 py-4 font-medium text-gray-900">{product.name}</td>
                <td className="px-6 py-4 text-gray-600">{product.category}</td>
                <td className="px-6 py-4 font-semibold text-green-600">₦{product.price}</td>
                <td className="px-6 py-4">
                  <div className="flex flex-col gap-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium w-fit ${
                      product.stock_status === 'in_stock' 
                        ? 'bg-green-100 text-green-800' 
                        : product.stock_status === 'few_left'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {product.stock_status === 'in_stock' ? 'In Stock' : 
                       product.stock_status === 'few_left' ? 'Few Left' : 
                       'Out of Stock'}
                    </span>
                    {product.stock_quantity > 0 && (
                      <span className="text-xs text-gray-500">Qty: {product.stock_quantity}</span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => handleEdit(product)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => setDeleteConfirm({
                        id: product.id,
                        name: product.name,
                        imageUrl: product.image_url
                      })}
                      title="Delete product"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
              placeholder="Describe your product..."
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price (₦)</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                required
                min="0"
                step="0.01"
              />
            </div>
            
            <div>
              <CustomSelect
                label="Category"
                value={formData.category}
                onChange={(value) => setFormData({ ...formData, category: value })}
                options={[
                  { value: 'Eggs', label: 'Eggs' },
                  { value: 'Broilers', label: 'Broilers' },
                  { value: 'Layers', label: 'Layers' },
                  { value: 'Day-Old Chicks', label: 'Day-Old Chicks' },
                  { value: 'Feeds', label: 'Feeds' },
                  { value: 'Vaccines', label: 'Vaccines' },
                  { value: 'Medications', label: 'Medications' },
                  { value: 'Equipment', label: 'Equipment' },
                  { value: 'Supplements', label: 'Supplements' },
                  { value: 'Others', label: 'Others' }
                ]}
                placeholder="Select category"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Stock Quantity</label>
              <input
                type="number"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={formData.stock_quantity}
                onChange={(e) => setFormData({ ...formData, stock_quantity: parseInt(e.target.value) || 0 })}
                min="0"
                placeholder="Enter quantity"
              />
            </div>
            
            <div>
              <CustomSelect
                label="Stock Status"
                value={formData.stock_status}
                onChange={(value) => setFormData({ ...formData, stock_status: value })}
                options={[
                  { value: 'in_stock', label: 'In Stock' },
                  { value: 'few_left', label: 'Few Left' },
                  { value: 'out_of_stock', label: 'Out of Stock' }
                ]}
                placeholder="Select stock status"
              />
            </div>
          </div>
          
          <div>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
              />
              <span className="text-sm font-medium text-gray-700">Available for Sale</span>
            </label>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Product Image</label>
            
            {/* Current Image Preview */}
            {editingProduct?.image_url && imageFiles.length === 0 && (
              <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
                <div className="flex items-center gap-3">
                  <img 
                    src={editingProduct.image_url} 
                    alt="Current product image" 
                    className="w-16 h-16 object-cover rounded-lg shadow-sm" 
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Current Image</p>
                    <p className="text-xs text-gray-500">Upload a new image to replace</p>
                  </div>
                </div>
              </div>
            )}
            
            <FileInput
              onFileSelect={handleImageSelect}
              onValidationError={handleValidationError}
              accept="image/*"
              multiple={false}
              maxSize={5}
              preview={true}
              title="Upload Product Image"
              description="Choose a high-quality image for your product"
              className="border-0"
            />
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingProduct ? 'Update Product' : 'Add Product'}
            </Button>
            <Button type="button" variant="outline" onClick={resetForm} className="flex-1">
              Cancel
            </Button>
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        type="danger"
        title="Delete Product"
        message="Are you sure you want to delete this product?"
        itemName={deleteConfirm?.name}
        description="This will permanently remove the product from your catalog and storage."
        confirmText="Delete Product"
        cancelText="Cancel"
      />
    </div>
  )
}
