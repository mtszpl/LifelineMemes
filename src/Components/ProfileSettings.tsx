import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import { ChangeEvent, ChangeEventHandler, useContext, useState } from 'react'
import { UserContext, useUpdateUser } from '../Api/UserManagement'
import { tokens } from '../Theme'

type Props = {
    onUserDataChangeCallback: Function
}

export default function ProfileSettings({ onUserDataChangeCallback }: Props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const loggedUser = useContext(UserContext)
    const [user, setUser] = useState(loggedUser)

    const [newUserName, setNewUserName] = useState<string>("")
    const [newPassword, setNewPassword] = useState<string>("")
    const [newProfileImg, setNewProfileImg] = useState<File>()

    const updateUser = useUpdateUser()

    const changeCurrentUsername: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setNewUserName(e.currentTarget.value)
    }
    const changeCurrentPassword: ChangeEventHandler<HTMLInputElement | HTMLTextAreaElement> = (e) => {
        setNewPassword(e.currentTarget.value)
    }

    const changeProfileImg = (e: ChangeEvent<HTMLInputElement>) => {
        e.target.files !== null &&
            setNewProfileImg(e.target.files[0])
    }

    const updateProfileSettings = () => {
        updateUser(loggedUser.username, newUserName, newPassword, newProfileImg).then(newUser => {
            newUser !== undefined &&
            setUser(
                {
                    id: user.id,
                    username: newUser.username,
                    profileImg: newUser.profileImg,
                    role: newUser.role
                })                
                onUserDataChangeCallback(newUser)
            })
    }

    return (
        <Box alignContent="center" alignSelf="stretch">
            <UserContext.Provider value={user} />
            <Typography alignSelf="center">Profile Settings</Typography>
            <Box
                display="flex"
                sx={{
                    width: "100%",
                }}
                alignItems="center"
                gap="1em"
                flexDirection="column"
                my="2em">
                <Box display="flex" alignItems="center" alignSelf="stretch">
                    <TextField
                        defaultValue={newUserName}
                        sx={{ mr: "1em", flexGrow: "2" }}
                        onChange={(e) => changeCurrentUsername(e)}
                    /> <Typography>Change username</Typography>
                </Box>
                <Box display="flex" alignItems="center" alignSelf="stretch">
                    <TextField
                        defaultValue={newPassword}
                        sx={{ mr: "1em", flexGrow: "2" }}
                        onChange={(e) => changeCurrentPassword(e)}
                    /> <Typography>Change password</Typography>
                </Box>
                <Box display="flex" width="50%" justifyContent="space-between" flexDirection={{ xs: "column", sm: "column", md: "row" }}>
                    <input type="file" onChange={(e) => changeProfileImg(e)} />
                    <Typography variant="h5" ml="5%">Change profile picture</Typography>
                </Box>
                <Button
                    sx={{ backgroundColor: colors.red[500], borderRadius: "3px", margin: "2%", minWidth: "100px" }}
                    onClick={() => updateProfileSettings()}
                >
                    <Typography variant='h4' color={colors.white[500]}>
                        Change
                    </Typography>
                </Button>
            </Box>
        </Box>
    )
}