import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qarctnyssctoosibzqik.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFhcmN0bnlzc2N0b29zaWJ6cWlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTA0MjgyNjAsImV4cCI6MjA2NjAwNDI2MH0.8ypxqQY8ONP2hJzYyeaN7L9GK07DGfSekqAU_4ARkOw'

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 