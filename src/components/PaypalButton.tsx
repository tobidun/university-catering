import React, { useEffect, useRef } from 'react';

interface PaypalButtonProps {
  amount: number;
  onSuccess: (details: any) => void;
}

declare global {
  interface Window {
    paypal?: {
      Buttons: (config: any) => {
        render: (container: HTMLElement) => void;
      };
    };
  }
}

const PaypalButton: React.FC<PaypalButtonProps> = ({ amount, onSuccess }) => {
  const paypalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!window.paypal) {
      // Load the PayPal SDK script
      const script = document.createElement('script');
      script.src = `https://www.paypal.com/sdk/js?client-id=sb&currency=USD`;
      script.async = true;
      
      script.onload = () => {
        if (window.paypal && paypalRef.current) {
          window.paypal.Buttons({
            createOrder: (data: any, actions: any) => {
              return actions.order.create({
                purchase_units: [
                  {
                    amount: {
                      value: amount.toFixed(2)
                    }
                  }
                ]
              });
            },
            onApprove: async (data: any, actions: any) => {
              try {
                // This is a sandbox implementation, so we're not actually capturing funds
                // In a real implementation, you would use actions.order.capture()
                const details = {
                  id: `PAYPAL-${Math.floor(100000 + Math.random() * 900000)}`,
                  status: 'COMPLETED',
                  payer: { email_address: 'customer@example.com' },
                  purchase_units: [{
                    amount: { value: amount.toFixed(2) }
                  }]
                };
                
                onSuccess(details);
              } catch (error) {
                console.error('Error processing PayPal payment:', error);
              }
            },
            style: {
              layout: 'horizontal',
              color: 'gold',
              shape: 'rect',
              label: 'pay'
            }
          }).render(paypalRef.current);
        }
      };

      document.body.appendChild(script);
      
      return () => {
        if (document.body.contains(script)) {
          document.body.removeChild(script);
        }
      };
    } else if (window.paypal && paypalRef.current) {
      window.paypal.Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: amount.toFixed(2)
                }
              }
            ]
          });
        },
        onApprove: async (data: any, actions: any) => {
          try {
            // Sandbox implementation
            const details = {
              id: `PAYPAL-${Math.floor(100000 + Math.random() * 900000)}`,
              status: 'COMPLETED',
              payer: { email_address: 'customer@example.com' },
              purchase_units: [{
                amount: { value: amount.toFixed(2) }
              }]
            };
            
            onSuccess(details);
          } catch (error) {
            console.error('Error processing PayPal payment:', error);
          }
        },
        style: {
          layout: 'horizontal',
          color: 'gold',
          shape: 'rect',
          label: 'pay'
        }
      }).render(paypalRef.current);
    }
  }, [amount, onSuccess]);

  return (
    <div className="paypal-button-container">
      <div ref={paypalRef}></div>
      <p className="text-xs text-gray-500 mt-2 text-center">
        Note: This is a sandbox implementation. No actual charges will be made.
      </p>
    </div>
  );
};

export default PaypalButton;