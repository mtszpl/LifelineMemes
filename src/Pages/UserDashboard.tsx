import { Box } from '@mui/material'
import Typography from '@mui/material/Typography'
import { useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { useGetMemes } from '../Api/MemeManagement'
import Post from '../Global/Post'
import { useGetUser, UserContext } from '../Api/UserManagement'
import ProfileSettings from '../Components/ProfileSettings'


export default function UserDashboard() {
    
    const { username } = useParams()

    const loggedUser = useContext(UserContext)

    const [owner, updateOwner] = useGetUser()
    const [memes, setMemes] = useGetMemes()

    useEffect(() => { updateOwner(username!); setMemes(username) }, [username, updateOwner, setMemes])

    return (
        <Box display="flex" flexDirection="column" width="80%" alignItems="center">
            {owner.username === undefined ?
                (<Typography>404</Typography>) :
                (
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Box display="flex" justifyContent="space-between" width="50%" m="2em">
                            <img
                                alt='user-profile-pic'
                                width="100em"
                                height="100em"
                                src={owner.profileImg}
                            />
                            <Box display="flex" flexDirection="column" mx="2em">
                                <Typography variant='h2'>{owner.username}</Typography>
                                {owner.username === loggedUser.username && (
                                    <ProfileSettings/>                        
                                )}
                            </Box>
                        </Box>
                        <Typography variant='h3'>User Memes</Typography>
                        {memes.map(meme => {
                            return (<Post key={meme.id} id={meme.id} title={meme.title} authorName={meme.author} dataLink={meme.dataLink}
                                timestamp={meme.timestamp === undefined ? meme!.id : meme.timestamp} />)
                        })}
                    </Box>
                )
            }
        </Box>
    )
}