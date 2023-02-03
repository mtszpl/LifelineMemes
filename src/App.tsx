
import { Route, Routes, useNavigate } from "react-router-dom";

import { CssBaseline, ThemeProvider, useTheme } from "@mui/material"
import { Container } from "@mui/system";

import { ColorModeContext, tokens, useMode } from './Theme';
import Topbar from './Global/Topbar';
import MainMemeView from "./Pages/MainMemeView";
import MemeView from "./Pages/MemeView";
import Login from "./Pages/Login";
import { UserContext, useRegisterUser } from "./Api/UserManagement";
import { getImageFromProfileImgStore } from "./Api/Firebase";
import { useContext, useState } from "react";
import CreateUser from "./Pages/CreateUser";
import UserDashboard from "./Pages/UserDashboard";
import MemeCreate from "./Pages/MemeCreate";
import Page404 from "./Pages/Page404";

function App() {
  const [theme, colorMode] = useMode()
  const pageTheme = useTheme()
  const colors = tokens(pageTheme.palette.mode)

  const user = useContext(UserContext)
  const [currentUser, setCurrentUser] = useState(user)

  const createUser = useRegisterUser()
  const reroute = useNavigate()

  const handleLogin = (newUser: { username: string, profileImg: string, role: string }) => {
    console.log("logging");
    setCurrentUser(newUser)
    getImageFromProfileImgStore(newUser.profileImg, (imgUrl: string) => {
      setCurrentUser(currentUser => ({
        ...currentUser,
        profileImg: imgUrl
      }))
    })
  }

  const handleLogout = () => {
    setCurrentUser({ username: "", profileImg: "", role: "UNLOGGED" })
    reroute("/")
  }

  const handleCreateUser = (newUserName: string, newUserPassword: string) => {
    console.log(newUserName, newUserPassword)
    createUser(newUserName, newUserPassword)
      .then((data) => {
        reroute("/")
        data === true &&
          handleLogin({
            username: newUserName,
            profileImg: 'defaultAvatar.png',
            role: "USER"
          })
      })
  }

  return (
    <ColorModeContext.Provider value={colorMode}>
      <UserContext.Provider value={currentUser}>
        <div className="App">
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <main className='content'>
              <Topbar onLogoutCallback={handleLogout} />
              <Container sx={{ bgcolor: colors.primary[300], display: "flex", flexDirection: "column", alignItems: "center" }}>
                <Routes>
                  <Route path="/" element={<MainMemeView />} />
                  <Route path="/:id/:title" element={<MemeView />} />
                  <Route path="/login" element={<Login onLoginCallback={handleLogin} />} />
                  <Route path="/createuser" element={<CreateUser onUserCreateCallback={handleCreateUser} />} />
                  <Route path="/profilemanagement/:username" element={<UserDashboard />} />
                  <Route path="/creator" element={<MemeCreate author={currentUser.username} />} />
                  <Route path='*' element={<Page404 />} />
                </Routes>
              </Container>
            </main>
          </ThemeProvider>
        </div>
      </UserContext.Provider>
    </ColorModeContext.Provider>
  );
}

export default App;