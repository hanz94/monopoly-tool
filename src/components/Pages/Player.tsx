import { Box, Button, Typography } from '@mui/material';
import CircularProgress from "@mui/material/CircularProgress";
import { useGameContext } from "../../contexts/GameContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInDown, scaleOnHover } from "../../utils/animations";
import GameSessionHandler from '../../database/GameSessionHandler';

function Player() {

    const { gameInfo, dbPlayersInfo } = useGameContext();
    
    const navigate = useNavigate();
    const location = useLocation();

    const playerBalance = dbPlayersInfo[location.state.playerCode]?.balance;
    
    return ( 
        <>
            <GameSessionHandler />

            {/* Welcome + your name */}
            <Typography variant="h5">Witaj {dbPlayersInfo[location.state.playerCode]?.name}!</Typography>

            {/* Your account balance */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="h6">Twoje konto:</Typography>
                <AnimatePresence mode="wait">
                    {playerBalance !== undefined && playerBalance !== null ? (
                        <Typography
                        variant="h4"
                        component={motion.div}
                        key={playerBalance} // Key based on balance
                        {...scaleOnHover}
                        {...fadeInDown} // Use fade-in-down animation
                        >
                        {playerBalance} {gameInfo.currency}
                        </Typography>
                    ) : (
                        <CircularProgress /> // Show loading icon if balance is not available
                    )}
                </AnimatePresence>
            </Box>

            {/* Other players list */}
            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Typography variant="h6">Inni gracze:</Typography>
                {Object.keys(dbPlayersInfo).map((playerCode, index) => {
                    if (playerCode === location.state.playerCode) return null;
                    return <Box key={index} sx={{ mt: 1 }}>
                        <Typography key={index}>{dbPlayersInfo[playerCode].name}</Typography>
                        <Typography>Stan konta: 
                             <AnimatePresence mode="wait"><motion.span key={dbPlayersInfo[playerCode].balance} {...scaleOnHover} {...fadeInDown} style={{ display: 'inline-block', marginLeft: '5px' }}> {dbPlayersInfo[playerCode].balance} {gameInfo.currency}</motion.span></AnimatePresence>
                        </Typography>
                        <Typography>Status: {dbPlayersInfo[playerCode].status}</Typography>
                    </Box>;
                })}
            </Box>

            <Button 
                variant="contained" 
                component={motion.button} 
                {...scaleOnHover} 
                sx={{ p: 1.4, margin: 'auto', display: 'block', mt: 2 }} 
                onClick={() => navigate('/bank', { state: { gameID: location.state.gameID, playerCode: location.state.playerCode, token: location.state.token } })}
            >
                Wejdź do banku
            </Button>
        </>
     );
}

export default Player;