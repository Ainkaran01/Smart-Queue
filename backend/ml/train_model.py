import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
import joblib
import os

def train_wait_time_model():
    """Train a Random Forest model to predict wait times"""
    
    # Load or generate data
    if os.path.exists('training_data.csv'):
        print("Loading existing training data...")
        df = pd.read_csv('training_data.csv')
    else:
        print("Training data not found. Generating new data...")
        from generate_data import generate_synthetic_data
        df = generate_synthetic_data(10000)
        df.to_csv('training_data.csv', index=False)
    
    print(f"Dataset shape: {df.shape}")
    
    # Prepare features and target
    feature_columns = ['hour', 'weekday', 'service_avg_minutes', 'queue_length', 'counters_active', 'priority']
    X = df[feature_columns]
    y = df['wait_minutes']
    
    # Split the data
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    
    print(f"Training set size: {X_train.shape[0]}")
    print(f"Test set size: {X_test.shape[0]}")
    
    # Train Random Forest model
    print("\nTraining Random Forest model...")
    rf_model = RandomForestRegressor(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=2,
        random_state=42,
        n_jobs=-1
    )
    
    rf_model.fit(X_train, y_train)
    
    # Make predictions
    y_pred_train = rf_model.predict(X_train)
    y_pred_test = rf_model.predict(X_test)
    
    # Evaluate the model
    print("\n=== MODEL EVALUATION ===")
    print(f"Training MAE: {mean_absolute_error(y_train, y_pred_train):.2f} minutes")
    print(f"Training RMSE: {np.sqrt(mean_squared_error(y_train, y_pred_train)):.2f} minutes")
    print(f"Training R²: {r2_score(y_train, y_pred_train):.3f}")
    
    print(f"\nTest MAE: {mean_absolute_error(y_test, y_pred_test):.2f} minutes")
    print(f"Test RMSE: {np.sqrt(mean_squared_error(y_test, y_pred_test)):.2f} minutes")
    print(f"Test R²: {r2_score(y_test, y_pred_test):.3f}")
    
    # Feature importance
    feature_importance = pd.DataFrame({
        'feature': feature_columns,
        'importance': rf_model.feature_importances_
    }).sort_values('importance', ascending=False)
    
    print("\n=== FEATURE IMPORTANCE ===")
    for _, row in feature_importance.iterrows():
        print(f"{row['feature']}: {row['importance']:.3f}")
    
    # Save the model
    model_path = 'wait_predictor.joblib'
    joblib.dump(rf_model, model_path)
    print(f"\nModel saved to: {model_path}")
    
    # Test with sample predictions
    print("\n=== SAMPLE PREDICTIONS ===")
    sample_features = [
        [10, 1, 20, 8, 3, 1],  # Normal morning
        [14, 2, 20, 12, 3, 1],  # Busy afternoon
        [11, 4, 20, 5, 4, 4],  # Emergency case
        [16, 0, 30, 3, 2, 2],  # Elderly priority, late afternoon
    ]
    
    scenarios = [
        "Normal morning (10am, Tuesday, 20min service, 8 in queue, 3 counters, normal priority)",
        "Busy afternoon (2pm, Wednesday, 20min service, 12 in queue, 3 counters, normal priority)",
        "Emergency case (11am, Friday, 20min service, 5 in queue, 4 counters, emergency priority)",
        "Elderly priority (4pm, Monday, 30min service, 3 in queue, 2 counters, elderly priority)"
    ]
    
    for i, (features, scenario) in enumerate(zip(sample_features, scenarios)):
        prediction = rf_model.predict([features])[0]
        print(f"{i+1}. {scenario}")
        print(f"   Predicted wait: {prediction:.1f} minutes\n")
    
    return rf_model

if __name__ == '__main__':
    model = train_wait_time_model()
    print("Training completed successfully!")