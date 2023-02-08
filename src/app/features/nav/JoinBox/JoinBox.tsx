import { ActionIcon, Button, Group, TextInput } from '@mantine/core';
import React, { useEffect } from 'react';

import { MdPersonSearch } from 'react-icons/md';
import { supabase } from 'src/app/supabase/client';

function JoinBox() {
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
        onClick={async () =>
          await supabase
            .rpc('join_group_with_code', { invite: text })
            .then((res) => {
              console.log(res);

              if (res.error) {
                setErrorMessage(res.error.message);
              }
            })
        }
      >
        Join
      </Button>
    </Group>
  );
}

export default JoinBox;
