import React from 'react';

function Card() {
    return (
        <div>
            <img
                src='https://images.pexels.com/photos/4032060/pexels-photo-4032060.jpeg?auto=compress&cs=tinysrgb&w=1200'
                alt='image placeholder'
            />
            <h1 className='text-2xl bg-green-500 p-3 rounded'>
                A card for photos
            </h1>
            <p>
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Accusantium, nemo!
            </p>
        </div>
    );
}

export default Card;
