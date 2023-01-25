import {Database} from './supabase';

export type Spec = Database["public"]["Tables"]["Spec"]["Row"];
export type SpecItem = Database["public"]["Tables"]["SpecItem"]["Row"];