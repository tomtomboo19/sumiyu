import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://qedvukutfwbwlhlvrsvn.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFlZHZ1a3V0Zndid2xobHZyc3ZuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTg5MzcsImV4cCI6MjA4OTQ5NDkzN30.vACYcX4MViT_VgAfpIeebuAp4k3r1rY0lUsUl6J5_tE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
