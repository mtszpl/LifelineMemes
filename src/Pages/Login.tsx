import { Link, useNavigate } from 'react-router-dom'

import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react';
import { useLogIn, } from '../Api/UserManagement';
import { tokens } from '../Theme';

type Props = {
    onLoginCallback: Function
}

export default function Login({ onLoginCallback }: Props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)

    const [userName, setUserName] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    const [, logIn] = useLogIn()
    const [, setUser] = useState({ username: "", profileImg: "", role: "UNLOGGED" })
    const reroute = useNavigate()

    const handleClick = (e: any) => {
        logIn(userName, password,
            (newUser: { username: string, profileImg: string, role: string }) => {
                setUser(user => ({
                    ...user,
                    username: newUser.username,
                    profileImg: newUser.profileImg,
                    role: newUser.role
                }))
                onLoginCallback(newUser)
                reroute("/")
            })
    }

    const handleUserChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setUserName(e.currentTarget.value)
    }

    const handlePasswordChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
        setPassword(e.currentTarget.value)
    }

    return (
        <Box display="flex" flexDirection="column" alignItems="center" width="50%">
            <TextField defaultValue={userName} label="Username" sx={{ width: "100%", m: "1em" }} onChange={handleUserChange} />
            <TextField defaultValue={password} type="password" label="Password" sx={{ width: "100%", m: "1em" }} onChange={handlePasswordChange} />
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-around"
                }}
            >
                <Link to={"/createuser"}>
                    <Button
                        sx={{
                            width: "10em",
                            height: "5em",
                            bgcolor: colors.red[500],
                            m: "1em"
                        }}
                        // onClick={(e) => handleClick(e)}
                        >
                        <Typography color={colors.white[100]} variant="h3">Sign In</Typography>
                    </Button>
                </Link>
                <Button
                    sx={{
                        width: "10em",
                        height: "5em",
                        bgcolor: colors.red[500],
                        m: "1em"
                    }}
                    onClick={(e) => handleClick(e)}>
                    <Typography color={colors.white[100]} variant="h3">Log In</Typography>
                </Button>
            </Box>
        </Box>
    )
}
