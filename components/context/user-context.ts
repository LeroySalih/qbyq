import { User } from '@supabase/supabase-js';
import {createContext } from 'react';

export type UserContextType = {
    user?: User
}
  
export const UserContext = createContext<UserContextType >({});



  