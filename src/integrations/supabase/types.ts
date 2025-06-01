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
      activity_logs: {
        Row: {
          activity: string
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          activity: string
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          activity?: string
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      api_keys: {
        Row: {
          created_at: string
          created_by: string | null
          expiry_date: string | null
          id: string
          is_active: boolean
          key_value: string
          label: string
          last_used_at: string | null
          max_usage: number
          service: string
          usage_count: number
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          key_value: string
          label: string
          last_used_at?: string | null
          max_usage?: number
          service: string
          usage_count?: number
        }
        Update: {
          created_at?: string
          created_by?: string | null
          expiry_date?: string | null
          id?: string
          is_active?: boolean
          key_value?: string
          label?: string
          last_used_at?: string | null
          max_usage?: number
          service?: string
          usage_count?: number
        }
        Relationships: []
      }
      body_stats: {
        Row: {
          body_fat_percentage: number | null
          height: number | null
          id: string
          muscle_mass: number | null
          recorded_at: string | null
          user_id: string
          weight: number | null
        }
        Insert: {
          body_fat_percentage?: number | null
          height?: number | null
          id?: string
          muscle_mass?: number | null
          recorded_at?: string | null
          user_id: string
          weight?: number | null
        }
        Update: {
          body_fat_percentage?: number | null
          height?: number | null
          id?: string
          muscle_mass?: number | null
          recorded_at?: string | null
          user_id?: string
          weight?: number | null
        }
        Relationships: []
      }
      breach_alerts: {
        Row: {
          breach_data: Json | null
          email: string
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          breach_data?: Json | null
          email: string
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          breach_data?: Json | null
          email?: string
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          id: string
          role: string
          session_id: string | null
          timestamp: string
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          role: string
          session_id?: string | null
          timestamp?: string
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          role?: string
          session_id?: string | null
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      code_snippets: {
        Row: {
          code: string
          created_at: string | null
          id: string
          language: string
          output: string | null
          status: string | null
          user_id: string
        }
        Insert: {
          code: string
          created_at?: string | null
          id?: string
          language: string
          output?: string | null
          status?: string | null
          user_id: string
        }
        Update: {
          code?: string
          created_at?: string | null
          id?: string
          language?: string
          output?: string | null
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      console_logs: {
        Row: {
          command: string
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          command: string
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          command?: string
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      debug_logs: {
        Row: {
          created_at: string | null
          error_detected: string | null
          gpt_analysis: string | null
          id: string
          snippet_id: string
          suggestions: string | null
        }
        Insert: {
          created_at?: string | null
          error_detected?: string | null
          gpt_analysis?: string | null
          id?: string
          snippet_id: string
          suggestions?: string | null
        }
        Update: {
          created_at?: string | null
          error_detected?: string | null
          gpt_analysis?: string | null
          id?: string
          snippet_id?: string
          suggestions?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "debug_logs_snippet_id_fkey"
            columns: ["snippet_id"]
            isOneToOne: false
            referencedRelation: "code_snippets"
            referencedColumns: ["id"]
          },
        ]
      }
      diet_logs: {
        Row: {
          calories: number | null
          food_items: string
          id: string
          logged_at: string | null
          meal_type: string | null
          user_id: string
        }
        Insert: {
          calories?: number | null
          food_items: string
          id?: string
          logged_at?: string | null
          meal_type?: string | null
          user_id: string
        }
        Update: {
          calories?: number | null
          food_items?: string
          id?: string
          logged_at?: string | null
          meal_type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      dns_scans: {
        Row: {
          domain: string
          id: string
          scan_results: Json | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          domain: string
          id?: string
          scan_results?: Json | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          domain?: string
          id?: string
          scan_results?: Json | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      events: {
        Row: {
          created_at: string | null
          description: string | null
          end_time: string | null
          id: string
          location: string | null
          reminder_time: string | null
          start_time: string
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          reminder_time?: string | null
          start_time: string
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          end_time?: string | null
          id?: string
          location?: string | null
          reminder_time?: string | null
          start_time?: string
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      goals: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          progress: number | null
          status: string | null
          target_date: string | null
          title: string
          user_id: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title: string
          user_id: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          progress?: number | null
          status?: string | null
          target_date?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      habits: {
        Row: {
          created_at: string | null
          habit_name: string
          id: string
          last_logged: string | null
          streak_count: number | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          habit_name: string
          id?: string
          last_logged?: string | null
          streak_count?: number | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          habit_name?: string
          id?: string
          last_logged?: string | null
          streak_count?: number | null
          user_id?: string
        }
        Relationships: []
      }
      installed_plugins: {
        Row: {
          enabled: boolean | null
          id: string
          installed_at: string | null
          plugin_id: string
          user_config: Json | null
          user_id: string
        }
        Insert: {
          enabled?: boolean | null
          id?: string
          installed_at?: string | null
          plugin_id: string
          user_config?: Json | null
          user_id: string
        }
        Update: {
          enabled?: boolean | null
          id?: string
          installed_at?: string | null
          plugin_id?: string
          user_config?: Json | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "installed_plugins_plugin_id_fkey"
            columns: ["plugin_id"]
            isOneToOne: false
            referencedRelation: "plugins"
            referencedColumns: ["id"]
          },
        ]
      }
      investments: {
        Row: {
          amount: number | null
          asset_name: string
          created_at: string | null
          current_price: number | null
          id: string
          purchase_price: number | null
          user_id: string
        }
        Insert: {
          amount?: number | null
          asset_name: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          purchase_price?: number | null
          user_id: string
        }
        Update: {
          amount?: number | null
          asset_name?: string
          created_at?: string | null
          current_price?: number | null
          id?: string
          purchase_price?: number | null
          user_id?: string
        }
        Relationships: []
      }
      ip_logs: {
        Row: {
          geo_info: Json | null
          id: string
          target_ip: unknown
          timestamp: string | null
          user_id: string
        }
        Insert: {
          geo_info?: Json | null
          id?: string
          target_ip: unknown
          timestamp?: string | null
          user_id: string
        }
        Update: {
          geo_info?: Json | null
          id?: string
          target_ip?: unknown
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      knowledge_chunks: {
        Row: {
          content: string
          created_at: string | null
          embedding_vector: string | null
          id: string
          tags: string[] | null
          title: string
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          embedding_vector?: string | null
          id?: string
          tags?: string[] | null
          title: string
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          embedding_vector?: string | null
          id?: string
          tags?: string[] | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      memory: {
        Row: {
          context_tags: string[] | null
          emotion_analysis: Json | null
          id: string
          input_text: string
          mood_context: string | null
          response_text: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          context_tags?: string[] | null
          emotion_analysis?: Json | null
          id?: string
          input_text: string
          mood_context?: string | null
          response_text?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          context_tags?: string[] | null
          emotion_analysis?: Json | null
          id?: string
          input_text?: string
          mood_context?: string | null
          response_text?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      messages: {
        Row: {
          id: string
          message: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          id?: string
          message: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          id?: string
          message?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      mood_logs: {
        Row: {
          id: string
          mood_level: number | null
          mood_type: string | null
          notes: string | null
          timestamp: string | null
          user_id: string
        }
        Insert: {
          id?: string
          mood_level?: number | null
          mood_type?: string | null
          notes?: string | null
          timestamp?: string | null
          user_id: string
        }
        Update: {
          id?: string
          mood_level?: number | null
          mood_type?: string | null
          notes?: string | null
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      notes: {
        Row: {
          content: string
          id: string
          timestamp: string | null
          user_id: string
        }
        Insert: {
          content: string
          id?: string
          timestamp?: string | null
          user_id: string
        }
        Update: {
          content?: string
          id?: string
          timestamp?: string | null
          user_id?: string
        }
        Relationships: []
      }
      persistent_knowledge: {
        Row: {
          content: string
          created_at: string | null
          id: string
          last_used_at: string | null
          priority_level: number | null
          related_tags: string[] | null
          source_ref: string | null
          source_type: string | null
          type: string | null
          user_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          priority_level?: number | null
          related_tags?: string[] | null
          source_ref?: string | null
          source_type?: string | null
          type?: string | null
          user_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          last_used_at?: string | null
          priority_level?: number | null
          related_tags?: string[] | null
          source_ref?: string | null
          source_type?: string | null
          type?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plan_tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          description: string
          due_date: string | null
          goal_id: string
          id: string
          priority: number | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          description: string
          due_date?: string | null
          goal_id: string
          id?: string
          priority?: number | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          description?: string
          due_date?: string | null
          goal_id?: string
          id?: string
          priority?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "plan_tasks_goal_id_fkey"
            columns: ["goal_id"]
            isOneToOne: false
            referencedRelation: "planner_goals"
            referencedColumns: ["id"]
          },
        ]
      }
      planner_goals: {
        Row: {
          created_at: string | null
          deadline: string | null
          description: string | null
          goal_title: string
          id: string
          status: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          goal_title: string
          id?: string
          status?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deadline?: string | null
          description?: string | null
          goal_title?: string
          id?: string
          status?: string | null
          user_id?: string
        }
        Relationships: []
      }
      plugins: {
        Row: {
          config_json: Json | null
          created_at: string | null
          description: string | null
          id: string
          name: string
          version: string | null
        }
        Insert: {
          config_json?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          version?: string | null
        }
        Update: {
          config_json?: Json | null
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          version?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      reflections: {
        Row: {
          id: string
          prompt: string
          reflection_date: string | null
          response: string
          user_id: string
        }
        Insert: {
          id?: string
          prompt: string
          reflection_date?: string | null
          response: string
          user_id: string
        }
        Update: {
          id?: string
          prompt?: string
          reflection_date?: string | null
          response?: string
          user_id?: string
        }
        Relationships: []
      }
      tasks: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      transactions: {
        Row: {
          amount: number | null
          currency: string | null
          id: string
          timestamp: string | null
          transaction_hash: string | null
          user_id: string
          wallet_id: string | null
        }
        Insert: {
          amount?: number | null
          currency?: string | null
          id?: string
          timestamp?: string | null
          transaction_hash?: string | null
          user_id: string
          wallet_id?: string | null
        }
        Update: {
          amount?: number | null
          currency?: string | null
          id?: string
          timestamp?: string | null
          transaction_hash?: string | null
          user_id?: string
          wallet_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      voice_inputs: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: string
          intent_tag: string | null
          is_learned: boolean | null
          transcript_text: string | null
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          intent_tag?: string | null
          is_learned?: boolean | null
          transcript_text?: string | null
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          intent_tag?: string | null
          is_learned?: boolean | null
          transcript_text?: string | null
          user_id?: string
        }
        Relationships: []
      }
      voice_notes: {
        Row: {
          audio_url: string | null
          created_at: string | null
          id: string
          intent_tag: string | null
          transcript_text: string
          user_id: string
        }
        Insert: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          intent_tag?: string | null
          transcript_text: string
          user_id: string
        }
        Update: {
          audio_url?: string | null
          created_at?: string | null
          id?: string
          intent_tag?: string | null
          transcript_text?: string
          user_id?: string
        }
        Relationships: []
      }
      wallets: {
        Row: {
          address: string
          blockchain: string | null
          created_at: string | null
          id: string
          user_id: string
          wallet_name: string
        }
        Insert: {
          address: string
          blockchain?: string | null
          created_at?: string | null
          id?: string
          user_id: string
          wallet_name: string
        }
        Update: {
          address?: string
          blockchain?: string | null
          created_at?: string | null
          id?: string
          user_id?: string
          wallet_name?: string
        }
        Relationships: []
      }
      whois_lookups: {
        Row: {
          domain: string
          id: string
          timestamp: string | null
          user_id: string
          whois_data: Json | null
        }
        Insert: {
          domain: string
          id?: string
          timestamp?: string | null
          user_id: string
          whois_data?: Json | null
        }
        Update: {
          domain?: string
          id?: string
          timestamp?: string | null
          user_id?: string
          whois_data?: Json | null
        }
        Relationships: []
      }
      workouts: {
        Row: {
          calories_burned: number | null
          duration: number | null
          id: string
          logged_at: string | null
          notes: string | null
          user_id: string
          workout_type: string
        }
        Insert: {
          calories_burned?: number | null
          duration?: number | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          user_id: string
          workout_type: string
        }
        Update: {
          calories_burned?: number | null
          duration?: number | null
          id?: string
          logged_at?: string | null
          notes?: string | null
          user_id?: string
          workout_type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      binary_quantize: {
        Args: { "": string } | { "": unknown }
        Returns: unknown
      }
      get_active_api_key: {
        Args: { service_name: string }
        Returns: string
      }
      gtrgm_compress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_decompress: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_in: {
        Args: { "": unknown }
        Returns: unknown
      }
      gtrgm_options: {
        Args: { "": unknown }
        Returns: undefined
      }
      gtrgm_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_avg: {
        Args: { "": number[] }
        Returns: unknown
      }
      halfvec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      halfvec_send: {
        Args: { "": unknown }
        Returns: string
      }
      halfvec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      hnsw_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnsw_sparsevec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      hnswhandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_bit_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflat_halfvec_support: {
        Args: { "": unknown }
        Returns: unknown
      }
      ivfflathandler: {
        Args: { "": unknown }
        Returns: unknown
      }
      l2_norm: {
        Args: { "": unknown } | { "": unknown }
        Returns: number
      }
      l2_normalize: {
        Args: { "": string } | { "": unknown } | { "": unknown }
        Returns: unknown
      }
      log_activity: {
        Args: { activity_text: string }
        Returns: undefined
      }
      set_limit: {
        Args: { "": number }
        Returns: number
      }
      show_limit: {
        Args: Record<PropertyKey, never>
        Returns: number
      }
      show_trgm: {
        Args: { "": string }
        Returns: string[]
      }
      sparsevec_out: {
        Args: { "": unknown }
        Returns: unknown
      }
      sparsevec_send: {
        Args: { "": unknown }
        Returns: string
      }
      sparsevec_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
      }
      vector_avg: {
        Args: { "": number[] }
        Returns: string
      }
      vector_dims: {
        Args: { "": string } | { "": unknown }
        Returns: number
      }
      vector_norm: {
        Args: { "": string }
        Returns: number
      }
      vector_out: {
        Args: { "": string }
        Returns: unknown
      }
      vector_send: {
        Args: { "": string }
        Returns: string
      }
      vector_typmod_in: {
        Args: { "": unknown[] }
        Returns: number
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

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
