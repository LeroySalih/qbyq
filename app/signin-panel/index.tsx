"use client"

import styles from "./index.module.css";
import {Grid, Paper, Button, Avatar} from "@mui/material";
import supabase from "app/utils/supabase/client";

const SignIn = () => {
    
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

    return <div>
        <Grid container className={styles.gridLayout}>
            <Grid item xs={12} md={6} className={styles.textContainer}>
                <h1>Welcome to QbyQ</h1>
                <div>Use this site to track your past papers, and practice your daily questions.</div>
            </Grid>
            <Grid item xs={12} md={6} className={styles.signInContainer}>
                <Paper elevation={2} className={styles.signinCard}>
                    <h3>Sign in to QbyQ</h3>
                    <Button variant="outlined" onClick={handleSignIn} startIcon={<Avatar src={"/ms-logo.jpeg"}/>}>Sign in with microsoft id</Button>
                </Paper>
            </Grid>

        </Grid>
    </div>
}

export default SignIn;