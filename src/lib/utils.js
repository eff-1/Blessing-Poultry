export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price)
}

export const uploadImage = async (supabase, bucket, file) => {
  // Handle cases where file might not have a name (like compressed blobs)
  const fileName = file.name || 'image'
  const fileExt = fileName.includes('.') ? fileName.split('.').pop() : 'jpg'
  const uniqueFileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
  
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(uniqueFileName, file)
  
  if (error) {
    console.error('Upload error:', error)
    throw error
  }
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(uniqueFileName)
  
  return publicUrl
}

export const deleteImage = async (supabase, bucket, url) => {
  const fileName = url.split('/').pop()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])
  
  if (error) throw error
}
