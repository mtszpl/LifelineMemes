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
        <Box>
            {user.role === "UNLOGGED" ?
                (
                    <Link to="/login">
                        <IconButton type="button"
                            sx={{ backgroundColor: colors.red[500], borderRadius: "3px", margin: "2%", minWidth: "100px" }}>
                            Log In
                        </IconButton>
                    </Link>) :
                (
                    <Box display="flex" alignItems="center" gap="1%" >
                        <Box display="flex" sx={{cursor: "pointer"}} onClick={handleLoggedClick} alignItems="center">
                            <Typography variant="h3" mr="1em">
                                {user.username}
                            </Typography>
                            <img
                                width="50em"
                                height="50em"
                                src={user.profileImg}
                            />
                        </Box>
                        <IconButton type="button"
                            sx={{
                                backgroundColor: colors.red[500],
                                borderRadius: "3px",
                                margin: "2%",
                                height: "3em",
                                width: "3em"
                            }}
                            onClick={() => onLogoutCallback()}
                        >
                            <PowerSettingsNewIcon />
                        </IconButton>
                        {

                        }
                    </Box>
                )
            }
        </Box>
    )
}