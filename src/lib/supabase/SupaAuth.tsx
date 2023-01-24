import {
  Auth,
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-react';

import { supabase } from './client';

const SupaAuth = () => (
  <Auth
    supabaseClient={supabase}
    appearance={{ theme: ThemeSupa }}
    providers={['discord']}
  />
);

export default SupaAuth;
