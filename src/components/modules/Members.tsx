import React from 'react';
import Paper from '@mui/material/Paper';
import { Divider, Typography, IconButton } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import supabase from '../../util/supabase';
import { useRecoilValue } from 'recoil';
import { userState, member } from '../../Providers/userState';
import StarBorderIcon from '@mui/icons-material/StarBorder';

type MembersProps = {
  tableId: string;
}

const Members=(props: MembersProps)=>{
  const isAdmin = useRecoilValue(userState)
  const members = useRecoilValue(member);

  const deleteUser = async (name: string) => {
    await supabase
    .from('users')
    .delete()
    .match({'user': name, 'tableId': props.tableId})
  
    await supabase
    .from('tables')
    .update({ updated_at: new Date() })
    .eq('tableId', props.tableId)
  }

    return(
      <Paper elevation={3} style={{padding:'10px', margin: '50px 20px 50px 30px'}}>
        <Typography variant='h5' style={{margin:'10px 0'}}>MEMBER</Typography>
        <Divider></Divider>
        <ul style={{listStyle:'none', textAlign:'left', padding: '0 20px'}}>
          {members.map((member)=>{
          return (
            <li key={member.id} style={member.isAdmin?{padding:'5px 0', display:"flex"}:{padding:'5px 0 5px 24px', display:"flex"}}>
              {(member.isAdmin === true)&&<StarBorderIcon/>}
              <Typography>{member.user}</Typography>
              {isAdmin && 
                <IconButton style={{padding:'0', marginLeft:'15px'}} onClick={()=>deleteUser(member.user)}>
                  <CloseIcon/>
                </IconButton>
              }
            </li>
          )
          })}
        </ul>
      </Paper>
    )
}

export default Members