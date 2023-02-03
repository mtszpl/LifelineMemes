import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Box, useTheme } from '@mui/system'
import { ChangeEvent, ChangeEventHandler, FocusEventHandler, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useUploadMeme } from '../Api/MemeManagement'
import { tokens } from '../Theme'

type Props = {
  author: string
}

export default function MemeCreate({ author }: Props) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  const [titleExists, setTitleExists] = useState<boolean>(true)

  const reroute = useNavigate()
  const [newMemeData, setNewMemeData] = useState({
    Title: "",
    dataLink: new File([], ""),
    author: author
  })

  useEffect(() => {
    author === "" && reroute("/")
  }, [])

  const onFileSelect = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files !== null) {
      var name = e.target.files[0].name
      var type = name.substring(name.lastIndexOf('.') + 1, name.length) || name
      console.log(type);
      if (type === "jpg" || type === "png")
        setNewMemeData({
          Title: newMemeData.Title,
          dataLink: e.target.files[0],
          author: author
        })
        else {
          alert("Unaccepted file format, won't be accepted")
        }
    }
  }

  const onTitleEdit: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    if (e.currentTarget.value === "") {
      setTitleExists(false)
    }
    else
      setTitleExists(true)
    setNewMemeData({
      Title: e.currentTarget.value,
      dataLink: newMemeData.dataLink,
      author: author
    })
  }

  const handleBlur: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
    if (e.currentTarget.value === "") {
      setTitleExists(false)
    }
    else
      setTitleExists(true)
  }

  const upload = useUploadMeme()

  const onSubmit = () => {
    if (!newMemeData.dataLink.size && newMemeData.Title === "") {
      alert("Content and title are required")
      return
    }
    if (!newMemeData.dataLink.size) {
      alert("Correct content is required")
      return
    }
    if (newMemeData.Title === "") {
      alert("Title is required")
      return
    }
    upload(newMemeData.Title, newMemeData.dataLink, newMemeData.author)
    reroute("/")
  }

  return (
    <Box display="flex" flexDirection="column" width="80%" alignItems="center">
      <Box display="flex" flexDirection="column" gap="1em" my="2em" alignSelf="stretch">
        <Typography variant="h3">Title</Typography>
        <TextField defaultValue={newMemeData.Title} error={!titleExists} helperText={!titleExists ? "Title is required!" : undefined} onChange={onTitleEdit} onBlur={handleBlur} />
      </Box>
      <input id="fileInput" type='file' accept='.jpg, .png' onChange={(e) => onFileSelect(e)} />

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