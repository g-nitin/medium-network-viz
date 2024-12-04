import pandas as pd
import json
import numpy as np
from pathlib import Path
import os


def load_and_clean_dataset(filepath):
    df = pd.read_csv(filepath)
    
    # Convert numeric columns to appropriate types
    df['responses'] = pd.to_numeric(df['responses'], errors='coerce')
    df['claps'] = pd.to_numeric(df['claps'], errors='coerce')
    df['reading_time'] = pd.to_numeric(df['reading_time'], errors='coerce')
    
    # Handle missing values
    df['responses'] = df['responses'].fillna(0)
    df['claps'] = df['claps'].fillna(df['claps'].mean())
    df['reading_time'] = df['reading_time'].fillna(df['reading_time'].median())
    
    # Convert date to datetime
    df['date'] = pd.to_datetime(df['date'], errors='coerce')
    
    # Remove rows with invalid dates
    df = df.dropna(subset=['date'])
    
    # Ensure publication is string type
    df['publication'] = df['publication'].astype(str)
    
    return df


def calculate_publication_metrics(df):
    try:
        metrics = df.groupby('publication').agg({
            'claps': ['mean', 'sum', 'count'],
            'responses': ['mean', 'sum'],
            'reading_time': 'mean'
        }).round(2)
        
        metrics.columns = [f"{col[0]}_{col[1]}" for col in metrics.columns]
        return metrics.reset_index()
    except Exception as e:
        print(f"Error in calculate_publication_metrics: {e}")
        print("DataFrame info:")
        print(df.info())
        print("\nDataFrame head:")
        print(df.head())
        raise


def create_network_data(df, metrics):
    publications = df['publication'].unique()
    
    # Create nodes
    nodes = []
    for pub in publications:
        pub_metrics = metrics[metrics['publication'] == pub].iloc[0]
        nodes.append({
            'id': pub,
            'name': pub,
            'articleCount': int(pub_metrics['claps_count']),
            'avgClaps': float(pub_metrics['claps_mean']),
            'avgResponses': float(pub_metrics['responses_mean']),
            'avgReadingTime': float(pub_metrics['reading_time_mean'])
        })
    
    # Create links
    links = []
    for i, pub1 in enumerate(publications):
        for pub2 in publications[i+1:]:
            pub1_articles = df[df['publication'] == pub1]
            pub2_articles = df[df['publication'] == pub2]
            
            # Calculate similarity metrics
            common_dates = len(set(pub1_articles['date'].dt.date) & 
                             set(pub2_articles['date'].dt.date))
            
            # Ensure we don't divide by zero
            total_unique_dates = len(df['date'].dt.date.unique())
            weight = common_dates / total_unique_dates if total_unique_dates > 0 else 0
            
            links.append({
                'source': pub1,
                'target': pub2,
                'commonDates': common_dates,
                'weight': weight
            })
    
    return {'nodes': nodes, 'links': links}


def main():
    dir_path = os.path.dirname(os.path.realpath(__file__))
    project_root = os.path.dirname(dir_path)
    
    # Update output directory to public/data
    output_dir = Path(f'{project_root}/public/data')
    output_dir.mkdir(parents=True, exist_ok=True)
    
    try:
        # Process Dataset 1
        print("Processing Dataset 1...")
        df1 = load_and_clean_dataset(f'{dir_path}/data/raw/medium_articles_dataset1.csv')
        metrics1 = calculate_publication_metrics(df1)
        network_data1 = create_network_data(df1, metrics1)
        
        with open(output_dir / 'dataset1.json', 'w') as f:
            json.dump(network_data1, f, indent=2)
        
        # Process Dataset 2
        print("Processing Dataset 2...")
        df2 = load_and_clean_dataset(f'{dir_path}/data/raw/medium_articles_dataset2.csv')
        metrics2 = calculate_publication_metrics(df2)
        network_data2 = create_network_data(df2, metrics2)
        
        with open(output_dir / 'dataset2.json', 'w') as f:
            json.dump(network_data2, f, indent=2)
        
        # Create combined dataset
        print("Processing Combined Dataset...")
        df_combined = pd.concat([df1, df2]).drop_duplicates()
        metrics_combined = calculate_publication_metrics(df_combined)
        network_data_combined = create_network_data(df_combined, metrics_combined)
        
        with open(output_dir / 'combined.json', 'w') as f:
            json.dump(network_data_combined, f, indent=2)
        
        print("Processing completed successfully!")
        
    except Exception as e:
        print(f"An error occurred: {e}")
        raise


if __name__ == '__main__':
    main()
