import pandas as pd
import numpy as np
from datetime import datetime, timedelta
import random

def generate_synthetic_data(num_records=10000):
    """Generate synthetic data for training the wait time prediction model"""
    
    np.random.seed(42)
    random.seed(42)
    
    data = []
    
    # Define service types and their average times
    services = [
        ('License Renewal', 15),
        ('Passport Application', 30),
        ('Birth Certificate', 20),
        ('Tax Payment', 10),
        ('Vehicle Registration', 25),
        ('Business Permit', 35),
        ('ID Card Renewal', 12),
        ('Marriage Certificate', 18),
    ]
    
    priorities = ['NORMAL', 'ELDERLY', 'DISABLED', 'EMERGENCY']
    priority_weights = [0.7, 0.15, 0.10, 0.05]  # Distribution of priorities
    
    for _ in range(num_records):
        # Random time features
        hour = np.random.choice(range(8, 18), p=[0.05, 0.08, 0.12, 0.15, 0.15, 0.15, 0.10, 0.10, 0.05, 0.05])  # Business hours bias
        weekday = np.random.choice(range(7), p=[0.05, 0.20, 0.20, 0.20, 0.20, 0.10, 0.05])  # Weekday bias
        
        # Service selection
        service_name, service_avg = random.choice(services)
        
        # Queue and counter features
        # Peak hours and weekdays tend to have longer queues
        base_queue = 5
        if hour in [9, 10, 11, 14, 15]:  # Peak hours
            queue_length = base_queue + np.random.poisson(8)
        elif hour in [8, 16, 17]:  # Medium hours
            queue_length = base_queue + np.random.poisson(4)
        else:  # Light hours
            queue_length = base_queue + np.random.poisson(2)
            
        # Weekend adjustment
        if weekday in [5, 6]:  # Weekend
            queue_length = int(queue_length * 0.6)
        
        # Number of active counters (typically 2-5)
        counters_active = np.random.choice([2, 3, 4, 5], p=[0.2, 0.4, 0.3, 0.1])
        
        # Priority
        priority = np.random.choice(priorities, p=priority_weights)
        priority_num = {'NORMAL': 1, 'ELDERLY': 2, 'DISABLED': 3, 'EMERGENCY': 4}[priority]
        
        # Calculate actual wait time (target variable)
        base_wait = service_avg * (queue_length / counters_active)
        
        # Add randomness and adjustments
        randomness_factor = np.random.normal(1.0, 0.3)  # ±30% randomness
        base_wait *= randomness_factor
        
        # Priority adjustments
        if priority == 'EMERGENCY':
            base_wait *= 0.3  # Emergency gets served quickly
        elif priority == 'ELDERLY':
            base_wait *= 0.7  # Elderly get some priority
        elif priority == 'DISABLED':
            base_wait *= 0.8  # Disabled get some priority
        
        # Peak hour delays
        if hour in [10, 11, 14]:
            base_wait *= 1.2
        
        # Ensure reasonable bounds
        wait_minutes = max(3, min(180, int(base_wait)))  # 3 min to 3 hours
        
        data.append({
            'hour': hour,
            'weekday': weekday,
            'service_avg_minutes': service_avg,
            'queue_length': queue_length,
            'counters_active': counters_active,
            'priority': priority_num,
            'wait_minutes': wait_minutes
        })
    
    df = pd.DataFrame(data)
    return df

if __name__ == '__main__':
    # Generate and save training data
    print("Generating synthetic training data...")
    df = generate_synthetic_data(10000)
    
    # Save to CSV
    df.to_csv('training_data.csv', index=False)
    print(f"Generated {len(df)} records")
    print("\nData summary:")
    print(df.describe())
    print("\nSample data:")
    print(df.head(10))
    print("\nData saved to 'training_data.csv'")