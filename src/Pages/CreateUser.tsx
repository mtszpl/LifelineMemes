import { Box, TextField, useTheme } from '@mui/material'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import React, { useState } from 'react'
import { tokens } from '../Theme'

type Props = {
    onUserCreateCallback: Function
}

export default function CreateUser({ onUserCreateCallback }: Props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [username, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [repeatedPassword, setRepeatedPassword] = useState<string>("")


    const handleUserChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setUserName(e.currentTarget.value)
    }

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.currentTarget.value)
    }

    const handleRepeatedPasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setRepeatedPassword(e.currentTarget.value)
    }

    const handleClick = (e: any) => {
        if (password !== repeatedPassword) {
            alert("Repeated password must match password!")
            return
        }
        if(!password || !username){
            alert("Username or password can't be empty!")
            return
        }
        onUserCreateCallback(username, password)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" width={{ xs:1, sm:1, md: "50%"}}>
            <TextField defaultValue={username} label="Username" sx={{ width: "100%", m: "1em" }} onChange={handleUserChange} />
            <TextField defaultValue={password} type="password" label="Password" sx={{ width: "100%", m: "1em" }} onChange={handlePasswordChange} />
            <TextField defaultValue={repeatedPassword} error={password !== repeatedPassword}
                helperText={password !== repeatedPassword ? "Repeated password must match password" : ""}
                type="password" label="Repeat Password" sx={{ width: "100%", m: "1em" }} onChange={handleRepeatedPasswordChange} />
            <Button
                sx={{
                    width: "10em",
                    height: "5em",
                    bgcolor: colors.red[500],
                    m: "1em"
                }}
                onClick={handleClick}
            >
                <Typography color={colors.white[100]} variant="h3">
                    Register
                </Typography>
            </Button>

        </Box>
    )
}