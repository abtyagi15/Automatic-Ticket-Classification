import pickle
import json
import sys
from sklearn.feature_extraction.text import CountVectorizer


# Loading the saved model
loaded_model = pickle.load(open('C:/Users/abhis/OneDrive/Desktop/UsingSpawn/logreg_model.pkl', 'rb'))

# Loading the CountVectorizer vocabulary
loaded_vec = CountVectorizer(vocabulary=pickle.load(open('C:/Users/abhis/OneDrive/Desktop/UsingSpawn/count_vector.pkl', 'rb')))
loaded_tfidf = pickle.load(open('C:/Users/abhis/OneDrive/Desktop/UsingSpawn/tfidf.pkl', 'rb'))

# Defining the target names
target_names = ["Bank Account services", "Credit card or prepaid card", "Others", "Theft/Dispute Reporting", "Mortgage/Loan"]

def make_prediction(input_data):
    # Perform any necessary data preprocessing here
    # Input data should be a Python dictionary
    # Example preprocessing:
    text = input_data['text']

    # Convert input_data to a suitable format for prediction
    X_new_counts = loaded_vec.transform([text])
    X_new_tfidf = loaded_tfidf.transform(X_new_counts)

    
    prediction_index = loaded_model.predict(X_new_tfidf)[0]

    
    prediction_target_names= target_names[prediction_index]

    # Format the prediction label as needed
    return {'prediction': prediction_target_names}

if __name__ == '__main__':
    # Receive input data from the command line
    input_data = json.loads(sys.argv[1])

    # Make a prediction
    prediction = make_prediction(input_data)

    # Output the prediction as a JSON string
    print(json.dumps(prediction))
