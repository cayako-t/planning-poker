import { TextField, Typography, Button, FormGroup, Divider } from "@mui/material"
import React from "react"
import { makeStyles } from '@mui/styles';
import { ChromePicker } from 'react-color';
import supabase from "../../util/supabase";
import { useNavigate } from "react-router-dom";
import { useSetRecoilState } from 'recoil';
import { userState, userName } from '../../Providers/userState';
import { useSelectUseCards } from "../../hooks/useSelectUseCards";

const useStyles = makeStyles({
    div:{
        margin:'20px',
    },
    divHorizon:{
        display:'inline-flex',
    },
    TextField:{
        '& div':{
            marginLeft:'10px',
        },
        '& input':{
        }
    },
    fieldTitle:{
        padding: '10px'
    },
    btn:{
        display:'block',
    }
});

const CreateTable = () => {
    const classes = useStyles();
    const [roomName, setRoomName] = React.useState('');
    const [choices, setChoices] = React.useState(['1', '2', '3', '5', '8']);
    const [bgColor, setBgColor] = React.useState('rgba(255,255,255,1)');
    const [admin, setAdmin] = React.useState('');
    const [password, setPassword] = React.useState('');
    const navigate = useNavigate();
    const {cards} = useSelectUseCards(choices, setChoices);
    
    const setMyName = useSetRecoilState(userName)
    const setIsAdmin = useSetRecoilState(userState)

    const colorHandleChange = (color: any) => {
        const newColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        setBgColor(newColor);
    };

    const generatePath = () => {
        const l = 10;
        const c = "abcdefghijklmnopqrstuvwxyz0123456789";
        const cl = c.length;
        let r = '';
        for(let i=0; i<l; i++){
            r += c[Math.floor(Math.random()*cl)];
        }
        const date = new Date();
        const path = `${date.getSeconds()}${date.getMinutes()}${date.getHours()}${date.getFullYear()}${date.getMonth()+1}${r}${date.getDate()}`
        return path;
    }

    const sendInfo = async() => {
        if(roomName === ''|| choices.length < 3 || admin === '' || password === ''){return console.log('returned')}

        const path = generatePath();
        const date = new Date();

        await supabase.from('tables')
        .insert({'name': roomName, 'tableId': path, 'created_at': date, 'choices': choices, 'bgColor': bgColor, 'password': password})

        await supabase.from('users')
        .insert({'user': admin, 'tableId': path, 'isAdmin': true})

        setMyName(admin)
        setIsAdmin(true)

        navigate(`/playing/${path}`)
    }

    return(
        <div className="App" style={{margin:'30px'}}>
                <Typography variant="h2">Generate a Table</Typography>
                <Divider style={{margin:'30px 0'}}/>

            <div className={`${classes.div} ${classes.divHorizon}`}>
                <Typography className={classes.fieldTitle}>Table name *</Typography>
                <TextField className={classes.TextField} onChange={(ev)=>{setRoomName(ev.target.value)}}/>
            </div>
            <div className={classes.div}>
                <Typography className={classes.fieldTitle}>Choose card numbers</Typography>
                <FormGroup style={{display:'block'}}>
                    {cards()}
                </FormGroup>
            </div>
            <div>
                <div className={`${classes.div} ${classes.divHorizon}`}>
                    <Typography className={classes.fieldTitle}>Background color</Typography>
                    <ChromePicker color={bgColor} onChange={colorHandleChange}/>
                </div>
            </div>
            <div>
                <div className={`${classes.div} ${classes.divHorizon}`}>
                    <Typography className={classes.fieldTitle}>Password for Admin User *</Typography>
                    <TextField className={classes.TextField} onChange={(ev)=>{setPassword(ev.target.value)}} label='password' />
                </div>
            </div>
            <div>
                <div className={`${classes.div} ${classes.divHorizon}`}>
                    <Typography className={classes.fieldTitle}>Default Admin User *</Typography>
                    <TextField className={classes.TextField} onChange={(ev)=>{setAdmin(ev.target.value)}} label='type your name'/>
                </div>
            </div>

            <Divider style={{margin:'30px 0 10px'}}/>
            <Typography style={{margin:'20px auto', width:'50%', textAlign:'center'}}>If the table will not be used for more than one month, the table will be deleted automatically.</Typography>
            <Button className={classes.btn} variant="contained" onClick={sendInfo}>Generate table</Button>
        </div>
    )
}

export default CreateTable