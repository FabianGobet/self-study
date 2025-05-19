import { useState, createElement } from 'react';
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
            className:
              'text-black font-bold py-2 px-4 rounded-3xl border hover:border-black hover:border-double',
            style: {
              backgroundColor: colors[i],
            },
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
    <div
      className='w-full h-screen duration-200'
      style={{ backgroundColor: currentColor }}
    >
      <div className='fixed flex flex-wrap justify-center bottom-12 inset-x-0'>
        <div className='flex flex-wrap justify-center gap-3 shadow-lg bg-white px-3 py-2 rounded-3xl'>
          {createButtons(setColor, myColors)}
        </div>
      </div>
    </div>
  );
}

export default App;
