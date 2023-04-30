import { useMutation, useQueryClient } from "@tanstack/react-query"
import { useRef } from "react"
import { createPost } from "./api/posts"
import Post from "./Post"

export function CreatePost({ setCurrentPage }) {
    const titleRef = useRef();
    const bodyRef = useRef();
    // useQueryClient used to make a specific key fresher live data after 
    // we add post not waiting the entire app update
    const queryClient = useQueryClient();

    // createPostMutation invoked when click on the create button
    const createPostMutation = useMutation({
        mutationFn: createPost,
        // Important comments
        // variables -> are the variables of the form that
        // we will send to the server
        // which are title and body
        // onSuccess: (data, variables, context) => {
        //     // here context is the return in the onMutate
        //     console.log(context)
        // },

        onSuccess: (data) => {
            // immediate update ["posts"] key after we submit data
            // to make the posts up to date
            // queryClient.setQueryData called manually updates the cache
            queryClient.setQueryData(["posts", data.id], data);
            // immediate update ["posts"] key after we submit data
            // to make the posts up to date
            // 2nd param { exact: true } means only update ["posts"] key
            // if without { exact: true } will also updates any key has ["posts"] key with value
            // Example in the post page the key is ["posts", 1] which update so we add { exact: true }
            // to avoid update  ["posts", 1] key
            queryClient.invalidateQueries(["posts"], { exact: true })
            // to redirect you to the page with the entered values in the form of title & body
            setCurrentPage(<Post id={data.id} />)
        }

        // onMutate is useful when you want to do something 
        // before mutation function
        // or to set some data in your context
        // onMutate: variables => {
        //     return { hi: "Bye" }
        // },
    })



    function handleSubmit(e) {
        e.preventDefault()
        createPostMutation.mutate({
            title: titleRef.current.value,
            body: bodyRef.current.value,
        })
    }

    return (
        <div>
            {createPostMutation.isError && JSON.stringify(createPostMutation.error)}
            <h1>Create Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="title">Title</label>
                    <input id="title" ref={titleRef} />
                </div>
                <div>
                    <label htmlFor="body">Body</label>
                    <input id="body" ref={bodyRef} />
                </div>
                <button disabled={createPostMutation.isLoading}>
                    {createPostMutation.isLoading ? "Loading..." : "Create"}
                </button>
            </form>
        </div>
    )
}