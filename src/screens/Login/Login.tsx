import React from 'react';
import SupaAuth from 'src/lib/supabase/SupaAuth';
// import { supabase } from 'src/lib/supabase/client';

function Login() {
  // async function signInWithDiscord() {
  //   const { data, error } = await supabase.auth.signInWithOAuth({
  //     provider: 'discord',
  //   });
  // }
  return (
    <>
      <div>Login page</div>

      <SupaAuth />
    </>
  );
}

export default Login;
