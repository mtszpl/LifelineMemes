import { Box, IconButton, useTheme } from "@mui/material"
import Typography from "@mui/material/Typography"
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import { useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import { tokens } from "../Theme"
import { UserContext } from "../Api/UserManagement"

type Props = {
    onLogoutCallback: Function
}

export default function UserComponent({ onLogoutCallback }: Props) {
    const theme = useTheme()
    const colors = tokens(theme.palette.mode)
    const user = useContext(UserContext)
    const reroute = useNavigate()

    const handleLoggedClick = () => {
        reroute(`/profilemanagement/${user.username}`)
    }

    return (
        <Box sx={{
            width: "50%",
        }}>
            {user.role === "UNLOGGED" ?
                (
                    <Link to="/login">
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                margin: "2%",
                                height: "100%",
                                width: "100%",
                                minWidth: "100px"
                            }}>
                            <Typography variant="h3">Log In</Typography>
                        </IconButton>
                    </Link>) :
                (
                    <Box display="flex" alignItems="center" gap="1%">
                        <Box display="flex" sx={{
                            cursor: "pointer",
                            height: "100%",
                        }} onClick={handleLoggedClick} alignItems="center">
                            <Typography variant="h3" mr="1em">
                                {user.username}
                            </Typography>
                            <Box
                                component="img"
                                alt="user-profile-img"
                                sx={{
                                    height: { sm: "100%", md: "100%" },
                                    width: { sm: "100%", md: "100%" },
                                    maxWidth: 50,
                                    maxHeight: 50
                                }}
                                src={user.profileImg}
                                mx="5px"
                            />
                        </Box>
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                margin: "2%",
                                height: "70%",
                                width: "30%",
                                alignSelf: "center",
                                mx: 5
                            }}
                            onClick={() => onLogoutCallback()}
                        >
                            <PowerSettingsNewIcon />
                        </IconButton>
                    </Box>
                )
            }
        </Box>
    )
}