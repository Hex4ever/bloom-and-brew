export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          display_name: string | null;
          units: "metric" | "imperial";
          temperature_unit: "c" | "f";
          auto_play_music: boolean;
          step_notifications: boolean;
          default_grinder_id: string | null;
          created_at: string;
        };
        Insert: {
          id: string;
          display_name?: string | null;
          units?: "metric" | "imperial";
          temperature_unit?: "c" | "f";
          auto_play_music?: boolean;
          step_notifications?: boolean;
          default_grinder_id?: string | null;
          created_at?: string;
        };
        Update: {
          display_name?: string | null;
          units?: "metric" | "imperial";
          temperature_unit?: "c" | "f";
          auto_play_music?: boolean;
          step_notifications?: boolean;
          default_grinder_id?: string | null;
        };
        Relationships: [];
      };
      grinders: {
        Row: {
          id: string;
          user_id: string | null;
          name: string;
          clicks_per_1000um: number;
          detent_style: "half" | "whole";
          is_default: boolean;
          grinder_type: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name: string;
          clicks_per_1000um: number;
          detent_style?: "half" | "whole";
          is_default?: boolean;
          grinder_type?: string;
          created_at?: string;
        };
        Update: {
          name?: string;
          clicks_per_1000um?: number;
          detent_style?: "half" | "whole";
          is_default?: boolean;
          grinder_type?: string;
        };
        Relationships: [];
      };
      recipes: {
        Row: {
          id: string;
          author_id: string | null;
          method: string;
          title: string;
          dose_g: number;
          water_g: number;
          temp_c: number;
          ratio: number;
          brew_time_s: number;
          difficulty: "Beginner" | "Intermediate" | "Advanced" | "Expert";
          steps: Json;
          flavor_profile: Json;
          source_author: string | null;
          is_curated: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          author_id?: string | null;
          method: string;
          title: string;
          dose_g: number;
          water_g: number;
          temp_c: number;
          ratio: number;
          brew_time_s: number;
          difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
          steps?: Json;
          flavor_profile?: Json;
          source_author?: string | null;
          is_curated?: boolean;
          created_at?: string;
        };
        Update: {
          method?: string;
          title?: string;
          dose_g?: number;
          water_g?: number;
          temp_c?: number;
          ratio?: number;
          brew_time_s?: number;
          difficulty?: "Beginner" | "Intermediate" | "Advanced" | "Expert";
          steps?: Json;
          flavor_profile?: Json;
          source_author?: string | null;
          is_curated?: boolean;
        };
        Relationships: [];
      };
      beans: {
        Row: {
          id: string;
          user_id: string | null;
          name: string | null;
          roaster: string | null;
          origin: string | null;
          roast_level: string | null;
          tasting_notes: string | null;
          source: "scan" | "manual" | "curated";
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string | null;
          name?: string | null;
          roaster?: string | null;
          origin?: string | null;
          roast_level?: string | null;
          tasting_notes?: string | null;
          source?: "scan" | "manual" | "curated";
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          name?: string | null;
          roaster?: string | null;
          origin?: string | null;
          roast_level?: string | null;
          tasting_notes?: string | null;
          source?: "scan" | "manual" | "curated";
          image_url?: string | null;
        };
        Relationships: [];
      };
      journal_entries: {
        Row: {
          id: string;
          user_id: string;
          recipe_id: string | null;
          bean_id: string | null;
          grinder_id: string | null;
          servings: number;
          sweetness: number | null;
          acidity: number | null;
          body: number | null;
          bitterness: number | null;
          aftertaste: number | null;
          overall: number | null;
          notes: string | null;
          quick_logged: boolean;
          created_at: string;
          recipe_title: string | null;
          bean_name: string | null;
          grinder_name: string | null;
          method_id: string | null;
          dose_g_used: number | null;
          water_g_used: number | null;
          temp_c_used: number | null;
          clicks_used: number | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          recipe_id?: string | null;
          bean_id?: string | null;
          grinder_id?: string | null;
          servings?: number;
          sweetness?: number | null;
          acidity?: number | null;
          body?: number | null;
          bitterness?: number | null;
          aftertaste?: number | null;
          overall?: number | null;
          notes?: string | null;
          quick_logged?: boolean;
          created_at?: string;
          recipe_title?: string | null;
          bean_name?: string | null;
          grinder_name?: string | null;
          method_id?: string | null;
          dose_g_used?: number | null;
          water_g_used?: number | null;
          temp_c_used?: number | null;
          clicks_used?: number | null;
        };
        Update: {
          recipe_id?: string | null;
          bean_id?: string | null;
          grinder_id?: string | null;
          servings?: number;
          sweetness?: number | null;
          acidity?: number | null;
          body?: number | null;
          bitterness?: number | null;
          aftertaste?: number | null;
          overall?: number | null;
          notes?: string | null;
          quick_logged?: boolean;
          recipe_title?: string | null;
          bean_name?: string | null;
          grinder_name?: string | null;
          method_id?: string | null;
          dose_g_used?: number | null;
          water_g_used?: number | null;
          temp_c_used?: number | null;
          clicks_used?: number | null;
        };
        Relationships: [];
      };
      tweak_threads: {
        Row: { id: string; journal_entry_id: string; created_at: string };
        Insert: { id?: string; journal_entry_id: string; created_at?: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      tweak_messages: {
        Row: {
          id: string;
          thread_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          token_usage: number | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          thread_id: string;
          role: "user" | "assistant" | "system";
          content: string;
          token_usage?: number | null;
          created_at?: string;
        };
        Update: { token_usage?: number | null };
        Relationships: [];
      };
      community_posts: {
        Row: {
          id: string;
          user_id: string;
          caption: string | null;
          image_url: string | null;
          recipe_id: string | null;
          likes_count: number;
          comments_count: number;
          created_at: string;
          poster_name: string | null;
        };
        Insert: {
          id?: string;
          user_id: string;
          caption?: string | null;
          image_url?: string | null;
          recipe_id?: string | null;
          likes_count?: number;
          comments_count?: number;
          created_at?: string;
          poster_name?: string | null;
        };
        Update: {
          caption?: string | null;
          image_url?: string | null;
          recipe_id?: string | null;
          likes_count?: number;
          comments_count?: number;
          poster_name?: string | null;
        };
        Relationships: [];
      };
      post_likes: {
        Row: { post_id: string; user_id: string };
        Insert: { post_id: string; user_id: string };
        Update: Record<string, never>;
        Relationships: [];
      };
      post_comments: {
        Row: {
          id: string;
          post_id: string;
          user_id: string;
          poster_name: string | null;
          content: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          post_id: string;
          user_id: string;
          poster_name?: string | null;
          content: string;
          created_at?: string;
        };
        Update: { content?: string };
        Relationships: [];
      };
      recipe_submissions: {
        Row: {
          id: string;
          user_id: string;
          method: string;
          title: string;
          dose_g: number | null;
          water_g: number | null;
          temp_c: number | null;
          notes: string | null;
          status: "pending" | "approved" | "rejected";
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          method: string;
          title: string;
          dose_g?: number | null;
          water_g?: number | null;
          temp_c?: number | null;
          notes?: string | null;
          status?: "pending" | "approved" | "rejected";
          created_at?: string;
        };
        Update: {
          status?: "pending" | "approved" | "rejected";
          notes?: string | null;
        };
        Relationships: [];
      };
      cafes_cache: {
        Row: {
          id: string;
          lat: number;
          lng: number;
          place_id: string;
          data: Json;
          cached_at: string;
        };
        Insert: {
          id?: string;
          lat: number;
          lng: number;
          place_id: string;
          data: Json;
          cached_at?: string;
        };
        Update: { data?: Json; cached_at?: string };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
