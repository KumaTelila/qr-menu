'use client'

import { useRef } from 'react'
import { X, Download, Printer } from 'lucide-react'
import { QRCodeSVG } from 'qrcode.react'

interface Props {
  onClose: () => void
}

export default function QRModal({ onClose }: Props) {
  const menuUrl = process.env.NEXT_PUBLIC_MENU_URL || `${window.location.origin}/menu`
  const restaurantName = process.env.NEXT_PUBLIC_RESTAURANT_NAME || 'Our Menu'
  const qrRef = useRef<HTMLDivElement>(null)

  function handlePrint() {
    const printWindow = window.open('', '_blank')
    if (!printWindow || !qrRef.current) return

    const svgContent = qrRef.current.querySelector('svg')?.outerHTML || ''
    printWindow.document.write(`
      <html>
        <head>
          <title>QR Code — ${restaurantName}</title>
          <style>
            body { font-family: Georgia, serif; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; margin: 0; background: white; }
            .box { text-align: center; padding: 40px; border: 3px solid #1a1a1a; border-radius: 20px; max-width: 340px; }
            h1 { font-size: 28px; margin: 0 0 6px; color: #1a1a1a; }
            p { font-size: 13px; color: #666; margin: 0 0 20px; letter-spacing: 0.08em; text-transform: uppercase; }
            .url { font-family: monospace; font-size: 11px; color: #999; margin-top: 16px; word-break: break-all; }
            svg { display: block; margin: 0 auto; }
          </style>
        </head>
        <body>
          <div class="box">
            <h1>${restaurantName}</h1>
            <p>Scan to view menu</p>
            ${svgContent}
            <div class="url">${menuUrl}</div>
          </div>
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  function handleDownload() {
    const svg = qrRef.current?.querySelector('svg')
    if (!svg) return
    const serializer = new XMLSerializer()
    const svgStr = serializer.serializeToString(svg)
    const svgBlob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' })
    const url = URL.createObjectURL(svgBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${restaurantName.replace(/\s+/g, '-')}-menu-qr.svg`
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm">
        <div className="flex items-center justify-between p-5 border-b border-stone-100">
          <h2 className="font-semibold text-stone-900">QR Code</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-400 hover:bg-stone-100 transition"
          >
            <X size={16} />
          </button>
        </div>

        <div className="p-6 flex flex-col items-center gap-5">
          {/* QR code with branded frame */}
          <div className="border-2 border-stone-900 rounded-2xl p-5 text-center w-fit">
            <h3 className="font-display text-lg text-stone-900 mb-1">{restaurantName}</h3>
            <p className="text-[10px] text-stone-500 uppercase tracking-widest mb-4">Scan to view menu</p>
            <div ref={qrRef}>
              <QRCodeSVG
                value={menuUrl}
                size={180}
                bgColor="#ffffff"
                fgColor="#1a1a1a"
                level="H"
                includeMargin={false}
              />
            </div>
            <p className="text-[10px] text-stone-400 font-mono mt-4 break-all max-w-[180px]">
              {menuUrl}
            </p>
          </div>

          <p className="text-xs text-stone-500 text-center max-w-[240px]">
            Print and place on every table. Customers scan with their phone camera.
          </p>

          <div className="flex gap-3 w-full">
            <button
              onClick={handleDownload}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 border border-stone-200 rounded-xl text-sm text-stone-700 hover:bg-stone-50 transition"
            >
              <Download size={14} /> Download SVG
            </button>
            <button
              onClick={handlePrint}
              className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-[#1a1a1a] text-[#f5e6c8] rounded-xl text-sm font-medium hover:opacity-90 transition"
            >
              <Printer size={14} /> Print
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
