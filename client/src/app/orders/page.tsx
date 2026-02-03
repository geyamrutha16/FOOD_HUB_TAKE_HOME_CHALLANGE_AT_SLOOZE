'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Button, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface OrderItem {
  menuItemId: string;
  name: string;
  imageUrl: string;
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  country: string;
  status: 'CREATED' | 'PAID' | 'CANCELLED';
  items: OrderItem[];
}

export default function OrdersPage() {
  const { user, token, initialized } = useAuth();
  const router = useRouter();

  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!initialized || !user || !token) return;

    const fetchOrders = async () => {
      try {
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query {
                orders {
                  id
                  userId
                  country
                  status
                  items {
                    menuItemId
                    name
                    imageUrl
                    quantity
                  }
                }
              }
            `,
          }),
        });

        const result = await response.json();

        if (result.errors) {
          console.error('GraphQL errors:', result.errors);
          setOrders([]);
          return;
        }

        setOrders(result.data?.orders ?? []);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [initialized, user, token]);

  const handleCheckout = async (orderId: string) => {
    if (!['ADMIN', 'MANAGER'].includes(user?.role)) {
      alert('Only admins and managers can checkout');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              checkoutOrder(orderId: "${orderId}") {
                id
                status
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert(result.errors[0]?.message + "With the current payment method");
        return;
      }

      toast.success('Order paid successfully with current payment method🎉');

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'PAID' } : o
        )
      );
    } catch (err) {
      toast.error('Checkout failed');
    }
  };

  const handleCancel = async (orderId: string) => {
    if (!['ADMIN', 'MANAGER'].includes(user?.role)) {
      alert('Only admins and managers can cancel');
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation {
              cancelOrder(orderId: "${orderId}") {
                id
                status
              }
            }
          `,
        }),
      });

      const result = await response.json();

      if (result.errors) {
        alert(result.errors[0]?.message);
        return;
      }

      toast.success('Order cancelled successfully ❌');

      setOrders((prev) =>
        prev.map((o) =>
          o.id === orderId ? { ...o, status: 'CANCELLED' } : o
        )
      );
    } catch (err) {
      toast.error('Cancel failed');
    }
  };

  const statusColor = (status: Order['status']) => {
    switch (status) {
      case 'CREATED':
        return 'bg-yellow-100 text-yellow-800';
      case 'PAID':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (!initialized || loading) {
    return (
      <div className="p-8 text-center text-gray-600">
        Loading orders...
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">📦 My Orders</h1>

      {orders.length === 0 ? (
        <Card className="p-8 text-center">
          <p className="text-gray-600">
            No orders yet. Visit a restaurant to place one 🍽️
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <Card
              key={order.id}
              className="flex flex-col hover:shadow-lg transition-shadow"
            >
              {/* HEADER */}
              <div className="flex justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    Order {order.id.slice(0, 8)}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {order.items.length} items
                  </p>
                </div>
                <Badge className={statusColor(order.status)}>
                  {order.status}
                </Badge>
              </div>

              {/* ITEMS */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div
                    key={item.menuItemId}
                    className="flex gap-3 items-center"
                  >
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-14 h-14 rounded-lg object-cover"
                    />
                    <div>
                      <p className="font-medium">{item.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty × {item.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* ACTIONS */}
              {order.status === 'CREATED' &&
                ['ADMIN', 'MANAGER'].includes(user.role) && (
                  <div className="mt-auto flex gap-2">
                    <Button
                      className="flex-1 bg-green-500 hover:bg-green-600"
                      onClick={() => handleCheckout(order.id)}
                    >
                      Pay
                    </Button>
                    <Button
                      className="flex-1 bg-red-500 hover:bg-red-600"
                      onClick={() => handleCancel(order.id)}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
