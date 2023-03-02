export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      content: {
        Row: {
          category: Database["public"]["Enums"]["contentcategory"]
          default_intensity: Database["public"]["Enums"]["contentintensity"]
          description: string
          emoji: string | null
          id: number
          name: string
        }
        Insert: {
          category: Database["public"]["Enums"]["contentcategory"]
          default_intensity: Database["public"]["Enums"]["contentintensity"]
          description: string
          emoji?: string | null
          id?: number
          name: string
        }
        Update: {
          category?: Database["public"]["Enums"]["contentcategory"]
          default_intensity?: Database["public"]["Enums"]["contentintensity"]
          description?: string
          emoji?: string | null
          id?: number
          name?: string
        }
      }
      content_response: {
        Row: {
          content_id: number
          intensity: Database["public"]["Enums"]["contentintensity"]
          user_id: string
        }
        Insert: {
          content_id: number
          intensity: Database["public"]["Enums"]["contentintensity"]
          user_id: string
        }
        Update: {
          content_id?: number
          intensity?: Database["public"]["Enums"]["contentintensity"]
          user_id?: string
        }
      }
      custom_content: {
        Row: {
          description: string
          intensity: Database["public"]["Enums"]["contentintensity"]
          name: string
          user_id: string
        }
        Insert: {
          description: string
          intensity: Database["public"]["Enums"]["contentintensity"]
          name: string
          user_id: string
        }
        Update: {
          description?: string
          intensity?: Database["public"]["Enums"]["contentintensity"]
          name?: string
          user_id?: string
        }
      }
      group: {
        Row: {
          id: number
          invite_code: string
          max_intensity: Database["public"]["Enums"]["topicintensity"]
          name: string
          owner: string
        }
        Insert: {
          id?: number
          invite_code: string
          max_intensity: Database["public"]["Enums"]["topicintensity"]
          name: string
          owner: string
        }
        Update: {
          id?: number
          invite_code?: string
          max_intensity?: Database["public"]["Enums"]["topicintensity"]
          name?: string
          owner?: string
        }
      }
      topic: {
        Row: {
          adventure_example: string
          description: string
          fantasy_example: string
          id: number
          name: string
          struggle_example: string
          tragedy_example: string
        }
        Insert: {
          adventure_example: string
          description: string
          fantasy_example: string
          id?: number
          name: string
          struggle_example: string
          tragedy_example: string
        }
        Update: {
          adventure_example?: string
          description?: string
          fantasy_example?: string
          id?: number
          name?: string
          struggle_example?: string
          tragedy_example?: string
        }
      }
      topic_response: {
        Row: {
          group_id: number
          intensity: Database["public"]["Enums"]["topicintensity"]
          topic_id: number
          user_id: string
        }
        Insert: {
          group_id: number
          intensity: Database["public"]["Enums"]["topicintensity"]
          topic_id: number
          user_id: string
        }
        Update: {
          group_id?: number
          intensity?: Database["public"]["Enums"]["topicintensity"]
          topic_id?: number
          user_id?: string
        }
      }
      user: {
        Row: {
          content_version: number
          discord_id: string
          full_name: string
          id: string
          name: string
          profile_picture: string
        }
        Insert: {
          content_version?: number
          discord_id: string
          full_name: string
          id: string
          name: string
          profile_picture: string
        }
        Update: {
          content_version?: number
          discord_id?: string
          full_name?: string
          id?: string
          name?: string
          profile_picture?: string
        }
      }
      user_group: {
        Row: {
          group_id: number
          topics_submitted: boolean
          user_id: string
        }
        Insert: {
          group_id: number
          topics_submitted?: boolean
          user_id: string
        }
        Update: {
          group_id?: number
          topics_submitted?: boolean
          user_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      create_group: {
        Args: {
          name: string
          intensity: string
        }
        Returns: number
      }
      get_group_content_report: {
        Args: {
          req_group_id: number
        }
        Returns: {
          id: number
          name: string
          description: string
          intensity: Database["public"]["Enums"]["contentintensity"]
          category: Database["public"]["Enums"]["contentcategory"]
          emoji: string
          default_intensity: Database["public"]["Enums"]["contentintensity"]
        }[]
      }
      get_group_members: {
        Args: {
          req_id: number
        }
        Returns: {
          full_name: string
          name: string
          discord_id: string
          profile_picture: string
          is_owner: boolean
          topics_submitted: boolean
        }[]
      }
      get_group_topic_report: {
        Args: {
          req_group_id: number
        }
        Returns: {
          topic_id: number
          topic_name: string
          topic_description: string
          fantasy_count: number
          adventure_count: number
          struggle_count: number
          tragedy_count: number
          fantasy_example: string
          adventure_example: string
          struggle_example: string
          tragedy_example: string
        }[]
      }
      join_group: {
        Args: {
          invite: string
        }
        Returns: number
      }
      leave_group: {
        Args: {
          req_id: number
        }
        Returns: string
      }
    }
    Enums: {
      contentcategory:
        | "Physical"
        | "Objects"
        | "Social"
        | "Animals"
        | "Death"
        | "Supernatural"
        | "Other"
      contentintensity: "Neutral" | "Warning" | "Ban"
      phobiacategory:
        | "Physical"
        | "Objects"
        | "Social"
        | "Animals"
        | "Death"
        | "Supernatural"
        | "Other"
      phobiaintensity: "Unaffected" | "Neutral" | "Warning" | "Ban"
      topicintensity: "Fantasy" | "Adventure" | "Struggle" | "Tragedy"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          created_at: string | null
          id: string
          name: string
          owner: string | null
          public: boolean | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id: string
          name: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          owner?: string | null
          public?: boolean | null
          updated_at?: string | null
        }
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          path_tokens: string[] | null
          updated_at: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      extension: {
        Args: {
          name: string
        }
        Returns: string
      }
      filename: {
        Args: {
          name: string
        }
        Returns: string
      }
      foldername: {
        Args: {
          name: string
        }
        Returns: string[]
      }
      get_size_by_bucket: {
        Args: Record<PropertyKey, never>
        Returns: {
          size: number
          bucket_id: string
        }[]
      }
      search: {
        Args: {
          prefix: string
          bucketname: string
          limits?: number
          levels?: number
          offsets?: number
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          name: string
          id: string
          updated_at: string
          created_at: string
          last_accessed_at: string
          metadata: Json
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
