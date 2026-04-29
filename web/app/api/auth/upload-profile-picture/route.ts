import { supabaseAdmin } from '@/lib/supabase/admin'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { success: false, message: 'No file provided' },
        { status: 400 }
      )
    }

    const fileExt = file.name.split('.').pop()
    const timestamp = Date.now()
    const fileName = `${timestamp}.${fileExt}`
    const filePath = `avatars/${fileName}`

    const { data, error } = await supabaseAdmin.storage
      .from('avatars')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false,
        contentType: file.type,
      })

    if (error) {
      console.error('Storage upload error:', error.message)
      return NextResponse.json(
        { success: false, message: error.message || 'Failed to upload file. Make sure the avatars bucket exists in Supabase Storage.' },
        { status: 500 }
      )
    }

    const { data: urlData } = supabaseAdmin.storage
      .from('avatars')
      .getPublicUrl(filePath)

    return NextResponse.json({
      success: true,
      url: urlData.publicUrl,
    })
  } catch (err) {
    console.error('Upload error:', err)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}