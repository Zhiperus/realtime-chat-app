import sys
from transformers import AutoTokenizer, AutoModelForSequenceClassification, pipeline

texts = sys.argv[1];

model_name = "SamLowe/roberta-base-go_emotions"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = AutoModelForSequenceClassification.from_pretrained(model_name)

emotion_analyzer = pipeline("text-classification", model=model, tokenizer=tokenizer, top_k=None)

emotion_labels = [
    "admiration", "amusement", "anger", "annoyance", "approval", 
    "caring", "confusion", "curiosity", "desire", "disappointment", 
    "disapproval", "disgust", "embarrassment", "excitement", "fear", 
    "gratitude", "grief", "joy", "love", "nervousness", "optimism", 
    "pride", "realization", "relief", "remorse", "sadness", 
    "surprise", "neutral"
]
cumulative_scores = {label: 0 for label in emotion_labels}

for text in texts:
    results = emotion_analyzer(text)
    for result in results[0]:  
        cumulative_scores[result["label"]] += result["score"]


average_scores = {label: cumulative_scores[label] / len(texts) for label in emotion_labels}


overall_emotion = max(average_scores, key=average_scores.get)


print(overall_emotion)
sys.stdout.flush();