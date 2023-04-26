import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const posts = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
]
// /posts -> ["posts"]
// /posts/1 -> ["posts", post.id]
// /posts/?authorId=1 -> ["posts", {authorId: 1}]
// /posts/2/comments -> ["posts", post.id, "comments"]

function App() {
    // used to access the states in the queries and handle posts when I click add a post
    const queryClient = useQueryClient();
    // UseQuery syntax 
    const postQuery = useQuery({
        // key of function
        queryKey: ["posts"],
        // promise function such as fetch data from server
        queryFn: (obj) => wait(1000).then(() => {
            console.log(obj)
            return [...posts]
        })
    })

    // UseMutation to change fetched query
    const newPostMutation = useMutation({
        mutationFn: title => {
            return wait(1000).then(() =>
                posts.push({ id: crypto.randomUUID(), title })
            )
        },
        // if I have a successful mutation of data what should I do
        onSuccess: () => {
            // used to display mutation data in the page for each refresh in the 
            // reactQueryDevtools
            queryClient.invalidateQueries(["posts"])
        },
    })

    // UseQuery validation
    if (postQuery.isLoading) return <h1>Loading...</h1>
    if (postQuery.isError) {
        return <pre>{JSON.stringify(postQuery.error)}</pre>
    }
    // UseQuery returned data
    return <div>
        {postQuery.data.map(post => (
            <div key={post.id}>{post.title}</div>
        ))}
        {/* invokbe mutation to add posts */}
        <button disabled={newPostMutation.isLoading} onClick={() => newPostMutation.mutate("New Post")}>
            Add a Post
        </button>
    </div>
}

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export default App