import { Link } from 'react-router-dom';
import { FunctionalDogs } from './FunctionalDogs';
import { useEffect, useState } from 'react';
import { Dog } from '../types';
import { FunctionalCreateDogForm } from './FunctionalCreateDogForm';

export const FunctionalSection = () => {
  const [dogs, setDogs] = useState<Dog[]>([]);
  const [filteredDogs, setFilteredDogs] = useState<Dog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filter, setFilter] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

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
        setFilteredDogs(data);
      })
      .catch((error) => {
        setError(error.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    if (filter === 'favorite') {
      setFilteredDogs(dogs.filter((dog) => dog.isFavorite));
    } else if (filter === 'unfavorite') {
      setFilteredDogs(dogs.filter((dog) => !dog.isFavorite));
    } else {
      setFilteredDogs(dogs);
    }
  }, [dogs, filter]);

  const favoriteCount = dogs.filter((dog) => dog.isFavorite).length;
  const unfavoriteCount = dogs.length - favoriteCount;

  return (
    <section id='main-section'>
      <div className='container-header'>
        <div className='container-label'>Dogs: </div>
        <Link to={'/class'} className='btn'>
          Change to Class
        </Link>
        <div className='selectors'>
          {/* This should display the favorited count */}
          <div
            className={`selector ${filter === 'favorite' ? 'active' : ''}`}
            onClick={() =>
              filter !== 'favorite' ? setFilter('favorite') : setFilter('all')
            }
          >
            Favorited {favoriteCount}
          </div>

          {/* This should display the unfavorited count */}
          <div
            className={`selector ${filter === 'unfavorite' ? 'active' : ''}`}
            onClick={() =>
              filter !== 'unfavorite'
                ? setFilter('unfavorite')
                : setFilter('all')
            }
          >
            Unfavorited {unfavoriteCount}
          </div>
          <div
            className={`selector`}
            onClick={() => {
              setIsModalOpen(true);
            }}
          >
            create dog
          </div>
          {isModalOpen && (
            <div
              style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100vw',
                height: '100vh',
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                zIndex: 1000,
              }}
              onClick={() => setIsModalOpen(false)}
            >
              <div
                onClick={(e) => e.stopPropagation()}
                style={{
                  background: 'gray',
                  padding: '20px',
                  borderRadius: '8px',
                  minWidth: '400px',
                }}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  style={{ float: 'right', cursor: 'pointer' }}
                >
                  X
                </button>
                <FunctionalCreateDogForm setIsModalOpen={setIsModalOpen} />
              </div>
            </div>
          )}
        </div>
      </div>
      <div className='content-container'>
        <FunctionalDogs
          dogs={filteredDogs}
          setDogs={setDogs}
          loading={loading}
          error={error}
        />
      </div>
    </section>
  );
};
