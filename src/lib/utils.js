export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN'
  }).format(price)
}

export const uploadImage = async (supabase, bucket, file) => {
  const fileExt = file.name.split('.').pop()
  const fileName = `${Math.random()}.${fileExt}`
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(fileName, file)
  
  if (error) throw error
  
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(fileName)
  
  return publicUrl
}

export const deleteImage = async (supabase, bucket, url) => {
  const fileName = url.split('/').pop()
  const { error } = await supabase.storage
    .from(bucket)
    .remove([fileName])
  
  if (error) throw error
}
