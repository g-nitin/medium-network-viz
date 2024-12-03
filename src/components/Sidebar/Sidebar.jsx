// src/components/Sidebar/Sidebar.jsx
import { useState } from 'react';
import {
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Divider,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Chip,
} from '@mui/material';
import {
  Article,
  ThumbUp,
  Comment,
  Timer,
  Info,
} from '@mui/icons-material';
import WelcomeDialog from '../WelcomeDialog/WelcomeDialog';
import './Sidebar.css';

const Sidebar = ({
  selectedDataset,
  setSelectedDataset,
  selectedMetric,
  setSelectedMetric,
  selectedNode,
  data,
}) => {
  const [welcomeDialogOpen, setWelcomeDialogOpen] = useState(false);

  const getMetricDescription = () => {
    const descriptions = {
      avgClaps: "Average number of claps received per article",
      avgResponses: "Average number of responses per article",
      avgReadingTime: "Average reading time in minutes per article"
    };
    return descriptions[selectedMetric];
  };

  const PublicationStats = ({ node }) => (
    <Box className="publication-stats">
      <Typography variant="subtitle2" color="primary" gutterBottom>
        Publication Statistics
      </Typography>
      <List dense>
        <ListItem>
          <ListItemIcon>
            <Article fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Total Articles" 
            secondary={node.articleCount.toLocaleString()}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <ThumbUp fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Average Claps" 
            secondary={node.avgClaps.toLocaleString(undefined, { 
              maximumFractionDigits: 0 
            })}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Comment fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Average Responses" 
            secondary={node.avgResponses.toFixed(1)}
          />
        </ListItem>
        <ListItem>
          <ListItemIcon>
            <Timer fontSize="small" />
          </ListItemIcon>
          <ListItemText 
            primary="Average Reading Time" 
            secondary={`${node.avgReadingTime.toFixed(1)} minutes`}
          />
        </ListItem>
      </List>
      
      {node.topTags && (
        <Box className="tags-section">
          <Typography variant="subtitle2" gutterBottom>
            Top Tags
          </Typography>
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {node.topTags.map((tag, index) => (
              <Chip
                key={index}
                label={tag}
                size="small"
                variant="outlined"
                color="primary"
              />
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <Paper className="sidebar">
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6" component="h2">
          Medium Publication Networks
        </Typography>
        <Button
          startIcon={<Info />}
          onClick={() => setWelcomeDialogOpen(true)}
          size="small"
        >
          Info
        </Button>
      </Box>
      
      <Box className="controls-section">
        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Dataset</InputLabel>
          <Select
            value={selectedDataset}
            onChange={(e) => setSelectedDataset(e.target.value)}
            label="Dataset"
          >
            <MenuItem value="dataset1">General Articles Dataset</MenuItem>
            <MenuItem value="dataset2">Tech/ML Articles Dataset</MenuItem>
            <MenuItem value="combined">Combined Dataset</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal" size="small">
          <InputLabel>Edge Weight Metric</InputLabel>
          <Select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            label="Edge Weight Metric"
          >
            <MenuItem value="avgClaps">Average Claps</MenuItem>
            <MenuItem value="avgResponses">Average Responses</MenuItem>
            <MenuItem value="avgReadingTime">Average Reading Time</MenuItem>
          </Select>
        </FormControl>

        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
          {getMetricDescription()}
        </Typography>
      </Box>

      {selectedNode && (
        <>
          <Divider sx={{ my: 2 }} />
          <Box className="publication-section">
            <Typography variant="subtitle1" gutterBottom>
              {selectedNode.name}
            </Typography>
            <PublicationStats node={selectedNode} />
          </Box>
        </>
      )}

      {!selectedNode && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="body2" color="text.secondary" align="center">
            Click on a node to see publication details
          </Typography>
        </Box>
      )}

      <WelcomeDialog 
        open={welcomeDialogOpen}
        onClose={() => setWelcomeDialogOpen(false)}
      />
    </Paper>
  );
};

export default Sidebar;