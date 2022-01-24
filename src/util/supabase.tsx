import { createClient } from '@supabase/supabase-js'

const SUPABASE_KEY = process.env.REACT_APP_DB_KEY

const SUPABASE_URL = process.env.REACT_APP_DB_URL

const supabase = createClient(SUPABASE_URL!, SUPABASE_KEY!)

export default supabase;