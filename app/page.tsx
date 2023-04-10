"use client"

import Link from 'next/link';
import React, { useContext } from 'react'
import {useState, useEffect} from 'react';

import supabase from '../components/supabase';
import { PupilMarksForSpec, Specs, Spec, Paper } from 'types/alias';
import { UserContextType, UserContext } from 'components/context/user-context';
import { Profile } from 'types/alias';
import { useRouter } from 'next/navigation'
// import { Button } from 'primereact/button';
import Button from '@mui/material/Button';
 

import { Class } from 'types/alias';
import AddClass, {OnAddHandler} from 'components/add-class';
import { GetClassesResponseType } from 'lib';
import DisplayClasses from 'components/display-classes';
import Loading from 'components/loading';

import { TabView, TabPanel } from 'primereact/tabview';
import { Dropdown } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';

import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import {DateTime} from 'luxon';

import { useFilePicker } from 'use-file-picker';

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
    const [showCreatePaperDlg, setShowCreatePaperDlg] = useState(false);

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

    const handleOnCreatePaper = async () => {

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
          {!user && 
                <div>
                    
                    <h3>Click here to sign in</h3>
                    <Button variant="outlined" onClick={handleSignIn}>Sign In</Button>
                </div>
          }
          
          {
            user && <div className="page-header">
            <h2>Welcome, {profile?.firstName}</h2> 
            <div>
              <Button variant="outlined" onClick={() => {setAddDlgOpen(true)}}>Join Class</Button>
              
              {
                profile && profile.isAdmin && <Button  variant="outlined" onClick={()=> {setShowCreatePaperDlg(true)}}>Create Paper</Button>
              }
              
              {
                user && <Button variant="outlined" onClick={handleSignOut}>Sign Out</Button>
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

          <CreatePaperDlg 
            open={showCreatePaperDlg}
            onClose={()=> {setShowCreatePaperDlg(false)}}
            onCreatePaper={()=>{}}
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



type CreatePaperDlgProps = {
  open: boolean;
  onClose: () => void;
  onCreatePaper: (p: Paper) => void;
}

const CreatePaperDlg = ( {open, onClose, onCreatePaper} : CreatePaperDlgProps) => {
      const [title, setTitle] = useState('');
      const [year, setYear] = useState('');
      const [month, setMonth] = useState('');
      const [paper, setPaper] = useState('');
      const [availableDate, setAvailableDate] = useState(DateTime.now());
      const [completeDate, setCompleteDate] = useState(DateTime.now().plus({days: 7}));
      const [markByDate, setMarkByDate] = useState(DateTime.now().plus({days: 8}));
      const [status, setStatus] = useState('not ready');
      const [specId, setSpecId] = useState<number | null>(null);
      const [marks, setMarks] = useState<number | null>(0);
      const {specs} = useContext<UserContextType>(UserContext);
      

      const [openFileSelector, { filesContent, loading }] = useFilePicker({
        accept: '.pdf',
      });

      const handleFileOpen = async () => {

        try {
          // you can also get values directly from the openFileSelector
          const result = openFileSelector();
          
        } catch (err) {
          console.log(err);
          console.log('Something went wrong or validation failed');
        }
      }


      const handleOnCreatePaper = async () => {
      
        setStatus("Creating Paper")
        
        const {data: createPaperData, error: createPaperError} = await supabase.from("Papers")
                                                                .insert({
                                                                  month: month, 
                                                                  year: year,
                                                                  marks: marks,
                                                                  title: title,
                                                                  specId: specId})
                                                                .select();

        createPaperError && console.error(createPaperError);

        if (!createPaperData) return;

        console.log("CreatePaperData", createPaperData);

        setStatus(`Created paper ${createPaperData[0].id}`);

        /*
        const uploadFile = e.target.files[0];
        const {data, error} = await supabase
                                        .storage
                                        .from('exam-papers')
                                        .upload(`/${user!.id}/${paperId}/${uploadFile.name}`, uploadFile, {
                                            cacheControl: '3600',
                                            upsert: false
                                            });
        */
           
        
        for (const file of filesContent){

          const {data: fileUploadData, error:fileUploadError} = await supabase.storage.from("exam-papers")
                                  .upload(`/0-test-${createPaperData[0].id}/${file.name}`,file);
          
          
          fileUploadError && console.error(fileUploadError); 

          if (fileUploadData){
            console.log("Upload Data", fileUploadData)
          }

        }
        
        // onCreatePaper && onCreatePaper(p);
      }

      useEffect(()=> {
        specs && setSpecId(specs[0].id);
      }, [specs])
      useEffect (()=> {
        console.log("Checking")
        if (title !== '' && 
            year !== '' && 
            month !== '' && 
            paper !== '' && 
            filesContent.length > 0) {
          setStatus('valid')
        }

      }, [title, year, month, paper])

      return  <>
                <Dialog open={open} onClose={onClose}>
                <DialogTitle>Creating a Paper</DialogTitle>
                <DialogContent>
                  <DialogContentText>Creating a new Paper</DialogContentText>
                  <div className="form-layout">
                    <TextField
                      label="Year"
                      value={year}
                      size="small"
                      onChange={(e:any) => {setYear(e.target.value);}}
                    />

                    <TextField
                      label="Month"
                      value={month}
                      size="small"
                      onChange={(e:any) => {setMonth(e.target.value);}}
                    />
                  
                    <TextField
                      label="code"
                      value={paper}
                      size="small"
                      onChange={(e:any) => {setPaper(e.target.value);}}
                    />

                    <TextField
                      label="Title"
                      value={title}
                      size="small"
                      onChange={(e:any) => {setTitle(e.target.value);}}
                    />
                    <TextField
                      label="Marks"
                      value={marks}
                      size="small"
                      onChange={(e:any) => {setMarks(e.target.value);}}
                    />
                  
                  
                    <Select value={specId?.toString()} onChange={(v: SelectChangeEvent) => setSpecId(parseInt(v.target.value))}>
                      {
                        specs && specs.map((s:Spec, i) => <MenuItem key={i} value={s.id}>{s.title}</MenuItem>)
                      }
                    </Select>
                  
                </div>

                <div>
                    <Button onClick={handleFileOpen}>Select Files</Button>
                    <ul >
                    {
                    filesContent.map((file, index) => (
                        <li key={index}>{file.name}</li>
                    ))
            
                    }
                    </ul>
                </div>

                <div>{status}</div>
      
                </DialogContent>
                <DialogActions>
                  <Button onClick={onClose}>Cancel</Button>
                  <Button 
                    disabled={status !== 'valid'} 
                    onClick={handleOnCreatePaper}>Create</Button>
                </DialogActions>
              </Dialog>
              <style jsx={true}>{`
                .form-layout {
                  display : grid;
                  grid-template-columns: 1fr;
                  grid-gap: 1rem;
                  flex-direction: column;
                }

                .form-layout > * {
                  margin: 1rem;
                }
              `}
              </style>
              </>
}

