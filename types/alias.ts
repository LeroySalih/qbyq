import {Database} from './supabase';

export type Spec = Database["public"]["Tables"]["Spec"]["Row"];
export type SpecItem = Database["public"]["Tables"]["SpecItem"]["Row"];
export type PupilMarks = Database["public"]["Tables"]["PupilMarks"]["Row"];
export type Question = Database["public"]["Tables"]["Questions"]["Row"];