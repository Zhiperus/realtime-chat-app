import React from "react";
import Sidebar from "../components/Sidebar";
import Chat from "../components/Chat";
import SentimentAnalyzer from "natural/lib/natural/sentiment/SentimentAnalyzer";
import PorterStemmer from "natural/lib/natural/stemmers/porter_stemmer";

function Home() {
  const Analyzer = SentimentAnalyzer;
  const stemmer = PorterStemmer;
  const analyzer = new Analyzer("English", stemmer, "afinn");
  let totalScore = 0;

  const tests = [
    { input: "The tutorial was incredibly helpful and well-structured" },
    { input: "This tutorial is a complete waste of time" },
    { input: "I found the tutorial somewhat useful but lacking in detail" },
    { input: "The examples in this tutorial are clear and concise" },
    { input: "The tutorial is confusing and poorly explained" },
    { input: "This is the most engaging tutorial I've ever come across" },
    { input: "I wouldn’t recommend this tutorial to anyone" },
    { input: "The tutorial exceeded my expectations in every way" },
    { input: "The content is outdated and irrelevant to my needs" },
    { input: "I learned so much from this amazing tutorial" },
    { input: "The tutorial is mediocre, nothing special" },
    { input: "Every section of this tutorial is a masterpiece" },
    {
      input:
        "The tutorial lacks practical examples and real-world applications",
    },
    { input: "The tutorial was okay, but it could have been better" },
    { input: "I absolutely despise the way this tutorial is organized" },
  ];

  function interpretSentiment(score) {
    if (score > 0.5) return "Strongly Positive";
    if (score > 0) return "Positive";
    if (score === 0) return "Neutral";
    if (score > -0.5) return "Negative";
    return "Strongly Negative";
  }

  tests.forEach((test, index) => {
    const result = analyzer.getSentiment(test.input.split(" "));
    totalScore += result; // Add the score to the total
    const humanReadable = interpretSentiment(result);

    console.log(`Test ${index + 1}: Score is ${result} - ${humanReadable}`);
  });

  const averageScore = totalScore / tests.length;
  console.log(`Average Sentiment Score: ${interpretSentiment(averageScore)}`);

  return (
    <div className="flex h-screen justify-center items-center">
      <div className="flex border-2 border-teal-700 rounded-lg w-8/12 h-5/6 overflow-hidden">
        <Sidebar />
        <Chat />
      </div>
    </div>
  );
}

export default Home;
