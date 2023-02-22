import { User } from '@supabase/supabase-js';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { supabase } from 'src/app/supabase/client';

function Survey() {
  const [currentUser, setCurrentUser] = React.useState<null | User>(null);

  useEffect(() => {
    supabase.auth.getUser().then((user) => {
      console.log(user.data.user);
      setCurrentUser(user.data.user);
    });
  }, []);

  // Get the id from the url
  const { id } = useParams<{ id: string }>();

  return (
    <div>
      {currentUser ? (
        <div>{currentUser.email}</div>
      ) : (
        <div>
          <h1>Hi there</h1>
        </div>
      )}
      Survey id: {id}
    </div>
  );
}

export default Survey;
