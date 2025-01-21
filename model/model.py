import torch
from transformers import BertTokenizer, BertForSequenceClassification, get_linear_schedule_with_warmup
from sklearn.model_selection import train_test_split
from sklearn.metrics import classification_report, accuracy_score
import pandas as pd
from torch.utils.data import Dataset, DataLoader
from torch.optim import AdamW
import torch.nn.functional as F
from collections import Counter
import os

# generated input
data = {
    'text': [
        "I am so furious right now! This is outrageous!", "This is completely unfair, I can't believe this!",
        "I feel so down today, everything is so depressing and gloomy.", "I'm really sad, nothing seems to be going right for me.",
        "I can't get anything done, everything is frustrating and irritating!", "Why does everything keep going wrong? I feel so overwhelmed and stressed.",
        "I feel so happy, everything is going great and wonderful!", "Today is the best day ever, I'm so excited and thrilled!",
        "This news made me so angry!", "I'm feeling very blue and lonely.", "My work is incredibly frustrating.", "I'm absolutely delighted!",
        "I'm burning with anger!", "I'm feeling downhearted and dejected.", "This situation is so irritating and annoying!", "I'm walking on sunshine!",
        "I'm filled with rage!", "I'm feeling very low and miserable.", "This is extremely frustrating and bothersome!", "I'm on top of the world!",
        "I'm extremely angry and upset!", "I'm deeply saddened and heartbroken.", "I'm very frustrated and annoyed.", "I'm incredibly happy and joyful!"
    ],
    'label': ['angry', 'angry', 'sad', 'sad', 'frustrated', 'frustrated', 'happy', 'happy',
              'angry', 'sad', 'frustrated', 'happy', 'angry', 'sad', 'frustrated', 'happy',
              'angry', 'sad', 'frustrated', 'happy', 'angry', 'sad', 'frustrated', 'happy']
}

df = pd.DataFrame(data)
label_map = {'angry': 0, 'sad': 1, 'frustrated': 2, 'happy': 3}
df['label'] = df['label'].map(label_map)

train_texts, val_texts, train_labels, val_labels = train_test_split(df['text'], df['label'], test_size=0.3, random_state=42)

tokenizer = BertTokenizer.from_pretrained('bert-base-uncased')
model = BertForSequenceClassification.from_pretrained('bert-base-uncased', num_labels=4)

def tokenize_function(texts):
    return tokenizer(texts, padding=True, truncation=True, return_tensors="pt", max_length=128)

train_encodings = tokenize_function(train_texts.tolist())
val_encodings = tokenize_function(val_texts.tolist())

class ChatEmotionDataset(Dataset):
    def __init__(self, encodings, labels):
        self.encodings = encodings
        self.labels = labels

    def __getitem__(self, idx):
        item = {key: val[idx].clone().detach() for key, val in self.encodings.items()}
        item['labels'] = torch.tensor(self.labels[idx])
        return item

    def __len__(self):
        return len(self.labels)

train_dataset = ChatEmotionDataset(train_encodings, train_labels.tolist())
val_dataset = ChatEmotionDataset(val_encodings, val_labels.tolist())

learning_rate = 2e-5
batch_size = 4 
num_epochs = 10
weight_decay = 0.01

train_dataloader = DataLoader(train_dataset, batch_size=batch_size, shuffle=True)
val_dataloader = DataLoader(val_dataset, batch_size=batch_size)

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
model.to(device)

optimizer = AdamW(model.parameters(), lr=learning_rate, weight_decay=weight_decay)
total_steps = len(train_dataloader) * num_epochs
scheduler = get_linear_schedule_with_warmup(optimizer, num_warmup_steps=0, num_training_steps=total_steps)

def evaluate(model, dataloader):
    model.eval()
    all_preds = []
    all_labels = []
    with torch.no_grad():
        for batch in dataloader:
            inputs = {key: value.to(device) for key, value in batch.items()}
            labels = inputs.pop("labels")
            outputs = model(**inputs)
            preds = torch.argmax(outputs.logits, dim=-1)
            all_preds.extend(preds.cpu().numpy())
            all_labels.extend(labels.cpu().numpy())
    return accuracy_score(all_labels, all_preds), classification_report(all_labels, all_preds)

best_val_loss = float('inf')
patience = 3
patience_counter = 0

output_dir = "./fine_tuned_bert_chat" 
os.makedirs(output_dir, exist_ok=True) 

for epoch in range(num_epochs):
    model.train()
    epoch_loss = 0
    total_steps_in_epoch = len(train_dataloader)
    if total_steps_in_epoch == 0:
        print("Warning: Training data loader is empty. Skipping epoch.")
        continue

    for step, batch in enumerate(train_dataloader):
        inputs = {key: value.to(device) for key, value in batch.items()}
        labels = inputs.pop("labels")
        try:
            outputs = model(**inputs, labels=labels)
            loss = outputs.loss
            if loss is not None:
                epoch_loss += loss.item()
                loss.backward()
                torch.nn.utils.clip_grad_norm_(model.parameters(), 1.0)
                optimizer.step()
                scheduler.step()
                optimizer.zero_grad()
            else:
                print(f"Warning: Loss is None at step {step} of epoch {epoch+1}")
        except Exception as e:
            print(f"Error during training at step {step} of epoch {epoch+1}: {e}")
            continue

        if (step + 1) % (max(1, total_steps_in_epoch // 5)) == 0:
            print(f"Epoch {epoch + 1}/{num_epochs}, Step {step + 1}/{total_steps_in_epoch}, Current Loss: {loss.item() if loss is not None else 'N/A'}")

    train_loss = epoch_loss / len(train_dataloader) if len(train_dataloader) > 0 else 0
    val_accuracy, val_report = evaluate(model, val_dataloader)
    val_loss = 1- val_accuracy 
    print(f"Epoch {epoch + 1}/{num_epochs}, Train Loss: {train_loss:.4f}, Val Accuracy: {val_accuracy:.4f}")
    print(val_report)

    if val_loss < best_val_loss:
        best_val_loss = val_loss
        patience_counter = 0
        model.save_pretrained(output_dir) 
        tokenizer.save_pretrained(output_dir)
        print("Model Saved")
    else:
        patience_counter += 1
        if patience_counter >= patience:
            print("Early stopping!")
            break
