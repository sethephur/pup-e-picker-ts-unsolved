import { Component } from 'react';
import { DogCard } from '../Shared/DogCard';
import { Dog } from '../types';

interface ClassDogsProps {
  dogs: Dog[];
  setDogs: (dogs: Dog[] | ((prevDogs: Dog[]) => Dog[])) => void;
  loading: boolean;
  error: string;
}

export class ClassDogs extends Component<ClassDogsProps> {
  constructor(props: ClassDogsProps) {
    super(props);
    this.updateFavoriteStatus = this.updateFavoriteStatus.bind(this);
    this.deleteDog = this.deleteDog.bind(this);
  }

  updateFavoriteStatus(id: number, isFavorite: boolean) {
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
        this.props.setDogs((prevDogs) =>
          prevDogs.map((dog) => (dog.id === id ? { ...dog, isFavorite } : dog))
        );
      })
      .catch((error) => {
        console.error('Error updating favorite status:', error);
      });
  }

  deleteDog(id: number) {
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
        this.props.setDogs((prevDogs) =>
          prevDogs.filter((dog) => dog.id !== id)
        );
      })
      .catch((error) => {
        console.error('Error deleting dog:', error);
      });
  }

  render() {
    const { dogs, loading, error } = this.props;

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{`Error: ${error}`}</p>;

    return (
      <div className='content-container'>
        {dogs.map((dog) => (
          <DogCard
            dog={dog}
            key={dog.id}
            onTrashIconClick={() => {
              this.deleteDog(dog.id);
            }}
            onHeartClick={() => {
              this.updateFavoriteStatus(dog.id, false);
            }}
            onEmptyHeartClick={() => {
              this.updateFavoriteStatus(dog.id, true);
            }}
            isLoading={false}
          />
        ))}
      </div>
    );
  }
}

export default ClassDogs;
