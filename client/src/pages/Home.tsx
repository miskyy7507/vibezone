import { useState, useEffect } from "react";

import { useAuth } from "../auth";
import { PostCard } from "../components/PostCard";
import { Spinner } from "../components/Spinner";
import { PostCreate } from "../components/PostCreate";

import type { Post } from "../interfaces/post.interface";
import { handleFetchError } from "../utils/handleFetchError";

export function Home() {
    const { user } = useAuth();
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch(
                    "http://localhost:6660/api/post/all",
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
                    alert(
                        `An unexpected error occured when trying to fetch posts. The server responsed with code: ${response.status.toString()}`
                    );
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
    }

    return (
        <div className="flex flex-col items-center gap-6 m-6">
            {user && <PostCreate addPost={addNewPost} />}
            {posts ? (
                posts.map((post) => <PostCard postData={post} key={post._id} />)
            ) : (
                <Spinner size="large" theme="dark"></Spinner>
            )}
        </div>
    );
}
