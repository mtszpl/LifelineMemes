import { Link, useNavigate } from 'react-router-dom'

import { Box, Button, TextField, Typography, useTheme } from '@mui/material'
import { useState } from 'react';
import { useLogIn } from '../Api/UserManagement';
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
    const reroute = useNavigate()

    const handleClick = () => {
        logIn(userName, password).then(newUser => {
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
        <Box display="flex" flexDirection="column" alignItems="center" width={{ xs: 1, sm: 1, md: "50%" }}>
            <TextField defaultValue={userName} label="Username" sx={{ width: "100%", m: "1em" }} onChange={handleUserChange} />
            <TextField defaultValue={password} type="password" label="Password" sx={{ width: "100%", m: "1em" }} onChange={handlePasswordChange} />
            <Box
                sx={{
                    display: "flex",
                    width: "100%",
                    justifyContent: { xs: "space-between", sm: "space-between", md: "space-around"}
                }}
            >
                <Box display="flex" sx={{ flexGrow: { xs: 2, sm: 2 } }} justifyContent="stretch" alignItems="center">
                    <Link to={"/createuser"} style={{ textDecoration: "none", width: "100%"}}>
                        <Button
                            sx={{
                                width: "100%",
                                height: "5em",
                                bgcolor: colors.red[500],
                            }}
                        >
                            <Typography color={colors.white[100]} variant="h3">Sign In</Typography>
                        </Button>
                    </Link>
                </Box>
                <Button
                    sx={{
                        width: "10em",
                        height: "5em",
                        bgcolor: colors.red[500],
                        m: "1em",
                        flexGrow: { xs: 2, sm: 2 }
                    }}
                    onClick={() => handleClick()}>
                    <Typography color={colors.white[100]} variant="h3">Log In</Typography>
                </Button>
            </Box>
        </Box>
    )
}
