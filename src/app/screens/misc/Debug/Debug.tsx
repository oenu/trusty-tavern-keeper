import { Button } from '@mantine/core';
import { Session } from '@supabase/supabase-js';
import { handleRegister } from 'src/app/components/auth/functions/register';
import { supabase } from 'src/app/supabase/client';

function Debug({ session }: { session: Session | null }) {
  const testSupabase = async () => {
    const user = (await supabase.auth.getUser()).data.user?.id;
    console.log(user);

    const { data, error } = await supabase.from('group').select('*');
    if (error) console.log(error);
    else console.log(data);
  };

  return (
    <div>
      <Button
        onClick={() => {
          handleRegister({ session });
        }}
      >
        Test Discord API
      </Button>

      <Button
        onClick={async () => {
          const { data, error } = await supabase.rpc('create_group', {
            name: 'testGroupName',
            intensity: 'Adventure',
          });

          if (error) {
            console.log(error);
          }
          console.log(data);
        }}
      >
        Create Group (test)
      </Button>
      <Button
        onClick={() => {
          testSupabase();
        }}
      >
        Get list of groups im in
      </Button>
    </div>
  );
}

export default Debug;
