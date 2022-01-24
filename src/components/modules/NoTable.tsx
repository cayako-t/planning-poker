import { Typography, Box } from '@mui/material';
import React from 'react';
import {Link} from 'react-router-dom';
import MoodBadIcon from '@mui/icons-material/MoodBad';
import { makeStyles } from '@mui/styles';
import icon from '../../images/pokerIcon.png'

const useStyles = makeStyles({
    container:{
        marginTop:'50px'
    },
    texts:{
        fontSize:'40px',
    },
    icon:{
        width:'150px'
    },
    box:{
        backgroundColor:'#ddd',
        padding: '30px',
        margin: '20px auto',
        maxWidth: '500px'
    }
})

const NoTable = () => {
    const classes = useStyles();

    return(
        <div className={`App ${classes.container}`}>
            <Link to='/'><img src={icon} alt={''} className={classes.icon}/></Link>
            <Typography className={classes.texts}>Sorry, no table with this URL or ID...</Typography>
            <MoodBadIcon sx={{ fontSize: 40 }} />
            <Typography className={classes.texts}>You can generate new table from <Link to='/generate-table'>here.</Link></Typography>
            <Typography className={classes.texts}>Or go to <Link to='/'>home.</Link></Typography>

            <Box className={classes.box}>
                <Typography className={classes.texts}>If you didn't use your table for long time, the table is automatically deleted.</Typography>
                <Typography className={classes.texts}>In case, <Link to='/generate-table'>generate new table</Link> again.</Typography>
            </Box>
        </div>
    )
}

export default NoTable;