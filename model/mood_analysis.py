
import torch
from transformers import BertTokenizer, BertForSequenceClassification
from collections import Counter

model_path = './fine_tuned_bert_chat'
tokenizer = BertTokenizer.from_pretrained(model_path)
model = BertForSequenceClassification.from_pretrained(model_path)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

def get_mood_and_overall_mood(texts):
    encoded_texts = tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128).to(device)

    model.eval()
    with torch.no_grad():
        outputs = model(**encoded_texts)
        logits = outputs.logits

    predictions = torch.argmax(logits, dim=-1).cpu().numpy()
    emotion_labels = ['angry', 'sad', 'frustrated', 'happy']
    predicted_emotions = [emotion_labels[pred] for pred in predictions]

    mood_counts = Counter(predicted_emotions)
    if mood_counts:  
        overall_mood = mood_counts.most_common(1)[0][0] 
    else:
        overall_mood = "Neutral" 

    return predicted_emotions, overall_mood 

texts = [
    "This is the best day ever!",
    "This is completely unfair, I can't believe this!",
    "I feel so down today, everything is so depressing.",
    "I'm really sad, nothing seems to be going right.",
    "I can't get anything done, everything is frustrating!",
    "Why does everything keep going wrong? I feel so overwhelmed.",
    "I feel so happy, everything is going great!",
    "Today is the best day ever, I'm so excited!"
]

predicted_emotions, overall_mood = get_mood_and_overall_mood(texts) # Get both values

print(f"Overall Mood: {overall_mood}")

for text, emotion in zip(texts, predicted_emotions):
    print(f"Text: {text} -> Predicted Emotion: {emotion}")

    



