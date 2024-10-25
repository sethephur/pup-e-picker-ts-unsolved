import { Component } from 'react';
import ClassSection from './ClassSection';

export class ClassApp extends Component {
  render() {
    return (
      <div className='App' style={{ backgroundColor: 'goldenrod' }}>
        <header>
          <h1>pup-e-picker (Class)</h1>
        </header>
        <ClassSection />
      </div>
    );
  }
}

export default ClassApp;
