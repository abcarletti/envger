import { GROUPS_KEY } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export default function queryGetData<T>(
	key: any[],
	queryData: () => Promise<T>,
	enabled: boolean,
) {
	if (!key) {
		return {
			data: undefined,
			isLoading: false,
		}
	}
	return useQuery({
		queryKey: key,
		queryFn: queryData,
		enabled,
	})
}

export function composeGroupKey(slug: string, groupId: string) {
	return [
		GROUPS_KEY,
		{ slug: slug || 'no-slug', groupId: groupId || 'all-groups' },
	]
}
