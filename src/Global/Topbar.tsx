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
      <Box display="flex" justifyContent={{ xs: "space-between", sm: "space-between", md: "space-evenly"}} alignItems="center" height="5em" bgcolor={colors.primary[900]}>
        <Link style={{ textDecoration: "none" }} to="/">
          <Box display="flex" gap="2em" justifyContent="flex-start" alignItems="center" ml="10%">
            <Box
              component="img"
              src="https://firebasestorage.googleapis.com/v0/b/memepageproject-5dadd.appspot.com/o/logo%2FlifelineMemeLogo.png?alt=media&token=0652ef7b-2115-4525-95b2-3c5e2860abc5"
              alt="logo"
              sx={{
                width: "100%",
                aspectRatio: "1/1",
                maxWidth: 50,
                maxHeight: 50
              }}
            />
            <Typography variant="h3" color={colors.white[200]}>Lifeline Memes</Typography>
          </Box>
        </Link>
        <UserComponent onLogoutCallback={onLogoutCallback} />
      </Box>
    </AppBar>
  )
}