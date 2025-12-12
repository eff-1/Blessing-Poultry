import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { Modal } from '../Shared/Modal'
import { Button } from '../Shared/Button'
import { ConfirmationModal } from '../Shared/ConfirmationModal'
import { useNotification } from '../Shared/NotificationSystem'
import { FiEdit, FiTrash2, FiPlus } from 'react-icons/fi'

export const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteConfirm, setDeleteConfirm] = useState(null)
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 5 })
  
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      if (editingItem) {
        await supabase.from('testimonials').update(formData).eq('id', editingItem.id)
        showSuccess('Testimonial updated successfully!', {
          title: 'Testimonial Updated'
        })
      } else {
        await supabase.from('testimonials').insert([formData])
        showSuccess('Testimonial created successfully!', {
          title: 'Testimonial Created'
        })
      }
      fetchTestimonials()
      resetForm()
    } catch (error) {
      console.error('Error saving testimonial:', error)
      showError('Failed to save testimonial. Please try again.', {
        title: 'Save Error'
      })
    }
  }

  const handleDelete = async () => {
    if (!deleteConfirm) return
    
    try {
      const { id, name } = deleteConfirm
      const { error } = await supabase.from('testimonials').delete().eq('id', id)
      
      if (error) throw error
      
      fetchTestimonials()
      showSuccess(`Successfully deleted testimonial from "${name}"`, {
        title: 'Testimonial Deleted'
      })
      setDeleteConfirm(null)
    } catch (error) {
      console.error('Delete error:', error)
      showError('Failed to delete testimonial. Please try again.', {
        title: 'Delete Error'
      })
    }
  }

  const handleEdit = (item) => {
    setEditingItem(item)
    setFormData({ name: item.name, comment: item.comment, rating: item.rating })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingItem(null)
    setFormData({ name: '', comment: '', rating: 5 })
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <h2 className="text-xl md:text-2xl font-bold text-gray-900">Manage Testimonials</h2>
        <Button onClick={() => setShowModal(true)} className="w-full sm:w-auto">
          <FiPlus size={20} className="mr-2" />
          Add Testimonial
        </Button>
      </div>

      {/* Mobile Cards View */}
      <div className="block md:hidden space-y-4">
        {testimonials.map((item) => (
          <motion.div
            key={item.id}
            className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex justify-between items-start mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{item.name}</h3>
                <div className="flex text-yellow-400 text-sm mt-1">
                  {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                </div>
              </div>
              <div className="flex gap-2">
                <button 
                  className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  onClick={() => handleEdit(item)}
                >
                  <FiEdit size={18} />
                </button>
                <button 
                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  onClick={() => setDeleteConfirm({
                    id: item.id,
                    name: item.name
                  })}
                  title="Delete testimonial"
                >
                  <FiTrash2 size={18} />
                </button>
              </div>
            </div>
            <p className="text-gray-600 text-sm">{item.comment}</p>
          </motion.div>
        ))}
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full bg-white border border-gray-200 rounded-xl overflow-hidden">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Name</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Comment</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Rating</th>
              <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {testimonials.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                <td className="px-6 py-4 text-gray-600 max-w-xs truncate">{item.comment}</td>
                <td className="px-6 py-4">
                  <div className="flex text-yellow-400">
                    {'★'.repeat(item.rating)}{'☆'.repeat(5 - item.rating)}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    <button 
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                      onClick={() => handleEdit(item)}
                    >
                      <FiEdit size={18} />
                    </button>
                    <button 
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      onClick={() => setDeleteConfirm({
                        id: item.id,
                        name: item.name
                      })}
                      title="Delete testimonial"
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

      <Modal isOpen={showModal} onClose={resetForm} title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Customer Name</label>
            <input
              type="text"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              placeholder="Enter customer name"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Comment</label>
            <textarea
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              required
              placeholder="What did the customer say about your products?"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min="1"
                max="5"
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                className="flex-1"
              />
              <div className="flex text-yellow-400 text-xl">
                {'★'.repeat(formData.rating)}{'☆'.repeat(5 - formData.rating)}
              </div>
              <span className="text-sm font-medium text-gray-600 min-w-0">
                {formData.rating}/5
              </span>
            </div>
          </div>
          
          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              {editingItem ? 'Update Testimonial' : 'Add Testimonial'}
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
        title="Delete Testimonial"
        message="Are you sure you want to delete this testimonial?"
        itemName={`Testimonial from ${deleteConfirm?.name}`}
        description="This will permanently remove the testimonial from your website."
        confirmText="Delete Testimonial"
        cancelText="Cancel"
      />
    </div>
  )
}
