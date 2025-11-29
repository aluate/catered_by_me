// apps/web/src/lib/database.types.ts
// This is a placeholder for Supabase database types.
// In production, you would generate this using: npx supabase gen types typescript --project-id <project-id>
// For now, we'll define minimal types based on our schema.

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string;
          display_name: string | null;
          default_headcount: number | null;
          oven_capacity_lbs: number | null;
          burner_count: number | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email: string;
          display_name?: string | null;
          default_headcount?: number | null;
          oven_capacity_lbs?: number | null;
          burner_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          display_name?: string | null;
          default_headcount?: number | null;
          oven_capacity_lbs?: number | null;
          burner_count?: number | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      recipes: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          category: "main" | "side" | "dessert" | "app" | "other";
          base_headcount: number;
          prep_time_minutes: number;
          cook_time_minutes: number;
          method: "oven" | "stovetop" | "no_cook" | "mixed";
          day_before_ok: boolean;
          source_type: "text" | "url" | "pdf" | "image";
          source_raw: Json | null;
          normalized: Json | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          category: "main" | "side" | "dessert" | "app" | "other";
          base_headcount: number;
          prep_time_minutes?: number;
          cook_time_minutes?: number;
          method: "oven" | "stovetop" | "no_cook" | "mixed";
          day_before_ok?: boolean;
          source_type: "text" | "url" | "pdf" | "image";
          source_raw?: Json | null;
          normalized?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          category?: "main" | "side" | "dessert" | "app" | "other";
          base_headcount?: number;
          prep_time_minutes?: number;
          cook_time_minutes?: number;
          method?: "oven" | "stovetop" | "no_cook" | "mixed";
          day_before_ok?: boolean;
          source_type?: "text" | "url" | "pdf" | "image";
          source_raw?: Json | null;
          normalized?: Json | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      events: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          event_type: "prep_week" | "event";
          event_date: string | null;
          headcount: number | null;
          location: string | null;
          vibe: "chill" | "formal" | "family_chaos" | null;
          notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          event_type: "prep_week" | "event";
          event_date?: string | null;
          headcount?: number | null;
          location?: string | null;
          vibe?: "chill" | "formal" | "family_chaos" | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          event_type?: "prep_week" | "event";
          event_date?: string | null;
          headcount?: number | null;
          location?: string | null;
          vibe?: "chill" | "formal" | "family_chaos" | null;
          notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      event_recipes: {
        Row: {
          id: string;
          event_id: string;
          recipe_id: string;
          target_headcount: number;
          course_order: number;
          is_primary: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          event_id: string;
          recipe_id: string;
          target_headcount: number;
          course_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          event_id?: string;
          recipe_id?: string;
          target_headcount?: number;
          course_order?: number;
          is_primary?: boolean;
          created_at?: string;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

