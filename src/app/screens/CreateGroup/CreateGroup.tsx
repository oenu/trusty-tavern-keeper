// Components
import { Alert, Button, TextInput } from '@mantine/core';

// Hooks
import { useNavigate } from 'react-router-dom';
import { useForm } from '@mantine/form';

// Supabase
import { supabase } from 'src/app/supabase/client';
import { Group, TopicIntensity } from 'src/app/types/supabase-type-extensions';
import { useState } from 'react';

function CreateGroup({ getGroups }: { getGroups: () => Promise<void> }) {
  const navigate = useNavigate();
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  const form = useForm({
    initialValues: {
      name: '' as Group['name'],
      intensity: '' as TopicIntensity | undefined,
    },
    validate: {
      name: (value) =>
        value.length > 3 || 'Group name must be at least 3 characters',
      intensity: (value) => {
        if (value === undefined) return 'Please select an intensity';
        // check if value is a valid intensity (TopicIntensity)
        if (value in TopicIntensity) return;
        else return 'Please select an intensity';
      },
    },
  });

  const handleCreateGroup = async (
    groupName: Group['name'],
    intensity: TopicIntensity
  ) => {
    const { data, error } = await supabase.rpc('create_group', {
      name: groupName,
      intensity,
    });

    if (error) console.log(error);
    if (data) {
      console.log(data);
      await getGroups();
      navigate(`/group/${data}`);
    }
  };

  return (
    <form
      onSubmit={form.onSubmit(
        async (values) => {
          form.validate();

          // Check if form is valid
          if (!form.isValid()) return;

          console.log(values);
          console.log(form.values);
          console.log(form.errors);
          console.log(form.isValid());

          // await handleCreateGroup();
        },
        (validationErrors) => {
          console.log(validationErrors);
        }
      )}
    >
      <TextInput
        type="text"
        placeholder="Group Name"
        {...form.getInputProps('name')}
      />

      {supabaseError && (
        <Alert title="Something went wrong" color="red">
          {supabaseError}
        </Alert>
      )}
      <Button type="submit">Create Group</Button>
    </form>
  );
}

export default CreateGroup;
