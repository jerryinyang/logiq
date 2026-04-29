import { createClient } from '@supabase/supabase-js'
import 'dotenv/config'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

console.log('URL:', supabaseUrl)

const supabase = createClient(supabaseUrl, supabaseKey)

const tableName = 'test_items'

async function main() {
  console.log('\n--- INSERT DATA ---')
  const { data: insertData, error: insertError } = await supabase
    .from(tableName)
    .insert([{ name: 'Test Item', value: 42 }])
    .select()
    .single()

  if (insertError) {
    console.log('Insert error:', insertError.message)
  } else {
    console.log('Inserted:', insertData)
  }

  console.log('\n--- SELECT DATA ---')
  const { data: selectData, error: selectError } = await supabase
    .from(tableName)
    .select('*')

  if (selectError) {
    console.log('Select error:', selectError.message)
  } else {
    console.log('Current data:')
    console.table(selectData || [])
  }
}

main()