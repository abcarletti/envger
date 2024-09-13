import { GROUPS_KEY } from '@/lib/constants'
import { useQuery } from '@tanstack/react-query'

export default function queryGetData<T>(
	queryKey: any[],
	queryFn: () => Promise<T>,
	enabled: boolean,
) {
	if (!queryKey) {
		return {
			data: undefined,
			isLoading: false,
		}
	}
	return useQuery({
		queryKey,
		queryFn,
		enabled,
	})
}

export function composeGroupKey(slug: string, groupId: string) {
	return [
		GROUPS_KEY,
		{ slug: slug || 'no-slug', groupId: groupId || 'all-groups' },
	]
}
