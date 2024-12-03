import { FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import './Controls.css';

const Controls = ({
  selectedDataset,
  setSelectedDataset,
  selectedMetric,
  setSelectedMetric
}) => {
  return (
    <Paper className="controls-container">
      <FormControl variant="outlined" className="control-item">
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

      <FormControl variant="outlined" className="control-item">
        <InputLabel>Metric</InputLabel>
        <Select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          label="Metric"
        >
          <MenuItem value="avgClaps">Avg. Claps</MenuItem>
          <MenuItem value="avgResponses">Avg. Responses</MenuItem>
          <MenuItem value="avgReadingTime">Avg. Reading Time</MenuItem>
        </Select>
      </FormControl>
    </Paper>
  );
};

export default Controls;