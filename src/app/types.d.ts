// HACK: This will be replaced with a proper type once the supabase client is updated
type Group = {
  // id: 1
  id: number;
  // initial_intensity: "Adventure"
  initial_intensity: string;
  // invite_code: "e0e6db"
  invite_code: string;
  // name: "testGroupName"
  name: string;
  // owner: "90e4dee5-aa27-4e6f-bc24-f6d5b095198c"
  owner: string;
};

type GroupMember = {
  // full_name: "testUser"
  full_name: string;
  // name: "testUser#1234"
  name: string;
  // discord_id: "123456789012345678"
  discord_id: string;
  // profile_picture: "https://cdn.discordapp.com/avatars/123456789012345678/123456789012345678.png"
  profile_picture: string;
  // owner: false
  is_owner: boolean;
};
