import { useState, useEffect } from "react";
import "./App.css";
import { db } from "./firebase-config";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from "firebase/firestore";

export default function App() {
  const [newQuestion, setNewQuestion] = useState("");
  const [newAnswer, setNewAnswer] = useState("");
  const [questions, setQuestions] = useState([]);
  const questionsCollectionRef = collection(db, "questions");

  const createQuestion = async () => {
    await addDoc(questionsCollectionRef, { q: newQuestion, a: newAnswer });
  };

  const updateQuestion = async (id, countAsked) => {
    const questionDoc = doc(db, "questions", id);
    const newField = { countAsked: countAsked + 1 };
    await updateDoc(questionDoc, newField);
  };

  const deleteQuestion = async (id) => {
    const questionDoc = doc(db, "questions", id);
    await deleteDoc(questionDoc);
  };

  useEffect(() => {
    const getQuestions = async () => {
      const data = await getDocs(questionsCollectionRef);
      setQuestions(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getQuestions();
  }, []);

  return (
    <div className="App">
      <input
        type="text"
        placeholder="Question..."
        onChange={(e) => {
          setNewQuestion(e.target.value);
        }}
      />
      <input
        type="text"
        placeholder="Answer..."
        onChange={(e) => {
          setNewAnswer(e.target.value);
        }}
      />
      <button onClick={createQuestion}>Add Q</button>
      {questions.map((question) => {
        return (
          <div key={question.id}>
            <h1>Question: {question.q}</h1>
            <h1>Views: {question.countAsked}</h1>

            <button
              onClick={() => updateQuestion(question.id, question.countAsked)}
            >
              Edit
            </button>
            <button onClick={() => deleteQuestion(question.id)}>Delete</button>
          </div>
        );
      })}
    </div>
  );
}
