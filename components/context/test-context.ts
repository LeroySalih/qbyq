
import {createContext } from 'react';

export type TestContextType = {
    msg: 'ok'
}
  
export const TestContext = createContext<TestContextType >({msg:'ok'});



  