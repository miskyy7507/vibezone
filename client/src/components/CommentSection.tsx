import { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { handleFetchError } from "../utils/handleFetchError";
import { CommentItem } from "./CommentItem";
import { Spinner } from "./Spinner";
import { CommentCreate } from "./CommentCreate";

import type { Comment } from "../interfaces/comment.interface";

export function CommentSection({postId, commentCount, focus}: {postId: string, commentCount: number, focus: boolean}) {
    const [comments, setComments] = useState<Comment[] | null>(null);
    const commentSection = useRef<HTMLElement | null>(null);

    useEffect(() => {
        void (async () => {
            try {
                const response = await fetch(`http://localhost:6660/api/comment/post/${postId}`, {
                    method: "GET",
                    credentials: "include",
                });
                if (response.status === 200) {
                    const comments = await response.json() as Comment[];
                    setComments(comments);
                    if (focus) {
                        commentSection.current?.scrollIntoView();
                    }
                } else if (response.status === 404 || response.status === 400) {
                    toast.error("Could not fetch comments for this post.");
                }
            } catch (error) {
                handleFetchError(error);
            }
        })();
    }, [postId, focus]);

    const addComment = (newComment: Comment) => {
        setComments((prev) => {
            if (!prev) return [newComment];
            return [newComment, ...prev];
        });
    }

    return (
        <section ref={commentSection} id="comments" className="flex flex-col gap-3 px-5 py-4 max-w-2xl w-full bg-zinc-800 rounded-xl shadow-sm ring-1 ring-zinc-700 scroll-mt-[64px]">
            {comments ? (
                <>
                    <div className="flex flex-row gap-3">
                        <h3 className="font-bold">Comments</h3>
                        <span>{commentCount}</span>
                    </div>
                    <CommentCreate postId={postId} addComment={addComment} focus={focus} />

                    {comments.map((i) => (
                        <CommentItem key={i._id} comment={i} />
                    ))}
                </>
            ) : (
                <div className="py-4.5">
                    <Spinner size="medium" theme="dark" />
                </div>
            )}
        </section>
    );
}
