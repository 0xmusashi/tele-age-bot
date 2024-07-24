import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.tree import DecisionTreeRegressor
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_squared_error, mean_absolute_error
import joblib
import time

# Assuming you have a CSV file with columns 'user_id' and 'joining_date'
# Load the data
data = pd.read_csv('telegram_users.csv')

# Preprocess the data
# Convert joining_date to epoch seconds
data['joining_epoch'] = pd.to_datetime(data['joining_date']).astype(int) // 10**9

# Split the data into features and target
X = data[['user_id']]
y = data['joining_epoch']

# Split the data into training and testing sets
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define models
models = {
    'Linear Regression': LinearRegression(),
    'Decision Tree': DecisionTreeRegressor(),
    'Random Forest': RandomForestRegressor(n_estimators=100)
}

# Train and evaluate each model, store results
best_model = None
best_score = float('inf')

for name, model in models.items():
    model.fit(X_train, y_train)
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    mae = mean_absolute_error(y_test, y_pred)
    print(f"{name} - MSE: {mse}, MAE: {mae}")
    
    if mse < best_score:
        best_score = mse
        best_model = model

# Save the best model as a checkpoint file
joblib.dump(best_model, 'best_model_checkpoint.pkl')
print("Best model saved as 'best_model_checkpoint.pkl'.")

# Example inference with the best model
best_model = joblib.load('best_model_checkpoint.pkl')
new_user_ids = pd.DataFrame({'user_id': [123456, 789012]})
predicted_joining_epoch = best_model.predict(new_user_ids)
predicted_joining_dates = pd.to_datetime(predicted_joining_epoch, unit='s')
print(predicted_joining_dates)
