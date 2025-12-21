export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          ad_soyad: string
          created_at: string
          id: string
          tc_kimlik: string
          unvan: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          ad_soyad: string
          created_at?: string
          id?: string
          tc_kimlik: string
          unvan?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          ad_soyad?: string
          created_at?: string
          id?: string
          tc_kimlik?: string
          unvan?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      districts: {
        Row: {
          id: number
          name: string
          latitude: number
          longitude: number
          radius: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          name: string
          latitude: number
          longitude: number
          radius: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          name?: string
          latitude?: number
          longitude?: number
          radius?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      district_scores: {
        Row: {
          id: number
          district_id: number
          infrastructure: number
          environment: number
          social: number
          transportation: number
          security: number
          education: number
          health: number
          overall: number
          period_start: string
          period_end: string
          created_at: string
        }
        Insert: {
          id?: number
          district_id: number
          infrastructure: number
          environment: number
          social: number
          transportation: number
          security: number
          education: number
          health: number
          overall: number
          period_start?: string
          period_end?: string
          created_at?: string
        }
        Update: {
          id?: number
          district_id?: number
          infrastructure?: number
          environment?: number
          social?: number
          transportation?: number
          security?: number
          education?: number
          health?: number
          overall?: number
          period_start?: string
          period_end?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "district_scores_district_id_fkey"
            columns: ["district_id"]
            referencedRelation: "districts"
            referencedColumns: ["id"]
          }
        ]
      }
      negative_factors: {
        Row: {
          id: number
          district_id: number
          uncontrolled_migration: number
          informal_settlement: number
          crime_rate: number
          traffic_congestion: number
          noise_pollution: number
          period_start: string
          period_end: string
          created_at: string
        }
        Insert: {
          id?: number
          district_id: number
          uncontrolled_migration: number
          informal_settlement: number
          crime_rate: number
          traffic_congestion: number
          noise_pollution: number
          period_start?: string
          period_end?: string
          created_at?: string
        }
        Update: {
          id?: number
          district_id?: number
          uncontrolled_migration?: number
          informal_settlement?: number
          crime_rate?: number
          traffic_congestion?: number
          noise_pollution?: number
          period_start?: string
          period_end?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "negative_factors_district_id_fkey"
            columns: ["district_id"]
            referencedRelation: "districts"
            referencedColumns: ["id"]
          }
        ]
      }
      recommended_actions: {
        Row: {
          id: number
          district_id: number
          action: string
          potential_score: number
          priority: 'high' | 'medium' | 'low'
          budget: string | null
          status: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          district_id: number
          action: string
          potential_score: number
          priority: 'high' | 'medium' | 'low'
          budget?: string | null
          status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          district_id?: number
          action?: string
          potential_score?: number
          priority?: 'high' | 'medium' | 'low'
          budget?: string | null
          status?: 'pending' | 'approved' | 'in_progress' | 'completed' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommended_actions_district_id_fkey"
            columns: ["district_id"]
            referencedRelation: "districts"
            referencedColumns: ["id"]
          }
        ]
      }
      trend_data: {
        Row: {
          id: number
          district_id: number
          period_type: 'monthly' | 'quarterly' | 'yearly'
          period_value: string
          overall_score: number
          created_at: string
        }
        Insert: {
          id?: number
          district_id: number
          period_type: 'monthly' | 'quarterly' | 'yearly'
          period_value: string
          overall_score: number
          created_at?: string
        }
        Update: {
          id?: number
          district_id?: number
          period_type?: 'monthly' | 'quarterly' | 'yearly'
          period_value?: string
          overall_score?: number
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "trend_data_district_id_fkey"
            columns: ["district_id"]
            referencedRelation: "districts"
            referencedColumns: ["id"]
          }
        ]
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
