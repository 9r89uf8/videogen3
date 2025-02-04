export const createPostsSlice = (set) => ({
    posts: [],

    // Function to set the entire posts array
    setPosts: (posts) => set({ posts }),

    // Function to clear all posts by resetting to an empty array
    clear: () => set({ posts: [] }),

    // Function to update a single post within the posts array
    updatePost: (updatedPost) => set((state) => ({
        posts: state.posts.map((post) =>
            post.id === updatedPost.id ? { ...post, ...updatedPost } : post
        ),
    })),
    // Function to delete a single post by its ID
    deletePost: (postId) => set((state) => ({
        posts: state.posts.filter((post) => post.id !== postId)
    })),
});
