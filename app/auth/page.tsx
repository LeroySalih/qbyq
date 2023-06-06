"use client"
import supabase from "components/supabase"
import {useRouter} from 'next/navigation';

const AuthPage = () => {

  const router = useRouter();
  
    // console.log("Visiting Auth Page")
    const handleSignIn = async () => {
        
      

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
              redirectTo: process.env.NEXT_PUBLIC_SITE_REDIRECT
            },
          });

        router.push('/')
        // console.log(data)
    }

    const handleSignOut = async () => {
        
      const {  error } = await supabase.auth.signOut();
      error && console.error(error);
      // console.log("Signed Out");
      router.push('/')
  }
    return <><h1>Auth Page</h1>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignOut}>Sign Out</button>
    </>
    
}

export default AuthPage;