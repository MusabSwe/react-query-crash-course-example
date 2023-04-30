import { useQuery } from "@tanstack/react-query"
import { useState } from "react"
import { getPostsPaginated } from "./api/posts"

export function PostListPaginated() {
    const [page, setPage] = useState(1)

    const { status, error, data, isPreviousData } = useQuery({
        queryKey: ["posts", { page }],
        // means when fetch data keep it in the client local store
        // and when return back to the prev data we do not need to fetch it again from
        // the server
        // as we see in this example we fetch data when we click next page until we 
        // reach last page as a result the data of all pages store in the client
        // so we click prev page we do not need fetch the data again from the server
        // as a result, will improve UX
        keepPreviousData: true,
        queryFn: () => getPostsPaginated(page),
    })

    if (status === "loading") return <h1>Loading...</h1>
    if (status === "error") return <h1>{JSON.stringify(error)}</h1>

    return (
        <>
            <h1>
                Post List Paginated
                <br />
                <small>{isPreviousData && "Previous Data"}</small>
            </h1>
            {data.posts.map(post => (
                <div key={post.id}>{post.title}</div>
            ))}
            {data.previousPage && (
                <button onClick={() => setPage(data.previousPage)}>Previous</button>
            )}{" "}
            {data.nextPage && (
                <button onClick={() => setPage(data.nextPage)}>Next</button>
            )}
        </>
    )
}