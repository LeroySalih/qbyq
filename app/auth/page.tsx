"use client"
import supabase from "app/utils/supabase/client"
import {useRouter} from 'next/navigation';

const AuthPage = () => {

  const router = useRouter();
  
    // // console.log("Visiting Auth Page")
    const handleSignIn = async () => {
        
      

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
              redirectTo: process.env.NEXT_PUBLIC_SITE_REDIRECT
            },
          });

        router.push('/')
        
    }

    const handleSignOut = async () => {
        
      const {  error } = await supabase.auth.signOut();
      error && console.error(error);
      
      router.push('/')
  }
    return <><h1>Auth Page</h1>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignOut}>Sign Out</button>
    </>
    
}

export default AuthPage;