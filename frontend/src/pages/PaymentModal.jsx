import React, { useState } from 'react'
import { toast } from 'react-toastify'
import axios from 'axios'

const PaymentModal = ({ isOpen, onClose, appointment, backendUrl, token, onPaymentSuccess }) => {
    const [upiId, setUpiId] = useState('')
    const [processing, setProcessing] = useState(false)
    const [showUpiApps, setShowUpiApps] = useState(false)

    const upiApps = [
        { name: 'PhonePe', icon: '📱', color: 'bg-purple-100 text-purple-800' },
        { name: 'Google Pay', icon: '🎯', color: 'bg-blue-100 text-blue-800' },
        { name: 'Paytm', icon: '💙', color: 'bg-indigo-100 text-indigo-800' },
        { name: 'BHIM', icon: '🏛️', color: 'bg-orange-100 text-orange-800' }
    ]

    const handleUpiPayment = async () => {
        if (!upiId || !upiId.includes('@')) {
            toast.error('Please enter a valid UPI ID')
            return
        }

        setProcessing(true)

        try {
            // Simulate payment processing delay
            await new Promise(resolve => setTimeout(resolve, 2000))

            const { data } = await axios.post(
                backendUrl + '/api/user/process-payment',
                {
                    appointmentId: appointment._id,
                    upiId: upiId,
                    amount: appointment.amount
                },
                { headers: { token } }
            )

            if (data.success) {
                toast.success('Payment Successful! 🎉')
                onPaymentSuccess()
                onClose()
            } else {
                toast.error(data.message || 'Payment failed')
            }
        } catch (error) {
            console.error(error)
            toast.error('Payment failed. Please try again.')
        }

        setProcessing(false)
    }

    const handleAppPayment = async (appName) => {
        setProcessing(true)

        try {
            // Simulate app-based payment
            await new Promise(resolve => setTimeout(resolve, 1500))

            const { data } = await axios.post(
                backendUrl + '/api/user/process-payment',
                {
                    appointmentId: appointment._id,
                    paymentMethod: appName,
                    amount: appointment.amount
                },
                { headers: { token } }
            )

            if (data.success) {
                toast.success(`Payment Successful via ${appName}! 🎉`)
                onPaymentSuccess()
                onClose()
            } else {
                toast.error(data.message || 'Payment failed')
            }
        } catch (error) {
            console.error(error)
            toast.error('Payment failed. Please try again.')
        }

        setProcessing(false)
    }

    if (!isOpen) return null

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="p-6 border-b">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">Complete Payment</h2>
                        <button
                            onClick={onClose}
                            className="text-gray-400 hover:text-gray-600 text-2xl"
                            disabled={processing}
                        >
                            ×
                        </button>
                    </div>
                </div>

                {/* Payment Details */}
                <div className="p-6 border-b bg-gray-50">
                    <div className="flex items-center gap-4 mb-4">
                        <img
                            src={appointment.docData.image}
                            alt={appointment.docData.name}
                            className="w-16 h-16 rounded-full object-cover"
                        />
                        <div>
                            <h3 className="font-semibold text-gray-800">{appointment.docData.name}</h3>
                            <p className="text-sm text-gray-600">{appointment.docData.speciality}</p>
                        </div>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600">Consultation Fee:</span>
                        <span className="text-2xl font-bold text-green-600">₹{appointment.amount}</span>
                    </div>
                </div>

                {/* Payment Methods */}
                <div className="p-6">
                    {!showUpiApps ? (
                        <>
                            {/* UPI ID Payment */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Enter UPI ID
                                </label>
                                <input
                                    type="text"
                                    value={upiId}
                                    onChange={(e) => setUpiId(e.target.value)}
                                    placeholder="yourname@paytm"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    disabled={processing}
                                />
                                <button
                                    onClick={handleUpiPayment}
                                    disabled={processing || !upiId}
                                    className={`w-full mt-3 py-2 rounded-md font-medium ${processing || !upiId
                                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                                        }`}
                                >
                                    {processing ? 'Processing...' : 'Pay with UPI ID'}
                                </button>
                            </div>

                            {/* Divider */}
                            <div className="flex items-center my-6">
                                <div className="flex-1 border-t border-gray-300"></div>
                                <span className="px-3 text-gray-500 text-sm">OR</span>
                                <div className="flex-1 border-t border-gray-300"></div>
                            </div>

                            {/* UPI Apps Button */}
                            <button
                                onClick={() => setShowUpiApps(true)}
                                disabled={processing}
                                className="w-full py-3 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-500 hover:text-blue-600 transition-colors"
                            >
                                💳 Pay with UPI Apps
                            </button>
                        </>
                    ) : (
                        <>
                            {/* Back Button */}
                            <button
                                onClick={() => setShowUpiApps(false)}
                                className="mb-4 text-blue-600 hover:text-blue-800 flex items-center gap-2"
                                disabled={processing}
                            >
                                ← Back to UPI ID
                            </button>

                            {/* UPI Apps Grid */}
                            <div className="grid grid-cols-2 gap-3">
                                {upiApps.map((app) => (
                                    <button
                                        key={app.name}
                                        onClick={() => handleAppPayment(app.name)}
                                        disabled={processing}
                                        className={`p-4 rounded-lg border hover:shadow-md transition-all ${app.color} ${processing ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
                                            }`}
                                    >
                                        <div className="text-2xl mb-2">{app.icon}</div>
                                        <div className="font-medium">{app.name}</div>
                                    </button>
                                ))}
                            </div>
                        </>
                    )}

                    {/* Processing Overlay */}
                    {processing && (
                        <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center">
                            <div className="text-center">
                                <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
                                <p className="text-gray-600">Processing Payment...</p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-4 bg-gray-50 text-xs text-gray-500 text-center">
                    🔒 This is a demo payment. No real money will be charged.
                </div>
            </div>
        </div>
    )
}

export default PaymentModal