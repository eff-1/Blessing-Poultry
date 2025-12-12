import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabaseClient'
import { Button } from '../Shared/Button'
import { FileInput } from '../Shared/FileInput'
import { useNotification } from '../Shared/NotificationSystem'
import { uploadImage } from '../../lib/utils'

export const ManageAbout = () => {
  const [content, setContent] = useState('')
  const [imageFiles, setImageFiles] = useState([])
  const [currentImage, setCurrentImage] = useState('')
  const [aboutId, setAboutId] = useState(null)
  
  const { showSuccess, showError } = useNotification()

  useEffect(() => {
    fetchAbout()
  }, [])

  const fetchAbout = async () => {
    const { data } = await supabase.from('about').select('*').single()
    if (data) {
      setContent(data.content)
      setCurrentImage(data.image_url)
      setAboutId(data.id)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    let imageUrl = currentImage

    if (imageFiles.length > 0) {
      const imageFile = imageFiles[0] // Take first file for single image upload
      imageUrl = await uploadImage(supabase, 'about-images', imageFile)
    }

    const aboutData = { content, image_url: imageUrl }

    try {
      if (aboutId) {
        await supabase.from('about').update(aboutData).eq('id', aboutId)
      } else {
        const { data } = await supabase.from('about').insert([aboutData]).select().single()
        setAboutId(data.id)
      }

      showSuccess('About section updated successfully!', {
        title: 'About Updated'
      })
      fetchAbout()
    } catch (error) {
      console.error('Error updating about:', error)
      showError('Failed to update about section. Please try again.', {
        title: 'Update Error'
      })
    }
  }

  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-6">About Section</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">About Your Farm</label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Tell your farm's story... Share your experience, values, and what makes your poultry business special."
            required
          />
          <p className="text-sm text-gray-500 mt-1">
            This content will appear on your website's About section. Share your story to connect with customers.
          </p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-3">About Section Image</label>
          
          {/* Current Image Preview */}
          {currentImage && imageFiles.length === 0 && (
            <div className="mb-4 p-4 bg-gray-50 rounded-xl border border-gray-200">
              <p className="text-sm font-medium text-gray-900 mb-3">Current Image</p>
              <img 
                src={currentImage} 
                alt="Current about image" 
                className="w-full max-w-md h-48 object-cover rounded-lg border border-gray-200 shadow-sm" 
              />
              <p className="text-xs text-gray-500 mt-2">Upload a new image to replace the current one</p>
            </div>
          )}
          
          <FileInput
            onFileSelect={setImageFiles}
            onValidationError={(error, type) => {
              if (type === 'size') {
                showError(error, { title: 'File Too Large' })
              } else if (type === 'type') {
                showError(error, { title: 'Invalid File Type' })
              }
            }}
            accept="image/*"
            multiple={false}
            maxSize={5}
            preview={true}
            title="Upload About Image"
            description="Choose an image that represents your farm or business"
            className="border-0"
          />
        </div>
        
        <div className="pt-4">
          <Button type="submit" className="w-full sm:w-auto">
            Save About Section
          </Button>
        </div>
      </form>
    </div>
  )
}
