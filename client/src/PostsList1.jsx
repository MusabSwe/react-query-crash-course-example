import { useQuery } from "@tanstack/react-query";
import { getPosts } from './api/posts';

export default function PostsList1() {
    const postsQuery = useQuery({
        queryKey: ["posts"],
        queryFn: getPosts,
        // Every 1s refetch data from the server (Live data)
        // refetchInterval: 1000
    })

    if (postsQuery.status === "loading") return <h1>Loading...</h1>
    if (postsQuery.status === 'error') return <h1>{JSON.stringify(postsQuery.error)}</h1>

    return (
        <div>
            <h1>Post List 1</h1>
            <ol>
                {postsQuery.data.map(post => (
                    <li key={post.id}>{post.title}</li>
                ))}
            </ol>
        </div>
    )
}