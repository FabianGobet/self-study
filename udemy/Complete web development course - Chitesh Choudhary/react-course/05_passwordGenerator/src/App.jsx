import { useState, useCallback, useEffect, useRef } from 'react';
import './App.css';

function App() {
  const [password, setPassword] = useState('');
  const [length, setLength] = useState(8);
  const [numberAllowed, setNumberAllowed] = useState(false);
  const [symbolAllowed, setSymbolAllowed] = useState(false);

  const passwordRef = useRef(null);

  const generatePassword = useCallback(() => {
    let pass = '';
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const symbols = '!@#$%^&*()_+[]{}|;:,.<>?';
    const allChars =
      chars + (numberAllowed ? numbers : '') + (symbolAllowed ? symbols : '');
    for (let i = 0; i < length; i++) {
      pass += allChars.charAt(Math.floor(Math.random() * allChars.length));
    }
    setPassword(pass);
  }, [length, numberAllowed, symbolAllowed]);

  const copyToClipboard = () => {
    window.navigator.clipboard.writeText(password);
    passwordRef.current?.select();
  };

  useEffect(() => generatePassword(), [length, numberAllowed, symbolAllowed]);

  return (
    <>
      <div className='w-full max-w-md mx-auto shadow-2xl rounded-md px-4 py-3 my-8 bg-gray-800 text-orange-500'>
        <h1 className='text-white text-center my-3'>Password Generator</h1>

        <div className='flex shadow rounded-lg overflow-hidden mb-4'>
          <input
            type='text'
            className='outline-none w-full py-1 px-3 placeholder:italic placeholder:text-gray-500'
            value={password}
            placeholder='Password'
            readOnly
            ref={passwordRef}
          />
          <button
            className='outline-none bg-blue-700 text-white px-3 py-0.5 shrink-0 hover:bg-blue-900'
            onClick={copyToClipboard}
          >
            Copy
          </button>
        </div>

        <div className='flex items-start text-sm gap-x-4'>
          {/* Range + Label */}
          <div className='flex items-center gap-x-2'>
            <input
              type='range'
              min={1}
              max={24}
              name='slider'
              className='cursor-pointer'
              onChange={(e) => setLength(e.target.value)}
            />
            <label htmlFor='slider'>length: {length}</label>
          </div>

          {/* Checkbox + Label + hi span */}
          <div className='flex items-start gap-x-2'>
            <input
              type='checkbox'
              name='allowNumbers'
              checked={numberAllowed}
              onClick={() => setNumberAllowed((prev) => !prev)}
              className='cursor-pointer mt-1'
              onChange={(e) => console.log(e)}
            />
            <div className='flex flex-col leading-tight'>
              <label htmlFor='allowNumbers'>Numbers?</label>
              <span
                className={`text-xs text-${
                  numberAllowed ? 'green' : 'red'
                }-500`}
              >
                {String(numberAllowed)}
              </span>
            </div>
          </div>
          <div className='flex items-start gap-x-2'>
            <input
              type='checkbox'
              name='allowSymbols'
              checked={symbolAllowed}
              onClick={() => setSymbolAllowed((prev) => !prev)}
              className='cursor-pointer mt-1'
              onChange={(e) => console.log(e)}
            />
            <div className='flex flex-col leading-tight'>
              <label htmlFor='allowSymbols'>Symbols?</label>
              <span
                className={`text-xs text-${
                  symbolAllowed ? 'green' : 'red'
                }-500`}
              >
                {String(symbolAllowed)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
