import { Pagination, useTheme } from '@mui/material'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'
import { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useGetMemes } from '../Api/MemeManagement'
import Post from '../Components/Post'
import { UserContext } from '../Api/UserManagement'
import { tokens } from '../Theme'

export default function MainMemeView() {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const [page, setPage] = useState(1)

    const user = useContext(UserContext)

    const postsPerPage: number = 5
    const [memes, setMemes] = useGetMemes()
    
    let [memesToDisplay, setMemesToDisplay] = useState(memes.slice((page - 1), postsPerPage))

    useEffect(() => {setMemes()}, [])

    useEffect(() => {
        setMemesToDisplay(memes.slice((page - 1) * postsPerPage, postsPerPage * page))
        window.scrollTo(0, 0)
    }, [page, memes])


    const handleChange = (e: React.ChangeEvent<unknown>, value: number) => {
        setPage(value)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" gap="2vh">
            <Link to={user.role !== "UNLOGGED" ? "/creator" : "/login"} style={{ textDecoration: "none"}}>
                <IconButton
                    sx={{
                        display: "flex",
                        width: "100%",
                        justifyContent: "space-around",
                        bgcolor: colors.red[500],
                        borderRadius: "2px",
                        mt: "5%"
                    }}>
                        <Typography variant='h3'>Add meme</Typography>
                </IconButton>
            </Link>
            {memesToDisplay.map(meme =>
                (<Post key={meme.id} id={meme.id} authorName={meme.author} title={meme.title} dataLink={meme.dataLink}
                    timestamp={meme.timestamp === undefined ? meme!.id : meme.timestamp}
                    />))}

            <Pagination
                count={(memes.length < postsPerPage) ? 1 : Math.ceil(memes.length / postsPerPage)}
                shape="rounded"
                onChange={handleChange}
            />
        </Box>
    )
}