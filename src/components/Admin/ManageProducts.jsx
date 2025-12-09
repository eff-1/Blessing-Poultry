import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { supabase } from '../../lib/supabaseClient'
import { Modal } from '../Shared/Modal'
import { Button } from '../Shared/Button'
import { uploadImage } from '../../lib/utils'
import { MdEdit, MdDelete, MdAdd } from 'react-icons/md'

export const ManageProducts = () => {
  const [products, setProducts] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: 'Eggs',
    in_stock: true,
  })
  const [imageFile, setImageFile] = useState(null)

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

    if (imageFile) {
      imageUrl = await uploadImage(supabase, 'product-images', imageFile)
    }

    const productData = { ...formData, image_url: imageUrl, price: parseFloat(formData.price) }

    if (editingProduct) {
      await supabase.from('products').update(productData).eq('id', editingProduct.id)
    } else {
      await supabase.from('products').insert([productData])
    }

    fetchProducts()
    resetForm()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this product?')) {
      await supabase.from('products').delete().eq('id', id)
      fetchProducts()
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
    })
    setShowModal(true)
  }

  const resetForm = () => {
    setShowModal(false)
    setEditingProduct(null)
    setFormData({ name: '', description: '', price: '', category: 'Eggs', in_stock: true })
    setImageFile(null)
  }

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <h2>Manage Products</h2>
        <Button onClick={() => setShowModal(true)}>
          <MdAdd size={20} style={{ marginRight: '8px' }} />
          Add Product
        </Button>
      </div>

      <div className="admin-table">
        <table>
          <thead>
            <tr>
              <th>Image</th>
              <th>Name</th>
              <th>Category</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>
                  <img src={product.image_url} alt={product.name} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '8px' }} />
                </td>
                <td>{product.name}</td>
                <td>{product.category}</td>
                <td>₦{product.price}</td>
                <td>{product.in_stock ? '✅ In Stock' : '❌ Out'}</td>
                <td>
                  <button className="action-btn edit" onClick={() => handleEdit(product)}>
                    <MdEdit />
                  </button>
                  <button className="action-btn delete" onClick={() => handleDelete(product.id)}>
                    <MdDelete />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal isOpen={showModal} onClose={resetForm} title={editingProduct ? 'Edit Product' : 'Add Product'}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Description</label>
            <textarea
              className="form-control"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={3}
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Price</label>
            <input
              type="number"
              className="form-control"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              required
            />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Category</label>
            <select
              className="form-control"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              {['Eggs', 'Broilers', 'Layers', 'Day-Old Chicks', 'Feeds'].map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>
              <input
                type="checkbox"
                checked={formData.in_stock}
                onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
              />
              {' '}In Stock
            </label>
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label>Image</label>
            <input
              type="file"
              className="form-control"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
          </div>
          <Button type="submit">Save Product</Button>
        </form>
      </Modal>
    </div>
  )
}
