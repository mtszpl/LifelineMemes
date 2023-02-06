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
        <Box display="flex">
            {user.role === "UNLOGGED" ?
                (
                    <Link style={{ textDecoration: "none" }} to="/login">
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                height: "100%",
                                aspectRatio: "auto",
                                alignSelf: "flex-end",
                                mr: { xs: "5vh", sm: "10vh", md: "10vh" }
                            }}>
                            <Typography variant="h3">Log In</Typography>
                        </IconButton>
                    </Link>) :
                (

                    <Box display="flex" mr={{ xs: "4vh", sm: "8vh", md: 0}}>
                        <Box
                            display="flex"
                            alignItems="center"
                            sx={{
                                cursor: "pointer",
                                gap: "10%"
                            }}
                            mr={{ xs: "2vh", sm: "5vh", md: "5vh" }}
                            onClick={handleLoggedClick}
                        >
                            <Typography variant="h3" mr="1em">
                                {user.username}
                            </Typography>
                            <Box
                                component="img"
                                alt="user-profile-img"
                                sx={{
                                    width: "50px",
                                    aspectRatio: "1",
                                }}
                                src={user.profileImg}
                            />
                        </Box>
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                width: "40%",
                                aspectRatio: "2",
                                m: 0
                            }}
                            onClick={() => onLogoutCallback()}
                        >
                            <PowerSettingsNewIcon />
                        </IconButton>
                    </Box>
                )
            }
        </Box >
    )
}