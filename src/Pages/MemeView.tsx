import { Box, Button, Typography, useTheme } from '@mui/material'
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import CommentBox from '../Components/CommentBox'
import { useGetOneMeme } from '../Api/MemeManagement'
import Post from '../Global/Post'
import { tokens } from '../Theme'
import { useGetComments } from '../Api/CommentManagement'
import Comment from '../Components/Comment'

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

  const [, updateComments] = useGetComments()
  const [comments, setComments] = useState<{
    author: string
    commentedPost: string
    content: string
    timestamp: number
  }[]>([])

  const [canShowMemes, setCanShowMemes] = useState<boolean>(false)

  useEffect(() => {
    setCanShowMemes(false)
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

    updateComments(title!, (arr: any) => {
      console.log(arr);
      setComments(arr)
      console.log(comments);
      setCanShowMemes(true)
    }
    )
  }, [])

  return (
    <Box display="flex" flexDirection="column" alignItems="stretch" width="75%">
      {(meme !== undefined && meme.authorName !== undefined) && (
        <Post id={Number(meme!.id)} title={meme!.title} clearTitle={meme!.title} dataLink={meme!.dataLink} authorName={meme!.authorName}
          timestamp={meme.timestamp === undefined ? meme!.id : meme.timestamp} />
      )}
      <Link to="/">
        <Button sx={{ bgcolor: colors.red[500], height: "4em", width: "100%" }}>
          <Typography color={colors.white[100]}>Back To Main Page</Typography>
        </Button>
      </Link>
      <CommentBox title={title!} onPostCallback={() => { updateComments(title!) }} />
      <Box>
        {(comments !== undefined && canShowMemes === true) && comments.map((comment, i) => (
          <Comment key={i} authorName={comment.author} content={comment.content} />
        ))}
      </Box>
    </Box>
  )
}