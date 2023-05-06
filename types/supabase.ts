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
          specId: number | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          specId?: number | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          join_code?: string | null
          specId?: number | null
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
      ClassPaperResources: {
        Row: {
          classId: number | null
          created_at: string | null
          id: number
          label: string | null
          paperId: number | null
          url: string | null
        }
        Insert: {
          classId?: number | null
          created_at?: string | null
          id?: number
          label?: string | null
          paperId?: number | null
          url?: string | null
        }
        Update: {
          classId?: number | null
          created_at?: string | null
          id?: number
          label?: string | null
          paperId?: number | null
          url?: string | null
        }
      }
      ClassPapers: {
        Row: {
          availableFrom: string | null
          classId: number
          completeBy: string | null
          created_at: string | null
          markBy: string | null
          paperId: number
        }
        Insert: {
          availableFrom?: string | null
          classId: number
          completeBy?: string | null
          created_at?: string | null
          markBy?: string | null
          paperId: number
        }
        Update: {
          availableFrom?: string | null
          classId?: number
          completeBy?: string | null
          created_at?: string | null
          markBy?: string | null
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
          paperId: number
          questionId: number
          userId: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId: number
          questionId: number
          userId: string
        }
        Update: {
          created_at?: string | null
          id?: number
          marks?: number | null
          paperId?: number
          questionId?: number
          userId?: string
        }
      }
      "PupilMarks.copy": {
        Row: {
          created_at: string | null
          id: number | null
          marks: number | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number | null
          marks?: number | null
          paperId?: number | null
          questionId?: number | null
          userId?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number | null
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
      TDFQuestions: {
        Row: {
          AO: number | null
          created_at: string | null
          def: string | null
          id: number
          questionSetId: number | null
          specItemId: number | null
          term: string | null
        }
        Insert: {
          AO?: number | null
          created_at?: string | null
          def?: string | null
          id?: number
          questionSetId?: number | null
          specItemId?: number | null
          term?: string | null
        }
        Update: {
          AO?: number | null
          created_at?: string | null
          def?: string | null
          id?: number
          questionSetId?: number | null
          specItemId?: number | null
          term?: string | null
        }
      }
      TDFQuestionSets: {
        Row: {
          created_at: string | null
          id: number
          owner: string | null
          specId: number | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          owner?: string | null
          specId?: number | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          owner?: string | null
          specId?: number | null
          title?: string | null
        }
      }
      TDFQueue: {
        Row: {
          created_at: string | null
          dueDate: string | null
          questionId: number
          queueType: number | null
          result: boolean | null
          userId: string
        }
        Insert: {
          created_at?: string | null
          dueDate?: string | null
          questionId: number
          queueType?: number | null
          result?: boolean | null
          userId: string
        }
        Update: {
          created_at?: string | null
          dueDate?: string | null
          questionId?: number
          queueType?: number | null
          result?: boolean | null
          userId?: string
        }
      }
    }
    Views: {
      vw_duplicate_pupil_marks: {
        Row: {
          count: number | null
          firstName: string | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
      }
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
      vw_questions_denorm: {
        Row: {
          p_id: number | null
          p_paper: string | null
          p_subject: string | null
          p_title: string | null
          p_year: string | null
          pm_entered: string | null
          pm_id: number | null
          pm_pMarks: number | null
          pm_userId: string | null
          q_amarks: number | null
          q_id: number | null
          q_month: string | null
          q_qnumber: string | null
          q_qorder: number | null
          si_revision_materials: string | null
          si_specId: number | null
          si_tag: string | null
          si_title: string | null
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
      fn_check_class: {
        Args: {
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          classId: number
          paperId: number
          year: string
          month: string
          paper: string
          pMarks: number
        }[]
      }
      fn_check_class_spec_item: {
        Args: {
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          tag: string
          title: string
          pMarks: number
          qMarks: number
        }[]
      }
      fn_check_paper_for_class: {
        Args: {
          paperid: number
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          pMarks: number
        }[]
      }
      fn_get_paper_data_for_pupil: {
        Args: {
          pupilid: string
        }
        Returns: {
          classId: number
          classTag: string
          specId: number
          pupilId: string
          firstName: string
          familyName: string
          paperId: number
          year: string
          month: string
          paper: string
          availableFrom: string
          completeBy: string
          markBy: string
          qMarks: number
          pMarks: number
        }[]
      }
      fn_marks_entered: {
        Args: {
          paperid: number
          classid: number
        }
        Returns: {
          pupilId: string
          firstName: string
          familyName: string
          pMarks: number
          qMarks: number
          pct: number
        }[]
      }
      fn_pupil_marks_by_available_from_date: {
        Args: {
          uuid: string
          specid: number
        }
        Returns: {
          tag: string
          title: string
          paperid: number
          availablefrom: string
          amarks: number
          pmarks: number
        }[]
      }
      fn_pupil_marks_by_available_marks: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          avMarks: number
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_by_paper: {
        Args: {
          uuid: string
          specid: number
        }
        Returns: {
          paperId: number
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_by_spec_item: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          specTag: string
          specItem: string
          revisionMaterials: string
          pMarks: number
          aMarks: number
        }[]
      }
      fn_pupil_marks_for_all_papers: {
        Args: {
          _userid: string
        }
        Returns: {
          userId: string
          paperId: number
          max_marks: number
          marks: number
        }[]
      }
      fn_pupilmarks_by_specitem: {
        Args: {
          userid: string
          specid: number
        }
        Returns: {
          tag: string
          SpecItem: string
          pupilMarks: number
          availableMarks: number
        }[]
      }
      fn_tdf_get_queue: {
        Args: {
          pid: string
          questionsetid: number
        }
        Returns: {
          questionId: number
          questionSetId: number
          specItemId: number
          term: string
          def: string
          AO: number
          createdAt: string
          pupilId: string
          queueType: number
          result: boolean
          dueDate: string
          inQueue: number
        }[]
      }
      fn_upsert_pupilmarks: {
        Args: {
          _paperid: number
          _questionid: number
          _userid: string
          _marks: number
        }
        Returns: {
          id: number
          created_at: string
          userid: string
          questionid: number
          marks: number
          paperid: number
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
