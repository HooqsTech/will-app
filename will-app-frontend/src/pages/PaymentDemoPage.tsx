import { useState } from 'react';
import CustomButton from '../components/CustomButton'
import { createPaymentOrder } from '../api/payment';
import { useRecoilValue } from 'recoil';
import { userState } from '../atoms/UserDetailsState';
import Swal from 'sweetalert2';

function loadScript(src: string) {
    return new Promise((resolve) => {
        const script = document.createElement('script')
        script.src = src
        script.onload = () => {
            resolve(true)
        }
        script.onerror = () => {
            resolve(false)
        }
        document.body.appendChild(script)
    })
}

const PaymentDemoPage = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const user = useRecoilValue(userState);

    const payNow = async () => {
        setIsLoading(true);

        let res = await loadScript("https://checkout.razorpay.com/v1/checkout.js");

        if (!res) {
            setIsLoading(false);
            return
        }

        // CREATE PAYMENT ORDER
        var data = await createPaymentOrder(user.userId, 8756)

        setIsLoading(false);

        const options = {
            key: import.meta.env.VITE_RAZOR_PAY_ID,
            currency: data.currency,
            amount: data.amount,
            order_id: data.id,
            name: 'Payment',
            description: 'Thank you for choosing Hamaara will.',
            image: "",
            handler: async function (response: any) {
                Swal.fire("Your payment is successfull.")
            }
        }
        const _window = window as any
        const paymentObject = _window.Razorpay(options)
        paymentObject.open()
    }

    return (
        <CustomButton loading={isLoading} label='Pay Now' onClick={async () => await payNow()} />
    )
}

export default PaymentDemoPage