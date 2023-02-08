import { Button } from '@mantine/core';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from 'src/app/supabase/client';

function CreateGroup({ getGroups }: { getGroups: () => Promise<void> }) {
  const navigate = useNavigate();
  return (
    <div>
      inset group creation screen here
      <Button
        onClick={async () => {
          const { data, error } = await supabase.rpc('create_group', {
            name: 'testGroupName',
            intensity: 'Adventure',
          });

          if (error) console.log(error);
          if (data) {
            console.log(data);
            await getGroups();
            navigate(`/group/${data}`);
          }
        }}
      >
        Create Group (test)
      </Button>
    </div>
  );
}

export default CreateGroup;
