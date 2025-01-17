import { Avatar, Box, Button, Stack, Typography } from "@mui/material";
import Grid from '@mui/material/Grid2';
import { StyledBadge } from "../../contexts/ThemeContext";
import Accordion from '@mui/material/Accordion';
import AccordionDetails from '@mui/material/AccordionDetails';
import AccordionSummary from '@mui/material/AccordionSummary';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PlayerCard from "../PlayerCard";
import { useModalContext } from "../../contexts/ModalContext";
import newModalContent from "../../utils/newModalContent";
import { useGameContext } from "../../contexts/GameContext";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { scaleOnHover } from "../../utils/animations";
import GameSessionHandler from "../../database/GameSessionHandler";

function Bank() {

    const { modalOpen } = useModalContext();

    const { gameInfo, dbPlayersInfo } = useGameContext();

    const navigate = useNavigate();
    const location = useLocation();

    return ( 
        <div style={{ width: '90%', height: '100%' }}>

            <GameSessionHandler />

            <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>Witamy na stronie Banku!</Typography>
            <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>Na bieżąco sprawdzaj i zarządzaj kontami innych graczy.</Typography>

            <Typography sx={{ mt: 2, mb: 1, textAlign: 'center' }}>

                {/* Grid display - players */}
                <Grid container spacing={2}>
                    {Object.keys(dbPlayersInfo).map((playerCode, index) => {
                    return (
                        <Grid size={{ xs: 12, md: 6 }}>
                            <Accordion key={index} sx={{ my: 1.4 }}>
                                <AccordionSummary
                                expandIcon={<ArrowDownwardIcon />}
                                >
                                    <Stack direction="row" spacing={2} sx={{ mr: 1, my: 'auto' }}>
                                        <StyledBadge
                                        overlap="circular"
                                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                                        variant="dot"
                                        isOnline={dbPlayersInfo[playerCode].status == 'online'}
                                    >
                                            <Avatar sx={{ width: 32, height: 32, cursor: 'pointer'}}>
                                                {dbPlayersInfo[playerCode].name.charAt(0).toUpperCase()}
                                            </Avatar>
                                        </StyledBadge>
                                    </Stack>
                                    <Box>
                                        <Typography sx={{ my: 'auto', ml: 0.5, textAlign: 'left', fontSize: 17 }}>{dbPlayersInfo[playerCode].name} {dbPlayersInfo[playerCode].name == dbPlayersInfo[location.state?.playerCode]?.name && playerCode == location.state?.playerCode  && ' (Ty)'}</Typography>
                                        <Typography sx={{ my: 'auto', ml: 0.95, textAlign: 'left', fontSize: 12, fontWeight: 'bold' }}>{dbPlayersInfo[playerCode].balance} {gameInfo.currency}</Typography>
                                    </Box>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <PlayerCard
                                    currency={gameInfo.currency}
                                    gameID={gameInfo.gameID}
                                    playerCode={playerCode}
                                    playerName={dbPlayersInfo[playerCode].name}
                                    playerBalance={dbPlayersInfo[playerCode].balance}
                                    playerStatus={dbPlayersInfo[playerCode].status}
                                /> 
                                </AccordionDetails>
                            </Accordion>
                        </Grid>
                        );
                    })}
                </Grid>
            </Typography>

            <Button 
                variant="contained" 
                component={motion.button} 
                {...scaleOnHover} 
                sx={{ p: 1.4, margin: 'auto', display: 'block', mt: 2 }} 
                onClick={() => modalOpen(newModalContent.deleteGameConfirmation)}
            >
                Usuń sesję gry (ID: {location.state.gameID})
            </Button>

            <Button 
                variant="contained" 
                component={motion.button} 
                {...scaleOnHover} 
                sx={{ p: 1.4, margin: 'auto', display: 'block', mt: 2 }} 
                onClick={() => navigate('/player', { state: { gameID: location.state.gameID, playerCode: location.state.playerCode, token: location.state.token } })}
            >
                Panel gracza ({dbPlayersInfo[location.state.playerCode]?.name})
            </Button>
           
        </div>
    );
}

export default Bank;
