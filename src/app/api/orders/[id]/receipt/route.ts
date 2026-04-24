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
    const restaurantName = 'Ayam Geprek Sambal Ijo'
    const restaurantAddress = 'Jl. Merdeka No. 123, Jakarta'
    const restaurantPhone = '+62 812-3456-7890'

    // Set up PDF
    let yPos = 20

    // Header
    doc.setFontSize(20)
    doc.setFont('helvetica', 'bold')
    doc.text(restaurantName, 105, yPos, { align: 'center' })
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(restaurantAddress, 105, yPos, { align: 'center' })
    yPos += 5
    doc.text(restaurantPhone, 105, yPos, { align: 'center' })
    yPos += 10

    // Divider line
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    // Order info
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text(`Order #${order.orderNumber}`, 20, yPos)
    yPos += 8

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text(`Tanggal: ${new Date(order.createdAt).toLocaleString('id-ID')}`, 20, yPos)
    yPos += 6
    doc.text(`Customer: ${order.user.name}`, 20, yPos)
    yPos += 6
    doc.text(`Metode Pembayaran: ${getPaymentMethodDisplayName(order.paymentMethod)}`, 20, yPos)
    yPos += 6
    doc.text(`Status: ${getOrderStatusDisplay(order.status)}`, 20, yPos)
    yPos += 10

    // Order items table
    const items = order.items.map((item) => [
      item.product.name,
      `${item.qty}x`,
      `Rp ${item.price.toLocaleString()}`,
      `Rp ${item.subtotal.toLocaleString()}`,
    ])

    // Using autoTable plugin
    const autoTable = (await import('jspdf-autotable')).default
    autoTable(doc, {
      startY: yPos,
      head: [['Item', 'Qty', 'Harga', 'Subtotal']],
      body: items,
      theme: 'striped',
      headStyles: { fillColor: [249, 115, 22] }, // Orange color
      styles: { fontSize: 9 },
      columnStyles: {
        0: { cellWidth: 60 },
        1: { cellWidth: 20, halign: 'center' },
        2: { cellWidth: 45, halign: 'right' },
        3: { cellWidth: 45, halign: 'right' },
      },
    })

    yPos = doc.lastAutoTable.finalY + 10

    // Totals
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')

    doc.text('Subtotal:', 130, yPos)
    doc.text(`Rp ${order.subtotal.toLocaleString()}`, 190, yPos, { align: 'right' })
    yPos += 6

    doc.text('Pajak (10%):', 130, yPos)
    doc.text(`Rp ${order.tax.toLocaleString()}`, 190, yPos, { align: 'right' })
    yPos += 6

    if (order.discount > 0) {
      doc.text('Diskon:', 130, yPos)
      doc.text(`-Rp ${order.discount.toLocaleString()}`, 190, yPos, { align: 'right' })
      yPos += 6
    }

    doc.setFont('helvetica', 'bold')
    doc.setFontSize(12)
    doc.text('Total:', 130, yPos)
    doc.text(`Rp ${order.total.toLocaleString()}`, 190, yPos, { align: 'right' })
    yPos += 15

    // Divider line
    doc.setLineWidth(0.5)
    doc.line(20, yPos, 190, yPos)
    yPos += 10

    // Note if exists
    if (order.note) {
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text('Catatan:', 20, yPos)
      yPos += 6
      doc.text(order.note, 20, yPos, { maxWidth: 170 })
      yPos += 15
    }

    // Thank you message
    doc.setFontSize(11)
    doc.setFont('helvetica', 'bold')
    doc.text('Terima kasih atas pesanan Anda!', 105, yPos, { align: 'center' })
    yPos += 6

    doc.setFontSize(9)
    doc.setFont('helvetica', 'normal')
    doc.text('Simpan struk ini sebagai bukti pembayaran', 105, yPos, { align: 'center' })
    yPos += 5
    doc.text('Ayam Geprek Sambal Ijo', 105, yPos, { align: 'center' })

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
    cash: 'Cash',
    qris: 'QRIS',
    transfer: 'Transfer Bank',
  }
  return methods[method] || method
}

function getOrderStatusDisplay(status: string): string {
  const statuses: Record<string, string> = {
    pending: 'Menunggu Pembayaran',
    paid: 'Sudah Dibayar',
    processing: 'Sedang Diproses',
    completed: 'Selesai',
    cancelled: 'Dibatalkan',
  }
  return statuses[status] || status
}
