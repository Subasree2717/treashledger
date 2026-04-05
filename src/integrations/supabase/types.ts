export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      blogs: {
        Row: {
          author_name: string
          author_avatar: string | null
          category: string | null
          content: string
          created_at: string
          description: string
          id: string
          image_url: string | null
          likes: number
          published: boolean
          title: string
          updated_at: string
          user_id: string
        }
        Insert: {
          author_name?: string
          author_avatar?: string | null
          category?: string | null
          content?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          likes?: number
          published?: boolean
          title: string
          updated_at?: string
          user_id: string
        }
        Update: {
          author_name?: string
          author_avatar?: string | null
          category?: string | null
          content?: string
          created_at?: string
          description?: string
          id?: string
          image_url?: string | null
          likes?: number
          published?: boolean
          title?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      budgets: {
        Row: {
          amount: number
          category: string
          created_at: string
          id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount?: number
          category: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      reviews: {
        Row: {
          avatar_url: string | null
          content: string
          created_at: string
          id: string
          location: string | null
          name: string
          rating: number
        }
        Insert: {
          avatar_url?: string | null
          content: string
          created_at?: string
          id?: string
          location?: string | null
          name: string
          rating?: number
        }
        Update: {
          avatar_url?: string | null
          content?: string
          created_at?: string
          id?: string
          location?: string | null
          name?: string
          rating?: number
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          email: string | null
          role: string | null
          created_at: string
        }
        Insert: {
          id: string
          email?: string | null
          role?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          email?: string | null
          role?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedSchema: "auth"
          }
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string
          date: string
          id: string
          note: string | null
          type: string
          updated_at: string
          user_id: string
        }
        Insert: {
          amount: number
          category: string
          created_at?: string
          date: string
          id?: string
          note?: string | null
          type: string
          updated_at?: string
          user_id: string
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string
          date?: string
          id?: string
          note?: string | null
          type?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export const Constants = {
  public: {
    Enums: {},
  },
} as const
