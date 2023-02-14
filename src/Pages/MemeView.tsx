import { Box, Button, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentBox from '../Components/CommentBox'
import { useGetOneMeme } from '../Api/MemeManagement'
import Post from '../Components/Post'
import { tokens } from '../Theme'
import { useGetComments } from '../Api/CommentManagement'
import Comment from '../Components/Comment'
import { useGetUserByDocumentId } from '../Api/UserManagement'

type Props = {
}

export default function MemeView(props: Props) {
  const { title } = useParams()
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [meme, setMeme] = useState<{
    id: number
    title: string
    clearTitle?: string
    dataLink: string
    authorName: string
    timestamp: number
    tags?: string
  }>()
  const [, getMeme] = useGetOneMeme()
  const [, getAuthor] = useGetUserByDocumentId()

  const [, updateComments] = useGetComments()
  const [comments, setComments] = useState<{
    author: string
    commentedPost: string
    content: string
    timestamp: number
  }[]>([])

  const [canShowComments, setCanShowComments] = useState<boolean>(false)

  useEffect(() => {
    setCanShowComments(false)
    getMeme(title!, (newMeme: any) => {
      setMeme({
        id: newMeme.id,
        title: newMeme.title,
        clearTitle: newMeme.clearTitle,
        dataLink: newMeme.dataLink,
        authorName: newMeme.author,
        timestamp: newMeme.timestamp,
        tags: newMeme.tags
      })
    })

    updateComments(title!)
    .then(comments => {
      setComments(comments)
      setCanShowComments(true)
    })
  }, [])

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch"
      sx={{
        width: { xm: 1, md: 3/4 }
      }}
    >
      {(meme !== undefined && meme.authorName !== undefined) && (
        <Post id={Number(meme!.id)} title={meme!.title} clearTitle={meme!.title} dataLink={meme!.dataLink} authorId={meme!.authorName}
          timestamp={meme.timestamp === undefined ? meme!.id : meme.timestamp} />
      )}
      <Link to="/" style={{textDecoration: "none"}}>
        <Button sx={{ bgcolor: colors.red[500], height: "4em", width: "100%" }}>
          <Typography color={colors.white[100]}>Back To Main Page</Typography>
        </Button>
      </Link>
      <CommentBox title={title!} onPostCallback={() => { updateComments(title!) }} />
      <Box>
        {(comments !== undefined && canShowComments === true) && comments.map((comment, i) => (
          <Comment key={i} authorName={comment.author} content={comment.content} />
        ))}
      </Box>
    </Box>
  )
}