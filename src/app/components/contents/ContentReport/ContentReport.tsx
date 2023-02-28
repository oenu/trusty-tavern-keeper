import { Card, Title } from '@mantine/core';
import { PostgrestError } from '@supabase/supabase-js';
import React, { useEffect, useState } from 'react';
import { supabase } from 'src/app/supabase/client';
import {
  ContentCategory,
  ContentIntensity,
} from 'src/app/types/supabase-type-extensions';

interface GroupContentResponse {
  content_id: number;
  content_name: string;
  content_description: string;
  content_category: ContentCategory;
  content_intensity: ContentIntensity;
}

function ContentReport({ group_id }: { group_id: number }) {
  const [contentReportError, setContentReportError] =
    useState<PostgrestError>();
  const [contentReportData, setContentReportData] =
    useState<GroupContentResponse[]>();

  const getGroupContentResponses = async () => {
    supabase
      .rpc('get_group_content_responses', {
        req_group_id: group_id,
      })
      .then((response) => {
        if (response.error) setContentReportError(response.error);
        if (response.data) {
          console.log(response.data);
          // Convert to GroupContentResponse[]
          setContentReportData(
            response.data.map((content) => {
              return {
                ...content,
                content_category: content.content_category as ContentCategory,
                content_intensity:
                  content.content_intensity as ContentIntensity,
              };
            })
          );
          setContentReportData(response.data as GroupContentResponse[]);
        }
      });
  };

  useEffect(() => {
    getGroupContentResponses();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //TODO - Handle errors better
  if (contentReportError) return <div>Could not fetch content report</div>;

  // Filter out content that has a ""

  return <>placeholder</>;
}

export default ContentReport;

const ContentItem = ({ content }: { content: GroupContentResponse }) => {
  return (
    <Card>
      <Title order={3}>{content.content_name}</Title>
    </Card>
  );
};
