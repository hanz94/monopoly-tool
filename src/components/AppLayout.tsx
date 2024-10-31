import '../App.css';
import LightModeIcon from '@mui/icons-material/LightMode';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Header from './Header/Header';
import ModalWindow from './ModalWindow/ModalWindow';
import { useThemeContext } from '../contexts/ThemeContext';
import { useModalContext } from '../contexts/ModalContext';

function AppLayout() {
    const { mode, toggleTheme } = useThemeContext();
    const { isModalOpen, modalClose, modalContent } = useModalContext();

    return ( 
    <>

    <ModalWindow open={isModalOpen} onClose={modalClose} modalContent={modalContent} />

        <Box className="flex flex-col justify-center items-center height-full-mobile-support">
          <Header />
          
          <Paper elevation={0} className='flex flex-col justify-center items-center' sx={{height: '100%', width: '100%'}} square>
            <Box className="flex flex-col justify-center items-center">
              <p className="text-4xl">
                Monopoly tool
              </p>
              <Button variant="contained" sx={{ mt: 2 }} onClick={toggleTheme}>
                {mode === 'dark' ? <LightModeIcon sx={{mr: 1}} /> : <DarkModeIcon sx={{mr: 1}} />}
                Switch to {mode === 'dark' ? 'light' : 'dark'} mode
              </Button>
            </Box>
          </Paper>
        </Box> 
    </>
        
    );
}

export default AppLayout;