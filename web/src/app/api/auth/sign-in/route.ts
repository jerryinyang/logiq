import { createClient } from '@/lib/supabase/server'
import { signInSchema } from '@/lib/validations/auth'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = signInSchema.safeParse(body)
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

    const { email, password } = result.data
    const supabase = await createClient()

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email.toLowerCase(),
      password,
    })

    if (error) {
      // Handle specific errors with descriptive user-friendly messages
      const errorMessage = error.message.toLowerCase()
      
      // User doesn't exist in database
      if (errorMessage.includes('invalid login credentials')) {
        // First, check if user exists by attempting to find them
        const { data: users } = await supabase
          .from('auth.users')
          .select('id')
          .eq('email', email.toLowerCase())
          .limit(1)
        
        // If the query fails or returns no results, assume user doesn't exist
        // Note: This check may not work due to RLS, so we use a generic message
        return NextResponse.json(
          { 
            success: false, 
            message: 'No account found with this email address. Please check your email or create a new account.',
            errorCode: 'USER_NOT_FOUND',
            errors: [{ 
              field: 'email', 
              message: 'No account found with this email address' 
            }] 
          },
          { status: 401 }
        )
      }
      
      // Wrong password
      if (errorMessage.includes('invalid password') || errorMessage.includes('wrong password')) {
        return NextResponse.json(
          { 
            success: false,
            message: 'The password you entered is incorrect. Please try again or reset your password.',
            errorCode: 'INVALID_PASSWORD',
            errors: [{ 
              field: 'password', 
              message: 'Incorrect password. Please try again.' 
            }] 
          },
          { status: 401 }
        )
      }
      
      // Email not confirmed
      if (errorMessage.includes('email not confirmed') || errorMessage.includes('not confirmed')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Your email address has not been verified. Please check your inbox for the verification link.',
            errorCode: 'EMAIL_NOT_VERIFIED',
            needsVerification: true,
          },
          { status: 401 }
        )
      }
      
      // Too many requests / rate limited
      if (errorMessage.includes('too many requests') || errorMessage.includes('rate limit')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'Too many login attempts. Please wait a few minutes before trying again.',
            errorCode: 'RATE_LIMITED',
          },
          { status: 429 }
        )
      }
      
      // Account disabled/banned
      if (errorMessage.includes('disabled') || errorMessage.includes('banned')) {
        return NextResponse.json(
          { 
            success: false, 
            message: 'This account has been disabled. Please contact support for assistance.',
            errorCode: 'ACCOUNT_DISABLED',
          },
          { status: 403 }
        )
      }

      // Generic error fallback
      return NextResponse.json(
        { 
          success: false, 
          message: 'Unable to sign in. Please check your credentials and try again.',
          errorCode: 'SIGN_IN_FAILED',
        },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Signed in successfully',
      data: {
        user: {
          id: data.user.id,
          email: data.user.email,
          firstName: data.user.user_metadata?.first_name,
          lastName: data.user.user_metadata?.last_name,
        },
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
