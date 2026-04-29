import { createClient } from '@/lib/supabase/server'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const resendOtpSchema = z.object({
  email: z.string().email('Invalid email'),
  type: z.enum(['signup', 'recovery']).default('signup'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = resendOtpSchema.safeParse(body)
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

    const { email, type } = result.data
    const supabase = await createClient()

    if (type === 'signup') {
      // Send OTP for email verification
      const { error } = await supabase.auth.signInWithOtp({
        email: email.toLowerCase(),
        options: {
          shouldCreateUser: false,
        },
      })

      if (error) {
        // Don't reveal if email exists
        console.error('Resend OTP error:', error.message)
      }
    } else {
      const { error } = await supabase.auth.resetPasswordForEmail(email.toLowerCase(), {
        redirectTo:
          process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
          `${request.nextUrl.origin}/auth/reset-password`,
      })

      if (error) {
        console.error('Resend error:', error.message)
      }
    }

    // Always return success to prevent email enumeration
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a new code has been sent',
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
