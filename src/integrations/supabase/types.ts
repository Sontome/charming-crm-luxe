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
      agent: {
        Row: {
          agentid: string
          department: string | null
          fullname: string
          isactive: boolean | null
          lastlogin: string | null
          password: string
        }
        Insert: {
          agentid: string
          department?: string | null
          fullname: string
          isactive?: boolean | null
          lastlogin?: string | null
          password: string
        }
        Update: {
          agentid?: string
          department?: string | null
          fullname?: string
          isactive?: boolean | null
          lastlogin?: string | null
          password?: string
        }
        Relationships: []
      }
      configoption: {
        Row: {
          configtype: string
          isactive: boolean | null
          optionid: string
          optionlabel: string
          sortorder: number | null
        }
        Insert: {
          configtype: string
          isactive?: boolean | null
          optionid: string
          optionlabel: string
          sortorder?: number | null
        }
        Update: {
          configtype?: string
          isactive?: boolean | null
          optionid?: string
          optionlabel?: string
          sortorder?: number | null
        }
        Relationships: []
      }
      customer: {
        Row: {
          createdat: string | null
          customeraddress: string | null
          customercode: number
          customeremail: string | null
          customerinfo: Json | null
          customername: string
          customerphone: string
          firstactivity: string | null
          lastactivity: string | null
        }
        Insert: {
          createdat?: string | null
          customeraddress?: string | null
          customercode?: number
          customeremail?: string | null
          customerinfo?: Json | null
          customername: string
          customerphone: string
          firstactivity?: string | null
          lastactivity?: string | null
        }
        Update: {
          createdat?: string | null
          customeraddress?: string | null
          customercode?: number
          customeremail?: string | null
          customerinfo?: Json | null
          customername?: string
          customerphone?: string
          firstactivity?: string | null
          lastactivity?: string | null
        }
        Relationships: []
      }
      interaction: {
        Row: {
          agentid: string
          chitietnhucau: string | null
          createdat: string | null
          customercode: number
          interactioncode: number
          nhucaukh: string
          noteinput: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticketserial: string
          timestart: string
        }
        Insert: {
          agentid: string
          chitietnhucau?: string | null
          createdat?: string | null
          customercode: number
          interactioncode?: number
          nhucaukh: string
          noteinput?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticketserial: string
          timestart: string
        }
        Update: {
          agentid?: string
          chitietnhucau?: string | null
          createdat?: string | null
          customercode?: number
          interactioncode?: number
          nhucaukh?: string
          noteinput?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticketserial?: string
          timestart?: string
        }
        Relationships: [
          {
            foreignKeyName: "interaction_agentid_fkey"
            columns: ["agentid"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["agentid"]
          },
          {
            foreignKeyName: "interaction_customercode_fkey"
            columns: ["customercode"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customercode"]
          },
          {
            foreignKeyName: "interaction_ticketserial_fkey"
            columns: ["ticketserial"]
            isOneToOne: false
            referencedRelation: "ticket"
            referencedColumns: ["ticketserial"]
          },
        ]
      }
      rawmisscall: {
        Row: {
          ani: string
          dnis: string | null
          duration: number | null
          endtime: string | null
          id: number
          importedat: string | null
          reason: string | null
          starttime: string | null
        }
        Insert: {
          ani: string
          dnis?: string | null
          duration?: number | null
          endtime?: string | null
          id?: number
          importedat?: string | null
          reason?: string | null
          starttime?: string | null
        }
        Update: {
          ani?: string
          dnis?: string | null
          duration?: number | null
          endtime?: string | null
          id?: number
          importedat?: string | null
          reason?: string | null
          starttime?: string | null
        }
        Relationships: []
      }
      ticket: {
        Row: {
          agent: string | null
          createdat: string | null
          customercode: number
          interactioncodeend: number | null
          interactioncodestart: number | null
          kenhtiepnhan: string
          phoihop: string | null
          status: Database["public"]["Enums"]["ticket_status"] | null
          ticketcode: number
          ticketserial: string
          timeend: string | null
          timestart: string
        }
        Insert: {
          agent?: string | null
          createdat?: string | null
          customercode: number
          interactioncodeend?: number | null
          interactioncodestart?: number | null
          kenhtiepnhan: string
          phoihop?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticketcode?: number
          ticketserial: string
          timeend?: string | null
          timestart: string
        }
        Update: {
          agent?: string | null
          createdat?: string | null
          customercode?: number
          interactioncodeend?: number | null
          interactioncodestart?: number | null
          kenhtiepnhan?: string
          phoihop?: string | null
          status?: Database["public"]["Enums"]["ticket_status"] | null
          ticketcode?: number
          ticketserial?: string
          timeend?: string | null
          timestart?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_interaction_end"
            columns: ["interactioncodeend"]
            isOneToOne: false
            referencedRelation: "interaction"
            referencedColumns: ["interactioncode"]
          },
          {
            foreignKeyName: "fk_interaction_start"
            columns: ["interactioncodestart"]
            isOneToOne: false
            referencedRelation: "interaction"
            referencedColumns: ["interactioncode"]
          },
          {
            foreignKeyName: "ticket_agent_fkey"
            columns: ["agent"]
            isOneToOne: false
            referencedRelation: "agent"
            referencedColumns: ["agentid"]
          },
          {
            foreignKeyName: "ticket_customercode_fkey"
            columns: ["customercode"]
            isOneToOne: false
            referencedRelation: "customer"
            referencedColumns: ["customercode"]
          },
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
      ticket_status: "PENDING" | "DONE" | "CANCELLED"
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
