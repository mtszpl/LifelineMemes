import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import { ChangeEvent, ChangeEventHandler, useContext, useState } from 'react'
import { UserContext, useUpdateUser } from '../Api/UserManagement'
import { tokens } from '../Theme'

export default function ProfileSettings() {
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

    const updateProfileSettings = (e: any) => {
        updateUser(loggedUser.username, newUserName, newPassword, newProfileImg, undefined, (newUser: any) => {
            setUser(
                {
                    username: newUser.username,
                    profileImg: newUser.profileImg,
                    role: newUser.role
                }
            )
        })
    }

    return (
        <Box>
            <UserContext.Provider value={user} />
            <Typography>Profile Settings</Typography>
            <Box>
                <Box display="flex">
                    <TextField defaultValue={newUserName} sx={{ ml: "1em" }} onChange={(e) => changeCurrentUsername(e)} /> <Typography>Change username</Typography>
                </Box>
                <Box display="flex">
                    <TextField defaultValue={newPassword} sx={{ ml: "1em" }} onChange={(e) => changeCurrentPassword(e)} /> <Typography>Change password</Typography>
                </Box>
            </Box>

            <Box>
                <Typography variant="h5">Set profile picture</Typography>
                <input type="file" onChange={(e) => changeProfileImg(e)} />
                <Button
                    sx={{ backgroundColor: colors.red[500], borderRadius: "3px", margin: "2%", minWidth: "100px" }}
                    onClick={(e) => updateProfileSettings(e)}
                >
                    <Typography variant='h4' color={colors.white[500]}>
                        Change
                    </Typography>
                </Button>
            </Box>
        </Box>
    )
}