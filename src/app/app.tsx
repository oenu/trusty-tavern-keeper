import styled from 'styled-components';
// import NxWelcome from './nx-welcome';
import { selectPhobias } from 'src/features/phobias/phobiasSlice';
import { useAppSelector } from 'src/redux/hooks';

const StyledApp = styled.div`
  // Your style here
`;

export function App() {
  const phobias = useAppSelector(selectPhobias);

  return (
    <StyledApp>
      {phobias.map((phobia) => (
        <div key={phobia.id}>
          <h1>{phobia.name}</h1>
          <p>{phobia.description}</p>
        </div>
      ))}

      {/* <NxWelcome title="trusty-tavern-keeper" /> */}
    </StyledApp>
  );
}

export default App;
