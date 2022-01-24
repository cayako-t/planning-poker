import React, { useEffect } from 'react';
import { useSelectUseCards } from "../../hooks/useSelectUseCards";
import supabase from '../../util/supabase';
import { Box, Modal, Typography, Button, FormGroup } from "@mui/material"
import { makeStyles } from '@mui/styles';
import { ChromePicker } from 'react-color';
import DeleteIcon from '@mui/icons-material/Delete';
import { useRecoilValue } from 'recoil';
import { member } from '../../Providers/userState';
import { DeleteModal } from './DeleteModal';

const useStyles = makeStyles({
    modalBox:{
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '500px',
        backgroundColor: '#fff',
        border: '1px solid #aaa',
        boxShadow: '24px',
        padding: '24px',
    },
    confirmBtn:{
    },
})

type SettingModalProps = {
    tableId: string;
    onClose: ()=>void;
    openSetting: boolean;
}

const SettingModal = (props: SettingModalProps) => {
    const classes = useStyles();
    const [choices, setChoices] = React.useState([]);
    const {cards} = useSelectUseCards(choices, setChoices);
    const [bgColor, setBgColor] = React.useState('');
    const members = useRecoilValue(member);
    const [openModal, setOpenModal] = React.useState(false);
    const [isCancelValid, setIsCancelValid] = React.useState(false);

    const getCurrentData = async()=>{
        try{
            const {data, error} = await supabase
                .from('tables')
                .select()
                .eq('tableId', props.tableId);
            if(error){
                throw new Error()
            } else if(data){
                setChoices(data[0].choices);
                setBgColor(data[0].bgColor)
            }
        }catch(e){
            console.error(e)
        }
    }
    useEffect(()=>{
        getCurrentData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    },[])

    const colorHandleChange = (color: any) => {
        const newColor = `rgba(${color.rgb.r},${color.rgb.g},${color.rgb.b},${color.rgb.a})`
        setBgColor(newColor);
    };

    const sendData = async() => {
        await supabase.from('tables')
        .update({'choices': choices, 'bgColor': bgColor})
        .eq('tableId', props.tableId)

        props.onClose();
    }

    const deleteTable = () => {
        (members.length > 1) ? setIsCancelValid(false) : setIsCancelValid(true);

        let oldDate = new Date();
        oldDate.setDate(oldDate.getDate() - 31)
        const theDate = oldDate.toISOString().slice(0,-1);

        const getOldTables = async()=>{
            try{
                const {data, error} = await supabase
                .from('tables')
                .select('tableId')
                .lt('updated_at', theDate)
    
                if(error){
                    throw new Error()
                }else if(data){
                    data.forEach((table)=>{
                        (async() => {
                            const tables = await supabase.from('tables')
                            .delete()
                            .eq('tableId', table.tableId)
        
                            const users = await supabase.from('users')
                            .delete()
                            .eq('tableId', table.tableId)
        
                            const results = await supabase.from('results')
                            .delete()
                            .eq('tableId', table.tableId)

                            Promise.all([tables, users, results])
                        })()
                    })
                }
            }catch(e){
                console.error(e)
            }

        }
        getOldTables()

        setOpenModal(true);
    }

    return(
        <div>
        <Modal
            open={props.openSetting}
            onClose={props.onClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box className={classes.modalBox}>
                <Typography id="modal-modal-title" variant="h6" component="h2">
                    Setting the table
                </Typography>
                <div>
                    <Typography id="modal-modal-description" sx={{ mt: 2 }}>
                        Change the card numbers
                    </Typography>
                    <FormGroup style={{display:'block'}}>
                        {cards()}
                    </FormGroup>
                </div>
                <div>
                    <Typography style={{margin:'20px 0 10px'}}>Background color</Typography>
                    <ChromePicker color={bgColor} onChange={colorHandleChange}/>
                </div>


                <Button variant='contained' className={classes.confirmBtn} style={{marginTop:'25px'}} onClick={sendData}>Confirm</Button>
                <Button variant='outlined' onClick={()=>props.onClose()} style={{marginTop:'25px', marginLeft:'15px'}}>Cancel</Button>
                <Button variant='contained' onClick={deleteTable} style={{marginTop:'25px', marginLeft:'15px', float:'right'}} color='error'><DeleteIcon style={{marginRight:'5px'}}/>Delete the table</Button>

            </Box>
        </Modal>
        {openModal && <DeleteModal isCancelValid={isCancelValid} onClose={()=>setOpenModal(false)} open={openModal} tableId={props.tableId}/>}
        </div>
    )
}
export default SettingModal