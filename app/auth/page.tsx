"use client"
import supabase from "components/supabase"

const AuthPage = () => {

    console.log("Visiting Auth Page")
    const handleSignIn = async () => {
        
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
             // redirectTo: "https://leroysalih-humble-enigma-695prqwq94c4r76-3000.preview.app.github.dev"
            },
          });


        console.log(data)
    }

    const handleSignOut = async () => {
        
      const {  error } = await supabase.auth.signOut();
      error && console.error(error);
      console.log("Signed Out");
  }
    return <><h1>Auth Page</h1>
        <button onClick={handleSignIn}>Sign In</button>
        <button onClick={handleSignOut}>Sign Out</button>
    </>
    
}

export default AuthPage;