import { useState, createElement } from 'react';
import './App.css';
import colors from 'tailwindcss/colors';

const allowedColors = Object.keys(colors).filter((key) => {
  const disallowed = ['inherit', 'current', 'transparent'];
  return disallowed.includes(key) ? false : true;
});

const createButtons = (setFn, colors) => {
  const buttons = [];
  if (new Set(colors).size !== colors.length) {
    buttons.push(
      createElement(
        'p',
        { className: 'text-red-500' },
        'Error: Duplicate colors found'
      )
    );
  } else if (colors.some((c) => !allowedColors.includes(c))) {
    buttons.push(
      createElement(
        'p',
        { className: 'text-red-500' },
        'Error: Some colors are not allowed'
      )
    );
  } else {
    for (let i = 0; i < colors.length; i++) {
      buttons.push(
        createElement(
          'button',
          {
            key: 'color-button-' + colors[i],
            className: `color-button-class bg-${colors[i]}-500`,
            onClick: () => setFn(colors[i]),
          },
          `${colors[i]}`
        )
      );
    }
  }
  return buttons;
};

function App() {
  const [currentColor, setColor] = useState('black');
  const myColors = ['red', 'green', 'blue', 'yellow'];

  return (
    <div className={`main-container bg-${currentColor}-500`}>
      <div className='controls-wrapper'>
        <div className='button-container'>
          {createButtons(setColor, myColors)}
        </div>
      </div>
    </div>
  );
}

export default App;
