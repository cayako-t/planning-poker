import * as React from 'react';
import {Button, Dialog, DialogContent, DialogActions} from '@mui/material';
import supabase from '../../util/supabase';
import { useNavigate } from "react-router-dom";

type DeleteModalProps = {
    tableId: string;
    isCancelValid: boolean;
    open: boolean;
    onClose: ()=>void;
}

export const DeleteModal = (props: DeleteModalProps) => {
    const navigate = useNavigate();

    const deleteThisTable = async() => {
        const table = await supabase
        .from('tables')
        .delete()
        .eq('tableId', props.tableId)

        const users = await supabase
        .from('users')
        .delete()
        .eq('tableId', props.tableId)

        const results = await supabase
        .from('results')
        .delete()
        .eq('tableId', props.tableId)

        await Promise.all([table, users, results]);

        navigate('/')
    }

    return(
        props.isCancelValid ?
        <Dialog open={props.open}>
            <DialogContent>
            Are you sure you want to delete the table? You will not be able to restore the table any more.
            </DialogContent>
            <DialogActions>
                <Button onClick={deleteThisTable} color='error'>Delete</Button>
                <Button onClick={props.onClose} variant='outlined'>Cancel</Button>
            </DialogActions>
        </Dialog>
        :
        <Dialog open={props.open}>
            <DialogContent>
            There are other logged in users in this table. Make sure that no one except you is in the table.
            </DialogContent>
            <DialogActions>
                <Button onClick={props.onClose} variant='outlined'>OK</Button>
            </DialogActions>
        </Dialog>
    )
}