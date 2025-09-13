"use client"
import React from 'react'
import Image from 'next/image'
import { Smile, Paperclip, Send } from 'lucide-react'

export default function Chatbot() {
  const [isOpen, setIsOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<{role:'user'|'assistant', content:string}[]>([
    { role: 'assistant', content: 'Hi! I\'m the M-Well assistant. Ask about products, availability, or site features.' }
  ])
  const [input, setInput] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const [showEmojiPicker, setShowEmojiPicker] = React.useState(false)
  const endRef = React.useRef<HTMLDivElement | null>(null)

  // Predefined quick question suggestions
  const allSuggestions = [
    'What M-well Really Do?',
    'What is M-well Mission ?',
    'How to placed a Order ?'
  ] as const
  const [remainingSuggestions, setRemainingSuggestions] = React.useState<string[]>([...allSuggestions])
  const [showSuggestions, setShowSuggestions] = React.useState(true)

  const normalize = (text: string) => text.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()

  const getBotReply = (raw: string): string => {
    const text = normalize(raw)
    if (text.includes('what m well really do') || text === 'what m well really do') {
      return (
        "M-Well Healthcare offers trusted wellness and personal care products backed by ayurvedic and natural ingredients. You'll find daily essentials like Multi Vitamin Softgels, Men Care tonic, Super Herbs, All Clear (digestive support), Anti Anxiety drops, Women Care syrup, and Anti Addiction drops. We focus on quality, simplicity, and results—helping you boost energy, immunity, and overall well-being."
      )
    }
    if (text.includes('what is m well mission') || text === 'what is m well mission') {
      return (
        "Our mission is to make everyday wellness simple, effective, and accessible. We aim to improve lives with safe, natural formulations, clear guidance, and caring support—prioritizing quality, customer trust, and long-term health outcomes."
      )
    }
    if (text.includes('how to placed a order') || text.includes('how to place a order') || text.includes('how to place an order')) {
      return (
        "Placing an order is easy: 1) Open the Shop and pick a product. 2) Tap the product to view details. 3) Click ‘Add to Cart’. 4) Open the Cart to review items. 5) Proceed with the on-screen steps. Need help? Call 1800-891-2871 or email sales@mwellhealthcare.com."
      )
    }
    // Default reply for any other input
    return "our developer Girish Goswami Boss is working on automation backend process so please stay updated with us. it will working soon.. 🙂"
  }

  const send = async (e?: React.FormEvent, overrideContent?: string, isSuggestion?: boolean) => {
    e?.preventDefault()
    const content = (overrideContent ?? input).trim()
    if (!content) return
    setMessages((m) => [...m, { role: 'user', content }])
    setInput('')
    // Typing indicator
    setIsTyping(true)
    // Local reply logic with delay (3-4 seconds)
    const reply = getBotReply(content)
    const delay = 3000 + Math.floor(Math.random() * 1000)
    window.setTimeout(() => {
      setMessages((m) => [...m, { role: 'assistant', content: reply }])
      setIsTyping(false)
      if (isSuggestion) {
        // Remove the used suggestion
        const next = remainingSuggestions.filter((s) => s !== content)
        // If all used, reset the list to all suggestions
        const updated = next.length === 0 ? [...allSuggestions] : next
        setRemainingSuggestions(updated)
        setShowSuggestions(true)
      }
    }, delay)
  }

  const handleSuggestionClick = (text: string) => {
    // Hide all suggestions while typing, then show remaining after reply
    setShowSuggestions(false)
    send(undefined, text, true)
  }

  const handleAddEmoji = (emoji: string) => {
    setInput((prev) => prev + emoji)
    setShowEmojiPicker(false)
  }

  // Auto-scroll to the latest message / typing indicator
  React.useEffect(() => {
    // Defer to allow DOM to paint first
    const id = window.setTimeout(() => {
      endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }, 0)
    return () => window.clearTimeout(id)
  }, [messages, isTyping])

  const handleAttachLink = () => {
    const url = typeof window !== 'undefined' ? window.prompt('Paste a link (URL):') : ''
    if (!url) return
    // Basic prepend if no protocol
    const formatted = /^(https?:)?\/\//i.test(url) ? url : `https://${url}`
    setInput((prev) => (prev ? prev + ' ' + formatted : formatted))
  }

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full px-5 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 hover:shadow-xl transition-all hover:-translate-y-0.5"
        >
          Chat with us
        </button>
      )}
      {isOpen && (
        <div className="w-96 sm:w-[30rem] h-[34rem] bg-white/95 backdrop-blur dark:bg-gray-800/95 rounded-2xl shadow-[0_20px_60px_-20px_rgba(0,0,0,0.4)] border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
          <div className="relative">
            <div className="h-20 bg-gradient-to-r from-primary-600 via-pink-500 to-yellow-500" />
            <div className="absolute top-3 right-3 flex gap-2">
              <button onClick={() => setIsOpen(false)} className="w-8 h-8 rounded-full bg-white/20 text-white hover:bg-white/30">×</button>
            </div>
            <div className="absolute left-4 bottom-3 flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-white overflow-hidden shadow ring-1 ring-gray-200 flex items-center justify-center">
                <Image src="/smallwell.png" alt="M-Well" width={40} height={40} className="object-cover" />
              </div>
              <div className="leading-tight">
                <div className="font-semibold text-white">M-Well Assistant</div>
                <div className="text-[12px] text-white/80">Ask about products, orders, help</div>
                {isTyping && (
                  <div className="mt-0.5 text-[11px] text-white/90 flex items-center gap-1">
                    <span>typing</span>
                    <span className="animate-pulse">...</span>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto p-4 pt-4 space-y-3">
            {messages.map((m, i) => (
              m.role === 'assistant' ? (
                <div key={i} className="flex items-start gap-3">
                  <div className="flex-none w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full bg-white overflow-hidden shadow ring-1 ring-gray-200 flex items-center justify-center">
                    <Image src="/smallwell.png" alt="Assistant" width={40} height={40} className="object-cover" />
                  </div>
                  <div className="inline-block px-3 py-2 rounded-2xl text-sm bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-100 shadow-sm max-w-[80%] break-words whitespace-pre-wrap">
                    {m.content}
                  </div>
                </div>
              ) : (
                <div key={i} className="text-right">
                  <div className="inline-block px-3 py-2 rounded-2xl text-sm bg-primary-600 text-white shadow-md max-w-[80%] break-words whitespace-pre-wrap text-left">
                    {m.content}
                  </div>
                </div>
              )
            ))}
            {isTyping && (
              <div className="flex items-start gap-3">
                <div className="flex-none w-10 h-10 min-w-[40px] min-h-[40px] max-w-[40px] max-h-[40px] rounded-full bg-white overflow-hidden shadow ring-1 ring-gray-200 flex items-center justify-center">
                  <Image src="/smallwell.png" alt="Assistant" width={40} height={40} className="object-cover" />
                </div>
                <div className="inline-flex items-center gap-1 px-3 py-2 rounded-2xl bg-gray-100 shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'0ms'}} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'150ms'}} />
                  <span className="w-2 h-2 rounded-full bg-gray-500 animate-bounce" style={{animationDelay:'300ms'}} />
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>
          <div className="p-3 border-t border-gray-200 dark:border-gray-700 bg-white/70 dark:bg-gray-800/70">
            <form onSubmit={send} className="flex items-center gap-2">
              {/* Left action icons */}
              <div className="flex items-center gap-2 pl-1">
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setShowEmojiPicker((v) => !v)}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-300"
                    title="Insert emoji"
                  >
                    <Smile className="w-5 h-5" />
                  </button>
                  {showEmojiPicker && (
                    <div className="absolute bottom-12 left-0 w-56 max-w-[14rem] bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg p-2 grid grid-cols-6 gap-1 z-50 max-h-40 overflow-y-auto">
                      {['😀','😁','😂','😊','😍','😇','😎','🤗','👍','🙏','✨','💪','🥳','🤝','🛒','📦','💬','📞','📧','🙂'].map(e => (
                        <button key={e} type="button" className="px-1 py-0.5 hover:bg-gray-100 dark:hover:bg-gray-600 rounded" onClick={() => handleAddEmoji(e)} aria-label={`emoji ${e}`}>
                          {e}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <button
                  type="button"
                  onClick={handleAttachLink}
                  disabled
                  className="p-2 rounded-full text-gray-400 dark:text-gray-500 opacity-60 cursor-not-allowed"
                  title="Attach link (disabled)"
                >
                  <Paperclip className="w-5 h-5" />
                </button>
              </div>

              {/* Input with embedded send button */}
              <div className="relative flex-1">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Enter your message..."
                  className="w-full pr-12 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white text-gray-900 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#123E72] hover:opacity-90 shadow flex items-center justify-center text-white"
                  aria-label="Send message"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
            {/* Quick Suggestions below text bar */}
            {showSuggestions && remainingSuggestions.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {remainingSuggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSuggestionClick(s)}
                    className="px-3 py-1.5 text-xs rounded-full bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-200"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}


