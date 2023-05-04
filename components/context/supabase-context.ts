import { User } from '@supabase/supabase-js';
import {createContext } from 'react';
import { Profile, ClassMembershipData } from 'types/alias';
import { GetClassesResponseType, GetAllPupilMarks, GetAllSpecsType } from 'lib';
import {SupabaseClient} from "@supabase/supabase-js";

export type SupabaseContextType = {
    supabase?: SupabaseClient
}
  
export const SupabaseContext = createContext<SupabaseContextType >({});



  