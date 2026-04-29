import { createClient } from '@/lib/supabase/server'
import { signUpSchema } from '@/lib/validations/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = signUpSchema.safeParse(body)
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

    const { firstName, lastName, email, password, profilePicture } = result.data
    const supabase = await createClient()

    // Check if user already exists by trying to get auth user
    const { data: existingUsers } = await supabase.auth.admin.listUsers()
    const existingUser = existingUsers?.users?.find(
      u => u.email?.toLowerCase() === email.toLowerCase()
    )

    if (existingUser) {
      // Check if user is already confirmed
      if (existingUser.email_confirmed_at) {
        return NextResponse.json(
          { 
            success: false, 
            errors: [{ field: 'email', message: 'An account with this email already exists. Please sign in instead.' }] 
          },
          { status: 400 }
        )
      }
      // User exists but not confirmed - we'll resend OTP below
    }

    // Sign up with Supabase Auth - skip email confirmation for now
    const { data, error } = await supabase.auth.signUp({
      email: email.toLowerCase(),
      password,
      options: {
        data: {
          first_name: firstName,
          last_name: lastName,
          full_name: `${firstName} ${lastName}`,
          avatar_url: profilePicture || null,
        },
      },
    })

    if (error) {
      // Handle specific Supabase errors
      if (error.message.includes('already registered')) {
        return NextResponse.json(
          { 
            success: false, 
            errors: [{ field: 'email', message: 'An account with this email already exists. Please sign in instead.' }] 
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
      message: 'Account created successfully',
      data: {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
        } : null,
      },
    })
  } catch (err) {
    console.error('Sign up error:', err)
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
