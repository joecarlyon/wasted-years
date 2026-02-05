'use client'

import { useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import Image from 'next/image'

interface ImageLightboxProps {
  src: string
  alt: string
  thumbnailWidth?: number
  thumbnailHeight?: number
}

export default function ImageLightbox({
  src,
  alt,
  thumbnailWidth = 250,
  thumbnailHeight = 320,
}: ImageLightboxProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  return (
    <>
      {/* Thumbnail */}
      <button
        onClick={() => setIsOpen(true)}
        className="cursor-zoom-in transition-opacity hover:opacity-80"
      >
        <Image
          src={src}
          alt={alt}
          width={thumbnailWidth}
          height={thumbnailHeight}
          className="rounded border border-border"
        />
      </button>

      {/* Lightbox overlay - rendered via portal to escape stacking context */}
      {mounted &&
        isOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 p-4"
            onClick={() => setIsOpen(false)}
          >
            <button
              className="absolute right-4 top-4 text-3xl text-white/70 transition-colors hover:text-white"
              onClick={() => setIsOpen(false)}
            >
              &times;
            </button>
            <Image
              src={src}
              alt={alt}
              width={800}
              height={1024}
              className="max-h-[90vh] w-auto rounded"
              onClick={(e) => e.stopPropagation()}
            />
          </div>,
          document.body
        )}
    </>
  )
}
