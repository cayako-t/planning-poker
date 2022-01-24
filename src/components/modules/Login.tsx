import React from 'react';
import {Button, Box, Checkbox, Typography, TextField, FormControlLabel, FormGroup} from '@mui/material';
import supabase from '../../util/supabase'
import { useRecoilState, useRecoilValue } from 'recoil';
import { userState, userName, member } from '../../Providers/userState';
import {Link} from 'react-router-dom';

type LoginProps = {
    tableId?: string;
}

const Login = (props: LoginProps) => {
    const [myName, setMyName] = useRecoilState(userName);
    const [isAdmin, setIsAdmin] = useRecoilState(userState);
    const members = useRecoilValue(member);
    const [tableName, setTableName] = React.useState('');
    const [valid, setValid] = React.useState(true);

    React.useEffect(()=>{
            (async () => {
                try{
                    const {data, error} = await supabase
                        .from('tables')
                        .select('name')
                        .eq('tableId', props.tableId)
                    
                        if(data){
                            const tableName = data[0].name
                            setTableName(tableName);
                        }else if(error){
                            throw new Error()
                        }                        
                }catch(e){
                    console.error(e)
                }
            })();
    },[props.tableId])

    const checkIsAdmin = (ev: { target: { checked: any; }; }) => {
        ev.target.checked ? setIsAdmin(true) : setIsAdmin(false)
    }

    const logedinMember = 
    members.map((member)=>{
      return member.user
    })

    const sendName = async (name: string) => {
        isAdmin ?
        await supabase
        .from('users')
        .insert({'user': name, 'tableId': props.tableId, 'isAdmin': true}) :
        await supabase
        .from('users')
        .insert({'user': name, 'tableId': props.tableId})

        await supabase
        .from('tables')
        .update({ updated_at: new Date() })
        .eq('tableId', props.tableId)  
    }

    const checkPassword = async(password: String)=>{
        try{
            const {data, error} = await supabase
                .from('tables')
                .select('password')
                .eq('tableId', props.tableId)
            
                if(data){
                    const check = password === data[0].password
                    return check
                }else if(error){
                    console.error()
                }                
        }catch(e){
            console.error(e)
        }
    }

    const confirmUser = () => {
        if(isAdmin){
            const password = document.getElementById('password') as HTMLInputElement;
            checkPassword(password.value).then(check => {
                if(!check){
                    console.log('invalid password') 
                    setValid(false);
                    return;
                }
            })
        }
        const getName = document.getElementById('userName') as HTMLInputElement;
        if(myName||!getName.value||!valid||logedinMember.includes(getName)) return;
        setMyName(getName.value);
        sendName(getName.value);
    }

    return(
        <Box       
        sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
            m: 1,
            width: 100,
            },
        }}
        style={{width:'max-content', maxWidth:'100%', margin:'auto', paddingTop:'100px'}}
        >
            <Typography variant='h2' style={{width: '100%', textAlign:'center'}}><Link to={'/'} style={{textDecoration:'none', color:'#444'}}>Planning Poker</Link></Typography>
            <Typography variant="h4" component="div" sx={{ flexGrow: 1, backgroundColor:'#616161', color:'#fff' }}>
                {tableName}
            </Typography>
            <TextField id="userName" label="Type your name" variant="outlined" style={{width: '40%', margin:'20px 30% 10px', backgroundColor:'#fff', borderRadius:'5px'}}/>
            <FormGroup style={{width: '100%', display:'block'}}>
                <FormControlLabel control={<Checkbox onChange={checkIsAdmin} checked={isAdmin}/>} label="login as admin" />
            </FormGroup>
            {isAdmin && <TextField id="password" label="Input password for admin" variant="outlined" style={{width: '40%', margin:'10px 30% 20px', backgroundColor:'#fff', borderRadius:'5px'}}/>}
            <Button 
            variant="contained" 
            style={{margin: '10px auto', backgroundColor:'#616161'}}
            onClick={confirmUser}
            >
                ENTER
            </Button>
        </Box>
    )
}

export default Login;