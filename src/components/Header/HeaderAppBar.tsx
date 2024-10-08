import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';

type HeaderAppBarProps = {
  onToggleDrawer: (isDrawerOpen: boolean) => () => void
  isDrawerOpen: boolean
  isModalOpen: boolean
  setModalOpen: (newModalOpen: boolean) => void
}
function HeaderAppBar( {onToggleDrawer, isDrawerOpen, isModalOpen, setModalOpen} : HeaderAppBarProps ) {
    return (
      <>
          <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1
           }}>
            <Toolbar sx={{height: 64}}>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
                onClick={onToggleDrawer(!isDrawerOpen)}
              >
                {(isDrawerOpen) ? <ArrowBackIosNewIcon /> : <MenuIcon />}
              </IconButton>
              <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                Monopoly Tool
              </Typography>
              <Button color="inherit" onClick={() => setModalOpen(!isModalOpen)}>Wybierz pseudonim</Button>
            </Toolbar>
          </AppBar>
      </>
     );
}

export default HeaderAppBar;