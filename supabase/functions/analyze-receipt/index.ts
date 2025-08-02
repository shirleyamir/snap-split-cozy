
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import "https://deno.land/x/xhr@0.1.0/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    console.log('Starting receipt analysis...')
    
    const formData = await req.formData()
    const imageFile = formData.get('image') as File
    
    if (!imageFile) {
      console.error('No image provided')
      return new Response(
        JSON.stringify({ error: 'No image provided' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    console.log('Image received:', imageFile.name, imageFile.size, 'bytes')

    // Convert image to base64
    const bytes = await imageFile.arrayBuffer()
    const base64 = btoa(String.fromCharCode(...new Uint8Array(bytes)))
    
    console.log('Image converted to base64, length:', base64.length)
    
    const openaiApiKey = Deno.env.get('OPENAI_API_KEY')
    if (!openaiApiKey) {
      console.error('OpenAI API key not found in environment')
      throw new Error('OpenAI API key not configured')
    }

    console.log('OpenAI API key found, making request...')

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: `Analyze this receipt image and extract the items, prices, and totals. Return a JSON object with this exact structure:
{
  "items": [
    {
      "name": "item name",
      "price": 12.99,
      "quantity": 1
    }
  ],
  "total": 25.98,
  "tax": 2.10,
  "tip": 0
}

Be accurate with the prices and item names. If you can't clearly read something, make your best guess but be conservative with prices.`
              },
              {
                type: 'image_url',
                image_url: {
                  url: `data:image/jpeg;base64,${base64}`
                }
              }
            ]
          }
        ],
        max_tokens: 1000
      })
    })

    console.log('OpenAI response status:', response.status)

    const openaiResult = await response.json()
    
    if (!response.ok) {
      console.error('OpenAI API error:', openaiResult)
      throw new Error(`OpenAI API error: ${openaiResult.error?.message || 'Unknown error'}`)
    }

    console.log('OpenAI response received successfully')

    // Extract JSON from the response
    const content = openaiResult.choices[0]?.message?.content
    if (!content) {
      console.error('No content received from OpenAI')
      throw new Error('No content received from OpenAI')
    }

    console.log('OpenAI content:', content)

    // Try to parse the JSON response
    let receiptData
    try {
      // Look for JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/)
      if (jsonMatch) {
        receiptData = JSON.parse(jsonMatch[0])
        console.log('Successfully parsed receipt data:', receiptData)
      } else {
        throw new Error('No JSON found in response')
      }
    } catch (parseError) {
      console.error('JSON parse error:', parseError)
      console.error('Content that failed to parse:', content)
      // Fallback response
      receiptData = {
        items: [
          { name: "Unable to parse receipt", price: 0, quantity: 1 }
        ],
        total: 0,
        tax: 0,
        tip: 0
      }
    }

    return new Response(
      JSON.stringify(receiptData),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in analyze-receipt function:', error)
    return new Response(
      JSON.stringify({ 
        error: error.message,
        details: 'Check the function logs for more information'
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    )
  }
})
