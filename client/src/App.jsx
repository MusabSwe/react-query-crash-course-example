import { useQuery, useMutation } from "@tanstack/react-query"

const posts = [
    { id: 1, title: "Post 1" },
    { id: 2, title: "Post 2" },
]

function App() {
    console.log(posts);
    // UseQuery syntax 
    const postQuery = useQuery({
        // key of function
        queryKey: ["posts"],
        // promise function such as fetch data from server
        queryFn: () => wait(1000).then(() => [...posts]),
    })
    const newPostMutation = useMutation({
        mutationFn: title => {
            return wait(1000).then(() =>
                posts.push({ id: crypto.randomUUID(), title })
            )
        }
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
        <button onClick={() => newPostMutation.mutate("New Post")}>
            Add a Post
        </button>
    </div>
}

function wait(duration) {
    return new Promise(resolve => setTimeout(resolve, duration))
}

export default App