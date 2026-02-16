"use client";

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Star, BookOpen, Heart, Sparkles } from 'lucide-react';
import { showSuccess, showError } from '@/utils/toast';

interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  theme: string;
}

interface QuizStats {
  totalQuizzes: number;
  correctAnswers: number;
  totalQuestions: number;
  currentStreak: number;
  bestStreak: number;
  rewards: string[];
}

const Index = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [stats, setStats] = useState<QuizStats>({
    totalQuizzes: 0,
    correctAnswers: 0,
    totalQuestions: 0,
    currentStreak: 0,
    bestStreak: 0,
    rewards: []
  });

  // Biblical themes and questions database
  const biblicalThemes = [
    "Creation",
    "Noah's Ark",
    "Moses",
    "David and Goliath",
    "Daniel in the Lions' Den",
    "Birth of Jesus",
    "Miracles of Jesus",
    "Parables",
    "The Ten Commandments",
    "The Good Samaritan",
    "The Prodigal Son",
    "Easter Story",
    "Christmas Story",
    "The Apostles",
    "The Fruits of the Spirit"
  ];

  const questionsDatabase: Question[] = [
    // Creation
    { id: "1", text: "What did God create on the first day?", options: ["Animals", "Light", "Plants", "Water"], correctAnswer: 1, theme: "Creation" },
    { id: "2", text: "How many days did it take God to create the world?", options: ["5 days", "6 days", "7 days", "10 days"], correctAnswer: 1, theme: "Creation" },
    { id: "3", text: "What did God create on the seventh day?", options: ["Animals", "Plants", "He rested", "The sun"], correctAnswer: 2, theme: "Creation" },
    
    // Noah's Ark
    { id: "4", text: "How many of each animal did Noah take on the ark?", options: ["One", "Two", "Three", "Four"], correctAnswer: 1, theme: "Noah's Ark" },
    { id: "5", text: "What did God use to show His promise to Noah?", options: ["A rainbow", "A star", "A mountain", "A river"], correctAnswer: 0, theme: "Noah's Ark" },
    { id: "6", text: "How long did the rain last during the flood?", options: ["40 days", "30 days", "50 days", "60 days"], correctAnswer: 0, theme: "Noah's Ark" },
    
    // Moses
    { id: "7", text: "What did God give Moses on Mount Sinai?", options: ["A sword", "The Ten Commandments", "A crown", "A map"], correctAnswer: 1, theme: "Moses" },
    { id: "8", text: "How did Moses part the Red Sea?", options: ["With a boat", "With his hands", "With God's power", "With a bridge"], correctAnswer: 2, theme: "Moses" },
    { id: "9", text: "What did Moses turn into a snake?", options: ["His staff", "His robe", "His sandals", "His hat"], correctAnswer: 0, theme: "Moses" },
    
    // David and Goliath
    { id: "10", text: "Who killed Goliath?", options: ["Saul", "Jonathan", "David", "Samuel"], correctAnswer: 2, theme: "David and Goliath" },
    { id: "11", text: "What did David use to fight Goliath?", options: ["A sword", "A spear", "A slingshot", "A shield"], correctAnswer: 2, theme: "David and Goliath" },
    { id: "12", text: "How tall was Goliath?", options: ["6 feet", "7 feet", "8 feet", "9 feet"], correctAnswer: 1, theme: "David and Goliath" },
    
    // Daniel in the Lions' Den
    { id: "13", text: "Why was Daniel thrown into the lions' den?", options: ["He stole food", "He prayed to God", "He broke the law", "He ran away"], correctAnswer: 1, theme: "Daniel in the Lions' Den" },
    { id: "14", text: "What happened to the lions?", options: ["They ate Daniel", "They slept", "They ran away", "They talked"], correctAnswer: 1, theme: "Daniel in the Lions' Den" },
    { id: "15", text: "How many days was Daniel in the lions' den?", options: ["1 day", "2 days", "3 days", "7 days"], correctAnswer: 2, theme: "Daniel in the Lions' Den" },
    
    // Birth of Jesus
    { id: "16", text: "Where was Jesus born?", options: ["Jerusalem", "Bethlehem", "Nazareth", "Egypt"], correctAnswer: 1, theme: "Birth of Jesus" },
    { id: "17", text: "What did the wise men follow to find Jesus?", options: ["A star", "A cloud", "A voice", "A dream"], correctAnswer: 0, theme: "Birth of Jesus" },
    { id: "18", text: "What gifts did the wise men bring Jesus?", options: ["Toys, clothes, books", "Gold, frankincense, myrrh", "Food, water, clothes", "Animals, tools, money"], correctAnswer: 1, theme: "Birth of Jesus" },
    
    // Miracles of Jesus
    { id: "19", text: "How many loaves and fishes did Jesus use to feed 5000 people?", options: ["2 loaves, 5 fishes", "5 loaves, 2 fishes", "7 loaves, 3 fishes", "3 loaves, 7 fishes"], correctAnswer: 1, theme: "Miracles of Jesus" },
    { id: "20", text: "What did Jesus turn water into?", options: ["Milk", "Wine", "Juice", "Honey"], correctAnswer: 1, theme: "Miracles of Jesus" },
    { id: "21", text: "Who did Jesus raise from the dead?", options: ["Lazarus", "Peter", "John", "James"], correctAnswer: 0, theme: "Miracles of Jesus" },
    
    // Parables
    { id: "22", text: "In the Good Samaritan story, who helped the injured man?", options: ["A priest", "A Levite", "A Samaritan", "A soldier"], correctAnswer: 2, theme: "Parables" },
    { id: "23", text: "What does the Prodigal Son do when he returns home?", options: ["Demands money", "Repents and asks for forgiveness", "Runs away again", "Fights with his father"], correctAnswer: 1, theme: "Parables" },
    { id: "24", text: "In the story of the Lost Sheep, how many sheep did the shepherd have?", options: ["90", "95", "99", "100"], correctAnswer: 3, theme: "Parables" },
    
    // The Ten Commandments
    { id: "25", text: "What is the first commandment?", options: ["Do not steal", "Do not kill", "Love God with all your heart", "Honor your parents"], correctAnswer: 2, theme: "The Ten Commandments" },
    { id: "26", text: "What commandment tells us to remember the Sabbath day?", options: ["First commandment", "Fourth commandment", "Seventh commandment", "Tenth commandment"], correctAnswer: 1, theme: "The Ten Commandments" },
    { id: "27", text: "What commandment tells us not to lie?", options: ["Third commandment", "Eighth commandment", "Ninth commandment", "Tenth commandment"], correctAnswer: 2, theme: "The Ten Commandments" },
    
    // Easter Story
    { id: "28", text: "What happened on Easter Sunday?", options: ["Jesus was born", "Jesus was baptized", "Jesus rose from the dead", "Jesus ascended to heaven"], correctAnswer: 2, theme: "Easter Story" },
    { id: "29", text: "Who found the empty tomb?", options: ["Peter and John", "Mary Magdalene", "The disciples", "The Roman soldiers"], correctAnswer: 1, theme: "Easter Story" },
    { id: "30", text: "How many days was Jesus in the tomb?", options: ["1 day", "2 days", "3 days", "4 days"], correctAnswer: 2, theme: "Easter Story" },
    
    // Christmas Story
    { id: "31", text: "What angel appeared to Mary?", options: ["Michael", "Gabriel", "Raphael", "Uriel"], correctAnswer: 1, theme: "Christmas Story" },
    { id: "32", text: "What animals were in the stable where Jesus was born?", options: ["Cows and sheep", "Donkeys and cows", "Sheep and donkeys", "All of the above"], correctAnswer: 3, theme: "Christmas Story" },
    { id: "33", text: "What did the shepherds see in the sky?", options: ["A star", "An angel", "A cloud", "A rainbow"], correctAnswer: 1, theme: "Christmas Story" },
    
    // The Apostles
    { id: "34", text: "How many apostles did Jesus have?", options: ["10", "11", "12", "13"], correctAnswer: 2, theme: "The Apostles" },
    { id: "35", text: "Which apostle betrayed Jesus?", options: ["Peter", "John", "Judas", "Thomas"], correctAnswer: 2, theme: "The Apostles" },
    { id: "36", text: "Which apostle denied knowing Jesus three times?", options: ["Peter", "James", "John", "Andrew"], correctAnswer: 0, theme: "The Apostles" },
    
    // The Fruits of the Spirit
    { id: "37", text: "What is the first fruit of the Spirit?", options: ["Joy", "Love", "Peace", "Patience"], correctAnswer: 1, theme: "The Fruits of the Spirit" },
    { id: "38", text: "Which fruit of the Spirit means being kind to others?", options: ["Goodness", "Kindness", "Gentleness", "Faithfulness"], correctAnswer: 1, theme: "The Fruits of the Spirit" },
    { id: "39", text: "What does self-control help us do?", options: ["Eat more candy", "Control our actions and words", "Stay up late", "Be selfish"], correctAnswer: 1, theme: "The Fruits of the Spirit" },
    
    // Additional questions
    { id: "40", text: "What is the name of the boat that Noah built?", options: ["The Ark", "The Ship", "The Boat", "The Vessel"], correctAnswer: 0, theme: "Noah's Ark" },
    { id: "41", text: "Who was the king that David served before becoming king?", options: ["Saul", "Solomon", "Rehoboam", "Jeroboam"], correctAnswer: 0, theme: "David and Goliath" },
    { id: "42", text: "What did Jonah do when God told him to go to Nineveh?", options: ["Obeyed immediately", "Ran away", "Prayed for guidance", "Asked for help"], correctAnswer: 1, theme: "Prophets" },
    { id: "43", text: "How many disciples did Jesus choose to be his apostles?", options: ["8", "10", "12", "15"], correctAnswer: 2, theme: "Jesus Ministry" },
    { id: "44", text: "What did Jesus teach us to pray in the Lord's Prayer?", options: ["For money", "For food", "For God's kingdom", "For fame"], correctAnswer: 2, theme: "Teachings of Jesus" },
    { id: "45", text: "What is the golden rule?", options: ["Do unto others as you would have them do unto you", "Always tell the truth", "Share your toys", "Be kind to animals"], correctAnswer: 0, theme: "Teachings of Jesus" },
    { id: "46", text: "What did Jesus say is the greatest commandment?", options: ["Love your neighbor", "Honor your parents", "Love God with all your heart", "Keep the Sabbath"], correctAnswer: 2, theme: "Teachings of Jesus" },
    { id: "47", text: "What did Jesus use to heal the blind man?", options: ["A special medicine", "Mud and water", "His hands", "A prayer"], correctAnswer: 1, theme: "Miracles of Jesus" },
    { id: "48", text: "What did Jesus say about children?", options: ["They are annoying", "They are the greatest in the kingdom of heaven", "They should be quiet", "They should work"], correctAnswer: 1, theme: "Teachings of Jesus" },
    { id: "49", text: "What did Jesus feed the 4000 people with?", options: ["Bread and fish", "Bread and meat", "Bread and cheese", "Bread and fruit"], correctAnswer: 0, theme: "Miracles of Jesus" },
    { id: "50", text: "What did Jesus say about worry?", options: ["Worry about everything", "Don't worry about tomorrow", "Worry about money", "Worry about what others think"], correctAnswer: 1, theme: "Teachings of Jesus" }
  ];

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  // Generate random questions for each quiz
  const generateRandomQuestions = () => {
    const shuffled = [...questionsDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Initialize quiz
  const startQuiz = () => {
    const newQuestions = generateRandomQuestions();
    setCurrentQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizCompleted(false);
    showSuccess("Quiz started! Good luck! 🌟");
  };

  // Handle answer selection
  const handleAnswerSelect = (answerIndex: number) => {
    if (isAnswered) return;
    
    setSelectedAnswer(answerIndex);
    setIsAnswered(true);

    const currentQ = currentQuestions[currentQuestion];
    const isCorrect = answerIndex === currentQ.correctAnswer;

    if (isCorrect) {
      setScore(score + 1);
      setStats(prev => ({
        ...prev,
        correctAnswers: prev.correctAnswers + 1,
        currentStreak: prev.currentStreak + 1,
        bestStreak: Math.max(prev.bestStreak, prev.currentStreak + 1)
      }));
      showSuccess("Correct! 🎉");
    } else {
      setStats(prev => ({
        ...prev,
        currentStreak: 0
      }));
      showError("Try again! 🤔");
    }
  };

  // Move to next question
  const nextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz completed
      setQuizCompleted(true);
      setStats(prev => ({
        ...prev,
        totalQuizzes: prev.totalQuizzes + 1,
        totalQuestions: prev.totalQuestions + 10
      }));
      
      // Award rewards based on performance
      const rewards = [];
      if (score >= 8) rewards.push("🏆 Bible Master");
      if (score >= 6) rewards.push("⭐ Super Star");
      if (score >= 4) rewards.push("🌟 Faithful Friend");
      if (score >= 2) rewards.push("💖 Kind Heart");
      
      setStats(prev => ({
        ...prev,
        rewards: [...prev.rewards, ...rewards]
      }));
      
      showSuccess(`Quiz completed! You scored ${score}/10! 🎊`);
    }
  };

  // Restart quiz with new questions
  const restartQuiz = () => {
    startQuiz();
  };

  // Initialize on first load
  useEffect(() => {
    startQuiz();
  }, []);

  if (currentQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Loading your adventure...</p>
        </div>
      </div>
    );
  }

  const currentQ = currentQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🌟 Bible Quest 🌟
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Learn God's Word through fun quizzes and adventures!
          </p>
          
          {/* Stats Display */}
          <div className="flex justify-center gap-4 mb-6">
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  <span className="text-white font-bold">Score: {score}/10</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Star className="text-orange-400" />
                  <span className="text-white font-bold">Streak: {stats.currentStreak}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <BookOpen className="text-blue-400" />
                  <span className="text-white font-bold">Quizzes: {stats.totalQuizzes}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Progress value={(currentQuestion + 1) * 10} className="h-3 bg-white/20" />
            <p className="text-white/80 text-sm mt-2">
              Question {currentQuestion + 1} of 10
            </p>
          </div>
        </div>

        {/* Quiz Area */}
        {!quizCompleted ? (
          <Card className="bg-white/95 backdrop-blur-sm border-4 border-yellow-300 shadow-2xl">
            <CardHeader className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  {currentQ.theme}
                </Badge>
                <Sparkles className="text-yellow-500" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-800">
                {currentQ.text}
              </CardTitle>
            </CardHeader>
            
            <CardContent>
              <div className="grid gap-3">
                {currentQ.options.map((option, index) => (
                  <Button
                    key={index}
                    onClick={() => handleAnswerSelect(index)}
                    disabled={isAnswered}
                    className={`p-4 text-left h-auto transition-all duration-200 ${
                      isAnswered
                        ? index === currentQ.correctAnswer
                          ? 'bg-green-500 text-white border-green-600'
                          : selectedAnswer === index
                          ? 'bg-red-500 text-white border-red-600'
                          : 'bg-gray-100 text-gray-700'
                        : 'bg-gradient-to-r from-blue-100 to-purple-100 hover:from-blue-200 hover:to-purple-200 text-gray-800 border-2 border-blue-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        isAnswered
                          ? index === currentQ.correctAnswer
                            ? 'bg-green-600 text-white'
                            : selectedAnswer === index
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-600'
                          : 'bg-blue-500 text-white'
                      }`}>
                        {String.fromCharCode(65 + index)}
                      </div>
                      <span className="font-medium">{option}</span>
                    </div>
                  </Button>
                ))}
              </div>
              
              {isAnswered && (
                <div className="mt-6 text-center">
                  <Button
                    onClick={nextQuestion}
                    className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white font-bold py-3 px-8 rounded-full shadow-lg"
                  >
                    {currentQuestion < 9 ? "Next Question" : "Finish Quiz"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Quiz Results */
          <Card className="bg-white/95 backdrop-blur-sm border-4 border-yellow-300 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mb-4">
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  Quiz Completed!
                </CardTitle>
                <p className="text-xl text-gray-600">
                  You scored {score} out of 10!
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  {score >= 8 ? "🏆 Bible Master!" : 
                   score >= 6 ? "⭐ Super Star!" : 
                   score >= 4 ? "🌟 Faithful Friend!" : 
                   score >= 2 ? "💖 Kind Heart!" : "🌈 Keep Learning!"}
                </div>
                
                <div className="flex justify-center gap-2 mb-6">
                  {stats.rewards.slice(-3).map((reward, index) => (
                    <Badge key={index} className="bg-gradient-to-r from-yellow-400 to-orange-400 text-white text-lg px-4 py-2">
                      {reward}
                    </Badge>
                  ))}
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6 text-left">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="font-semibold text-blue-800">Total Quizzes</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-800">Correct Answers</p>
                    <p className="text-2xl font-bold text-green-600">{stats.correctAnswers}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800">Best Streak</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.bestStreak}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="font-semibold text-pink-800">Rewards Earned</p>
                    <p className="text-2xl font-bold text-pink-600">{stats.rewards.length}</p>
                  </div>
                </div>
                
                <Button
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                >
                  🚀 Start New Adventure!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Made with Dyad */}
        <div className="mt-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-white text-sm">
              Made with ❤️ for God's little ones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;