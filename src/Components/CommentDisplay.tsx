import { Box, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUser } from '../Api/UserManagement'
import { tokens } from '../Theme'

type Props = {
  authorName: string
  content: string
}

export default function CommentDisplay({ authorName, content }: Props) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [author, updateAuthor] = useGetUser()

  const reroute = useNavigate()

  useEffect(() => {
    updateAuthor(authorName)
  }, [authorName])

  return (
    <Box bgcolor={colors.primary[800]} display="flex" mb="2em">
      <Box onClick={() => reroute(`/profilemanagement/${authorName}`)}>
        <img
          alt='author-profile-pic'
          width="50em"
          height="50em"
          style={{ margin: "0 2em 0 2em" }}
          src={author.profileImg}
        />
      </Box>
      <Typography>{author.username}</Typography>
      <Typography mx="2em" border="solid" borderColor={colors.indigo[800]} width="100%">{content}</Typography>

    </Box>
  )
}