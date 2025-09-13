import { NextResponse } from 'next/server'
import { ENV } from '@/src/lib/env'

export async function POST(request: Request) {
  try {
    const { messages } = await request.json()

    const OPENAI_API_KEY = process.env.OPENAI_API_KEY

    // Site/product context to make the bot helpful even without external knowledge
    const siteContext = `
You are the friendly M-Well website assistant.
Brand: M-Well Healthcare (organic, ayurvedic, holistic wellness).
Header nav: Home, About us, Our products (/products), Contact us (/contact).
Order: Use the "Order Now" button in the header which links to /products. There is a search bar to find items.
Top Categories: Daily Essentials, Personal Care, Diabetic Care.
Recommended Products (examples): Lama Immunity Kit, Lumax beauty cream, Vitamin C Capsules, Personal Wellness Pack.
Popular Products (examples): Keytar McSweeney's Williamsburn,re., INLIFE Immunity Plus Capsules 60's, Kee Pharma Immune Smart Capsule 60's, Daily Essentials Kit.
Images live in /public and product pages are under /products.
If users ask where to find a product, guide them to Our products or use the search bar (placeholder "search for products").
When asked about benefits, prefer general ayurvedic/wellness guidance and suggest consulting a professional for medical advice.
Keep answers concise and helpful; offer a next step (view product, search, contact).
    `

    // If no API key, return a lightweight heuristic response
    if (!OPENAI_API_KEY) {
      const last = messages?.[messages.length - 1]?.content || ''
      let reply = 'You can browse Our products from the header, or use the search bar to find items. Want me to point you to Top Categories like Daily Essentials, Personal Care, or Diabetic Care?'
      const l = String(last).toLowerCase()
      if (l.includes('price')) reply = 'Prices are shown on each product card in Our products. You can also use the search bar to find specific items.'
      if (l.includes('order') || l.includes('buy')) reply = 'Click the Order Now button in the header to jump to /products and complete your order.'
      if (l.includes('contact')) reply = 'Use the Contact us link in the header to reach our team.'
      return NextResponse.json({ content: reply })
    }

    // Call OpenAI Chat Completions API via fetch
    const payload = {
      model: 'gpt-4o-mini',
      temperature: 0.4,
      messages: [
        { role: 'system', content: siteContext },
        ...(Array.isArray(messages) ? messages : []),
      ],
    }

    const res = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    })

    if (!res.ok) {
      const text = await res.text()
      console.error('OpenAI API error', text)
      return NextResponse.json({ content: 'Sorry, I had trouble reaching AI right now. Please try again in a moment.' }, { status: 200 })
    }

    const data = await res.json()
    const content = data?.choices?.[0]?.message?.content || 'How can I help you next?'
    return NextResponse.json({ content })
  } catch (error) {
    console.error('Chat API error', error)
    return NextResponse.json({ content: 'Something went wrong. Please try again.' }, { status: 200 })
  }
}


