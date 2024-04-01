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
      __specid: {
        Row: {
          specId: number | null
        }
        Insert: {
          specId?: number | null
        }
        Update: {
          specId?: number | null
        }
        Relationships: []
      }
      cat_names: {
        Row: {
          cat_name: string | null
        }
        Insert: {
          cat_name?: string | null
        }
        Update: {
          cat_name?: string | null
        }
        Relationships: []
      }
      Classes: {
        Row: {
          created_at: string | null
          id: number
          join_code: string
          specId: number
          tag: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: number
          join_code: string
          specId: number
          tag: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: number
          join_code?: string
          specId?: number
          tag?: string
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "ClassMembership_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "ClassMembership_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "public_ClassPapers_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_ClassPapers_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "public_ClassPapers_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "public_ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_ClassPapers_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
        ]
      }
      dqAnswers: {
        Row: {
          answer: Json | null
          attempts: number
          correct: number
          created_at: string | null
          flag: boolean | null
          id: string
          isCorrect: boolean | null
          likeState: number
          owner: string
          questionId: number
        }
        Insert: {
          answer?: Json | null
          attempts?: number
          correct?: number
          created_at?: string | null
          flag?: boolean | null
          id?: string
          isCorrect?: boolean | null
          likeState?: number
          owner: string
          questionId: number
        }
        Update: {
          answer?: Json | null
          attempts?: number
          correct?: number
          created_at?: string | null
          flag?: boolean | null
          id?: string
          isCorrect?: boolean | null
          likeState?: number
          owner?: string
          questionId?: number
        }
        Relationships: [
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "dqQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["questionId"]
          },
        ]
      }
      dqPage: {
        Row: {
          created_at: string
          id: string
          specItemId: number
          summary: string
          title: string
          transcript: string
        }
        Insert: {
          created_at?: string
          id: string
          specItemId: number
          summary: string
          title?: string
          transcript: string
        }
        Update: {
          created_at?: string
          id?: string
          specItemId?: number
          summary?: string
          title?: string
          transcript?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_dqPage_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqPage_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "public_dqPage_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "public_dqPage_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqPage_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      dqQuestions: {
        Row: {
          choices: string[]
          code: string | null
          correct_answer: string
          created_at: string
          createdBy: string | null
          id: number
          question_text: string
          specItemId: number | null
        }
        Insert: {
          choices: string[]
          code?: string | null
          correct_answer: string
          created_at?: string
          createdBy?: string | null
          id?: number
          question_text: string
          specItemId?: number | null
        }
        Update: {
          choices?: string[]
          code?: string | null
          correct_answer?: string
          created_at?: string
          createdBy?: string | null
          id?: number
          question_text?: string
          specItemId?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_dqQuestions_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqQuestions_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "public_dqQuestions_createdBy_fkey"
            columns: ["createdBy"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
          {
            foreignKeyName: "public_dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "public_dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "public_dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      dqQuestionType: {
        Row: {
          created_at: string
          description: string | null
          id: number
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: number
        }
        Relationships: []
      }
      FCQuestions: {
        Row: {
          created_at: string
          id: string
          specItemId: number
          term: string
          text: string
        }
        Insert: {
          created_at?: string
          id?: string
          specItemId: number
          term: string
          text: string
        }
        Update: {
          created_at?: string
          id?: string
          specItemId?: number
          term?: string
          text?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCQuestions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      FCUserQuestionHistory: {
        Row: {
          answer: string
          created_at: string
          id: number
          questionId: string
          result: boolean
          specItemId: number
          userid: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: number
          questionId: string
          result: boolean
          specItemId: number
          userid: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: number
          questionId?: string
          result?: boolean
          specItemId?: number
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUserQuestionHistory_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "FCQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQuestionHistory_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      FCUSerQueueEntries: {
        Row: {
          created_at: string
          currentQueue: number
          dueDate: string
          id: number
          questionId: string
          specItemId: number
          userId: string
        }
        Insert: {
          created_at?: string
          currentQueue: number
          dueDate: string
          id?: number
          questionId: string
          specItemId: number
          userId: string
        }
        Update: {
          created_at?: string
          currentQueue?: number
          dueDate?: string
          id?: number
          questionId?: string
          specItemId?: number
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUSerQueueEntries_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "FCQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "FCUSerQueueEntries_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
      }
      FCUserQueues: {
        Row: {
          created_at: string | null
          specItemId: number
          userid: string
        }
        Insert: {
          created_at?: string | null
          specItemId: number
          userid: string
        }
        Update: {
          created_at?: string | null
          specItemId?: number
          userid?: string
        }
        Relationships: [
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "FCUserQueues_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      Papers: {
        Row: {
          aPaperLabel: string | null
          created_at: string | null
          id: number
          marks: number | null
          month: string | null
          paper: string | null
          qPaperLabel: string | null
          specId: number | null
          subject: string | null
          title: string | null
          year: string | null
        }
        Insert: {
          aPaperLabel?: string | null
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: string | null
          paper?: string | null
          qPaperLabel?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
        Update: {
          aPaperLabel?: string | null
          created_at?: string | null
          id?: number
          marks?: number | null
          month?: string | null
          paper?: string | null
          qPaperLabel?: string | null
          specId?: number | null
          subject?: string | null
          title?: string | null
          year?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Papers_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Papers_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "Papers_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
      }
      Profile: {
        Row: {
          classes: string[] | null
          created_at: string | null
          familyName: string
          firstName: string
          id: string
          isAdmin: boolean
          isTech: boolean
        }
        Insert: {
          classes?: string[] | null
          created_at?: string | null
          familyName: string
          firstName: string
          id: string
          isAdmin?: boolean
          isTech?: boolean
        }
        Update: {
          classes?: string[] | null
          created_at?: string | null
          familyName?: string
          firstName?: string
          id?: string
          isAdmin?: boolean
          isTech?: boolean
        }
        Relationships: [
          {
            foreignKeyName: "Profile_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      PupilMarks: {
        Row: {
          created_at: string | null
          id: number
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
        Relationships: [
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "Questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["questionId"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["q_id"]
          },
        ]
      }
      PupilMarks_2024_03_29: {
        Row: {
          created_at: string | null
          id: number
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
        Relationships: [
          {
            foreignKeyName: "public_PupilMarks_duplicate_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "Questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["questionId"]
          },
          {
            foreignKeyName: "public_PupilMarks_duplicate_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["q_id"]
          },
        ]
      }
      QPAnswer: {
        Row: {
          answer: string
          created_at: string | null
          id: number
          isCorrect: boolean
          max_points: number
          path: string
          points: number
          questionId: string
          userId: string
        }
        Insert: {
          answer: string
          created_at?: string | null
          id?: number
          isCorrect: boolean
          max_points?: number
          path: string
          points?: number
          questionId: string
          userId: string
        }
        Update: {
          answer?: string
          created_at?: string | null
          id?: number
          isCorrect?: boolean
          max_points?: number
          path?: string
          points?: number
          questionId?: string
          userId?: string
        }
        Relationships: [
          {
            foreignKeyName: "QPAnswer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "QPAnswer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "QPAnswer_userId_fkey"
            columns: ["userId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Questions_PaperId_fkey"
            columns: ["PaperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "SpecItem"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_dq_daily_pupil_answer_count"
            referencedColumns: ["specItemId"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Questions_specItemId_fkey"
            columns: ["specItemId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specItemId"]
          },
        ]
      }
      result_record: {
        Row: {
          correctAnswer: Json | null
          created_at: string | null
          createdBy: string | null
          id: number | null
          questionData: Json | null
          questionType: number | null
          specItemId: number | null
          specTitle: string | null
          tag: string | null
          title: string | null
        }
        Insert: {
          correctAnswer?: Json | null
          created_at?: string | null
          createdBy?: string | null
          id?: number | null
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
          specTitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          correctAnswer?: Json | null
          created_at?: string | null
          createdBy?: string | null
          id?: number | null
          questionData?: Json | null
          questionType?: number | null
          specItemId?: number | null
          specTitle?: string | null
          tag?: string | null
          title?: string | null
        }
        Relationships: []
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
        Relationships: []
      }
      SpecItem: {
        Row: {
          created_at: string | null
          id: number
          revisionMaterials: string | null
          SpecId: number | null
          specUnitId: number | null
          tag: string | null
          title: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
          SpecId?: number | null
          specUnitId?: number | null
          tag?: string | null
          title?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          revisionMaterials?: string | null
          SpecId?: number | null
          specUnitId?: number | null
          tag?: string | null
          title?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "public_SpecItem_specUnitId_fkey"
            columns: ["specUnitId"]
            isOneToOne: false
            referencedRelation: "SpecUnits"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_SpecItem_specUnitId_fkey"
            columns: ["specUnitId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specUnitId"]
          },
          {
            foreignKeyName: "public_SpecItem_specUnitId_fkey"
            columns: ["specUnitId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specUnitId"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
      }
      SpecUnits: {
        Row: {
          created_at: string
          id: number
          specId: number
          title: string
        }
        Insert: {
          created_at?: string
          id?: number
          specId: number
          title: string
        }
        Update: {
          created_at?: string
          id?: number
          specId?: number
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_SpecUnits_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_SpecUnits_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "public_SpecUnits_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "Tasks_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "Tasks_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "Tasks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
        ]
      }
      "TBD-ClassPaperResources": {
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
        Relationships: [
          {
            foreignKeyName: "TBD-ClassPaperResources_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "Classes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_classId_fkey"
            columns: ["classId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["classId"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "TBD-ClassPaperResources_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
        ]
      }
      test: {
        Row: {
          category: string | null
          id: number | null
          value: number | null
        }
        Insert: {
          category?: string | null
          id?: number | null
          value?: number | null
        }
        Update: {
          category?: string | null
          id?: number | null
          value?: number | null
        }
        Relationships: []
      }
      WorkQueue: {
        Row: {
          complete_date: string | null
          created_at: string
          filePath: string
          id: number
          machine: string
          notes: string
          publicUrl: string
          status: string
          tech_notes: string | null
          userid: string
        }
        Insert: {
          complete_date?: string | null
          created_at?: string
          filePath?: string
          id?: number
          machine?: string
          notes?: string
          publicUrl: string
          status?: string
          tech_notes?: string | null
          userid?: string
        }
        Update: {
          complete_date?: string | null
          created_at?: string
          filePath?: string
          id?: number
          machine?: string
          notes?: string
          publicUrl?: string
          status?: string
          tech_notes?: string | null
          userid?: string
        }
        Relationships: []
      }
      WorkUploads: {
        Row: {
          created_at: string
          dt: string
          fileName: string
          id: number
          owner: string
          paperId: string
          path: string
        }
        Insert: {
          created_at?: string
          dt: string
          fileName: string
          id?: number
          owner: string
          paperId: string
          path: string
        }
        Update: {
          created_at?: string
          dt?: string
          fileName?: string
          id?: number
          owner?: string
          paperId?: string
          path?: string
        }
        Relationships: [
          {
            foreignKeyName: "public_WorkUploads_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_WorkUploads_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "public_WorkUploads_owner_fkey"
            columns: ["owner"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
      }
    }
    Views: {
      dq_vw_answers: {
        Row: {
          answer: Json | null
          attempts: number | null
          code: string | null
          correct: number | null
          created_at: string | null
          flag: boolean | null
          id: string | null
          isCorrect: boolean | null
          likeState: number | null
          owner: string | null
          questionId: number | null
        }
        Relationships: [
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "dqQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["questionId"]
          },
        ]
      }
      vw_class_lists: {
        Row: {
          familyName: string | null
          firstName: string | null
          pupilId: string | null
          tag: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
      }
      vw_dq_answers_denormed: {
        Row: {
          answerCreatedAt: string | null
          answerId: string | null
          answerQuestionId: number | null
          created_at: string | null
          familyName: string | null
          firstName: string | null
          isCorrect: boolean | null
          owner: string | null
          questionCode: string | null
          questionId: number | null
          specId: number | null
          specItemId: number | null
          specItemTag: string | null
          specItemTitle: string | null
          specSubject: string | null
          specTitle: string | null
          specUnitId: number | null
          specUnitTitle: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profile_id_fkey"
            columns: ["owner"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["answerQuestionId"]
            isOneToOne: false
            referencedRelation: "dqQuestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "public_dqAnswers_questionId_fkey"
            columns: ["answerQuestionId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["questionId"]
          },
        ]
      }
      vw_dq_daily_pupil_answer_count: {
        Row: {
          classTag: string | null
          count: number | null
          created_at: string | null
          familyName: string | null
          firstName: string | null
          owner: string | null
          specItemId: number | null
          tag: string | null
          title: string | null
        }
        Relationships: []
      }
      vw_dq_pupil_scores_last5days: {
        Row: {
          cl_classTag: string | null
          count: number | null
          dt: string | null
          familyName: string | null
          firstName: string | null
          pupilId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
      }
      vw_duplicate_pupil_marks: {
        Row: {
          count: number | null
          firstName: string | null
          paperId: number | null
          questionId: number | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "Questions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["questionId"]
          },
          {
            foreignKeyName: "PupilMarks_questionId_fkey"
            columns: ["questionId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["q_id"]
          },
        ]
      }
      vw_marks_for_papers_by_tag: {
        Row: {
          familyName: string | null
          firstName: string | null
          paperId: number | null
          pupilId: string | null
          sum: number | null
          tag: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Profile_id_fkey"
            columns: ["pupilId"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "Papers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_paper_marks_for_pupil_detail"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_papers_for_classes"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["paperId"]
          },
          {
            foreignKeyName: "PupilMarks_paperId_fkey"
            columns: ["paperId"]
            isOneToOne: false
            referencedRelation: "vw_questions_denorm"
            referencedColumns: ["p_id"]
          },
        ]
      }
      vw_paper_marks_for_pupil_detail: {
        Row: {
          aMarks: number | null
          id: number | null
          paperId: number | null
          qMarks: number | null
          SpecId: number | null
          tag: string | null
          title: string | null
          userId: string | null
        }
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
      }
      vw_papers_for_classes: {
        Row: {
          availableFrom: string | null
          classId: number | null
          completeBy: string | null
          markBy: string | null
          month: string | null
          paper: string | null
          paperId: number | null
          specId: number | null
          tag: string | null
          title: string | null
          year: string | null
        }
        Relationships: [
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "Classes_specId_fkey"
            columns: ["specId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
      }
      vw_pupil_marks_denormed: {
        Row: {
          answerMarks: number | null
          availableFrom: string | null
          classId: number | null
          classTag: string | null
          classTitle: string | null
          completeBy: string | null
          familyName: string | null
          firstName: string | null
          markBy: string | null
          month: string | null
          paper: string | null
          paperId: number | null
          pupilId: string | null
          pupilMarksId: number | null
          questionId: number | null
          questionMarks: number | null
          questionNumber: string | null
          questionOrder: number | null
          specId: number | null
          specItemId: number | null
          specItemTag: string | null
          specItemTitle: string | null
          specSubject: string | null
          specTitle: string | null
          specUnitId: number | null
          specUnitTitle: string | null
          year: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "Profile"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["owner"]
          },
          {
            foreignKeyName: "ClassMembership_pupilId_fkey"
            columns: ["pupilId"]
            isOneToOne: false
            referencedRelation: "vw_marks_for_papers_by_tag"
            referencedColumns: ["pupilId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["SpecId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["si_specId"]
            isOneToOne: false
            referencedRelation: "Spec"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["si_specId"]
            isOneToOne: false
            referencedRelation: "vw_dq_answers_denormed"
            referencedColumns: ["specId"]
          },
          {
            foreignKeyName: "SpecItem_SpecId_fkey"
            columns: ["si_specId"]
            isOneToOne: false
            referencedRelation: "vw_pupil_marks_denormed"
            referencedColumns: ["specId"]
          },
        ]
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
        Relationships: []
      }
      vw_user_marks_for_paper_clone: {
        Row: {
          "?column?": number | null
        }
        Relationships: []
      }
      vw_user_marks_for_spec: {
        Row: {
          avg: number | null
          pm_marks: number | null
          q_marks: number | null
          tag: string | null
          title: string | null
        }
        Relationships: []
      }
      vw_wq_tickets: {
        Row: {
          complete_date: string | null
          created_at: string | null
          familyName: string | null
          filePath: string | null
          firstName: string | null
          id: number | null
          isAdmin: boolean | null
          isTech: boolean | null
          machine: string | null
          notes: string | null
          publicUrl: string | null
          status: string | null
          tech_notes: string | null
          userid: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      crosstab: {
        Args: {
          "": string
        }
        Returns: Record<string, unknown>[]
      }
      crosstab2: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_2"][]
      }
      crosstab3: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_3"][]
      }
      crosstab4: {
        Args: {
          "": string
        }
        Returns: Database["public"]["CompositeTypes"]["tablefunc_crosstab_4"][]
      }
      dq_getspecitemquestioncount: {
        Args: {
          _specid: number
        }
        Returns: {
          specid: number
          specitemid: number
          title: string
          subject: string
          tag: string
          specitem_title: string
          questiondatacount: number
        }[]
      }
      dq_loadnextquestionbycode: {
        Args: {
          _code: string
          _owner: string
        }
        Returns: {
          id: number
          question_text: string
          choices: string[]
          correct_answer: string
        }[]
      }
      dq_loadnextquestionbyspecitem: {
        Args: {
          _specitemid: number
          _owner: string
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      dq_loadquestionbyid: {
        Args: {
          _questionid: number
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      dq_loadquestionbyspecitemid: {
        Args: {
          _specitemid: number
        }
        Returns: Database["public"]["CompositeTypes"]["dq_loadquestionbyspecitemidreturn"]
      }
      fn_admin_get_all_papers_for_class_spec: {
        Args: {
          classTag: string
        }
        Returns: {
          paperId: number
          year: string
          month: string
          title: string
          paper: string
          availablefrom: string
          completeby: string
          markby: string
        }[]
      }
      fn_admin_get_papers_for_class: {
        Args: {
          _classid: number
        }
        Returns: {
          paperId: number
          year: string
          month: string
          subject: string
          paper: string
          qpaperlabel: string
          apaperlabel: string
          availableFrom: string
          completeBy: string
          markBy: string
        }[]
      }
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
      fn_fc_add_spec_item_to_pupil_queue: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: number
      }
      fn_fc_get_distractors: {
        Args: {
          _specid: number
          _qid: string
        }
        Returns: string[]
      }
      fn_fc_get_next_question: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          userId: string
          specItemId: number
          tag: string
          title: string
          dueDate: string
          currentQueue: number
          history: Json
          questionId: string
          term: string
          text: string
          distractors: string[]
        }[]
      }
      fn_fc_get_queue: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          userId: string
          specItemId: number
          tag: string
          title: string
          dueDate: string
          currentQueue: number
          history: Json
          questionId: string
          term: string
          text: string
          distractors: string[]
        }[]
      }
      fn_fc_get_queue_summary: {
        Args: {
          _userid: string
          _specitemid: number
        }
        Returns: {
          isDue: string
          count: number
        }[]
      }
      fn_fc_get_queues: {
        Args: {
          _userid: string
        }
        Returns: {
          specItemId: number
          specItemTag: string
          specItemTitle: string
          specId: number
          specTitle: string
          specSubject: string
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
      fn_get_paper_details_for_pupil: {
        Args: {
          _owner: string
        }
        Returns: {
          classId: number
          paperId: number
          paperTitle: string
          classTag: string
          availableFrom: string
          completeBy: string
          markBy: string
          paperMarks: number
          pupilMarks: number
        }[]
      }
      fn_get_papers_for_class: {
        Args: {
          _classid: number
        }
        Returns: {
          paperId: number
          year: string
          month: string
          subject: string
          paper: string
          qpaperlabel: string
          apaperlabel: string
          availableFrom: string
          completeBy: string
          markBy: string
        }[]
      }
      fn_get_specitemmarks_for_pupil_class: {
        Args: {
          _pupilid: string
          _classtag: string
        }
        Returns: {
          _specId: number
          _specItemId: number
          _specItemTag: string
          _specItemTitle: string
          _questionMarks: number
          _answerMarks: number
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
      fn_pupil_marks_by_spec_item:
        | {
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
        | {
            Args: {
              userid: string
              specid: number
              classid: number
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
      fn_qp_get_current_answers: {
        Args: {
          _userid: string
          _path: string
        }
        Returns: {
          _created_at: string
          _questionid: string
          _iscorrect: boolean
          _max_points: number
          _points: number
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
      fn_test_vars: {
        Args: Record<PropertyKey, never>
        Returns: {
          _count: number
          _sum: number
          _avg: number
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
      get_class_marks: {
        Args: {
          class_tag: string
          paper_id: number
        }
        Returns: {
          classid: number
          classtag: string
          pupilid: string
          first_name: string
          family_name: string
          marks: number
        }[]
      }
      get_papers_class_tag: {
        Args: {
          class_tag: string
        }
        Returns: {
          classId: number
          paperId: number
          year: string
          month: string
          title: string
          paper: string
        }[]
      }
      helloworld: {
        Args: {
          _name: string
        }
        Returns: {
          msg: string
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      dq_loadquestionbyspecitemidreturn: {
        id: number | null
        created_at: string | null
        createdby: string | null
        specitemid: number | null
        questiondata: Json | null
        questiontype: number | null
        correctanswer: Json | null
        tag: string | null
        title: string | null
        spectitle: string | null
      }
      tablefunc_crosstab_2: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
      }
      tablefunc_crosstab_3: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
      }
      tablefunc_crosstab_4: {
        row_name: string | null
        category_1: string | null
        category_2: string | null
        category_3: string | null
        category_4: string | null
      }
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
