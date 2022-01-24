import supabase from '../util/supabase';
import { useRecoilState } from 'recoil';
import { result } from '../Providers/userState';


export const useGetResults=(
    setIsSent: React.Dispatch<React.SetStateAction<boolean>>, tableId: string | undefined
    )=>{
    const [results, setResults] = useRecoilState(result);

    const getResult = async()=>{
        try{
            const {data, error} = await supabase
            .from('results')
            .select()
            .eq('tableId', tableId)
    
            if(data){
                setResults(data)
                data.length === 0 && setIsSent(false)
            } else if(error) {
                throw new Error();
            }
        }catch(e){
            console.error(e);
        }
    }

      return{ getResult, results }
}