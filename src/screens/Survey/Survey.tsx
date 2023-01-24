import React from 'react';
import { useParams } from 'react-router-dom';

/**
 * Survey
 * Get the id from the url
 * ask server for survey data
 * render survey
 * submit survey
 * redirect to result page
 */

function Survey() {
  const { id } = useParams<{ id: string }>();
  return <div>Survey id: {id}</div>;
}

export default Survey;
