import { dogPictures } from '../dog-pictures';

interface FunctionalCreateDogFormProps {
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// use this as your default selected image
const defaultSelectedImage = dogPictures.BlueHeeler;

export const FunctionalCreateDogForm: React.FC<
  FunctionalCreateDogFormProps
  // eslint-disable-next-line react/prop-types
> = ({ setIsModalOpen }) => {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const name =
      (form.querySelector('input[type="text"]') as HTMLInputElement)?.value ||
      '';
    const description =
      (form.querySelector('textarea') as HTMLTextAreaElement)?.value || '';
    const image =
      (form.querySelector('select') as HTMLSelectElement)?.value ||
      defaultSelectedImage;

    fetch('http://localhost:3000/dogs')
      .then((response) => response.json())
      .then((dogs) => {
        const maxId = dogs.reduce(
          (max: number, dog: { id: number }) => (dog.id > max ? dog.id : max),
          0
        );

        const newDog = {
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
        });
      })
      .then((response) => {
        if (!response.ok) {
          return Promise.reject(`Failed to create dog: ${response.status}`);
        }
        return response.json();
      })
      .then((responseData) => {
        console.log('Dog created successfully:', responseData);
      })
      .catch((error) => {
        console.error('Error submitting form:', error);
      });

    setIsModalOpen(false);
  };

  return (
    <form
      action=''
      id='create-dog-form'
      onSubmit={(e) => {
        handleSubmit(e);
      }}
    >
      <h4>Create a New Dog</h4>
      <label htmlFor='name'>Dog Name</label>
      <input type='text' disabled={false} />
      <label htmlFor='description'>Dog Description</label>
      <textarea name='' id='' cols={80} rows={10} disabled={false}></textarea>
      <label htmlFor='picture'>Select an Image</label>
      <select id='picture'>
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
};
