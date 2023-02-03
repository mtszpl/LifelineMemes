import { Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'
import { tokens } from '../Theme'
import { useGetUser } from '../Api/UserManagement';

type Props = {
    id: number
    title: string
    clearTitle?: string
    dataLink: string
    authorName: string
    timestamp: number
    tags?: string
} | {
    id: number
    title?: string
    clearTitle: string
    dataLink: string
    authorName: string
    timestamp: number
    tags?: string
};

export default function Post(props: Props) {
    const [postData, setPostData] = useState(props)
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [author, updateAuthor] = useGetUser()

    useEffect(() => {
        let nClearTitle: string = ""
        if (props.title !== undefined && props.clearTitle === undefined)
            nClearTitle = props.title.replace(/[^\w\s']|_/g, "")
                .replace(/\s+/g, "-")
        setPostData({
            id: props.id,
            title: props.title,
            clearTitle: nClearTitle,
            dataLink: props.dataLink,
            authorName: props.authorName,
            timestamp: props.timestamp,
            tags: props.tags,
        })
        updateAuthor(props.authorName)
    }, [])


    return (
        <Box display="flex" sx={{ cursor: "pointer" }} my="1%" justifyContent="center">
            <Box mr="1%">
                <Link to={`/profilemanagement/${postData.authorName}`}>
                    <img
                        alt='author-profile-pic'
                        height="50em"
                        width="50em"
                        src={author.profileImg}
                    />
                </Link>
            </Box>
            <Box display="flex" flexDirection="column" alignItems="stretch" gap="1vh">
                <Box bgcolor={colors.indigo[900]}>
                    <Link to={`/${postData.id}/${postData.clearTitle}`}>
                        <Typography variant='h2'>{postData.title}</Typography>
                    </Link>
                </Box>
                <Box bgcolor={colors.indigo[900]}>
                    <Typography variant='h6'>{postData.authorName}</Typography>
                </Box>
                <Link to={`/${postData.id}/${postData.clearTitle}`}>
                    <img
                        width="750em"
                        // height="750em"
                        alt={postData.title}
                        src={postData.dataLink}
                    />
                </Link>
            </Box>
        </Box>
    )
}