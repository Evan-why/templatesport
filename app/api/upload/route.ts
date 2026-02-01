import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File

    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('Uploading:', file.name, 'Type:', file.type, 'Size:', file.size)

    // Check if video or image
    const isVideo = file.type.startsWith('video/')
    const resourceType = isVideo ? 'video' : 'image'

    console.log('Resource type:', resourceType)

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const base64 = buffer.toString('base64')
    const dataURI = `data:${file.type};base64,${base64}`

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME

    if (!cloudName) {
      console.error('Cloudinary cloud name not configured')
      return NextResponse.json(
        { success: false, error: 'Cloudinary not configured' },
        { status: 500 }
      )
    }

    console.log('Uploading to Cloudinary as:', resourceType)

    // Upload to Cloudinary (image or video)
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          file: dataURI,
          upload_preset: 'ml_default',
          folder: 'memes',
        }),
      }
    )

    const cloudinaryResult = await cloudinaryResponse.json()

    if (!cloudinaryResponse.ok) {
      console.error('Cloudinary error:', cloudinaryResult)
      return NextResponse.json(
        { success: false, error: cloudinaryResult.error?.message || 'Upload failed' },
        { status: 400 }
      )
    }

    console.log('Upload successful!')

    return NextResponse.json({
      success: true,
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      resourceType: cloudinaryResult.resource_type,
      duration: cloudinaryResult.duration || 0,
    })

  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    )
  }
}