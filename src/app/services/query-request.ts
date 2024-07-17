import { useQuery } from '@tanstack/react-query'

export default function queryGetData(
	key: string[],
	queryData: () => Promise<any>,
) {
	return useQuery({
		queryKey: key,
		queryFn: queryData,
	})
}
