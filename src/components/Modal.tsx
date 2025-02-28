import React, { ReactNode } from "react"
import { createPortal } from "react-dom"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  title?: string
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  if (!isOpen) return null

  React.useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose()
      }
    }
    window.addEventListener("keydown", handleEscape)
    return () => window.removeEventListener("keydown", handleEscape)
  }, [onClose])

  return createPortal(
    <div className="pencraft-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="pencraft-modal" role="dialog" aria-modal="true" aria-labelledby={title ? "modal-title" : undefined}>
        <button className="pencraft-modal-close" onClick={onClose} aria-label="Закрити модальне вікно">
          ×
        </button>
        {title && <h2 id="modal-title">{title}</h2>}
        {children}
      </div>
    </div>,
    document.body // Рендеримо модальне вікно прямо в body
  )
}
