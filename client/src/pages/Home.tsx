import { useState, useEffect } from "react";

import { PostCard } from "../components/PostCard";
import { Spinner } from "../components/Spinner";

import type { Post } from "../interfaces/post.interface";

export function Home() {
    const [posts, setPosts] = useState<Post[] | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch(
                    "http://localhost:6660/api/post/all", {
                        method: "GET",
                        credentials: "include"
                    }
                );
                if (response.status !== 200) {
                    console.error(await response.text());
                    alert(
                        `An unexpected error occured when trying to fetch posts. The server responsed with code: ${response.status.toString()}`
                    );
                }
                const data = (await response.json()) as Post[];
                setPosts(data);
            } catch (error) {
                if (error instanceof TypeError) {
                    console.error("Fetch failed.", error);
                    alert(`Something went wrong: ${error.message}`);
                } else {
                    throw error;
                }
            }
        })()
      }, []);

    return (
        <div className={"flex flex-col items-center"}>
            {
                posts ?
                posts.map((post) => (
                    <PostCard postData={post} key={post._id} />
                )) : <Spinner size="large" theme="dark"></Spinner>
            }
        </div>
    );
}
