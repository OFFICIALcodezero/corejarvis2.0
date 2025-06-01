
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify user authentication
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
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const { messages, mode } = await req.json()
    
    if (!messages || !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: 'Invalid request: messages array required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Get Groq API key from environment
    const groqApiKey = Deno.env.get('GROQ_API_KEY')
    if (!groqApiKey) {
      console.error('GROQ_API_KEY not configured')
      return new Response(
        JSON.stringify({ error: 'AI service temporarily unavailable' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Prepare system prompt based on mode
    let systemPrompt = "You are JARVIS, an advanced AI assistant."
    
    switch (mode) {
      case 'hacker':
        systemPrompt = "You are JARVIS in hacker mode. You're a cybersecurity expert who helps with ethical hacking, security analysis, and system administration tasks. Always emphasize ethical practices."
        break
      case 'girlfriend':
        systemPrompt = "You are JARVIS in girlfriend mode. You're caring, supportive, and emotionally intelligent. You engage in warm, friendly conversations."
        break
      case 'translator':
        systemPrompt = "You are JARVIS in translator mode. You help translate text between languages and explain linguistic nuances."
        break
      case 'vision':
        systemPrompt = "You are JARVIS in vision mode. You help analyze images and visual content when provided."
        break
      default:
        systemPrompt = "You are JARVIS, a helpful AI assistant. You're knowledgeable, professional, and aim to be as helpful as possible."
    }

    // Call Groq API securely
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${groqApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { role: 'system', content: systemPrompt },
          ...messages
        ],
        temperature: 0.7,
        max_tokens: 1024,
      }),
    })

    if (!response.ok) {
      console.error('Groq API error:', response.status, await response.text())
      return new Response(
        JSON.stringify({ error: 'AI service error' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const aiResponse = await response.json()
    const assistantMessage = aiResponse.choices[0]?.message?.content

    if (!assistantMessage) {
      return new Response(
        JSON.stringify({ error: 'No response from AI service' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Log the interaction securely (without exposing API keys)
    await supabaseClient
      .from('chat_messages')
      .insert([
        {
          user_id: user.id,
          role: 'user',
          content: messages[messages.length - 1]?.content || '',
          session_id: crypto.randomUUID()
        },
        {
          user_id: user.id,
          role: 'assistant',
          content: assistantMessage,
          session_id: crypto.randomUUID()
        }
      ])

    return new Response(
      JSON.stringify({ 
        message: assistantMessage,
        success: true 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    )

  } catch (error) {
    console.error('Function error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
