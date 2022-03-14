import React, { MouseEventHandler, useState } from 'react'
import Image from 'next/image'
import Comment from '@/modules/blog/types/admin/Comment'
import Markdown from '../../Markdown'
import CommentCardMenu from './CommentCardMenu'
import CommentCardEditForm from './CommentCardEditForm'
import { KeyedMutator } from 'swr'
import axios from 'axios'
import { toast } from 'react-toastify'
import { axiosAPI } from '@/common/utils/AxiosInstance'

interface Props {
  comment: Comment
  mutate: KeyedMutator<Comment[]>
  openModal: (commentId: string, handler: () => Promise<void>) => void
  closeModal: () => void
}

function CommentCard({ comment, mutate, openModal, closeModal }: Props) {
  const { createdAt, id, is_own_comment, user_name } = comment
  const [isEditing, setIsEditing] = useState(false)

  const deleteComment = async () => {
    try {
      await axiosAPI.delete(`/blog/comments/${id}`)
      mutate()
      toast.success('Comment deleted successfully!', { theme: 'dark' })
      closeModal()
    } catch (e) {
      if (!axios.isAxiosError(e)) throw e
      toast.error(e.response?.data?.message || e.message, { theme: 'dark' })
    }
  }

  const deleteHandler: MouseEventHandler<HTMLButtonElement> = () => {
    openModal(comment.id, deleteComment)
  }

  return (
    <li className="w-full border border-white/20 rounded px-5 py-3">
      <div className="flex justify-between">
        <div className="w-full flex gap-3 mb-3">
          <div className="h-10 w-10 bg-white rounded-full shrink-0 my-auto">
            <Image
              className="rounded-full shrink-0 my-auto"
              width={40}
              height={40}
              src={`https://avatars.dicebear.com/api/human/${id}.svg`}
              alt={`Profile picture of ${user_name}`}
            ></Image>
          </div>
          <div className="my-auto">
            <p className="text-sm">{user_name}</p>
            <p className="text-xs text-gray-400">{createdAt}</p>
          </div>
        </div>
        {is_own_comment && (
          <CommentCardMenu
            handleEdit={() => setIsEditing(true)}
            handleDelete={deleteHandler}
          />
        )}
      </div>
      {isEditing ? (
        <CommentCardEditForm
          comment={comment}
          closeHandler={() => setIsEditing(false)}
          mutate={mutate}
        />
      ) : (
        <Markdown markdown={comment.comment} />
      )}
    </li>
  )
}

export default CommentCard