import { useQuery } from '@tanstack/react-query'
import pingServer from '../../../Apis/ping.js'

export default function usePing() {
    const {data ,isLoading , isError} = useQuery({
        queryFn: pingServer,
        queryKey: ['ping'],
        staleTime: 1000 * 60 * 5, // 5 minutes
        cacheTime: 1000 * 60 * 10, // 10 minutes
    }); 
    return {data, isLoading, isError};
};