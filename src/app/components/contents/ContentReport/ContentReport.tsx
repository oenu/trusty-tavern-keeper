import {
  Accordion,
  Card,
  Group,
  HoverCard,
  Loader,
  Popover,
  SimpleGrid,
  Text,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { PostgrestError } from '@supabase/supabase-js';
import { useEffect, useState } from 'react';
import { supabase } from 'src/app/supabase/client';
import { Database } from 'src/app/types/supabase-types';

type ContentReportData =
  Database['public']['Functions']['get_group_content_report']['Returns'][0];

function ContentReport({ group_id }: { group_id: number }) {
  const [contentReportError, setContentReportError] =
    useState<PostgrestError>();
  const [contentReportData, setContentReportData] =
    useState<ContentReportData[]>();

  const [accordionValue, setAccordionValue] = useState<string[]>([
    'Banned Content',
    'Warned Content',
  ]);

  const getGroupContentResponses = async () => {
    supabase
      .rpc('get_group_content_report', {
        req_group_id: group_id,
      })
      .then((response) => {
        if (response.error) {
          console.log(response.error);
          setContentReportError(response.error);
        }
        if (response.data) {
          console.log(response.data);
          setContentReportData([...response.data]);
        }
      });
  };

  useEffect(() => {
    getGroupContentResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TODO - Handle errors better
  if (contentReportError) return <div>Could not fetch content report</div>;

  if (!contentReportData) return <Loader />;

  // Sort the data into Ban, Warn, Neutral

  const responses = {
    ban: contentReportData.filter((content) => content.intensity === 'Ban'),
    warn: contentReportData.filter(
      (content) => content.intensity === 'Warning'
    ),
    neutral: contentReportData.filter(
      (content) => content.intensity === 'Neutral'
    ),
  };

  const contentGrid = (contentArray: ContentReportData[]) => {
    if (!contentArray) return <div>Could not fetch content report</div>;

    return (
      <SimpleGrid
        cols={3}
        breakpoints={[
          { minWidth: 'xs', cols: 1 },
          { minWidth: 'sm', cols: 2 },
          { minWidth: 'md', cols: 3 },
          { minWidth: 1600, cols: 4 },
        ]}
        spacing="md"
      >
        {contentArray.map((content) => (
          // <UnstyledButton key={content.id}>
          <Card key={content.id}>
            {/* <Popover withinPortal> */}
            {/* <Popover.Target> */}
            <Group>
              <Text>{content.emoji}</Text>
              <Title order={5}>{content.name}</Title>
            </Group>
            {/* </Popover.Target> */}
            {/* <Popover.Dropdown> */}
            {/* <Text>{content.description}</Text> */}
            {/* </Popover.Dropdown> */}
            {/* </Popover> */}
          </Card>
          // </UnstyledButton>
        ))}
      </SimpleGrid>
    );
  };

  return (
    <div>
      <Title order={1}>Content Report</Title>
      <Accordion value={accordionValue} onChange={setAccordionValue} multiple>
        {responses.ban && (
          <Accordion.Item value="Banned Content">
            <Accordion.Control>
              <Title order={3}>Banned Content </Title>
            </Accordion.Control>

            <Accordion.Panel>{contentGrid(responses.ban)}</Accordion.Panel>
          </Accordion.Item>
        )}
        {responses.warn && (
          <Accordion.Item value="Warned Content">
            <Accordion.Control>
              <Title order={3}>Warned Content</Title>
            </Accordion.Control>
            <Accordion.Panel>{contentGrid(responses.warn)}</Accordion.Panel>
          </Accordion.Item>
        )}
        {responses.neutral && (
          <Accordion.Item value="Neutral Content">
            <Accordion.Control>
              <Title order={3}>Neutral Content </Title>
            </Accordion.Control>
            <Accordion.Panel>{contentGrid(responses.neutral)}</Accordion.Panel>
          </Accordion.Item>
        )}
      </Accordion>
    </div>
  );
}

export default ContentReport;
