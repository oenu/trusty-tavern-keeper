import { Card, Title } from '@mantine/core';
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

  if (!contentReportData) return <div>Loading...</div>;

  return contentReportData?.map((content) => (
    <ContentItem key={`content-item-${content.id}`} content={content} />
  ));
}

export default ContentReport;

const ContentItem = ({ content }: { content: ContentReportData }) => {
  return (
    <Card>
      <Title order={3}>{content.name}</Title>
    </Card>
  );
};
