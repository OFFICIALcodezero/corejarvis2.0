
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { query, per_page = 15, page = 1 } = await req.json()

    if (!query) {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    console.log(`Searching for videos with query: ${query}`)

    // Get Pexels API key from environment or use fallback
    const PEXELS_API_KEY = Deno.env.get('PEXELS_API_KEY') || 'fT6wjh0J0jL9sfYII36OrAYm0dRcPKVjn8olcad9b4lRK2gaejXZJJrv'

    const response = await fetch(`https://api.pexels.com/videos/search?query=${encodeURIComponent(query)}&per_page=${per_page}&page=${page}`, {
      headers: {
        'Authorization': PEXELS_API_KEY,
        'User-Agent': 'Jarvis Video Maker/1.0'
      }
    })

    if (!response.ok) {
      console.error('Pexels API error:', response.status, response.statusText)
      const errorText = await response.text()
      console.error('Error details:', errorText)
      
      return new Response(
        JSON.stringify({ 
          error: 'Failed to search videos from Pexels',
          details: response.status === 401 ? 'Invalid API key' : `HTTP ${response.status}`,
          status: response.status
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    const data = await response.json()
    
    console.log(`Found ${data.videos?.length || 0} videos`)

    return new Response(
      JSON.stringify(data),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error in pexels-video-search:', error)
    return new Response(
      JSON.stringify({ 
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
