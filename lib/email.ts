import { resend } from "@/lib/resend"

interface OrderEmailData {
  customerName: string
  customerEmail: string
  orderId: string
  items: Array<{
    name: string
    quantity: number
    price: number
  }>
  total: number
  pickupDate?: Date
  deliveryAddress?: string
}

export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: data.customerEmail,
      subject: `Order Confirmation - Sweet Dreams Bakery #${data.orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🧁 Sweet Dreams Bakery</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #374151; margin-bottom: 20px;">Thank you for your order, ${data.customerName}!</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Your order #${data.orderId} has been received and is being prepared with love.
            </p>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3 style="color: #374151; margin-top: 0;">Order Details:</h3>
              ${data.items
                .map(
                  (item) => `
                <div style="display: flex; justify-content: space-between; margin: 10px 0;">
                  <span>${item.name} x ${item.quantity}</span>
                  <span>$${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              `,
                )
                .join("")}
              <hr style="margin: 15px 0; border: none; border-top: 1px solid #e5e7eb;">
              <div style="display: flex; justify-content: space-between; font-weight: bold;">
                <span>Total:</span>
                <span>$${data.total.toFixed(2)}</span>
              </div>
            </div>

            ${
              data.pickupDate
                ? `
              <p style="color: #6b7280;">
                <strong>Pickup Date:</strong> ${data.pickupDate.toLocaleDateString()}
              </p>
            `
                : ""
            }

            ${
              data.deliveryAddress
                ? `
              <p style="color: #6b7280;">
                <strong>Delivery Address:</strong> ${data.deliveryAddress}
              </p>
            `
                : ""
            }

            <p style="color: #6b7280; margin-top: 30px;">
              We'll send you another email when your order is ready for pickup or delivery.
            </p>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            © 2024 Sweet Dreams Bakery. All rights reserved.
          </div>
        </div>
      `,
    })
  } catch (error) {
    throw new Error("Failed to send order confirmation email")
  }
}

export async function sendOrderStatusUpdateEmail(
  customerEmail: string,
  customerName: string,
  orderId: string,
  status: string,
) {
  const statusMessages = {
    CONFIRMED: "Your order has been confirmed and we're preparing it!",
    PREPARING: "Your delicious treats are being prepared with care.",
    READY: "Your order is ready for pickup or delivery!",
    DELIVERED: "Your order has been delivered. Enjoy!",
    CANCELLED: "Your order has been cancelled. If you have questions, please contact us.",
  }

  try {
    await resend.emails.send({
      from: process.env.EMAIL_FROM!,
      to: customerEmail,
      subject: `Order Update - Sweet Dreams Bakery #${orderId}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">🧁 Sweet Dreams Bakery</h1>
          </div>
          <div style="padding: 30px; background: #fff;">
            <h2 style="color: #374151; margin-bottom: 20px;">Order Update</h2>
            <p style="color: #6b7280; margin-bottom: 20px;">
              Hi ${customerName},
            </p>
            <p style="color: #6b7280; margin-bottom: 20px;">
              ${statusMessages[status as keyof typeof statusMessages] || "Your order status has been updated."}
            </p>
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; text-align: center;">
              <p style="margin: 0; color: #374151;">
                <strong>Order #${orderId}</strong><br>
                Status: <span style="color: #f59e0b; font-weight: bold;">${status}</span>
              </p>
            </div>
            <p style="color: #6b7280;">
              Thank you for choosing Sweet Dreams Bakery!
            </p>
          </div>
          <div style="background: #f9fafb; padding: 20px; text-align: center; color: #6b7280; font-size: 14px;">
            © 2024 Sweet Dreams Bakery. All rights reserved.
          </div>
        </div>
      `,
    })
  } catch (error) {
    throw new Error("Failed to send order status update email")
  }
}
