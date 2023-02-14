import { Box, Typography, useTheme } from '@mui/material'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useGetUserByDocumentId } from '../Api/UserManagement'
import { tokens } from '../Theme'

type Props = {
  authorName: string
  content: string
}

export default function Comment({ authorName, content }: Props) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)
  const [author, updateAuthor] = useGetUserByDocumentId()

  const reroute = useNavigate()

  useEffect(() => {
    updateAuthor(authorName)
  }, [])

  return (
    <Box bgcolor={colors.primary[800]} display="flex" mb="2em">
      <Box onClick={() => reroute(`/profilemanagement/${authorName}`)}>
        <Box
          component="img"
          alt='author-profile-pic'
          sx={{
            width: { xs: 30, sm: 35, md: 50 },
            height: { xs:30, sm: 35, md: 50 },
          }}
          style={{ margin: "0 2em 0 2em" }}
          src={author.profileImg}
        />
      </Box>
      <Typography>{author.username}</Typography>
      <Typography mx="2em" border="solid" borderColor={colors.indigo[800]} width="100%">{content}</Typography>

    </Box>
  )
}