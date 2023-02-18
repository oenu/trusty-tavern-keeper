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
  Content,
  ContentCategory,
  ContentIntensity,
  ContentResponse,
} from 'src/app/types/supabase-type-extensions';

function ContentList() {
  // Data states
  const [contents, setContents] = useState<Content[]>([]);
  const [contentResponses, setContentResponses] = useState<ContentResponse[]>(
    []
  );

  // Loading states
  const [contentResponsesLoading, setContentResponsesLoading] =
    useState<boolean>(true);
  const [contentsLoading, setContentsLoading] = useState<boolean>(true);
  const [pendingContentResponses, setPendingContentResponses] = useState<
    number[]
  >([]);

  // Error states
  const [contentResponsesError, setContentResponsesError] = useState<
    string | null
  >(null);
  const [contentsError, setContentsError] = useState<string | null>(null);

  /**
   * Handle Content Response
   * Handles the response to a content
   * @param {number} content_id - The id of the content
   * @param {ContentIntensity} intensity - The intensity of the response
   * @returns {Promise<void>}
   * @async
   */

  // Handle Change of Content Response
  const handleContentResponse = async (
    content_id: number,
    intensity: ContentIntensity
  ): Promise<void> => {
    // If the content response is already pending, don't do anything
    if (pendingContentResponses.includes(content_id)) return;
    const user_id = (await supabase.auth.getUser()).data.user?.id;
    if (!user_id) {
      console.error('No user id, this should not happen');
      return;
    }

    // Add the content id to the pending content responses
    setPendingContentResponses((prevPendingContentResponses) => [
      ...prevPendingContentResponses,
      content_id,
    ]);

    // Upsert the content response
    supabase
      .from('content_response')
      .upsert({
        user_id,
        content_id,
        intensity,
      })
      .select('*')
      .then(({ data, error }) => {
        if (data) {
          console.debug('Upserted content response follows:');
          console.debug(data);
          setContentResponses((prevContentResponses) => {
            const newResponses = [...prevContentResponses];
            const index = newResponses.findIndex(
              (contentResponse) =>
                contentResponse.content_id === content_id &&
                contentResponse.user_id === user_id
            );

            // If the content response doesn't exist, add it
            if (index === -1) newResponses.push(data[0]);
            // Otherwise, replace it
            else newResponses[index] = data[0];
            return newResponses;
          });
        } else if (error) {
          console.error(error);
        } else {
          console.error(
            'No data or error returned from content response upsert'
          );
        }

        // Remove the content id from the pending content responses
        setPendingContentResponses((prevPendingContentResponses) =>
          prevPendingContentResponses.filter((id) => id !== content_id)
        );
      });
  };

  useEffect(() => {
    fetchContents()
      .then(async (contents: Content[]) => {
        setContents(contents);
        setContentsLoading(false);
        fetchContentResponses(contents.map((content) => content.id))
          .then((contentResponses: ContentResponse[]) => {
            setContentResponses(contentResponses);
            setContentResponsesLoading(false);
          })
          .catch((error) => {
            setContentResponsesError(error.message);
          });
      })
      .catch((error) => {
        setContentsError(error.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const contentCards = contents.map((content) => {
    const contentValue = contentResponses.find(
      (contentResponse) => contentResponse.content_id === content.id
    )?.intensity;

    if (contentValue === undefined) {
      // Set default value to "Adventure" intensity (A)
    }

    return (
      <Card key={content.id}>
        <Stack justify={'space-between'} style={{ height: '100%' }}>
          <Stack>
            <Group position="apart" noWrap>
              <Title order={3}>{content.name}</Title>
              {pendingContentResponses.includes(content.id) && (
                <Loader size={20} color="blue" />
              )}
            </Group>
            <Text>{content.description}</Text>
          </Stack>
          <Stack align={'stretch'} justify={'space-between'}>
            <Skeleton radius="sm" visible={contentResponsesLoading}>
              <SegmentedControl
                fullWidth
                transitionDuration={0}
                disabled={
                  contentResponsesLoading ||
                  pendingContentResponses.includes(content.id)
                }
                value={contentValue}
                onChange={(value) => {
                  console.log(
                    `Changing content response for ${content.name} to ${value}`
                  );
                  handleContentResponse(content.id, value as ContentIntensity);
                }}
                data={Object.keys(ContentIntensity).map((key) => ({
                  label: key,
                  value: ContentIntensity[key as keyof typeof ContentIntensity],
                }))}
              />
            </Skeleton>
          </Stack>
        </Stack>
      </Card>
    );
  });

  // Separate the content cards into categories
  const contentCardsByCategory = contentCards.reduce(
    (acc, contentCard) => {
      const content = contents.find(
        (content) => content.id === parseInt(contentCard.key as string)
      );
      if (!content) {
        console.error('Content not found');
        return acc;
      }
      const category = content.category;
      if (!acc[category]) acc[category] = [];
      acc[category].push(contentCard);
      return acc;
    },
    {
      [ContentCategory.Physical]: [] as JSX.Element[],
      [ContentCategory.Objects]: [] as JSX.Element[],
      [ContentCategory.Social]: [] as JSX.Element[],
      [ContentCategory.Animals]: [] as JSX.Element[],
      [ContentCategory.Death]: [] as JSX.Element[],
      [ContentCategory.Supernatural]: [] as JSX.Element[],
      [ContentCategory.Other]: [] as JSX.Element[],
    }
  );

  return (
    <>
      <Title mb={'md'}>User Content List</Title>
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
      {contentsLoading ? (
        <Loader size={20} color="blue" />
      ) : contentsError || contentResponsesError ? (
        <Alert title="Something went wrong" color={'red'}>
          {contentsError || contentResponsesError}
          {contentsError && contentResponsesError && <br />}
        </Alert>
      ) : contents.length === 0 ? (
        <Alert title="No contents found" color={'red'}>
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
            {contentCardsByCategory[ContentCategory.Physical]}
          </SimpleGrid>
          <Title mt={'lg'}>Social Interaction / People</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Social]}
          </SimpleGrid>
          <Title mt={'lg'}>Objects</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Objects]}
          </SimpleGrid>
          <Title mt={'lg'}>Animals</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Animals]}
          </SimpleGrid>
          <Title mt={'lg'}>Death / Injury</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Death]}
          </SimpleGrid>
          <Title mt={'lg'}>Supernatural</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Supernatural]}
          </SimpleGrid>
          <Title mt={'lg'}>Other</Title>
          <Divider mb={'sm'} />
          <SimpleGrid
            breakpoints={[
              { minWidth: 'md', cols: 2 },
              { minWidth: 'lg', cols: 3 },
            ]}
          >
            {contentCardsByCategory[ContentCategory.Other]}
          </SimpleGrid>
        </>
      )}
    </>
  );
}

export default ContentList;

/**
 * fetchContents
 * Fetches all contents from the database
 * @returns {Promise<Content[]>}
 * @async
 */

const fetchContents = async (): Promise<Content[]> => {
  return supabase
    .from('content')
    .select('*')
    .then(({ data, error }) => {
      if (data) {
        console.debug('Fetched contents' + data);
        return data;
      } else if (error) {
        console.error(error);
        throw error;
      } else {
        throw new Error('No data or error returned from content fetch');
      }
    });
};

/**
 * fetchContentResponses
 * Fetches all content responses from the database
 * @param {number[]} contentIds
 * @returns {Promise<ContentResponse>}
 * @async
 */

const fetchContentResponses = async (
  contentIds: number[]
): Promise<ContentResponse[]> => {
  return supabase
    .from('content_response')
    .select('*')
    .in('content_id', contentIds)
    .then(({ data, error }) => {
      if (data) {
        console.debug('Fetched content responses' + data);
        return data;
      } else if (error) {
        throw error;
      } else {
        throw new Error(
          'No data or error returned from content response fetch'
        );
      }
    });
};
