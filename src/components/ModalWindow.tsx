import React from 'react';
import {
  Modal,
  Box,
  Typography,
  IconButton,
  useTheme,
  styled,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface ThemeAwareModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const ModalContent = styled(Box)(({ theme }) => ({
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  maxWidth: '90%',
  backgroundColor: theme.palette.background.paper,
  boxShadow: theme.shadows[24],
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(4),
  outline: 'none',
}));

const ModalHeader = styled(Box)(({ theme }) => ({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: theme.spacing(2),
}));

export default function ThemeAwareModal({
  open,
  onClose,
  title,
  children,
}: ThemeAwareModalProps) {
  const theme = useTheme();

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="theme-aware-modal-title"
      aria-describedby="theme-aware-modal-description"
    >
      <ModalContent>
        <ModalHeader>
          <Typography variant="h6" component="h2" id="theme-aware-modal-title">
            {title}
          </Typography>
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              color: theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </ModalHeader>
        <Typography id="theme-aware-modal-description" sx={{ mt: 2 }}>
          {children}
        </Typography>
      </ModalContent>
    </Modal>
  );
}