import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Modal } from '../Shared/Modal'
import { Button } from '../Shared/Button'
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md'

export const ManageTestimonials = () => {
  const [testimonials, setTestimonials] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [formData, setFormData] = useState({ name: '', comment: '', rating: 5 })

  useEffect(() => {
    fetchTestimonials()
  }, [])

  const fetchTestimonials = async () => {
    const { data } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false })
    setTestimonials(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (editingItem) {
      await supabase.from('testimonials').update(formData).eq('id', editingItem.id)
    } else {
      await supabase.from('testimonials').insert([formData])
    }
    fetchTestimonials()
    resetForm()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this testimonial?')) {
      await supabase.from('testimonials').delete().eq('id', id)
      fetchTestimonials()
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Manage Testimonials</h2>
        <Button onClick={() => setShowModal(true)}>
          <MdAdd size={20} style={{ marginRight: '8px' }} />
          Add Testimonial
        </Button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Comment</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {testimonials.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.comment.substring(0, 50)}...</td>
                <td>{'⭐'.repeat(item.rating)}</td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEdit(item)}>
                    <MdEdit />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(item.id)}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editingItem ? 'Edit Testimonial' : 'Add Testimonial'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>Customer Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Comment</label>
            <textarea
              className="form-control"
              value={formData.comment}
              onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
              rows={4}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Rating (1-5)</label>
            <input
              type="number"
              className="form-control"
              min="1"
              max="5"
              value={formData.rating}
              onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
              required
            />
          </div>
          <Button type="submit">Save Testimonial</Button>
        </form>
      </Modal>
    </div>
  )
}
