import { createClient } from '@/lib/supabase/server'
import { resetPasswordSchema } from '@/lib/validations/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = resetPasswordSchema.safeParse(body)
    if (!result.success) {
      const errors = result.error.errors.map(err => ({
        field: err.path.join('.'),
        message: err.message,
      }))
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      )
    }

    const { password } = result.data
    const supabase = await createClient()

    // Get the current session - user must be authenticated via reset link
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Invalid or expired reset link. Please request a new password reset.' 
        },
        { status: 401 }
      )
    }

    const { error } = await supabase.auth.updateUser({
      password,
    })

    if (error) {
      if (error.message.includes('same as your old password')) {
        return NextResponse.json(
          { 
            success: false, 
            errors: [{ field: 'password', message: 'New password must be different from your old password' }] 
          },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { success: false, message: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Password has been reset successfully',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
