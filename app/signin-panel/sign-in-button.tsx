"use client"
import {Button} from "@mui/material";
import {useEffect, useState} from "react";
import {User, Session, AuthChangeEvent} from "@supabase/supabase-js";
import {Avatar} from "@mui/material";
import supabase from "app/utils/supabase/client";
import AssessmentOutlinedIcon from '@material-ui/icons/AssessmentOutlined';
import { IconButton } from '@mui/material';

const SignInButton = () => {

    const [user, setUser] = useState<User | null>(null);

    const handleSignIn = async () => {

        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'azure',
          options: {
            scopes: 'email',
            redirectTo: process.env.NEXT_PUBLIC_SITE_REDIRECT
          },
        });

    
        error && console.error(error);
    }

    useEffect(()=> {

        supabase.auth.onAuthStateChange((event: AuthChangeEvent, session:Session | null) => {
            
            if (session == null || !session.user){
                setUser(null);
                return;
            }

            setUser(session.user);

        })
    });

    return  (user === null) ? <Button variant="outlined" onClick={handleSignIn} startIcon={<Avatar src={"/ms-logo.jpeg"}/>}>Sign in with microsoft id</Button> : 
                                <IconButton aria-label="delete" disabled color="primary" >
                                    <AssessmentOutlinedIcon > Dashboard </AssessmentOutlinedIcon>
                                </IconButton>
}