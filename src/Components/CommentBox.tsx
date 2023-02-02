import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import { tokens } from '../Theme';
import { ChangeEventHandler, useContext, useState } from 'react';
import { UserContext } from '../Api/UserManagement';
import { useNavigate } from 'react-router-dom';
import { useUploadComment } from '../Api/CommentManagement';

type Props = {
    title: string
    onPostCallback: Function
}

export default function CommentBox({ title, onPostCallback }: Props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const user = useContext(UserContext)

    const [comment, setComment] = useState("")
    const reroute = useNavigate()
    const postComment = useUploadComment()

    const handleClick = () => {
        if (user.role === "UNLOGGED") {
            reroute("/login")
            return
        }
        if (comment === "") {
            alert("Comment needs content")
            return
        }
        setComment("")
        postComment(user.username, title, comment)
        onPostCallback()
    }

    const handleCommentEdit: ChangeEventHandler<HTMLTextAreaElement | HTMLInputElement> = (e) => {
        setComment(e.currentTarget.value)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="stretch" m="2em" gap="2em">
            <Box display="flex" alignSelf="center" width="80%" gap="2%">
                <img
                    width="50px"
                    height="50px"
                    src={user.profileImg}
                />
                <TextField
                    id="commentInput"
                    multiline label="Write a comment"
                    value={comment}
                    onChange={handleCommentEdit}
                    sx={{ flexGrow: "2" }}
                />
                <Button sx={{ bgcolor: colors.red[500] }} onClick={handleClick}>
                    <ArrowForwardIosSharpIcon sx={{ color: colors.white[600] }} />
                </Button>
            </Box>
        </Box>
    )
}