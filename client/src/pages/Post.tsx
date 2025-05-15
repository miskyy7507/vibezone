import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router";
import { toast } from "react-toastify";

import { handleFetchError } from "../utils/handleFetchError";
import { NotFound } from "./NotFound";
import { Spinner } from "../components/Spinner";
import { PostCard } from "../components/PostCard";
import { CommentList } from "../components/CommentSection";

import type { Post } from "../interfaces/post.interface";

export function Post() {
    const [post, setPost] = useState<Post | null>(null);
    const [notFound, setNotFound] = useState(false);

    const { postId } = useParams();

    const navigate = useNavigate();

    useEffect(() => {
        if (!postId || !/^[a-f0-9]{24}$/.test(postId)) {
            setNotFound(true);
            return;
        }

        void (async () => {
            try {
                const response = await fetch(
                    `http://localhost:6660/api/post/${postId}`,
                    {
                        method: "GET",
                        credentials: "include",
                    }
                );

                if (response.status === 200) {
                    const postData = (await response.json()) as Post;
                    setPost(postData);
                } else if (response.status === 404) {
                    setNotFound(true);
                } else {
                    console.error(await response.text());
                    toast.error(
                        `Something went wrong when trying to fetch this post. Try reloading the page.`
                    );
                }
            } catch (error) {
                handleFetchError(error);
            }
        })();
    }, [postId]);

    const deletePost = () => {
        void navigate(-1);
    }

    return notFound ? (
        <NotFound />
    ) : post ? (
        <main className="flex flex-col items-center gap-6 m-6">
            <PostCard postData={post} deletePostCb={deletePost}/>
            <CommentList postId={post._id} />
        </main>
    ) : (
        <Spinner size="large" theme="dark" />
    );
}
