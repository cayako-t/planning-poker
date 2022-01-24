import React from 'react';
import { FormControlLabel, Switch } from "@mui/material"

export const useSelectUseCards = (choices: string[], setChoices: any) => {
    const makeChoices = ['1', '2', '3', '5', '8', '13', '21', '34'];
  
    const cards = () => {
        return(
            makeChoices.map((choice)=>{
                let checked;
                if (choices.includes(choice)){
                    checked = true
                } else {
                    checked = false
                }
                return <TheCard choice={choice} checked={checked} choices={choices} setChoices={setChoices} key={choice}/>
            })
        )
    }

    return {cards}
}

type theCardProps = {
    choice: string;
    checked: boolean;
    choices: string[];
    setChoices: any;
    // setChoices: React.SetStateAction<string[]>;
}

const TheCard = (props: theCardProps) => {
    const [checked, setChecked] = React.useState(props.checked);
    const choicesHandleChange = (event: { target: { checked: boolean; value: string; }; }) => {
        const copyChoices = props.choices.slice();
        if(event.target.checked === true){
            copyChoices.push(event.target.value);
        }else{
            const val = copyChoices.indexOf(event.target.value);
            if (val >= 0){
                copyChoices.splice(val, 1);
            }
        }
        copyChoices.sort(function(a:any, b:any){return a - b;})
        props.setChoices(copyChoices);
        setChecked(!checked);
    }

    return(
        <>
        <FormControlLabel control={<Switch checked={checked} value={props.choice} onChange={choicesHandleChange}/>} label={props.choice} labelPlacement="top" style={{margin: 0}}  key={props.choice}/>
        </>
    )
}