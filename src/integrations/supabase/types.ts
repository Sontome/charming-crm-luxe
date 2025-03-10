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
      Agent: {
        Row: {
          email: string
          id: string
          lasttimeactive: string | null
          name: string
          password: string
        }
        Insert: {
          email: string
          id: string
          lasttimeactive?: string | null
          name: string
          password: string
        }
        Update: {
          email?: string
          id?: string
          lasttimeactive?: string | null
          name?: string
          password?: string
        }
        Relationships: []
      }
      Config: {
        Row: {
          DropdownName: string
          Value1: string
          Value2: string | null
        }
        Insert: {
          DropdownName: string
          Value1: string
          Value2?: string | null
        }
        Update: {
          DropdownName?: string
          Value1?: string
          Value2?: string | null
        }
        Relationships: []
      }
      Customer: {
        Row: {
          customerCode: number
          customerEmail: string | null
          customerID: string | null
          customerName: string
          customerPhone: string
          firstActivity: number
          lastActivity: number
        }
        Insert: {
          customerCode?: number
          customerEmail?: string | null
          customerID?: string | null
          customerName?: string
          customerPhone: string
          firstActivity: number
          lastActivity: number
        }
        Update: {
          customerCode?: number
          customerEmail?: string | null
          customerID?: string | null
          customerName?: string
          customerPhone?: string
          firstActivity?: number
          lastActivity?: number
        }
        Relationships: []
      }
      Interaction: {
        Row: {
          agentID: string
          chiTietNhuCau: string
          customerCode: number
          interactionCode: number
          nhuCauKH: string
          noteInput: string
          status: string
          ticketSerial: string
          timeStart: string
        }
        Insert: {
          agentID: string
          chiTietNhuCau: string
          customerCode: number
          interactionCode?: number
          nhuCauKH: string
          noteInput: string
          status: string
          ticketSerial: string
          timeStart: string
        }
        Update: {
          agentID?: string
          chiTietNhuCau?: string
          customerCode?: number
          interactionCode?: number
          nhuCauKH?: string
          noteInput?: string
          status?: string
          ticketSerial?: string
          timeStart?: string
        }
        Relationships: []
      }
      Ticket: {
        Row: {
          agent: string
          customerCode: number
          interactionCodeEnd: number
          interactionCodeStart: number
          kenhTiepNhan: string
          phoiHop: string
          status: string
          ticketCode: number
          ticketSerial: string
          timeEnd: string
          timeStart: string
        }
        Insert: {
          agent: string
          customerCode: number
          interactionCodeEnd: number
          interactionCodeStart: number
          kenhTiepNhan: string
          phoiHop: string
          status: string
          ticketCode?: number
          ticketSerial: string
          timeEnd: string
          timeStart: string
        }
        Update: {
          agent?: string
          customerCode?: number
          interactionCodeEnd?: number
          interactionCodeStart?: number
          kenhTiepNhan?: string
          phoiHop?: string
          status?: string
          ticketCode?: number
          ticketSerial?: string
          timeEnd?: string
          timeStart?: string
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
