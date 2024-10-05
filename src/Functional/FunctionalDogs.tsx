import { useEffect, useState } from 'react';
import { DogCard } from '../Shared/DogCard';
import { Dog } from '../types';

export const FunctionalDogs = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch data when component mounts
  useEffect(() => {
    fetch('http://localhost:3000/dogs')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        setDogs(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const updateFavoriteStatus = (id: number, isFavorite: boolean) => {
    fetch(`http://localhost:3000/dogs/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ isFavorite }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to update favorite status');
        }
        return response.json();
      })
      .then(() => {
        setDogs((prevDogs) =>
          prevDogs.map((dog) => (dog.id === id ? { ...dog, isFavorite } : dog))
        );
      })
      .catch((error) => {
        console.error('Error updating favorite status:', error);
      });
  };

  const deleteDog = (id: number) => {
    fetch(`http://localhost:3000/dogs/${id}`, {
      method: 'DELETE',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to delete dog');
        }
        return response.json();
      })
      .then((data) => {
        console.log('Deleted:', data);
        setDogs((prevDogs) => prevDogs.filter((dog) => dog.id !== id));
      })
      .catch((error) => {
        console.error('Error deleting dog:', error);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{`Error: ${error}`}</p>;

  return (
    <div className='content-container'>
      {dogs.map((dog) => (
        <DogCard
          dog={dog}
          key={dog.id}
          onTrashIconClick={() => {
            deleteDog(dog.id);
          }}
          onHeartClick={() => {
            updateFavoriteStatus(dog.id, false);
          }}
          onEmptyHeartClick={() => {
            updateFavoriteStatus(dog.id, true);
          }}
          isLoading={false}
        />
      ))}
    </div>
  );
};
