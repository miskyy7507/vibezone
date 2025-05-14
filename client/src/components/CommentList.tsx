import { useState, useEffect } from "react";
import { handleFetchError } from "../utils/handleFetchError";
import { CommentItem } from "./CommentItem";

import type { Comment } from "../interfaces/comment.interface";
import { Spinner } from "./Spinner";


export function CommentList({postId}: {postId: string}) {
    const [comments, setComments] = useState<Comment[] | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch(`http://localhost:6660/api/post/${postId}/comments`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.status === 200) {
                    const comments = await response.json() as Comment[];
                    setComments(comments);
                } else if (response.status === 404 || response.status === 400) {
                    alert("Could not fetch comments for this post.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })();
    }, [postId]);

    return comments ? (
        <section>
            <h3>Comments</h3>
            {comments.map((i) => (
                <CommentItem key={i._id} comment={i}></CommentItem>
            ))}
        </section>
    ) : (
        <Spinner size="large" theme="dark"></Spinner>
    );
}
