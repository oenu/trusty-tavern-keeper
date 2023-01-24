import React from 'react';
import { selectPhobias } from 'src/features/phobias/phobiasSlice';
import { useAppSelector } from 'src/lib/redux/hooks';

function Home() {
  const phobias = useAppSelector(selectPhobias);
  return (
    <div>
      <h1>Phobia List - Testing</h1>
      {phobias.map((phobia) => (
        <div key={phobia.id}>
          <h2>{phobia.name}</h2>
          <p>{phobia.description}</p>
        </div>
      ))}
    </div>
  );
}

export default Home;
