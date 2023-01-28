import { User } from '@supabase/supabase-js';
import {createContext } from 'react';
import { Profile, ClassMembershipData } from 'types/alias';

export type UserContextType = {
    user?: User,
    profile?: Profile | null,
    classes?: ClassMembershipData | null
}
  
export const UserContext = createContext<UserContextType >({});



  