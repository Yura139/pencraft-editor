import React, { ReactNode } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null

  return (
    <div className="pencraft-modal-overlay">
      <div className="pencraft-modal">
        <button className="pencraft-modal-close" onClick={onClose}>
          ×
        </button>
        {children}
      </div>
    </div>
  )
}
