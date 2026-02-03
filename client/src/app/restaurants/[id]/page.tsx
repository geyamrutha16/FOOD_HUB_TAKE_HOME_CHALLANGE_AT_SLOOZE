'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Button, Badge } from '@/components/ui';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface Restaurant {
  id: string;
  name: string;
  menuItems: MenuItem[];
}

export default function RestaurantDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { user, token, initialized } = useAuth();
  const router = useRouter();

  const [restaurant, setRestaurant] = useState<Restaurant | null>(null);
const [pageLoading, setPageLoading] = useState(true);
const [orderLoading, setOrderLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<Record<string, boolean>>({});


  useEffect(() => {
    if (!initialized || !user || !token || !id) return;

    const fetchRestaurant = async () => {
      try {
        setPageLoading(true);
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `
              query ($id: String!) {
                restaurant(id: $id) {
                  id
                  name
                  menuItems {
                    id
                    name
                    price
                  }
                }
              }
            `,
            variables: { id },
          }),
        });

        const result = await response.json();
        if (!result.errors) {
          setRestaurant(result.data.restaurant);
        }
      } catch {
    toast.error('Failed to fetch restaurant');
    setRestaurant(null);
  } finally {
    setPageLoading(false);
  }
    };

    fetchRestaurant();
  }, [initialized, user, token, id]);

  const toggleItem = (itemId: string) => {
  setSelectedItems(prev => ({
    ...prev,
    [itemId]: !prev[itemId],
  }));
};

const totalPrice = restaurant
  ? restaurant.menuItems
      .filter(item => selectedItems[item.id])
      .reduce((sum, item) => sum + item.price, 0)
  : 0;


const handlePlaceOrder = async () => {
  if (!restaurant) return;
  if (orderLoading) return;

  const itemsToOrder = restaurant.menuItems
    .filter(item => selectedItems[item.id])
    .map(item => ({
      menuItemId: item.id,
      quantity: 1,
    }));

  if (itemsToOrder.length === 0) {
    toast.error('Please select at least one item');
    return;
  }

  try {
    setOrderLoading(true);

    const response = await fetch('http://localhost:4000/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        query: `
          mutation CreateOrder($items: [CreateOrderItemInput!]!) {
            createOrder(items: $items) {
              id
            }
          }
        `,
        variables: { items: itemsToOrder },
      }),
    });

    const result = await response.json();

    if (result.errors) {
      toast.error(result.errors[0]?.message);
      return;
    }

    toast.success('Order placed successfully 🍽️');
    router.push(`/orders/${result.data.createOrder.id}`);
  } catch {
    toast.error('Failed to create order');
  } finally {
    setOrderLoading(false);
  }
};

if (!initialized || pageLoading) {
  return (
    <div className="p-8 text-center text-gray-600">
      Loading restaurant details...
    </div>
  );
}
  if (!restaurant) return <div className="p-8">Restaurant not found</div>;

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{restaurant.name}</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {restaurant.menuItems.map(item => (
    <Card
      key={item.id}
      onClick={() => toggleItem(item.id)}
      className={`flex items-center justify-between p-4 cursor-pointer transition
        ${selectedItems[item.id] ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
    >
      <div className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={!!selectedItems[item.id]}
          onChange={() => toggleItem(item.id)}
          onClick={e => e.stopPropagation()}
          className="w-4 h-4"
        />

        <div>
          <h3 className="text-lg font-semibold">{item.name}</h3>
          <Badge variant="success">${item.price.toFixed(2)}</Badge>
        </div>
      </div>
    </Card>
  ))}
</div>

<span className="text-lg font-medium text-gray-700">
  {Object.values(selectedItems).filter(Boolean).length} item(s) selected
</span>


<div className="mt-6 p-4 bg-gray-50 rounded-lg flex justify-between items-center">
  <span className="text-lg font-medium text-gray-700">
    Total Amount
  </span>
  <span className="text-2xl font-bold text-green-600">
    ${totalPrice.toFixed(2)}
  </span>
</div>


      <Button
  className="w-full mt-6 text-lg"
  onClick={handlePlaceOrder}
  disabled={orderLoading || Object.values(selectedItems).every(v => !v)}
>
  {orderLoading ? 'Placing order...' : 'Place Order'}
</Button>

    </div>
  );
}
