import React, { useState, useEffect, useCallback } from 'react';
import { Button, Typography, Grid, Box, IconButton, Toolbar, AppBar, TextField } from '@mui/material';
import supabase from '../../util/supabase';
import OurResult  from '../modules/OurResult';
import MyCards from '../modules/MyCards'
import Members from '../modules/Members';
import Area from '../modules/Area';
import { useBeforeunload } from 'react-beforeunload';
import {useParams} from 'react-router-dom';
import {useGetResults} from '../../hooks/useGetResults';
import {useReset} from '../../hooks/useReset';
import NoTable from '../modules/NoTable';
import Loading from '../modules/Loading';
import Login from '../modules/Login';
import SettingModal from '../modules/SettingModal';
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, userName, member, result } from '../../Providers/userState';
import { makeStyles } from '@mui/styles';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import SettingsIcon from '@mui/icons-material/Settings';

function PlayingTable() {
  const {tableId} = useParams();
  const [isTable, setIsTable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [myChoice, setMyChoice] = useState('');
  const [isSent, setIsSent] = useState(false)
  const {getResult} = useGetResults(setIsSent, tableId);
  const {reset} = useReset(tableId!);
  const [backgroundColor, setBackgroundColor] = useState('');
  const [openSetting, setOpenSetting] = useState(false);
  const [tableName, setTableName] = useState('');

  const [myName, setMyName] = useRecoilState(userName)
  const [isAdmin, setIsAdmin] = useRecoilState(userState)
  const results = useRecoilValue(result)
  const [members, setMembers] = useRecoilState(member);

  const useStyles = makeStyles({
    container:{
      width: '100%', 
      height: '100vh', 
      maxHeight: '100%', 
      position:'absolute',
      bottom: 0,
      backgroundColor: backgroundColor,
    },
    app:{
      backgroundColor: backgroundColor,
    },
    iconBtn:{
      position:'fixed', 
      right:'30px', 
      top:'20px', 
      width:'24px', 
      height:'24px',
      '& > path':{
        color:'#fff',
      }
    },
    settingIcon:{
      position:'fixed',
      right: '30px',
      top: '20px',
      zIndex:'2000'
    },
    idField:{
      backgroundColor: '#fff',
      borderRadius:'5px',
      marginLeft:'30px !important',
      width: '250px'
    },
    header:{
      backgroundColor: '#444 !important'
    },
    copyIcon:{
      marginLeft:'5px',
      '& :hover':{
        cursor:'pointer',
      }
    },
    outlineBtn:{
      borderColor:'#444 !important',
      color: '#444 !important',
      backgroundColor: 'rgba(255, 255, 255, 0.5) !important'
    },
    myNameBox:{
      width:'max-content', 
      textAlign:'center', 
      border: "#888 1px solid", 
      padding:'5px 15px', 
      color:'#444', 
      borderRadius:'5px',
      backgroundColor: 'rgba(255, 255, 255, 0.8)'
    }
  })
  const classes = useStyles();

  const checkTable = async() => {
    try{
      const tables = (
        await supabase.from('tables')
        .select('tableId')
      ).data;
      tables && setIsTable(tables.some(item => item.tableId === tableId))
      setIsLoading(false);
    }catch(e){
      console.error(e)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const getTableName = async() => {
    try{
      const {data, error} = 
      await supabase.from('tables')
      .select('name')
      .eq('tableId', tableId);
      if(error){
        throw new Error();
      }else if(data){
        isTable && setTableName(data[0].name);
      }
    }catch(error){
      console.error(error)
    }
  }

  useEffect(()=>{
    getTableName()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[myName, isLoading])

  const setBgColor = useCallback(async() => {
    const bgColor = (
      await supabase.from('tables')
      .select('bgColor')
      .eq('tableId', tableId)
    ).data
    bgColor && setBackgroundColor(bgColor[0].bgColor)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  useEffect(()=>{
    isTable && setBgColor();
  },[isTable, setBgColor])

  const getMembers = async() => {
    const theMembers = (
      await supabase.from("users")
      .select()
      .eq('tableId', tableId)
      ).data;
    theMembers && setMembers(theMembers);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }

  const checkNames = members.map((member: { user: string; }) => member.user)
  const checkMyName = checkNames.includes(myName)
  useEffect(()=>{
    const checkIfLogin = () => {
      if(isTable && !checkMyName){
        setMyName('');
      }  
    }
      checkIfLogin()
  },[checkMyName, isTable, setMyName])

  useEffect(()=>{
    checkTable();
    (members.length < 1) && reset()
    getMembers()
    const insertMembers = supabase
    .from(`users:tableId=eq.${tableId}`)
    .on('*', payload => {
      getMembers()
    })
    .subscribe();

    const checkUpdate = supabase
    .from(`tables:tableId=eq.${tableId}`)
    .on('*', payload => {
        getMembers()
        setBgColor()
    })
    .subscribe()

    return () => {
        insertMembers.unsubscribe();
        checkUpdate.unsubscribe();
      }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  },[])
  
  const sendChoice = async () => {
    await supabase
    .from('results')
    .insert([
      {'name': myName, 'number': myChoice, 'tableId': tableId},
    ])
  }

  const checkIfISent = () => {
    const checkSentMember = results.map((result) => result.name)
    const checkIsSent = checkSentMember.includes(myName)
    checkIsSent ? setIsSent(true): setIsSent(false)
  }

  const logout = () => {
    const deleteMeAsUser = async () => {
      await supabase
      .from('users')
      .delete()
      .match({'user': myName, 'tableId': tableId})
  
      await supabase
      .from('tables')
      .update({ updated_at: new Date() })
      .eq('tableId', tableId)
    }  
    deleteMeAsUser()
    setMyName('');
    setIsAdmin(false);
  }

  useBeforeunload((event: { preventDefault: () => void; }) => {
    logout()
    event.preventDefault();
  });

  const reload = () => {
    getMembers()
    getResult()
    checkIfISent()
    setBgColor()
  }
  
  if(isLoading===true){
    return <Loading/>
  } else if(isTable===false){
    return <NoTable/>
  } else if (!myName){
    return <div className={classes.container}><div className={`App ${classes.app}`}><Login tableId={tableId}/></div></div>
  } else {
    return (
      <div className={classes.container}>
        <div className={`App ${classes.app}`}>
          <AppBar className={classes.header}>
            <Toolbar>
              <Typography>{tableName}</Typography>
              <TextField
                id="outlined-read-only-input"
                label="Table ID"
                defaultValue={tableId}
                InputProps={{
                  readOnly: true,
                }}
                className={classes.idField}
                variant='filled'
              ></TextField>
              <CopyToClipboard text={tableId!} onCopy={()=>{}} >
                <IconButton className={classes.copyIcon}>
                  <ContentCopyIcon sx={{color: '#fff'}}/>
                </IconButton>
              </CopyToClipboard>
            </Toolbar>
          </AppBar>
          <Grid 
          container 
          spacing={2} 
          style={{paddingTop:'30px'}}
          >
            {isAdmin && 
            <IconButton 
            style={{position:'absolute'}} 
            className={classes.iconBtn} 
            onClick={()=>{
              setOpenSetting(true)
            }}>
              <SettingsIcon className={classes.settingIcon} sx={{color: '#fff'}}/>
            </IconButton>
            }
            <SettingModal openSetting={openSetting} onClose={()=>{setOpenSetting(false)}} tableId={tableId!}/>
            <Grid item md={3} style={{marginTop:'64px'}}>
              {isAdmin && 
                <Button 
                variant="outlined" 
                color="primary" 
                style={{marginTop: '50px'}} 
                onClick={reset}
                className={classes.outlineBtn}
                >
                  Reset
                </Button>
              }
              <br/>
              <Button 
              variant="outlined" 
              color="primary" 
              style={{marginTop: '20px'}} 
              onClick={reload}
              className={classes.outlineBtn}
              >
                reload
              </Button>
              <Members
              tableId={tableId!}
              />
            </Grid>
    
            <Grid item md={9} style={{marginTop:'64px'}}>
              <Area>
                <OurResult 
                setIsSent = {setIsSent}
                tableId={tableId!}
                // key='ourResult'
                />
              </Area>
    
              <Button 
              variant="contained" 
              color="primary" 
              style={{margin: '20px', backgroundColor:'#616161'}} 
              disabled={!myName || isSent}
              onClick={()=>{
                myName && myChoice && sendChoice()
                setIsSent(true)
    
              }}
              >
                Send
              </Button>
    
              <Area       
              >
                <MyCards
                myChoice={myChoice}
                onClick = {(e: any) => setMyChoice(e.target.textContent)}
                tableId={tableId}
                />
              </Area>
              {myName &&
                  <Box style={{width:'100%', marginBottom: '50px'}}>
                    <Typography style={{margin:'0 auto'}} className={classes.myNameBox}>
                      {myName}
                    </Typography>
                    <Button onClick={logout}>log out</Button>
                  </Box>
                }
            </Grid>
          </Grid>
        </div>
      </div>
    )
  }
}

export default PlayingTable;