import { useState, useEffect } from "react";

import { useAuth } from "../hooks/useAuth";
import { PostCard } from "../components/PostCard";
import { Spinner } from "../components/Spinner";
import { PostCreate } from "../components/PostCreate";

import type { Post } from "../interfaces/post.interface";
import { handleFetchError } from "../utils/handleFetchError";
import { toast } from "react-toastify";
import { apiUrl } from "../config";

export function Home() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch(
                    `${apiUrl}/post/all`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );
                if (response.status === 200) {
                    const data = (await response.json()) as Post[];
                    setPosts(data);
                } else {
                    console.error(await response.text());
                    toast.error("An unexpected error occured when trying to fetch posts.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })();
    }, []);

    const addNewPost = (post: Post) => {
        setPosts((prev) => {
            if (!prev) {
                return [post];
            } else {
                return [post, ...prev];
            }
        });
    };

    const deletePost = (id: string) => {
        setPosts((prev) => {
            if (!prev) return null;
            return prev.filter((i) => i._id !== id);
        })
    }

    return (
        <main className="flex-1 flex flex-col items-center gap-6 m-6">
            {user && <PostCreate addPost={addNewPost} />}
            {posts ? (
                posts.map((post) => <PostCard postData={post} key={post._id} deletePostCb={deletePost} link />)
            ) : (
                <div className="flex-1 flex items-center">
                    <Spinner size="large" theme="dark"></Spinner>
                </div>
            )}
        </main>
    );
}
