```markdown
# Medium Publication Networks Visualization

An interactive visualization of content relationships across Medium's digital ecosystem.

## Features

- Interactive force-directed network graph
- Multiple dataset views (General, Tech/ML, Combined)
- Various relationship metrics (Claps, Responses, Reading Time)
- Publication details on hover
- Zoom and pan capabilities
- Responsive design

## Setup

1. Clone the repository:
```bash
git clone https://github.com/g-nitin/medium-network-viz.git
cd medium-network-viz
```

2. Install dependencies:
```bash
npm install
```

3. Prepare the data:
```bash
npm run prepare-data
```

4. Start the development server:
```bash
npm run dev
```

## Deployment

To deploy to GitHub Pages:
```bash
npm run deploy
```

## Data Sources

- Dataset 1: [Medium Articles Dataset](https://www.kaggle.com/datasets/dorianlazar/medium-articles-dataset)
- Dataset 2: [Medium Tech/ML Articles Dataset](https://www.kaggle.com/datasets/arnabchaki/medium-articles-dataset)