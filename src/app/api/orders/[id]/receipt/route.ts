import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // Get order with details
    const order = await db.order.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true,
          },
        },
        user: true,
      },
    })

    if (!order) {
      return NextResponse.json(
        { error: 'Pesanan tidak ditemukan' },
        { status: 404 }
      )
    }

    // Import jsPDF dynamically (server-side)
    const jsPDF = (await import('jspdf')).default
    const doc = new jsPDF()

    // Restaurant info
    const restaurantName = 'AYAM GEPREK SAMBAL IJO'
    const restaurantAddress = 'Jl. Medan - Banda Aceh, Simpang Camat'
    const restaurantAddress2 = 'Gampong Tijue, 24151'
    const restaurantPhone = 'WA: 085260812758'

    // Set up PDF - Thermal receipt width style (80mm)
    const pageWidth = 80
    const margin = 5
    const contentWidth = pageWidth - (margin * 2)

    // Colors
    const primaryColor = [249, 115, 22] // Orange

    let yPos = 15

    // ========== HEADER ==========
    // Top border line
    doc.setLineWidth(0.5)
    doc.setDrawColor(...primaryColor)
    doc.line(margin, yPos, margin + contentWidth, yPos)
    yPos += 5

    // Restaurant name - large and bold
    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text(restaurantName, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 6

    // Tagline
    doc.setFontSize(8)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('🍗 Lezat • Pedas • Bikin Nagih', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 5

    // Address
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text(restaurantAddress, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 4
    doc.text(restaurantAddress2, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 4
    doc.text(restaurantPhone, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 5

    // Decorative dashed line
    doc.setLineWidth(0.3)
    doc.setDrawColor(...primaryColor)
    doc.setLineDash([2, 2])
    doc.line(margin, yPos, margin + contentWidth, yPos)
    doc.setLineDash([]) // Reset dash
    yPos += 7

    // ========== ORDER INFO ==========
    // Order number with background
    doc.setFillColor(250, 250, 250)
    doc.rect(margin, yPos - 3, contentWidth, 8, 'F')

    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(0, 0, 0)
    doc.text(`ORDER #${order.orderNumber}`, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 4

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    const dateStr = new Date(order.createdAt).toLocaleString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
    doc.text(dateStr, margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 6

    // Order details left side
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.text('Customer:', margin, yPos)
    doc.setFont('helvetica', 'bold')
    doc.text(order.user.name, margin + 20, yPos)
    yPos += 4

    doc.setFont('helvetica', 'normal')
    doc.text('Payment:', margin, yPos)
    doc.setFont('helvetica', 'bold')
    doc.text(getPaymentMethodDisplayName(order.paymentMethod), margin + 20, yPos)
    yPos += 4

    // Order details right side
    doc.setFont('helvetica', 'normal')
    doc.text('Status:', margin, yPos)
    const statusDisplay = getOrderStatusDisplay(order.status)
    const statusColor = getStatusColor(order.status)
    doc.setTextColor(...statusColor)
    doc.setFont('helvetica', 'bold')
    doc.text(statusDisplay.toUpperCase(), margin + 20, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 6

    // ========== DASHED LINE ==========
    doc.setLineWidth(0.2)
    doc.setDrawColor(150, 150, 150)
    doc.setLineDash([1.5, 1.5])
    doc.line(margin, yPos, margin + contentWidth, yPos)
    doc.setLineDash([])
    yPos += 5

    // ========== ORDER ITEMS ==========
    // Table header
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)

    // Column positions
    const colQty = margin
    const colItem = margin + 8
    const colPrice = margin + contentWidth - 18
    const colSubtotal = margin + contentWidth

    doc.text('QTY', colQty, yPos)
    doc.text('ITEM', colItem, yPos)
    doc.text('PRICE', colPrice, yPos)
    doc.text('TOTAL', colSubtotal, yPos, { align: 'right' })
    yPos += 3

    // Header underline
    doc.setLineWidth(0.3)
    doc.setDrawColor(...primaryColor)
    doc.line(margin, yPos, margin + contentWidth, yPos)
    yPos += 4

    // Items
    doc.setTextColor(0, 0, 0)
    doc.setFont('helvetica', 'normal')

    order.items.forEach((item) => {
      // Qty
      doc.text(`${item.qty}x`, colQty, yPos, { align: 'left' })

      // Item name with text wrapping
      const maxWidth = colPrice - colItem - 3
      const itemLines = doc.splitTextToSize(item.product.name, maxWidth)
      doc.text(itemLines, colItem, yPos, { lineHeightFactor: 1.2 })

      // Calculate height for multi-line items
      const itemHeight = itemLines.length * 3

      // Price and subtotal on first line
      doc.text(`Rp${item.price.toLocaleString()}`, colPrice, yPos, { align: 'right' })
      doc.text(`Rp${item.subtotal.toLocaleString()}`, colSubtotal, yPos, { align: 'right' })

      yPos += Math.max(4, itemHeight)
    })

    yPos += 2

    // ========== DASHED LINE ==========
    doc.setLineWidth(0.2)
    doc.setDrawColor(150, 150, 150)
    doc.setLineDash([1.5, 1.5])
    doc.line(margin, yPos, margin + contentWidth, yPos)
    doc.setLineDash([])
    yPos += 5

    // ========== TOTALS ==========
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')

    // Subtotal
    doc.text('Subtotal', margin, yPos)
    doc.text(`Rp ${order.subtotal.toLocaleString()}`, margin + contentWidth, yPos, { align: 'right' })
    yPos += 4

    // Tax
    doc.text('Pajak (10%)', margin, yPos)
    doc.text(`Rp ${order.tax.toLocaleString()}`, margin + contentWidth, yPos, { align: 'right' })
    yPos += 4

    // Discount if exists
    if (order.discount > 0) {
      doc.setTextColor(34, 197, 94) // Green
      doc.text('Diskon', margin, yPos)
      doc.text(`-Rp ${order.discount.toLocaleString()}`, margin + contentWidth, yPos, { align: 'right' })
      doc.setTextColor(0, 0, 0)
      yPos += 4
    }

    // Separator
    doc.setLineWidth(0.3)
    doc.setDrawColor(...primaryColor)
    doc.line(margin, yPos, margin + contentWidth, yPos)
    yPos += 5

    // Grand Total
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('TOTAL BAYAR', margin, yPos)
    doc.text(`Rp ${order.total.toLocaleString()}`, margin + contentWidth, yPos, { align: 'right' })
    doc.setTextColor(0, 0, 0)
    yPos += 6

    // ========== DASHED LINE ==========
    doc.setLineWidth(0.2)
    doc.setDrawColor(150, 150, 150)
    doc.setLineDash([1.5, 1.5])
    doc.line(margin, yPos, margin + contentWidth, yPos)
    doc.setLineDash([])
    yPos += 5

    // ========== NOTE ==========
    if (order.note) {
      doc.setFontSize(7)
      doc.setFont('helvetica', 'italic')
      doc.text(`Note: ${order.note}`, margin, yPos, { maxWidth: contentWidth })
      yPos += 5
    }

    // ========== FOOTER ==========
    yPos += 3

    // Thank you message
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('TERIMA KASIH', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 4

    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('Simpan struk ini sebagai bukti pembayaran', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 3

    doc.setFontSize(6)
    doc.setFont('helvetica', 'italic')
    doc.setTextColor(100, 100, 100)
    doc.text('Barang yang sudah dibeli tidak dapat ditukar/dikembalikan', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 5

    // Social media / contact
    doc.setFontSize(7)
    doc.setFont('helvetica', 'normal')
    doc.setTextColor(0, 0, 0)
    doc.text('📱 Follow us: @ayamgepreksambalijo', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 4

    doc.setFontSize(6)
    doc.text('⭐ Rate us & Leave Review!', margin + contentWidth / 2, yPos, { align: 'center' })
    yPos += 5

    // Bottom border line
    doc.setLineWidth(0.5)
    doc.setDrawColor(...primaryColor)
    doc.line(margin, yPos, margin + contentWidth, yPos)
    yPos += 4

    // Footer tagline
    doc.setFontSize(7)
    doc.setFont('helvetica', 'bold')
    doc.setTextColor(...primaryColor)
    doc.text('LEZAT • PEDAS • BIKIN NAGIH', margin + contentWidth / 2, yPos, { align: 'center' })

    // Add page numbers
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.setFontSize(6)
      doc.setFont('helvetica', 'normal')
      doc.setTextColor(150, 150, 150)
      doc.text(`${i} of ${pageCount}`, margin + contentWidth / 2, 287, { align: 'center' })
    }

    // Generate PDF buffer
    const pdfBuffer = Buffer.from(doc.output('arraybuffer'))

    // Return PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="struk-${order.orderNumber}.pdf"`,
      },
    })
  } catch (error) {
    console.error('Error generating PDF receipt:', error)
    return NextResponse.json(
      { error: 'Gagal membuat struk PDF' },
      { status: 500 }
    )
  }
}

function getPaymentMethodDisplayName(method: string): string {
  const methods: Record<string, string> = {
    cash: '💵 CASH',
    qris: '📱 QRIS',
    transfer: '🏦 TRANSFER',
  }
  return methods[method] || method.toUpperCase()
}

function getOrderStatusDisplay(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Menunggu',
    paid: 'Lunas',
    processing: 'Diproses',
    completed: 'Selesai',
    cancelled: 'Batal',
  }
  return statuses[status] || status
}

function getStatusColor(status: string): number[] {
  const colors: Record<string, number[]> = {
    pending: [234, 179, 8],    // Yellow
    paid: [34, 197, 94],      // Green
    processing: [59, 130, 246], // Blue
    completed: [34, 197, 94],  // Green
    cancelled: [239, 68, 68], // Red
  }
  return colors[status] || [0, 0, 0]
}
