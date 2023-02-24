// Components
import {
  Alert,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';

// Hooks
import { useForm } from '@mantine/form';
import { useNavigate } from 'react-router-dom';

// Supabase
import { useState } from 'react';
import { supabase } from 'src/app/supabase/client';
import { Group, TopicIntensity } from 'src/app/types/supabase-type-extensions';
import IntensitySelector from './components/IntensitySelector/IntensitySelector';

function CreateGroup({ getGroups }: { getGroups: () => Promise<void> }) {
  const maxStackWidth = 800;

  const navigate = useNavigate();

  // State
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Form
  const form = useForm({
    initialValues: {
      name: '' as Group['name'],
      intensity: 'Fantasy' as TopicIntensity,
      agree: false,
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
      agree: (value) => value || 'You must agree to the above',
    },
  });

  /**
   * Create a new group in the database
   * @param groupName
   * @param intensity
   * @returns {Promise<void>}
   * @private
   * @async
   */
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

  const [groupIntensity, setGroupIntensity] = useState<TopicIntensity>(
    TopicIntensity.Fantasy
  );

  form.onSubmit(async (values) => {
    const { name, intensity } = values;
    await handleCreateGroup(name, intensity);
  });

  return (
    <>
      <Title order={1} mb={'md'}>
        Create a Group
      </Title>

      <form>
        <Center>
          <Stack maw={maxStackWidth}>
            <Card mb={'md'}>
              <Title order={2} mb={'md'}>
                Group Name
              </Title>
              <Text mb={'md'}>
                Choose a name for your group, this will be visible to other
                users
              </Text>
              <TextInput
                type="text"
                placeholder="Group Name"
                {...form.getInputProps('name')}
              />
            </Card>

            <IntensitySelector
              groupIntensity={groupIntensity}
              setGroupIntensity={setGroupIntensity}
            />

            {supabaseError && (
              <Alert title="Something went wrong" color="red">
                {supabaseError}
              </Alert>
            )}
            <Divider />
            <Center>
              <Alert title="Remember" color="blue">
                <Text>
                  When selecting a group intensity its important to remember
                  that you are setting an upper limit. Player responses override
                  the group intensity for topics that they have selected.
                </Text>
              </Alert>
              <Alert title="Don't be weird" color="red">
                <Text fw={'bold'} align="center">
                  If you push a player to play at a higher intensity or ignore
                  their wishes because "it's just a game" or "but just this
                  once", you should expect to be removed from the group and are
                  an arsehole.
                </Text>
              </Alert>
            </Center>

            <Checkbox
              label="I agree to the above (placeholder)"
              {...form.getInputProps('agree')}
            />

            <Button type="submit">Create Group</Button>
          </Stack>
        </Center>
      </form>
    </>
  );
}
export default CreateGroup;
