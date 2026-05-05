import { NextResponse } from 'next/server'

export async function POST() {
  return NextResponse.json(
    { success: false, message: 'Auth not implemented yet. Requires Drizzle ORM migration.' },
    { status: 501 }
  )
}
