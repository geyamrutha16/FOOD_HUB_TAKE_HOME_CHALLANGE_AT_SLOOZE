'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Badge } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

interface OrderItem {
  menuItemId: string;
  quantity: number;
}

interface Order {
  id: string;
  status: string;
  items: OrderItem[];
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, initialized } = useAuth();
  const router = useRouter();

  const [order, setOrder] = useState<Order | null>(null);

  useEffect(() => {
    if (!initialized || !user || !token || !id) return;

    const fetchOrder = async () => {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            query ($id: String!) {
              order(id: $id) {
                id
                status
                items {
                  menuItemId
                  quantity
                  imageUrl
                  name
                }
              }
            }
          `,
          variables: { id },
        }),
      });

      const result = await response.json();
      if (!result.errors) {
        setOrder(result.data.order);
      }
    };

    fetchOrder();
  }, [initialized, user, token, id]);

  if (!order) return <div className="p-8">Loading order...</div>;

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">Order {order.id.slice(0, 8)}</h1>

      <Badge>{order.status}</Badge>

      <div className="mt-4 space-y-2">
        {order.items.map((item, idx) => (
  <Card key={idx} className="flex gap-4 items-center">
    <img
      src={item.imageUrl}
      alt={item.name}
      className="w-16 h-16 rounded object-cover"
    />

    <div className="flex-1">
      <p className="font-semibold">{item.name}</p>
      <p className="text-sm text-gray-600">
        Quantity: {item.quantity}
      </p>
    </div>
  </Card>
))}

      </div>
    </div>
  );
}
