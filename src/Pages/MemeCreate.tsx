import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Box, useTheme } from '@mui/system'
import { ChangeEvent, ChangeEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploadMeme } from '../Api/MemeManagement'
import { tokens } from '../Theme'

type Props = {
  author: string
}

export default function MemeCreate({ author }: Props) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [fileReader, setFileReader] = useState<FileReader>(new FileReader())
  const reroute = useNavigate()
  const [newMemeData, setNewMemeData] = useState({
    Title: "",
    dataLink: new File([], "unknown"),
    author: author
  })

  useEffect(() => {
    author === "" && reroute("/")
  }, [])

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    e.target.files !== null &&
      setNewMemeData({
        Title: newMemeData.Title,
        dataLink: e.target.files[0],
        author: author
      })
  }

  const onTitleEdit: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    setNewMemeData({
      Title: e.currentTarget.value,
      dataLink: newMemeData.dataLink,
      author: author
    })
  }

  const upload = useUploadMeme()

  const onSubmit = () => {
    upload(newMemeData.Title, newMemeData.dataLink, newMemeData.author)
    reroute("/")
  }

  return (
    <Box display="flex" flexDirection="column" width="80%" alignItems="center">
      <Box display="flex" flexDirection="column" gap="2em" mb="2em" alignSelf="stretch">
        <Typography variant="h3">Title</Typography>
        <TextField defaultValue={newMemeData.Title} onChange={onTitleEdit}/>
      </Box>
      <input id="fileInput" type='file' onChange={(e) => onFileSelect(e)} />

      <Button
        sx={{
          width: "10em",
          height: "5em",
          bgcolor: colors.red[500],
          m: "1em"
        }}
        onClick={onSubmit}
        >
        <Typography variant="h3" color={colors.white[500]}>Submit</Typography>
      </Button>
    </Box>
  )
}