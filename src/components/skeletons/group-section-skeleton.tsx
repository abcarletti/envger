import { Skeleton } from '../ui/skeleton'

export const GroupSectionSkeleton = () => {
	return (
		<div className="flex flex-col gap-2 w-full p-2 mt-2">
			<Skeleton className="w-full bg-primary h-7 max-w-40" />
			<Skeleton className="w-full bg-primary h-7" />
			<Skeleton className="w-full bg-primary h-7" />
		</div>
	)
}
