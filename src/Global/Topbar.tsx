import IconButton from "@mui/material/IconButton"
import Typography from "@mui/material/Typography"
import { Box, useTheme } from "@mui/system"
import { tokens } from "../Theme"
import NotificationsIcon from '@mui/icons-material/Notifications';
import { Link } from "react-router-dom";
import UserComponent from "../Components/UserComponent";
import AppBar from "@mui/material/AppBar";

type Props = {
  onLogoutCallback: Function
}

export default function Topbar({ onLogoutCallback }: Props) {
  const theme = useTheme()
  const colors = tokens(theme.palette.mode)

  return (
    <AppBar position="sticky">
      <Box display="flex" justifyContent="space-evenly" alignItems="center" height="5em" bgcolor={colors.primary[900]}>
        <Link style={{textDecoration: "none"}} to="/">
          <Box display="flex" gap="2em" justifyContent="flex-start" alignItems="center">
            <img
              // alt="logo" 
              src="../Assets/lifelineMemeLogo.png"
              width="50em"
              height="50em"
            />
            <Typography variant="h3" color={colors.white[200]}>Lifeline Memes</Typography>
          </Box>
        </Link>
        <Box m="5%" display="flex" justifyContent="flex-end">
          <IconButton>
            <NotificationsIcon />
          </IconButton>
          <UserComponent onLogoutCallback={onLogoutCallback} />
        </Box>
      </Box>
    </AppBar>
  )
}