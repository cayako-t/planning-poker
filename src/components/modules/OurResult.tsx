import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Paper from '@mui/material/Paper';
import supabase from '../../util/supabase';
import {useGetResults} from '../../hooks/useGetResults';
import { useRecoilValue } from 'recoil';
import { member, result } from '../../Providers/userState';

type OurResultProps = {
    setIsSent: React.Dispatch<React.SetStateAction<boolean>>;
    tableId: string;

}

const OurResult = (props: OurResultProps) => {
    const {getResult} = useGetResults(props.setIsSent, props.tableId)
    const members = useRecoilValue(member);
    const results = useRecoilValue(result);
    

    useEffect(()=>{
        getResult()

        const porkerResult = supabase
        .from(`results:tableId=eq.${props.tableId}`)
        .on('*', payload => {
            getResult()
        })
        .subscribe()

        const checkUpdate = supabase
        .from(`tables:tableId=eq.${props.tableId}`)
        .on('*', payload => {
            getResult()
        })
        .subscribe()
        
        return () => {
            porkerResult.unsubscribe();        
            checkUpdate.unsubscribe();        
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return(
        <ul style={{margin:'initial', padding:'initial', height:'initial', width:'initial'}}>
            {
            results.map((result) => {
                return(
                    <li key={result.id} style={{width:'116px', height:'initial', margin:'initial', listStyleType:'none'}}>
                        <Box style={{ margin:'20px 8px', height:'auto'}}>
                        <Typography style={{color: '#333', minHeight: '50px'}}>{result.name}</Typography>
                        <Paper 
                        elevation={3} 
                        style={results.length !== members.length ? {fontSize:'30px', lineHeight: '128px', backgroundColor:'#aaa'} : {fontSize:'30px', lineHeight: '128px', }} 
                        >
                            <Typography 
                            variant='h4' 
                            style={results.length !== members.length ? {display: 'contents', color:'#aaa'} : {display: 'contents'}}
                            >
                                {result.number}
                            </Typography>             
                        </Paper>
                        </Box>
                    </li>
                )
            })
            }
        </ul>
    )
}

export default OurResult