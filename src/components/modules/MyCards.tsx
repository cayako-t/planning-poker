import React, { useEffect } from 'react';
import Paper from '@mui/material/Paper';
import supabase from '../../util/supabase';

type MyCardsProps = {
    tableId?: string;
    myChoice: string;
    onClick: (e: any) => void
}

const MyCards = (props: MyCardsProps) => {
    const [choices, setChoices] = React.useState([]);
    const getChoices = async()=>{
        try {
            let { data, error } = await supabase
            .from('tables')
            .select()
            .eq('tableId', props.tableId)
            if(error) {
                throw new Error()
            } else if(data) {
                setChoices(data[0].choices)
            }
        } catch(error) {
            console.error(error)
        }
    }
    useEffect(()=>{
        getChoices();
        const checkUpdate = supabase
        .from(`tables:tableId=eq.${props.tableId}`)
        .on('*', payload => {
            getChoices()
        })
        .subscribe()
    
        return () => {
            checkUpdate.unsubscribe();
          }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])



    
    return(
        <>
        {
        choices.map((card) => {
            return(
                <Paper 
                elevation={3} 
                style={{fontSize:'30px', lineHeight: '128px', cursor:'pointer', backgroundColor: props.myChoice === card ?'#ccc': '#fff' }} 
                key={card} 
                onClick={props.onClick}
                >
                {card}
                </Paper>
            )
            })
        }
        </>
        )
}

export default MyCards