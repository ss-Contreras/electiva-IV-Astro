import React, { useState } from 'react'
import { Button } from '../ui/button';

const Counter = () => {
  const [count, setCount] = useState(0);
  // const [count, setCount] = createSignal(0);

  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  return (
    <div className=''>
      <div>
        <h1 className='font-bold text-center mb-36 mt-10 text-3xl'>Island en Astro</h1>
      </div>
      <div className='flex flex-col rounded-2xl p-6 items-center border-white shadow-lg max-w-md mx-auto'>
        <div className="aaa">
          <h1 className="text-center font-bold text-4xl mb-6">Suma y Resta </h1>

          <div className="bg-gradient-to-r from-teal-500 to-blue-500 p-8 rounded-xl shadow-lg text-center max-w-md mx-auto">
            <div className="text-white font-semibold mb-4">
              <span>Contador:</span>
              <span className="text-2xl ml-2">{count}</span>
            </div>

            <div className="space-x-4 mt-4">
              <Button onClick={increment} className="bg-red-100 border rounded-xl px-4 py-2 hover:bg-red-200">
                +1
              </Button>
              <Button onClick={decrement} className="bg-red-100 border rounded-xl px-4 py-2 hover:bg-red-200" variant='ghost'>
                -1
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Counter;
