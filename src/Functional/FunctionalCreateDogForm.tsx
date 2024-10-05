import { dogPictures } from '../dog-pictures';

// use this as your default selected image
const defaultSelectedImage = dogPictures.BlueHeeler;

export const FunctionalCreateDogForm = () => {
  return (
    <form
      action=''
      id='create-dog-form'
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <h4>Create a New Dog</h4>
      <label htmlFor='name'>Dog Name</label>
      <input type='text' disabled={false} />
      <label htmlFor='description'>Dog Description</label>
      <textarea name='' id='' cols={80} rows={10} disabled={false}></textarea>
      <label htmlFor='picture'>Select an Image</label>
      <select id=''>
        {Object.entries(dogPictures).map(([label, pictureValue]) => {
          return (
            <option value={defaultSelectedImage} key={pictureValue}>
              {label}
            </option>
          );
        })}
      </select>
      <input type='submit' />
    </form>
  );
};
