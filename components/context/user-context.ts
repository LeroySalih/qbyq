import { User } from '@supabase/supabase-js';
import {createContext } from 'react';
import { Profile, ClassMembershipData } from 'types/alias';
import { GetClassesResponseType } from 'lib';

export type UserContextType = {
    user?: User,
    profile?: Profile | null,
    classes?: GetClassesResponseType | null,
    loadClasses : ()=>void
}
  
export const UserContext = createContext<UserContextType >({loadClasses: ()=> {}});



  