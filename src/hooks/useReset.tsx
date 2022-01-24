import supabase from '../util/supabase';

export const useReset= (tableId: string) => {
    const reset = async () => {
        await supabase.from('results')
        .delete()
        .eq('tableId', tableId)

        await supabase
        .from('tables')
        .update({ updated_at: new Date() })
        .eq('tableId', tableId)
    }


    return {reset}    
}