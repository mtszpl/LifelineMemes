import { Paper, Typography, useTheme } from '@mui/material'
import { Box } from '@mui/system'
import { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom'
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
    const { id, title } = useParams()

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
        <Box display="flex" my="1%" alignContent="center" gap="3%"
            sx={{
                width: { sm: '100%', md: 0.9 },
            }}>
            <Link style={{ textDecoration: "none", width: "10%" }} to={`/profilemanagement/${postData.authorName}`}>
                <Box>
                    <Box
                        component="img"
                        alt='author-profile-pic'
                        sx={{
                            width: '100%',
                            aspectRatio: '1/1',
                        }}
                        src={author.profileImg}
                    />
                </Box>
            </Link>
            <Box display="flex" flexDirection="column" alignItems="stretch" gap="1vh"
                sx={{
                    width: "100%",
                    maxWidth: 750,
                    cursor: "pointer",
                }}
            >
                {title === undefined ? (
                    <Link style={{ textDecoration: "none", color: "inherit" }} to={`/${postData.id}/${postData.clearTitle}`}>
                        <Box bgcolor={colors.indigo[900]} sx={{ cursor: "pointer" }}>
                            <Typography variant='h2'>{postData.title}</Typography>
                        </Box>
                    </Link>
                ) : (
                    <Box bgcolor={colors.indigo[900]} sx={{ cursor: "pointer" }}>
                        <Typography variant='h2'>{postData.title}</Typography>
                    </Box>
                )
                }
                <Link style={{ textDecoration: "none", color: "inherit" }} to={`/profilemanagement/${postData.authorName}`}>
                    <Box bgcolor={colors.indigo[900]} sx={{ cursor: "pointer" }}>
                        <Typography variant='h6'>{postData.authorName}</Typography>
                    </Box>
                </Link>

                {title === undefined ? (
                    <Link to={`/${postData.id}/${postData.clearTitle}`}>
                        <Box
                            component="img"
                            sx={{
                                width: "100%",
                                maxWidth: 750,
                                cursor: "pointer"
                            }}
                            alt={postData.title}
                            src={postData.dataLink}
                        />
                    </Link>
                ) : (
                    <Box
                        component="img"
                        sx={{
                            width: "100%",
                            maxWidth: 750,
                            cursor: "pointer"
                        }}
                        alt={postData.title}
                        src={postData.dataLink}
                    />
                )}
            </Box>
        </Box>
    )
}