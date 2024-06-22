import CommentDto from "@/dtos/responses/commentDto";
import React from "react";
import {useUserContext} from "@/contexts/userContext";

export interface CommentProps {
  comment: CommentDto;
  onCommentDelete: (commentId: string) => void;
  onUpdateComment: (commentId: string, comment: string) => void;
}

export default function Comment({ comment, onCommentDelete, onUpdateComment }: CommentProps) {
  const [isEditing, setIsEditing] = React.useState(false);
  const [updatedComment, setUpdatedComment] = React.useState(comment.text);
  const {user} = useUserContext();

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">{comment.username} {comment.isEdited && <span className="small ">(edited)</span> }</h5>
        {isEditing ?
          <>
            <div className="form-group mb-2">
              <textarea
                className="form-control"
                value={updatedComment}
                onChange={(e) => setUpdatedComment(e.target.value)}
                rows={3}
              ></textarea>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => {
                onUpdateComment(comment.id, updatedComment);
                setIsEditing(false);
              }}
            >
              Update comment
            </button>
          </> :
          <>
            <p className="card-text">{comment.text}</p>
            {user?.id === comment.userId && (
              <div className="btn-group">
                <button
                  className="btn btn-danger"
                  onClick={() => onCommentDelete(comment.id)}
                >
                  Delete
                </button>
                <button
                  className="btn btn-primary"
                  onClick={() => setIsEditing(true)}
                >
                  Edit
                </button>
              </div>
            )}
          </>}
      </div>
    </div>
  );
}
