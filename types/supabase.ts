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
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          tag?: string | null
          title?: string | null
        }
      }
      ClassMembership: {
        Row: {
          classId: number
          created_at: string | null
          pupilId: string
        }
        Insert: {
          classId: number
          created_at?: string | null
          pupilId: string
        }
        Update: {
          classId?: number
          created_at?: string | null
          pupilId?: string
        }
      }
      ClassPapers: {
        Row: {
          classId: number
          created_at: string | null
          paperId: number
        }
        Insert: {
          classId: number
          created_at?: string | null
          paperId: number
        }
        Update: {
          classId?: number
          created_at?: string | null
          paperId?: number
        }
      }
      Papers: {
        Row: {
          created_at: string | null
          id: number
          marks: number | null
          month: string | null
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
          month?: string | null
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
          month?: string | null
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
          id: string
          isAdmin: boolean
        }
        Insert: {
          classes?: string[] | null
          created_at?: string | null
          familyName: string
          firstName: string
          id: string
          isAdmin?: boolean
        }
        Update: {
          classes?: string[] | null
          created_at?: string | null
          familyName?: string
          firstName?: string
          id?: string
          isAdmin?: boolean
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
          question_order: number | null
          specItemId: number | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          question_order?: number | null
          specItemId?: number | null
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          PaperId?: number | null
          question_number?: string | null
          question_order?: number | null
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
          revisionMaterials: string | null
          SpecId: number | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
          SpecId?: number | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
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
      vw_pupil_marks_for_spec: {
        Row: {
          avg: number | null
          pm_marks: number | null
          q_marks: number | null
          SpecId: number | null
          tag: string | null
          title: string | null
          userId: string | null
        }
      }
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
      vw_user_marks_for_paper_clone: {
        Row: {
          "?column?": number | null
        }
      }
      vw_user_marks_for_spec: {
        Row: {
          avg: number | null
          pm_marks: number | null
          q_marks: number | null
          tag: string | null
          title: string | null
        }
      }
    }
    Functions: {
      fn_pupil_marks_per_spec_item: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          specId: number
          tag: string
          title: string
          revisionMaterials: string
          q_marks: number
          pm_marks: number
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
