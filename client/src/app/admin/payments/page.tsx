'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Button } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface PaymentMethod {
  id: string;
  type: string;
  details: string;
}

export default function PaymentsPage() {
  const { user, token, initialized } = useAuth();
  const router = useRouter();
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [newType, setNewType] = useState('CREDIT_CARD');
  const [newDetails, setNewDetails] = useState('');
  const [pageLoading, setPageLoading] = useState(true);  
  const [addLoading, setAddLoading] = useState(false);  
  const [selectedMethodId, setSelectedMethodId] = useState<string | null>(null);  

  useEffect(() => {
    if (initialized && (!user || user.role !== 'ADMIN')) {
      router.push('/dashboard');
      return;
    }

    if (!initialized || !user || user.role !== 'ADMIN') return;

    const fetchPaymentMethods = async () => {
      try {
        setPageLoading(true);
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { paymentMethods { id type details } }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.error('GraphQL errors:', data.errors);
        }
        if (data.data && data.data.paymentMethods) {
          setMethods(data.data.paymentMethods);
          const savedMethod = localStorage.getItem('currentPaymentMethod');
if (savedMethod) {
  setSelectedMethodId(savedMethod);
}

        }
      } catch {
    toast.error('Failed to fetch payment methods');
  } finally {
    setPageLoading(false);
  }
    };

    fetchPaymentMethods();
  }, [user, token, router, initialized]);

  const handleSelectMethod = (methodId: string) => {
  setSelectedMethodId(methodId);
  localStorage.setItem('currentPaymentMethod', methodId);
  toast.success('Current payment method updated');
};


  const handleAddMethod = async () => {
    if (!newType || !newDetails) {
 toast.error('Please fill in all fields');      return;
    }

     if (addLoading) return;

    try {
      setAddLoading(true);
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `mutation { addPaymentMethod(type: "${newType}", details: "${newDetails}") { id type details } }`,
        }),
      });

      const data = await response.json();
      if (data.errors) {
        alert('Error: ' + data.errors[0]?.message);
      } else if (data.data?.addPaymentMethod) {
        setMethods([...methods, data.data.addPaymentMethod]);
        setNewType('CREDIT_CARD');
        setNewDetails('');
        toast.success('Payment method added successfully 💳');
      }
    } catch (err) {
      toast.error('Failed to add payment method');
    }finally {
    setAddLoading(false);
  }
  };

if (!initialized || pageLoading) {
  return (
    <div className="p-8 text-center text-gray-600">
      Loading payment methods...
    </div>
  );
}
  if (!user || user.role !== 'ADMIN') return <div className="p-8"><p>Access Denied</p></div>;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">💳 Payment Methods (Admin Only)</h1>

      <div className="grid grid-cols-2 gap-8">
        <Card>
          <h2 className="text-2xl font-bold mb-4">Add New Payment Method</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <input
                type="text"
                value={newType}
                onChange={(e) => setNewType(e.target.value)}
                placeholder="e.g., Credit Card, PayPal"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Details</label>
              <input
                type="text"
                value={newDetails}
                onChange={(e) => setNewDetails(e.target.value)}
                placeholder="e.g., Card ending in 1234"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <Button
  onClick={handleAddMethod}
  className="w-full"
  disabled={addLoading}
>
  {addLoading ? 'Adding...' : 'Add Payment Method'}
</Button>

          </div>
        </Card>

        <Card>
          <h2 className="text-2xl font-bold mb-4">Existing Methods</h2>

          {methods.length === 0 ? (
            <p className="text-gray-600">No payment methods added yet</p>
          ) : (
            <div className="space-y-3">
  {methods.map((method) => {
    const isSelected = method.id === selectedMethodId;

    return (
      <div
        key={method.id}
        className={`p-4 rounded-lg border flex items-start gap-3 cursor-pointer transition
          ${isSelected ? 'border-blue-500 bg-blue-50' : 'bg-gray-50'}`}
        onClick={() => handleSelectMethod(method.id)}
      >
        <input
          type="radio"
          name="paymentMethod"
          checked={isSelected}
          onChange={() => handleSelectMethod(method.id)}
          className="mt-1"
        />

        <div className="flex-1">
          <div className="flex items-center gap-2">
            <p className="font-bold">{method.type}</p>
            {isSelected && (
              <span className="px-2 py-0.5 text-xs bg-green-100 text-green-700 rounded-full">
                Current payment method
              </span>
            )}
          </div>

          <p className="text-sm text-gray-600">{method.details}</p>
        </div>
      </div>
    );
  })}
</div>
          )}
        </Card>
      </div>
    </div>
  );
}
