import React from 'react';
import Box from '@mui/material/Box';
import { ReactNode } from 'react';

type AreaProps = {
  children: ReactNode;
}

const Area=(props: AreaProps)=>{
    return(
      <Box       
      sx={{
        display: 'flex',
        flexWrap: 'wrap',
        '& > :not(style)': {
          m: 1,
          width: 100,
          height: 128,
          },
        }}
      style={{width:'max-content', maxWidth:'100%', margin:'auto', minHeight: '180px'}}
      >
        {props.children}
      </Box>
    )
}

export default Area