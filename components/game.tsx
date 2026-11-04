"use client"

import { memo, useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { gameMarkup } from './game-markup'

// The game script owns these DOM nodes. Dialog state must never replace them
// with the initial, empty HTML after the script has populated the puzzle.
const GameBoard = memo(function GameBoard() {
  return <div dangerouslySetInnerHTML={{__html: gameMarkup}} />
})

export function Game() {
  const [popup, setPopup] = useState<{html: string; title: string} | null>(null)
  const opener = useRef<HTMLElement | null>(null)
  useEffect(() => {
    function open(event: Event) {
      const template = document.createElement('template')
      template.innerHTML = (event as CustomEvent<string>).detail
      const heading = template.content.querySelector('h2')
      const title = heading?.textContent || 'CRUX'
      heading?.remove()
      opener.current = document.activeElement as HTMLElement
      // Existing game handlers bind to the form immediately after opening it.
      flushSync(() => setPopup({html: template.innerHTML, title}))
    }
    window.addEventListener('crux:modal', open)
    const script = document.createElement('script')
    script.type = 'module'
    script.src = '/app.js'
    document.body.append(script)
    return () => { window.removeEventListener('crux:modal', open); script.remove() }
  }, [])
  return <>
    <GameBoard />
    <Dialog open={popup !== null} onOpenChange={open => { if (!open) setPopup(null) }}>
      <DialogContent className="crux-dialog" aria-describedby={undefined}
        onCloseAutoFocus={event => {event.preventDefault(); opener.current?.focus()}}>
        <DialogTitle>{popup?.title}</DialogTitle>
        <div id="modal-content" dangerouslySetInnerHTML={{__html: popup?.html || ''}} />
      </DialogContent>
    </Dialog>
  </>
}
