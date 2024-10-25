import { Component } from 'react';
import { Dog } from '../types';
import { Link } from 'react-router-dom';
import ClassCreateDogForm from './ClassCreateDogForm';
import ClassDogs from './ClassDogs';

interface ClassSectionState {
  dogs: Dog[];
  filteredDogs: Dog[];
  loading: boolean;
  error: string;
  filter: string;
  isModalOpen: boolean;
}

class ClassSection extends Component<object, ClassSectionState> {
  constructor(props: object) {
    super(props);
    this.state = {
      dogs: [],
      filteredDogs: [],
      loading: true,
      error: '',
      filter: 'all',
      isModalOpen: false,
    };
    this.fetchDogs = this.fetchDogs.bind(this);
    this.handleFilterChange = this.handleFilterChange.bind(this);
    this.toggleModal = this.toggleModal.bind(this);
    this.setDogs = this.setDogs.bind(this);
  }

  setDogs(newDogs: Dog[] | ((prevDogs: Dog[]) => Dog[])) {
    this.setState((prevState) => ({
      dogs: typeof newDogs === 'function' ? newDogs(prevState.dogs) : newDogs,
      filteredDogs:
        typeof newDogs === 'function' ? newDogs(prevState.dogs) : newDogs,
    }));
  }

  componentDidMount() {
    this.fetchDogs();
  }

  componentDidUpdate(prevState: ClassSectionState) {
    if (
      prevState.dogs !== this.state.dogs ||
      prevState.filter !== this.state.filter
    ) {
      if (
        JSON.stringify(prevState.filteredDogs) !==
        JSON.stringify(this.state.filteredDogs)
      ) {
        this.applyFilter();
      }
    }
  }

  applyFilter() {
    const { dogs, filter } = this.state;
    let filteredDogs;

    if (filter === 'favorite') {
      filteredDogs = dogs.filter((dog) => dog.isFavorite);
    } else if (filter === 'unfavorite') {
      filteredDogs = dogs.filter((dog) => !dog.isFavorite);
    } else {
      filteredDogs = dogs;
    }

    if (
      JSON.stringify(filteredDogs) !== JSON.stringify(this.state.filteredDogs)
    ) {
      this.setState({ filteredDogs });
    }
  }

  fetchDogs() {
    fetch('http://localhost:3000/dogs')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        this.setState({ dogs: data, filteredDogs: data, loading: false });
      })
      .catch((error) => {
        this.setState({ error: error.message, loading: false });
      });
  }

  handleFilterChange(newFilter: string) {
    this.setState({ filter: newFilter });
  }

  toggleModal(isOpen: boolean) {
    this.setState({ isModalOpen: isOpen });
  }

  render() {
    const { dogs, filteredDogs, loading, error, filter, isModalOpen } =
      this.state;
    const favoriteCount = dogs.filter((dog) => dog.isFavorite).length;
    const unfavoriteCount = dogs.length - favoriteCount;

    return (
      <section id='main-section'>
        <div className='container-header'>
          <div className='container-label'>Dogs: </div>
          <Link to={'/functional'} className='btn'>
            Change to Functional
          </Link>
          <div className='selectors'>
            <div
              className={`selector ${filter === 'favorite' ? 'active' : ''}`}
              onClick={() =>
                this.handleFilterChange(
                  filter !== 'favorite' ? 'favorite' : 'all'
                )
              }
            >
              Favorited {favoriteCount}
            </div>
            <div
              className={`selector ${filter === 'unfavorite' ? 'active' : ''}`}
              onClick={() =>
                this.handleFilterChange(
                  filter !== 'unfavorite' ? 'unfavorite' : 'all'
                )
              }
            >
              Unfavorited {unfavoriteCount}
            </div>
            <div className='selector' onClick={() => this.toggleModal(true)}>
              create dog
            </div>
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
              onClick={() => this.toggleModal(false)}
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
                  onClick={() => this.toggleModal(false)}
                  style={{ float: 'right', cursor: 'pointer' }}
                >
                  X
                </button>
                <ClassCreateDogForm
                  setIsModalOpen={this.toggleModal}
                  setDogs={this.setDogs}
                />
              </div>
            </div>
          )}
        </div>
        <div className='content-container'>
          <ClassDogs
            dogs={filteredDogs}
            setDogs={this.setDogs}
            loading={loading}
            error={error}
          />
        </div>
      </section>
    );
  }
}

export default ClassSection;
