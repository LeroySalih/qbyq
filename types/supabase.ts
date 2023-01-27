export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      Classes: {
        Row: {
          created_at: string | null
          id: number
          join_code: string | null
          resources: Json | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          resources?: Json | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          resources?: Json | null
          tag?: string | null
          title?: string | null
        }
      }
      Papers: {
        Row: {
          created_at: string | null
          id: number
          marks: number | null
          month: number | null
          paper: string | null
          specId: number | null
          subject: string | null
          title: string | null
          year: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: number | null
          paper?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: number | null
          paper?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
      }
      Profile: {
        Row: {
          classes: string[] | null
          created_at: string | null
          familyName: string
          firstName: string
          id: number
          isAdmin: boolean
          userId: string | null
        }
        Insert: {
          classes?: string[] | null
          created_at?: string | null
          familyName: string
          firstName: string
          id?: number
          isAdmin?: boolean
          userId?: string | null
        }
        Update: {
          classes?: string[] | null
          created_at?: string | null
          familyName?: string
          firstName?: string
          id?: number
          isAdmin?: boolean
          userId?: string | null
        }
      }
      PupilMarks: {
        Row: {
          created_at?: string | null
          id?: number
          marks: number | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId?: number | null
          questionId?: number | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId?: number | null
          questionId?: number | null
          userId?: string | null
        }
      }
      Questions: {
        Row: {
          created_at: string | null
          id: number
          marks: number | null
          PaperId: number | null
          question_number: string | null
          specItemId: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          specItemId?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          specItemId?: number | null
        }
      }
      Spec: {
        Row: {
          created_at: string | null
          id: number
          subject: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          subject?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          subject?: string | null
          title?: string | null
        }
      }
      SpecItem: {
        Row: {
          created_at: string | null
          id: number
          SpecId: number | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          SpecId?: number | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          SpecId?: number | null
          tag?: string | null
          title?: string | null
        }
      }
      Tasks: {
        Row: {
          classId: number | null
          created_at: string | null
          id: number
          isActive: boolean | null
          paperId: number | null
        }
        Insert: {
          classId?: number | null
          created_at?: string | null
          id?: number
          isActive?: boolean | null
          paperId?: number | null
        }
        Update: {
          classId?: number | null
          created_at?: string | null
          id?: number
          isActive?: boolean | null
          paperId?: number | null
        }
      }
    }
    Views: {
      vw_user_marks_for_paper: {
        Row: {
          qMarks: number | null
          question_number: string | null
          "Spec Title": string | null
          tag: string | null
          title: string | null
          uMarks: number | null
          userId: string | null
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
