// These types are generated from the file supabase-types.ts
import { Database } from './supabase-types';

// Table Types
export type User = Database['public']['Tables']['user']['Row'];
export type UserGroup = Database['public']['Tables']['user_group']['Row'];
export type Group = Database['public']['Tables']['group']['Row'];

export type Content = Database['public']['Tables']['content']['Row'];
export type ContentResponse =
  Database['public']['Tables']['content_response']['Row'];

export type Topic = Database['public']['Tables']['topic']['Row'];
export type TopicResponse =
  Database['public']['Tables']['topic_response']['Row'];

// Function Types
// Active
export type CreateGroup = Database['public']['Functions']['create_group'];
export type GetGroupUsers = Database['public']['Functions']['get_group_users'];
export type JoinGroupWithCode =
  Database['public']['Functions']['join_group_with_code'];
export type LeaveGroup = Database['public']['Functions']['leave_group'];
// Inactive
export type ElevatedInsertUserGroup =
  Database['public']['Functions']['elevated_insert_user_group'];
export type GetGroupSize = Database['public']['Functions']['get_group_size'];

// Enum Types
// NOTE: These are hardcoded because they are not able to be pulled from the database schema (in a working way)
export enum ContentIntensity {
  Unaffected = 'Unaffected',
  Neutral = 'Neutral',
  Warning = 'Warning',
  Ban = 'Ban',
}

export enum TopicIntensity {
  Fantasy = 'Fantasy',
  Adventure = 'Adventure',
  Struggle = 'Struggle',
  Tragedy = 'Tragedy',
}

export enum ContentCategory {
  Physical = 'Physical',
  Objects = 'Objects',
  Social = 'Social',
  Animals = 'Animals',
  Death = 'Death',
  Supernatural = 'Supernatural',
  Other = 'Other',
}
