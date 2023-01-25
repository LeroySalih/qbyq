import { User } from '@supabase/supabase-js';
import {createContext } from 'react';
import { Profile } from 'types/alias';

export type UserContextType = {
    user?: User,
    profile?: Profile | null
}
  
export const UserContext = createContext<UserContextType >({});



  