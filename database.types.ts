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
            categories: {
                Row: {
                    id: string
                    name: string
                    slug: string
                }
                Insert: {
                    id?: string
                    name: string
                    slug: string
                }
                Update: {
                    id?: string
                    name?: string
                    slug?: string
                }
                Relationships: []
            }
            conversations: {
                Row: {
                    buyer_id: string | null
                    created_at: string | null
                    id: string
                    listing_id: string | null
                    seller_id: string | null
                }
                Insert: {
                    buyer_id?: string | null
                    created_at?: string | null
                    id?: string
                    listing_id?: string | null
                    seller_id?: string | null
                }
                Update: {
                    buyer_id?: string | null
                    created_at?: string | null
                    id?: string
                    listing_id?: string | null
                    seller_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "conversations_buyer_id_fkey"
                        columns: ["buyer_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversations_listing_id_fkey"
                        columns: ["listing_id"]
                        isOneToOne: false
                        referencedRelation: "listings"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "conversations_seller_id_fkey"
                        columns: ["seller_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            favorites: {
                Row: {
                    created_at: string
                    id: string
                    listing_id: string
                    user_id: string
                }
                Insert: {
                    created_at?: string
                    id?: string
                    listing_id: string
                    user_id: string
                }
                Update: {
                    created_at?: string
                    id?: string
                    listing_id?: string
                    user_id?: string
                }
                Relationships: [
                    {
                        foreignKeyName: "favorites_listing_id_fkey"
                        columns: ["listing_id"]
                        isOneToOne: false
                        referencedRelation: "listings"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "favorites_user_id_fkey"
                        columns: ["user_id"]
                        isOneToOne: false
                        referencedRelation: "users" // Note: This might be 'auth.users' or similar in real DB, but generated types will reflect reality
                        referencedColumns: ["id"]
                    }
                ]
            }
            listings: {
                Row: {
                    age: number | null
                    attributes: Json | null
                    category_id: string | null
                    created_at: string | null
                    description: string | null
                    id: string
                    image_url: string | null
                    images: string[] | null
                    is_vip: boolean | null
                    location: string | null
                    owner_id: string | null
                    price: number | null
                    slug: string | null
                    state: string | null
                    subcategory: string | null
                    tier: string | null
                    title: string
                    updated_at: string | null
                    verified: boolean | null
                }
                Insert: {
                    age?: number | null
                    attributes?: Json | null
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    images?: string[] | null
                    is_vip?: boolean | null
                    location?: string | null
                    owner_id?: string | null
                    price?: number | null
                    slug?: string | null
                    state?: string | null
                    subcategory?: string | null
                    tier?: string | null
                    title: string
                    updated_at?: string | null
                    verified?: boolean | null
                }
                Update: {
                    age?: number | null
                    attributes?: Json | null
                    category_id?: string | null
                    created_at?: string | null
                    description?: string | null
                    id?: string
                    image_url?: string | null
                    images?: string[] | null
                    is_vip?: boolean | null
                    location?: string | null
                    owner_id?: string | null
                    price?: number | null
                    slug?: string | null
                    state?: string | null
                    subcategory?: string | null
                    tier?: string | null
                    title?: string
                    updated_at?: string | null
                    verified?: boolean | null
                }
                Relationships: [
                    {
                        foreignKeyName: "listings_category_id_fkey"
                        columns: ["category_id"]
                        isOneToOne: false
                        referencedRelation: "categories"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "listings_owner_id_fkey"
                        columns: ["owner_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            messages: {
                Row: {
                    body: string | null
                    conversation_id: string | null
                    created_at: string | null
                    id: string
                    read_at: string | null
                    sender_id: string | null
                }
                Insert: {
                    body?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    read_at?: string | null
                    sender_id?: string | null
                }
                Update: {
                    body?: string | null
                    conversation_id?: string | null
                    created_at?: string | null
                    id?: string
                    read_at?: string | null
                    sender_id?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "messages_conversation_id_fkey"
                        columns: ["conversation_id"]
                        isOneToOne: false
                        referencedRelation: "conversations"
                        referencedColumns: ["id"]
                    },
                    {
                        foreignKeyName: "messages_sender_id_fkey"
                        columns: ["sender_id"]
                        isOneToOne: false
                        referencedRelation: "profiles"
                        referencedColumns: ["id"]
                    }
                ]
            }
            profiles: {
                Row: {
                    avatar_url: string | null
                    created_at: string | null
                    id: string
                    name: string | null
                    phone: string | null
                }
                Insert: {
                    avatar_url?: string | null
                    created_at?: string | null
                    id: string
                    name?: string | null
                    phone?: string | null
                }
                Update: {
                    avatar_url?: string | null
                    created_at?: string | null
                    id?: string
                    name?: string | null
                    phone?: string | null
                }
                Relationships: [
                    {
                        foreignKeyName: "profiles_id_fkey"
                        columns: ["id"]
                        isOneToOne: true
                        referencedRelation: "users"
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
