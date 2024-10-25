import React, { Component } from 'react';
import { dogPictures } from '../dog-pictures';
import { Dog } from '../types';

interface ClassCreateDogFormProps {
  setDogs: (updater: (prevDogs: Dog[]) => Dog[]) => void;
  setIsModalOpen: (open: boolean) => void;
}

interface CreateDogFormState {
  name: string;
  description: string;
  image: string;
}

const defaultSelectedImage = dogPictures.BlueHeeler;

class ClassCreateDogForm extends Component<
  ClassCreateDogFormProps,
  CreateDogFormState
> {
  constructor(props: ClassCreateDogFormProps) {
    super(props);
    this.state = {
      name: '',
      description: '',
      image: defaultSelectedImage,
    };
  }

  handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { name, description, image } = this.state;

    fetch('http://localhost:3000/dogs')
      .then((response) => response.json())
      .then((dogs) => {
        const maxId = dogs.reduce(
          (max: number, dog: { id: number }) => (dog.id > max ? dog.id : max),
          0
        );

        const newDog: Dog = {
          name,
          image,
          description,
          isFavorite: false,
          id: maxId + 1,
        };

        return fetch('http://localhost:3000/dogs', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(newDog),
        })
          .then((response) => {
            if (!response.ok) {
              return Promise.reject(`Failed to create dog: ${response.status}`);
            }
            return response.json();
          })
          .then((createdDog) => {
            this.props.setDogs((prevDogs) => [...prevDogs, createdDog]);
            this.props.setIsModalOpen(false);
          })
          .catch((error) => {
            console.error('Error submitting form:', error);
          });
      })
      .catch((error) => {
        console.error('Error fetching dogs:', error);
      });
  };

  handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    } as Pick<CreateDogFormState, keyof CreateDogFormState>);
  };

  render() {
    const { name, description, image } = this.state;

    return (
      <form action='' id='create-dog-form' onSubmit={this.handleSubmit}>
        <h4>Create a New Dog</h4>
        <label htmlFor='name'>Dog Name</label>
        <input
          type='text'
          name='name'
          value={name}
          onChange={this.handleInputChange}
          disabled={false}
        />
        <label htmlFor='description'>Dog Description</label>
        <textarea
          name='description'
          id=''
          cols={80}
          rows={10}
          value={description}
          onChange={this.handleInputChange}
          disabled={false}
        />
        <label htmlFor='picture'>Select an Image</label>
        <select
          name='image'
          id='picture'
          value={image}
          onChange={this.handleInputChange}
        >
          {Object.entries(dogPictures).map(([label, pictureValue]) => {
            return (
              <option value={pictureValue} key={pictureValue}>
                {label}
              </option>
            );
          })}
        </select>
        <input type='submit' />
      </form>
    );
  }
}

export default ClassCreateDogForm;
