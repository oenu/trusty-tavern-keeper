import { Card, Group, SegmentedControl, Stack, Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { supabase } from 'src/app/supabase/client';
import { PhobiaIntensity } from 'src/app/types/enums';
import { Phobia, PhobiaResponse } from 'src/app/types/supabase-type-extensions';

function PhobiaList() {
  // Data states
  const [phobias, setPhobias] = useState<Phobia[]>([]);
  const [phobiaResponses, setPhobiaResponses] = useState<PhobiaResponse[]>([]);

  // Loading states
  const [phobiaResponsesLoading, setPhobiaResponsesLoading] =
    useState<boolean>(true);
  const [phobiasLoading, setPhobiasLoading] = useState<boolean>(true);

  // Error states
  const [phobiaResponsesError, setPhobiaResponsesError] = useState<
    string | null
  >(null);
  const [phobiasError, setPhobiasError] = useState<string | null>(null);

  /** Phobias are stored on the phobia table
   * ```json
   * {"id": Int, "name": String, "description": String}
   * ```
   */
  const fetchPhobias = async () => {
    supabase
      .from('phobia')
      .select('*')
      .then(({ data, error }) => {
        if (data) {
          console.log('Fetched phobias' + data);
          setPhobias(data);
          setPhobiasLoading(false);
        } else if (error) {
          setPhobiasError(error.message);
          console.error(error);
        } else {
          console.error('No data or error returned from phobia fetch');
        }
      });
  };

  /** Phobia responses are stored on the phobia_response table
   * ```json
   * {"user_id": Int, "phobia_id": Int, "intensity": PhobiaIntensity}
   * ```
   */
  const fetchPhobiaResponses = async (phobiaIds: number[]) => {
    supabase
      .from('phobia_response')
      .select('*')
      .in('phobia_id', phobiaIds)
      .then(({ data, error }) => {
        if (data) {
          console.log('Fetched phobia responses' + data);
          setPhobiaResponses(data);
          setPhobiaResponsesLoading(false);
        } else if (error) {
          setPhobiaResponsesError(error.message);
          console.error(error);
        } else {
          console.error('No data or error returned from phobia response fetch');
        }
      });
  };

  // Handle Change of Phobia Response
  const handlePhobiaResponse = async (
    phobia_id: number,
    intensity: PhobiaIntensity
  ) => {
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) {
      console.error('No user id, this should not happen');
      return;
    }

    const { data, error } = await supabase.from('phobia_response').upsert({
      user_id,
      phobia_id,
      intensity,
    });

    if (error) {
      console.error(error);
    }
    if (data) {
      console.log('Upserted phobia response');
      console.log(data);
    }
  };

  useEffect(() => {
    fetchPhobias().then(async () => {
      await fetchPhobiaResponses(phobias.map((phobia) => phobia.id));
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phobiaCards = phobias.map((phobia) => (
    <Card key={phobia.id}>
      <Group position="apart">
        <Stack>
          <Title order={3}>{phobia.name}</Title>
          <p>{phobia.description}</p>
        </Stack>

        <Stack>
          <SegmentedControl
            value={
              phobiaResponses.find(
                (phobiaResponse) => phobiaResponse.phobia_id === phobia.id
              )?.intensity
            }
            onChange={(value) => console.log(value)}
            data={Object.keys(PhobiaIntensity).map((key) => ({
              label: key,
              value: PhobiaIntensity[key as keyof typeof PhobiaIntensity],
            }))}
          />
        </Stack>
      </Group>
    </Card>
  ));

  return (
    <>
      {phobiasLoading ? <p>Loading phobias...</p> : phobiaCards}
      {phobiasError && <p>{phobiasError}</p>}
      {phobiaResponsesLoading && <p>Loading phobia responses...</p>}
      {phobiaResponsesError && <p>{phobiaResponsesError}</p>}
    </>
  );
}

export default PhobiaList;
