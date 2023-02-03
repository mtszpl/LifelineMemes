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
            width: { sm: 75, md: 250 },
        }}>
            {user.role === "UNLOGGED" ?
                (
                    <Link to="/login">
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                margin: "2%",
                                height: { sm: 35, md: 50 },
                                width: { sm: 75, md: 100 },
                                //    minWidth: "100px"
                            }}>
                            Log In
                        </IconButton>
                    </Link>) :
                (
                    <Box display="flex" alignItems="center" gap="1%">
                        <Box display="flex" sx={{
                            cursor: "pointer",
                            height: { sm: 35, md: 50 },
                            // width: { sm: 50, md: 100 },
                        }} onClick={handleLoggedClick} alignItems="center">
                            <Typography variant="h3" mr="1em">
                                {user.username}
                            </Typography>
                            <Box
                                component="img"
                                alt="user-profile-img"
                                sx={{
                                    width: { xs: 30, sm: 50, md: 60 },
                                    height: { sm: 50, md: 60 },
                                }}
                                src={user.profileImg}
                            />
                        </Box>
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                margin: "2%",
                                height: { sm: 50, md: 60 },
                                width: { xs: 30, sm: 50, md: 60 },
                                alignSelf: "center"
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