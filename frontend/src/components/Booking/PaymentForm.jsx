// PaymentForm.jsx
import React, { useState } from 'react';
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const PaymentForm = ({ totalAmount, onPaymentSuccess }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        const cardElement = elements.getElement(CardElement);

        const { token, error } = await stripe.createToken(cardElement);

        if (error) {
            setError(error.message);
        } else {
            // Send the token to your server or handle it as needed.
            console.log('Token:', token);
            onPaymentSuccess();
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div>
                <label htmlFor="card-element">
                    Credit or debit card
                </label>
                <div id="card-element">
                    <CardElement />
                </div>
                {error && (
                    <div className="error" role="alert">
                        {error}
                    </div>
                )}
            </div>
            <button type="submit" disabled={!stripe}>
                Pay ${totalAmount}
            </button>
        </form>
    );
};

export default PaymentForm;
