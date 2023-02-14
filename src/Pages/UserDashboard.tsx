import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useGetMemes } from '../Api/MemeManagement'
import Post from '../Components/Post'
import { useGetUser, UserContext } from '../Api/UserManagement'
import ProfileSettings from '../Components/ProfileSettings'

type Props = {
    onUserDataChangeCallback: Function
}

export default function UserDashboard({ onUserDataChangeCallback }: Props) {

    const { username } = useParams()

    const loggedUser = useContext(UserContext)

    const [owner, updateOwner] = useGetUser()
    const [memes, setMemes] = useGetMemes()

    useEffect(() => { updateOwner(username!); setMemes(username) }, [username])

    return (
        <Box display="flex" flexDirection="column">
            {owner.username === undefined ?
                (<Typography>404</Typography>) :
                (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box
                            display="flex"
                            flexDirection={{ xs: "column", sm: "column", md: "row" }}
                            justifyContent={{ xs: "center", sm: "center", md: "space-between" }}
                            alignItems={{ xs: "center", sm: "center", md: "flex-start" }}
                            width="100%"
                            my="2em">
                            <img
                                alt='user-profile-pic'
                                width="100em"
                                height="100em"
                                src={owner.profileImg}
                            />
                            <Box display="flex" flexDirection="column" mx="2em" width="100%"
                                alignItems={{ xs: "center", sm: "center", md: "flex-start" }}
                            >
                                <Typography variant='h2'>{owner.username}</Typography>
                                {owner.username === loggedUser.username && (
                                    <ProfileSettings onUserDataChangeCallback={onUserDataChangeCallback}/>
                                )}
                            </Box>
                        </Box>
                        <Typography variant='h3'>User Memes</Typography>
                        <Box width="80%">
                            {memes.map(meme => {
                                return (<Post key={meme.id} id={meme.id} title={meme.title} authorId={meme.author} dataLink={meme.dataLink}
                                    timestamp={meme.timestamp === undefined ? meme!.id : meme.timestamp} />)
                            })}
                        </Box>
                    </Box>
                )
            }
        </Box>
    )
}