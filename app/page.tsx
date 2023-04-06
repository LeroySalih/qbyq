"use client"

import Link from 'next/link';
import React, { useContext } from 'react'
import {useState, useEffect} from 'react';
import { Database } from 'types/supabase';
import supabase from '../components/supabase';
import { PupilMarksForSpec, Spec } from 'types/alias';
import { UserContextType, UserContext } from 'components/context/user-context';
import { Profile } from 'types/alias';
import { useRouter } from 'next/navigation'
// import { Button } from 'primereact/button';
import Button from '@mui/material/Button';
import { InputText } from 'primereact/inputtext'; 

import { Class } from 'types/alias';
import AddClass, {OnAddHandler} from 'components/add-class';
import { GetClassesResponseType } from 'lib';
import DisplayClasses from 'components/display-classes';
import Loading from 'components/loading';

import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';


type ProfileProps = {}
type ClassParam = Class | null | undefined;

const MainPage: React.FunctionComponent<ProfileProps> = (): JSX.Element => {
    
    const [userProfile, setUserProfile] = useState<Profile | null>(null);
    const [spec, setSpec] = useState<Spec | null>(null);
    const {user, profile, classes, pupilMarks, loadClasses} = useContext<UserContextType>(UserContext);
    const [loading, setLoading] = useState<boolean>(false);

    const [currentSpec, setCurrentSpec] = useState<number | undefined>(0);
    const [specData, setSpecData] = useState<PupilMarksForSpec | undefined>();

    const [addDlgOpen, setAddDlgOpen] = useState(false);

    const router = useRouter();

    // https://1f34-51-252-20-183.in.ngrok.io/paper-form

    
    useEffect(() => {
        const loadData = async () => {
            
            const {data, error} = await supabase.from('Spec').select("*").eq("id", 1).limit(1).single();

            error && console.error(error);

            setSpec(data);
        };

        

        setLoading(true);
        loadData();
        setCurrentSpec(1);
        setLoading(false);
        

        
    }, []);


    useEffect (() => {

      if (currentSpec == undefined || !user) return;

      const loadSpecData = async (specId:number, userId:string) =>{

        // @ts-ignore
        const {data, error} = await supabase.rpc('fn_pupil_marks_per_spec_item', {
                                                  userid: userId,
                                                  specid: specId, 
                                            })
                                            
        
        error && console.error(error);
        console.log("Data", data);  
        // @ts-ignore                                  
        setSpecData(data);

      }

      user && loadSpecData(currentSpec, user!.id);

    }, [currentSpec, user])


    const handleCheckClick = () => {

    }

    

    const handleOnAddClass = async (c:ClassParam) => {

        const {data, error} = await supabase.from("ClassMembership")
                                            .insert({classId: c!.id, pupilId: user!.id})
                                            .select();

        error && console.error(error);
        
        loadClasses!()        
        
    }


    const handleSignIn = async () => {

        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'azure',
            options: {
              scopes: 'email',
              redirectTo: process.env.NEXT_PUBLIC_SITE_REDIRECT
            },
          });

    }

    const handleSignOut = async () => {
        const {  error } = await supabase.auth.signOut();

        router.push("/goodbye")
    }

    if (loading)
        return <Loading/>

    return (
        <>
        <div className="page">
          
          
          {
            user && <div className="page-header">
            <h2>Welcome, {profile?.firstName}</h2> 
            <div>
              <Button variant="outlined" onClick={() => {setAddDlgOpen(true)}}>Join Class</Button>
              {
                user && <Button variant="outlined" onClick={handleSignOut}>Sign Out</Button>
              }

              {!user && 
                <div>
                    <h1>Question By Question (QbyQ)</h1>
                    <h3>Click here to sign in</h3>
                    <Button variant="outlined" onClick={handleSignIn}>Sign In</Button>
                </div>
              }

            </div>
            </div>
          }

          {// @ts-ignore
          <DisplayClasses classes={classes} pupilMarks={pupilMarks}/>
          }

          <AddClassDlg 
            open={addDlgOpen} 
            onClose={(v) => {setAddDlgOpen(false)}}
            onAddClass={handleOnAddClass}
            />
          
          </div>
          <style jsx={true}>{`

            .page-header {
              display : flex;
              flex-direction: row;
              justify-content: space-between;
              align-items: center;
            }

            .display-spec-heading {
              font-weight : bold;
              font-size: 1.1rem;
              font-family: 'Oswald';
              border-bottom: solid 1px silver;
              margin-bottom: 1rem;
              margin-top : 1rem;
            }

            .display-spec {
              display: grid;
              grid-template-columns : 1fr 3fr 1fr 1fr 1fr;
              font-size: 0.8rem;
              line-height: 1.5rem;
            }

            option {
              font-family: 'Poppins'
            }
          `}
          </style>
        </>
    )
}

export default MainPage;


type AddClassDlgProps = {
  open: boolean;
  onClose: (value: string) => void;
  onAddClass: (c: ClassParam) => void;
}

const AddClassDlg = ({open, onClose, onAddClass}: AddClassDlgProps) => {
  return  <Dialog open={open} onClose={onClose}>
            <DialogTitle>Adding Class</DialogTitle>
            <AddClass onAdd={onAddClass} />
          </Dialog>
}

