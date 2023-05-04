import { User } from '@supabase/supabase-js';
import {createContext } from 'react';
import { Profile, ClassMembershipData } from 'types/alias';
import { GetClassesResponseType, GetAllPupilMarks, GetAllSpecsType } from 'lib';

export type UserContextType = {
    user?: User | null,
    profile?: Profile | null,
}
  
export const UserContext = createContext<UserContextType >({});



  