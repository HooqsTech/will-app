import { UUID } from "crypto"

export interface IPaymentOrder {
    userId: string
    orderId: string
    createdAt: Date | null
    updatedAt: Date | null
}

export interface IRazorPaymentDetails {
    entity: string
    event: string
    account_id: string
    created_at: number
    payload: {
        refund: {
            entity: {
                id: string
                entity: string
                notes: string
                created_at: number
                batch_id: string
                status: string
                speed_processed: string
                speed_requested: string
            }
        }
        payment: {
            entity: {
                id: string
                entity: string
                amount: number
                currency: string
                status: string
                method: string
                order_id: string
                description: string
                international: boolean
                refund_status: string
                amount_refunded: number
                captured: boolean
                email: string
                contact: string
                fee: number
                tax: number
                error_code: string
                error_description: string
                error_source: string
                error_step: string
                error_reason: string
                notes: string
                created_at: number
                card_id: string
                card: {
                    id: string
                    entity: string
                    name: string
                    last4: string
                    network: string
                    type: string
                    issuer: string
                    emi: boolean
                    sub_type: string
                }
                upi: {
                    payer_account_type: string
                    vpa: string
                    flow: string
                }
                bank: string
                vpa: string
                wallet: string
                acquirer_data: {
                    rrn: string
                    authentication_reference_number: string
                    bank_transaction_id: string
                },
                invoice_id: string
            }
        }
    }
}