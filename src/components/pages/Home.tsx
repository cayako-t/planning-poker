import React from "react"
import { Button, TextField, Typography, Box } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { Link } from "react-router-dom"
import icon from '../../images/pokerIcon.png'
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    spaces:{
        margin: '30px', 
        backgroundColor:'#fff', 
        padding:'20px', 
        borderRadius:'5px'
    },
    link:{
        textDecoration:'none'
    }
});

const Home = () => {
    const classes = useStyles();
    const navigate = useNavigate();

    const enter = () => {
        const tableId = document.getElementById('tableId') as HTMLInputElement;
        if(tableId.value === '')return;
        navigate(`/playing/${tableId}`)
    }
    return(
        <div style={{textAlign:'center', backgroundColor:'#ccc', padding:'50px' }}>
            <Typography variant='h1' style={{margin: '50px'}}>Planning Poker</Typography>
            <img src={icon} alt={''}/>
            <Box className={classes.spaces}>
                <Typography variant='h3'>Generate a new table</Typography>
                <Link to='generate-table' className={classes.link}><Button variant ='contained' style={{margin: '20px',}}>Generate</Button></Link>
            </Box>
            <Box  className={classes.spaces}>
                <Typography variant='h3'>Enter to existing table</Typography>
                <TextField id="tableId" label='table ID' variant='standard' style={{margin: '15px', width: '17em'}}/>
                <Button variant ='contained' style={{display: 'block', margin: 'auto'}} onClick={enter}>Enter</Button>
            </Box>
        </div>
    )
}

export default Home