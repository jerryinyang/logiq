import { createClient } from '@/lib/supabase/server'
import { otpSchema } from '@/lib/validations/auth'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'

const verifyOtpInputSchema = z.object({
  email: z.string().email('Invalid email'),
  otp: otpSchema.shape.otp,
  type: z.enum(['signup', 'recovery', 'email_change']).default('signup'),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validate input
    const result = verifyOtpInputSchema.safeParse(body)
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

    const { email, otp, type } = result.data
    const supabase = await createClient()

    // For signup verification, use 'email' type since we sent OTP via signInWithOtp
    const otpType = type === 'signup' ? 'email' : type === 'recovery' ? 'recovery' : 'email_change'

    const { data, error } = await supabase.auth.verifyOtp({
      email: email.toLowerCase(),
      token: otp,
      type: otpType,
    })

    if (error) {
      if (error.message.includes('expired')) {
        return NextResponse.json(
          { 
            success: false, 
            errors: [{ field: 'otp', message: 'This code has expired. Please request a new one.' }] 
          },
          { status: 400 }
        )
      }

      if (error.message.includes('invalid')) {
        return NextResponse.json(
          { 
            success: false, 
            errors: [{ field: 'otp', message: 'Invalid code. Please check and try again.' }] 
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
      message: 'Email verified successfully',
      data: {
        user: data.user ? {
          id: data.user.id,
          email: data.user.email,
        } : null,
      },
    })
  } catch {
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}
