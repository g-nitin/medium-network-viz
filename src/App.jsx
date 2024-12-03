import { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from '@mui/material';
import NetworkVisualization from './components/NetworkVisualization/NetworkVisualization';
import Sidebar from './components/Sidebar/Sidebar'
import { useNetworkData } from './hooks/useNetworkData';
import WelcomeDialog from './components/WelcomeDialog/WelcomeDialog';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1a73e8',
    },
    secondary: {
      main: '#69b3a2',
    },
  },
});

function App() {
  const [selectedDataset, setSelectedDataset] = useState('dataset1');
  const [selectedMetric, setSelectedMetric] = useState('avgClaps');
  const [selectedNode, setSelectedNode] = useState(null);
  const { data, loading, error } = useNetworkData(selectedDataset);

  return (
    <ThemeProvider theme={theme}>
      <div className="app">
      <WelcomeDialog />
        <div className="main-content">
          <div className="visualization-container">
            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}
            {data && (
              <NetworkVisualization
                data={data}
                metric={selectedMetric}
                onNodeSelect={setSelectedNode}
              />
            )}
          </div>
          <Sidebar
            selectedDataset={selectedDataset}
            setSelectedDataset={setSelectedDataset}
            selectedMetric={selectedMetric}
            setSelectedMetric={setSelectedMetric}
            selectedNode={selectedNode}
            data={data}
          />
        </div>
      </div>
    </ThemeProvider>
  );
}

export default App;