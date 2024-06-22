import CommentDto from "@/dtos/responses/commentDto";
import Comment from "./comment";
import React, { useState } from "react";

export interface CommentsProps {
    comments: CommentDto[];
    onAddComment: (comment: string) => void;
    onCommentDelete: (commentId: string) => void;
    onUpdateComment: (commentId: string, comment: string) => void;
}


export default function Comments({comments, onAddComment, onCommentDelete, onUpdateComment}: CommentsProps) {
  const [newComment, setNewComment] = useState('');

  return (
    <>
      {comments.map(comment => <Comment
        key={comment.id}
        comment={comment}
        onCommentDelete={onCommentDelete}
        onUpdateComment={onUpdateComment}/> )}
      <div className="card mb-3">
        <div className="card-body">
          <h5 className="card-title">Add a comment</h5>
          <div className="form-group mb-2">
            <textarea
              className="form-control"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
            ></textarea>
          </div>
          <button
            className="btn btn-primary"
            onClick={() => {
              onAddComment(newComment);
              setNewComment('');
            }}
          >
            Add comment
          </button>
        </div>
      </div>
    </>
  );
}
