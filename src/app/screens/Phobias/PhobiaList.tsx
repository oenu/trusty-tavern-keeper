import { Card, Group, SegmentedControl, Stack, Title } from '@mantine/core';
import { PostgrestError } from '@supabase/supabase-js';
import { useContext, useEffect, useState } from 'react';
import { SessionContext } from 'src/app/app';
import { supabase } from 'src/app/supabase/client';
import { PhobiaIntensity } from 'src/app/types/enums';

function PhobiaList() {
  const session = useContext(SessionContext);

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
    const { data, error } = (await supabase.from('phobia').select('*')) as {
      data: Phobia[] | null;
      error: PostgrestError | null;
    };
    if (error) {
      console.error(error);
      setPhobiasError(error.message);
    }
    if (data) {
      console.log('Fetched phobias');
      console.log(data);
      setPhobias(data);
      setPhobiasLoading(false);
    }
  };

  /** Phobia responses are stored on the phobia_response table
   * ```json
   * {"user_id": Int, "phobia_id": Int, "intensity": PhobiaIntensity}
   * ```
   */
  const fetchPhobiaResponses = async (phobiaIds: number[]) => {
    const { data, error } = (await supabase
      .from('phobia_response')
      .select('*')
      .in('phobia_id', phobiaIds)) as {
      data: PhobiaResponse[] | null;
      error: PostgrestError | null;
    };

    if (error) {
      setPhobiaResponsesError(error.message);
      console.error(error);
    }
    if (data) {
      console.log('Fetched phobia responses');
      console.log(data);
      setPhobiaResponses(data);
    }
    setPhobiaResponsesLoading(false);
  };

  // Handle Change of Phobia Response
  const handlePhobiaResponse = async (
    phobia_id: number,
    intensity: PhobiaIntensity
  ) => {
    const { data, error } = (await supabase.from('phobia_response').upsert({
      user_id: session?.user?.id,
      phobia_id,
      intensity,
    })) as {
      data: PhobiaResponse[] | null;
      error: PostgrestError | null;
    };

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
                (phobiaResponse) => phobiaResponse.id === phobia.id
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
