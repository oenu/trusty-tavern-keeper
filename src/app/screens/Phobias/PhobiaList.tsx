// Components
import {
  Text,
  Card,
  Group,
  Loader,
  SegmentedControl,
  SimpleGrid,
  Skeleton,
  Stack,
  Title,
  Alert,
  Divider,
  List,
  HoverCard,
} from '@mantine/core';
// Hooks
import { useEffect, useState } from 'react';

// Supabase
import { supabase } from 'src/app/supabase/client';

// Types
import {
  Phobia,
  PhobiaCategory,
  PhobiaIntensity,
  PhobiaResponse,
} from 'src/app/types/supabase-type-extensions';

function PhobiaList() {
  // Data states
  const [phobias, setPhobias] = useState<Phobia[]>([]);
  const [phobiaResponses, setPhobiaResponses] = useState<PhobiaResponse[]>([]);

  // Loading states
  const [phobiaResponsesLoading, setPhobiaResponsesLoading] =
    useState<boolean>(true);
  const [phobiasLoading, setPhobiasLoading] = useState<boolean>(true);
  const [pendingPhobiaResponses, setPendingPhobiaResponses] = useState<
    number[]
  >([]);

  // Error states
  const [phobiaResponsesError, setPhobiaResponsesError] = useState<
    string | null
  >(null);
  const [phobiasError, setPhobiasError] = useState<string | null>(null);

  /**
   * fetchPhobias
   * Fetches all phobias from the database
   * @returns {Promise<void>}
   * @async
   */

  // Handle Change of Phobia Response
  const handlePhobiaResponse = async (
    phobia_id: number,
    intensity: PhobiaIntensity
  ) => {
    // If the phobia response is already pending, don't do anything
    if (pendingPhobiaResponses.includes(phobia_id)) return;
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) {
      console.error('No user id, this should not happen');
      return;
    }

    // Add the phobia id to the pending phobia responses
    setPendingPhobiaResponses((prevPendingPhobiaResponses) => [
      ...prevPendingPhobiaResponses,
      phobia_id,
    ]);

    // Upsert the phobia response
    supabase
      .from('phobia_response')
      .upsert({
        user_id,
        phobia_id,
        intensity,
      })
      .select('*')
      .then(({ data, error }) => {
        if (data) {
          console.debug('Upserted phobia response follows:');
          console.debug(data);
          setPhobiaResponses((prevPhobiaResponses) => {
            const newResponses = [...prevPhobiaResponses];
            const index = newResponses.findIndex(
              (phobiaResponse) =>
                phobiaResponse.phobia_id === phobia_id &&
                phobiaResponse.user_id === user_id
            );

            // If the phobia response doesn't exist, add it
            if (index === -1) newResponses.push(data[0]);
            // Otherwise, replace it
            else newResponses[index] = data[0];
            return newResponses;
          });
        } else if (error) {
          console.error(error);
        } else {
          console.error(
            'No data or error returned from phobia response upsert'
          );
        }

        // Remove the phobia id from the pending phobia responses
        setPendingPhobiaResponses((prevPendingPhobiaResponses) =>
          prevPendingPhobiaResponses.filter((id) => id !== phobia_id)
        );
      });
  };

  useEffect(() => {
    fetchPhobias()
      .then(async (phobias: Phobia[]) => {
        setPhobias(phobias);
        setPhobiasLoading(false);
        fetchPhobiaResponses(phobias.map((phobia) => phobia.id))
          .then((phobiaResponses: PhobiaResponse[]) => {
            setPhobiaResponses(phobiaResponses);
            setPhobiaResponsesLoading(false);
          })
          .catch((error) => {
            setPhobiaResponsesError(error.message);
          });
      })
      .catch((error) => {
        setPhobiasError(error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const phobiaCards = phobias.map((phobia) => (
    <Card key={phobia.id}>
      <Stack justify={'space-between'} style={{ height: '100%' }}>
        <Stack>
          <Group position="apart" noWrap>
            <Title order={3}>{phobia.name}</Title>
            {pendingPhobiaResponses.includes(phobia.id) && (
              <Loader size={20} color="blue" />
            )}
          </Group>
          <Text>{phobia.description}</Text>
        </Stack>
        <Stack align={'stretch'} justify={'space-between'}>
          <Skeleton radius="sm" visible={phobiaResponsesLoading}>
            <SegmentedControl
              fullWidth
              transitionDuration={0}
              disabled={
                phobiaResponsesLoading ||
                pendingPhobiaResponses.includes(phobia.id)
              }
              value={
                phobiaResponses.find(
                  (phobiaResponse) => phobiaResponse.phobia_id === phobia.id
                )?.intensity
              }
              onChange={(value) => {
                console.log(
                  `Changing phobia response for ${phobia.name} to ${value}`
                );
                handlePhobiaResponse(phobia.id, value as PhobiaIntensity);
              }}
              data={Object.keys(PhobiaIntensity).map((key) => ({
                label: key,
                value: PhobiaIntensity[key as keyof typeof PhobiaIntensity],
              }))}
            />
          </Skeleton>
        </Stack>
      </Stack>
    </Card>
  ));

  // Separate the phobia cards into categories
  const phobiaCardsByCategory = phobiaCards.reduce(
    (acc, phobiaCard) => {
      const phobia = phobias.find(
        (phobia) => phobia.id === parseInt(phobiaCard.key as string)
      );
      if (!phobia) {
        console.error('Phobia not found');
        return acc;
      }
      const category = phobia.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(phobiaCard);
      return acc;
    },
    {
      [PhobiaCategory.Physical]: [] as JSX.Element[],
      [PhobiaCategory.Objects]: [] as JSX.Element[],
      [PhobiaCategory.Social]: [] as JSX.Element[],
      [PhobiaCategory.Animals]: [] as JSX.Element[],
      [PhobiaCategory.Death]: [] as JSX.Element[],
      [PhobiaCategory.Supernatural]: [] as JSX.Element[],
      [PhobiaCategory.Other]: [] as JSX.Element[],
    }
  );

  return (
    <>
      <Title mb={'md'}>User Phobia List</Title>
      <Card mb={'md'}>
        <Text>
          Some content can be upsetting or triggering for people, on this page
          you will find a list of common topics that might come up in a
          roleplaying session. You can choose how comfortable you are with each
          topic by selecting from the options below, and you can change your
          mind at any time. When a group report is generated, the topics that
          players are not comfortable with will be anonymously listed so that
          the GM can avoid them.
        </Text>
        <Divider my={'md'} />
        {/* ('Unaffected', 'Neutral', 'Warning', 'Ban'); */}
        <Text>The four options you can choose from are:</Text>
        <List mb={'sm'}>
          <List.Item>
            <Text>
              <Text fw={700} span>
                Unaffected: &nbsp;
              </Text>
              This topic does not affect me in any way.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              <Text fw={700} span>
                Neutral: &nbsp;
              </Text>
              I am comfortable with this topic in a roleplaying session.
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              <Text fw={700} span>
                Warning: &nbsp;
              </Text>
              I am comfortable with this topic if it is brought up before the
              session and I give my{' '}
              <HoverCard width={400}>
                <HoverCard.Target>
                  <Text
                    variant="gradient"
                    gradient={{ from: 'indigo', to: 'cyan', deg: 45 }}
                    span
                  >
                    enthusiastic consent.
                  </Text>
                </HoverCard.Target>
                <HoverCard.Dropdown>
                  <Text>
                    Enthusiastic consent is a form of consent that requires
                    active, positive, and ongoing communication between all
                    participants. It can be withdrawn at any time.
                  </Text>
                </HoverCard.Dropdown>
              </HoverCard>
            </Text>
          </List.Item>
          <List.Item>
            <Text>
              <Text fw={700} span>
                Ban: &nbsp;
              </Text>
              This topic is not allowed in my sessions.
            </Text>
          </List.Item>
        </List>

        <Alert mb={'sm'}>
          If at any point you feel uncomfortable while playing, stop the game
          and speak with your group/GM.
          <br />
          If a player or GM is making you feel uncomfortable, stop the game.
        </Alert>
        <Alert color={'red'}>
          <Text fw={700} ta={'center'}>
            Do not play with anyone anyone who makes you feel unsafe or
            uncomfortable.
            <br />
            You have a right to feel safe in your hobby.
          </Text>
        </Alert>
      </Card>
      {phobiasLoading ? (
        <Loader size={20} color="blue" />
      ) : phobiasError || phobiaResponsesError ? (
        <Alert title="Something went wrong" color={'red'}>
          {phobiasError || phobiaResponsesError}
          {phobiasError && phobiaResponsesError && <br />}
        </Alert>
      ) : phobias.length === 0 ? (
        <Alert title="No phobias found" color={'red'}>
          This should not happen, please contact the site administrator.
        </Alert>
      ) : (
        <>
          <Title mt={'lg'}>Sensation / Physical</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Physical]}
          </SimpleGrid>
          <Title mt={'lg'}>Social Interaction / People</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Objects]}
          </SimpleGrid>
          <Title mt={'lg'}>Objects</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Social]}
          </SimpleGrid>
          <Title mt={'lg'}>Animals</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Animals]}
          </SimpleGrid>
          <Title mt={'lg'}>Death / Injury</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Death]}
          </SimpleGrid>
          <Title mt={'lg'}>Supernatural</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Supernatural]}
          </SimpleGrid>
          <Title mt={'lg'}>Other</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {phobiaCardsByCategory[PhobiaCategory.Other]}
          </SimpleGrid>
        </>
      )}
    </>
  );
}

export default PhobiaList;

const fetchPhobias = async (): Promise<Phobia[]> => {
  return supabase
    .from('phobia')
    .select('*')
    .then(({ data, error }) => {
      if (data) {
        console.debug('Fetched phobias' + data);
        return data;
      } else if (error) {
        console.error(error);
        throw error;
      } else {
        throw new Error('No data or error returned from phobia fetch');
      }
    });
};

const fetchPhobiaResponses = async (
  phobiaIds: number[]
): Promise<PhobiaResponse[]> => {
  return supabase
    .from('phobia_response')
    .select('*')
    .in('phobia_id', phobiaIds)
    .then(({ data, error }) => {
      if (data) {
        console.debug('Fetched phobia responses' + data);
        return data;
      } else if (error) {
        throw error;
      } else {
        throw new Error('No data or error returned from phobia response fetch');
      }
    });
};
