'use client';

import { useAuth } from '@/hooks/useAuth';
import { Card, Button, Badge } from '@/components/ui';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

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

export default function RestaurantsPage() {
  const { user, token, initialized } = useAuth();
  const router = useRouter();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialized && !user) {
      router.push('/login');
      return;
    }

    if (!token) {
    // ⛔️ WAIT until token is ready
    return;
  }
    const fetchRestaurants = async () => {
      try {
        console.debug('[RestaurantsPage] user, token:', { user, token });
        const response = await fetch('http://localhost:4000/graphql', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            query: `query { restaurants { id name country menuItems { id name price } } }`,
          }),
        });

        const data = await response.json();
        if (data.errors) {
          console.log('GraphQL errors fetching restaurants:', data.errors);
        }
        if (data.data && data.data.restaurants) {
          try {
            setRestaurants(data.data.restaurants);
          } catch (e) {
            console.log('Failed to parse restaurants JSON:', e, data.data.restaurants);
          }
        } else {
          console.debug('No restaurants field in GraphQL response', data);
        }
      } catch (err) {
        console.log('Failed to fetch restaurants:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRestaurants();
  }, [user, token, router, initialized]);

  if (!initialized) return <div>Loading...</div>;
  if (!user) return null;

  console.log(' Restaurants:', restaurants);

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">🍽️ Restaurants</h1>
        <p className="text-gray-600">Available in {user.country}</p>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Loading restaurants...</p>
        </div>
      ) : restaurants.length === 0 ? (
        <Card className="text-center">
          <p className="text-gray-600">No restaurants available in your country</p>
        </Card>
      ) : (
        <div className="grid grid-cols-2 gap-6">
          {restaurants.map((restaurant) => (
            <Card key={restaurant.id} className="flex flex-col justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-2">{restaurant.name}</h2>
                <p className="text-gray-600 mb-4">{restaurant.menuItems.length} menu items</p>
                <img src={`https://tse3.mm.bing.net/th/id/OIP.5faZa9BG9alMeBy2jOY1BAHaE8?rs=1&pid=ImgDetMain&o=7&rm=3`} alt={restaurant.name} className="w-full h-40 object-cover rounded mb-4" />
                <div className="space-y-2 mb-4">
                  {restaurant.menuItems.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span>{item.name}</span>
                      <Badge variant="success">${item.price.toFixed(2)}</Badge>
                    </div>
                  ))}
                  {restaurant.menuItems.length > 3 && (
                    <p className="text-gray-500 text-sm">+{restaurant.menuItems.length - 3} more items</p>
                  )}
                </div>
              </div>
              <Link href={`/restaurants/${restaurant.id}`}>
                <Button className="w-full">View Menu & Order</Button>
              </Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
