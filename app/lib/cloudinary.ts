// Client-side Cloudinary upload for images and videos

export async function uploadToCloudinary(
  file: File,
  folder: string = 'memes'
) {
  try {
    console.log('Starting upload for:', file.name, 'Type:', file.type)
    
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', 'ml_default')
    formData.append('folder', folder)

    // Check if video or image
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'
    
    console.log('Resource type:', resourceType)
    
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    
    if (!cloudName) {
      throw new Error('Cloudinary cloud name not configured')
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`
    console.log('Uploading to:', uploadUrl)

    const response = await fetch(uploadUrl, {
      method: 'POST',
      body: formData,
    })

    const result = await response.json()
    
    if (!response.ok) {
      console.error('Upload failed:', result)
      throw new Error(result.error?.message || 'Upload failed')
    }

    console.log('Upload successful:', result)

    return {
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width || 0,
      height: result.height || 0,
      duration: result.duration || 0,
      resourceType: result.resource_type || 'image',
    }
  } catch (error) {
    console.error('Cloudinary upload error:', error)
    throw error
  }
}

export async function deleteFromCloudinary(publicId: string) {
  console.log('Delete requested for:', publicId)
  return true
}

export function getOptimizedUrl(
  publicId: string,
  width?: number,
  height?: number
) {
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  return `https://res.cloudinary.com/${cloudName}/image/upload/w_${width || 800},h_${height || 800},c_limit,q_auto,f_auto/${publicId}`
}