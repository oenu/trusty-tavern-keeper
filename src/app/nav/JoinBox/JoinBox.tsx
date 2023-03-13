import { Button, Group, TextInput } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';

import { supabase } from 'src/app/supabase/client';

function JoinBox({ getGroups }: { getGroups: () => Promise<void> }) {
  const navigate = useNavigate();

  const [text, setText] = React.useState<string>('');
  const [errorMessage, setErrorMessage] = React.useState<string>('');

  return (
    <Group noWrap align={'top'}>
      <TextInput
        value={text}
        onChange={(event) => {
          setText(event.currentTarget.value);
          // Assume that if a user is changing the text, they want to try again (so clear the error message)
          setErrorMessage('');
        }}
        error={
          errorMessage.length > 0
            ? errorMessage
            : text.length === 0 || text.length === 6
            ? ''
            : 'Not a valid group code'
        }
        placeholder="Join An Existing Group"
      />
      <Button
        variant="outline"
        disabled={text.length !== 6}
        onClick={async () => {
          const { data, error } = await supabase.rpc('join_group', {
            invite: text,
          }); // Returns the group id if successful

          if (error) {
            setErrorMessage(error.message);
            return;
          }

          if (data) {
            await getGroups();
            navigate(`/group/${data}`);
          }
        }}
      >
        Join
      </Button>
    </Group>
  );
}

export default JoinBox;
