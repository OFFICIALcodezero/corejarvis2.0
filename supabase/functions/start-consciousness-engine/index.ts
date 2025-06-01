
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      {
        global: {
          headers: { Authorization: req.headers.get('Authorization')! },
        },
      }
    )

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser()
    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Update system status
    const { error: updateError } = await supabaseClient
      .from('systems_status')
      .update({ 
        is_active: true, 
        updated_at: new Date().toISOString() 
      })
      .eq('system_name', 'consciousness-engine')

    if (updateError) {
      console.error('Error updating system status:', updateError)
      return new Response(
        JSON.stringify({ error: 'Failed to update system status' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the activation
    const { error: logError } = await supabaseClient
      .from('system_logs')
      .insert({
        system_name: 'consciousness-engine',
        status: 'activated',
        user_id: user.id
      })

    if (logError) {
      console.error('Error logging activation:', logError)
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Consciousness Engine started',
        system: 'consciousness-engine'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
