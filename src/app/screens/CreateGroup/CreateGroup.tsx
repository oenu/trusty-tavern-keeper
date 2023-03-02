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
import { useNavigate } from 'react-router-dom';

// Supabase
import { useState } from 'react';
import { supabase } from 'src/app/supabase/client';
import { TopicIntensity } from 'src/app/types/supabase-type-extensions';
import IntensitySelector from './components/IntensitySelector/IntensitySelector';

function CreateGroup({ getGroups }: { getGroups: () => Promise<void> }) {
  const maxStackWidth = 800;

  const navigate = useNavigate();

  // State
  const [supabaseError, setSupabaseError] = useState<string | null>(null);

  // Intensity
  const [groupIntensity, setGroupIntensity] = useState<TopicIntensity>(
    TopicIntensity.Fantasy
  );

  // Group Name
  const [groupName, setGroupName] = useState<string>('');
  const [showGroupNameError, setShowGroupNameError] = useState<boolean>(false);

  // Terms
  const [hasAgreed, setHasAgreed] = useState<boolean>(false);
  const [showTermError, setShowTermError] = useState<boolean>(false);

  /**
   * Create a new group in the database
   * @param groupName
   * @param intensity
   * @returns {Promise<void>}
   * @private
   * @async
   */
  const handleCreateGroup = async () => {
    let rejected = false;

    // Check if user has agreed to the terms
    if (!hasAgreed) {
      setShowTermError(true);
      rejected = true;
    }

    // Check if group name is valid
    if (groupName.length < 3) {
      setShowGroupNameError(true);
      rejected = true;
    }

    if (rejected) return;

    // Create group
    const { data, error } = await supabase.rpc('create_group', {
      name: groupName,
      intensity: groupIntensity,
    });

    if (error) {
      console.error(error);
      setSupabaseError(error.message);
      return;
    }

    if (data) {
      console.log(data);
      await getGroups();
      navigate(`/group/${data}`);
    }
  };

  return (
    <>
      <Title order={1} mb={'md'}>
        Create a Group
      </Title>

      <Center>
        <Stack maw={maxStackWidth}>
          <Card mb={'md'}>
            <Title order={2} mb={'md'}>
              Group Name
            </Title>
            <Text mb={'md'}>
              Choose a name for your group, this will be visible to other users
            </Text>
            <TextInput
              value={groupName}
              onChange={(e) => setGroupName(e.currentTarget.value)}
              error={showGroupNameError}
              description={
                <Text hidden={!showGroupNameError} color="red">
                  Group name must be at least 3 characters long
                </Text>
              }
              type="text"
              placeholder="Group Name"
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
                When selecting a group intensity its important to remember that
                you are setting an upper limit. Player responses override the
                group intensity for topics that they have selected.
              </Text>
            </Alert>
            <Alert title="Don't be weird" color="red">
              <Text fw={'bold'} align="center">
                If you push a player to play at a higher intensity or ignore
                their wishes because "it's just a game" or "but just this once",
                you should expect to be removed from the group and are an
                arsehole.
              </Text>
            </Alert>
          </Center>

          <Center>
            <Checkbox
              error={showTermError}
              size="md"
              checked={hasAgreed}
              onChange={(e) => setHasAgreed(e.currentTarget.checked)}
              label={<Text>I have read and agree to the terms of play.</Text>}
              description={
                <Text hidden={!showTermError} color="red">
                  You must agree to the terms of play to create a group.
                </Text>
              }
            />
          </Center>
          <Button onClick={handleCreateGroup}>Create Group</Button>
        </Stack>
      </Center>
    </>
  );
}
export default CreateGroup;
