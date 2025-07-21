import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://lwdqeumtozjiqzygcmsi.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx3ZHFldW10b3pqaXF6eWdjbXNpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI5MzcxMDEsImV4cCI6MjA2ODUxMzEwMX0.hUYRPbVjGPlksnyJcENBBWKW0I37UMmFug8JUf-8hvU';
 
export const supabase = createClient(supabaseUrl, supabaseAnonKey); 