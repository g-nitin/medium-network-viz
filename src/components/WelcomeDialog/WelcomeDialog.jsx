// src/components/WelcomeDialog/WelcomeDialog.jsx
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Link,
  Tabs,
  Tab,
  Divider,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  PanTool,
  Hub,
  Dataset,
  OpenInNew,
} from '@mui/icons-material';

const WelcomeDialog = ({ open, onClose }) => {  // Modified to accept props
  const [activeTab, setActiveTab] = useState(0);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  useEffect(() => {
    // Check if the dialog has been shown before
    const hasSeenDialog = localStorage.getItem('hasSeenWelcomeDialog');
    if (!hasSeenDialog) {
      setOpen(true);
    }
  }, []);

  const InteractionGuide = () => (
    <Box>
      <Typography variant="body1" paragraph>
        This visualization allows you to explore relationships between Medium publications
        through an interactive network graph. Here's how to interact with it:
      </Typography>
      <List>
        <ListItem>
          <ListItemIcon>
            <ZoomIn />
          </ListItemIcon>
          <ListItemText 
            primary="Zoom In/Out" 
            secondary="Use mouse wheel or pinch gesture on trackpad"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <PanTool />
          </ListItemIcon>
          <ListItemText 
            primary="Pan Around" 
            secondary="Click and drag the background to move the view"
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Hub />
          </ListItemIcon>
          <ListItemText 
            primary="Explore Publications" 
            secondary="Click on nodes to see detailed publication statistics"
          />
        </ListItem>
      </List>
    </Box>
  );

  const DatasetInfo = () => (
    <Box>
      <Typography variant="body1" paragraph>
        This visualization uses two complementary datasets from Medium:
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Dataset 1: General Publications
        </Typography>
        <Typography variant="body2" paragraph>
          Contains articles from seven major Medium publications:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon><Dataset fontSize="small" /></ListItemIcon>
            <ListItemText 
              primary="Publications included: Towards Data Science, UX Collective, The Startup, 
                       The Writing Cooperative, Data Driven Investor, Better Humans, Better Marketing"
            />
          </ListItem>
          <ListItem>
            <ListItemIcon><Dataset fontSize="small" /></ListItemIcon>
            <ListItemText primary="~6,500 articles from 2019" />
          </ListItem>
        </List>
        <Link 
          href="https://www.kaggle.com/datasets/dorianlazar/medium-articles-dataset"
          target="_blank"
          rel="noopener"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          View dataset on Kaggle
          <OpenInNew fontSize="small" />
        </Link>
      </Box>

      {/* Insert a divider */}
      <Divider sx={{ mb: 3 }} />

      <Box>
        <Typography variant="subtitle1" color="primary" gutterBottom>
          Dataset 2: Tech/ML Focus
        </Typography>
        <Typography variant="body2" paragraph>
          Specialized collection of technical articles:
        </Typography>
        <List dense>
          <ListItem>
            <ListItemIcon><Dataset fontSize="small" /></ListItemIcon>
            <ListItemText primary="Focus on Machine Learning, AI, and Data Science" />
          </ListItem>
          <ListItem>
            <ListItemIcon><Dataset fontSize="small" /></ListItemIcon>
            <ListItemText primary="~1,800 articles" />
          </ListItem>
        </List>
        <Link 
          href="https://www.kaggle.com/datasets/arnabchaki/medium-articles-dataset"
          target="_blank"
          rel="noopener"
          sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}
        >
          View dataset on Kaggle
          <OpenInNew fontSize="small" />
        </Link>
      </Box>

      <Typography variant="body2" sx={{ mt: 2, color: 'text.secondary' }}>
        You can view these datasets separately or combined using the dataset selector.
      </Typography>
    </Box>
  );

  return (
    <Dialog
      open={open}  // Use the prop instead of local state
      onClose={onClose}  // Use the prop instead of local handler
      maxWidth="md"
      fullWidth
      aria-labelledby="welcome-dialog-title"
    >
      <DialogTitle id="welcome-dialog-title">
        Welcome to Medium Publication Networks
      </DialogTitle>
      
      <Tabs
        value={activeTab}
        onChange={handleTabChange}
        centered
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="How to Interact" />
        <Tab label="About the Data" />
      </Tabs>

      <DialogContent>
        {activeTab === 0 && <InteractionGuide />}
        {activeTab === 1 && <DatasetInfo />}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose} color="primary">
          Got it
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default WelcomeDialog;