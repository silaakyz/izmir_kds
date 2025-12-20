import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    // Create admin client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const tcKimlik = '12345678901'
    const password = '123456'
    const email = `${tcKimlik}@belediye.gov.tr`
    const adSoyad = 'Test Kullanıcı'

    // Check if user already exists
    const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers()
    const userExists = existingUsers?.users?.some(u => u.email === email)

    if (userExists) {
      console.log('Test user already exists')
      return new Response(
        JSON.stringify({ success: true, message: 'Test kullanıcısı zaten mevcut' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Create auth user
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        tc_kimlik: tcKimlik,
        ad_soyad: adSoyad
      }
    })

    if (authError) {
      console.error('Auth error:', authError)
      throw authError
    }

    console.log('Auth user created:', authData.user?.id)

    // Create profile
    if (authData.user) {
      const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .insert({
          user_id: authData.user.id,
          tc_kimlik: tcKimlik,
          ad_soyad: adSoyad,
          unvan: 'Bütçe Yönetim Müdürü'
        })

      if (profileError) {
        console.error('Profile error:', profileError)
        // Don't throw, user is created
      } else {
        console.log('Profile created successfully')
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test kullanıcısı oluşturuldu',
        credentials: {
          tc: tcKimlik,
          password: password
        }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    return new Response(
      JSON.stringify({ success: false, error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
