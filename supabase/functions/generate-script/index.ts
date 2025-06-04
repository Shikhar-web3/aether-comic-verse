
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
    const { prompt, characters = [], genre = "adventure", tone = "heroic" } = await req.json()

    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      throw new Error('OpenAI API key not configured')
    }

    const characterContext = characters.length > 0 
      ? `Characters: ${characters.map((c: any) => `${c.name} - ${c.description}`).join(', ')}`
      : ''

    const systemPrompt = `You are a professional comic book writer. Create engaging dialogue and narrative text for comic panels. 
    Focus on visual storytelling, concise dialogue, and dramatic moments. 
    Genre: ${genre}. Tone: ${tone}. ${characterContext}`

    console.log('Generating script with prompt:', prompt)

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: prompt }
        ],
        max_tokens: 500,
        temperature: 0.8,
      }),
    })

    if (!response.ok) {
      const error = await response.text()
      console.error('OpenAI API error:', error)
      throw new Error(`OpenAI API error: ${response.status}`)
    }

    const result = await response.json()
    const generatedScript = result.choices[0].message.content

    console.log('Generated script:', generatedScript)

    return new Response(
      JSON.stringify({ 
        success: true, 
        script: generatedScript 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error generating script:', error)
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message || 'Failed to generate script' 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    )
  }
})
