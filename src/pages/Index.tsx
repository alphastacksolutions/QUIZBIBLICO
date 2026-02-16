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

  // Temas bíblicos e banco de perguntas
  const biblicalThemes = [
    "Criação",
    "Arca de Noé",
    "Moisés",
    "Davi e Golias",
    "Daniel na Cova dos Leões",
    "Nascimento de Jesus",
    "Milagres de Jesus",
    "Parábolas",
    "Os Dez Mandamentos",
    "O Bom Samaritano",
    "O Filho Pródigo",
    "História da Páscoa",
    "História do Natal",
    "Os Apóstolos",
    "Os Frutos do Espírito"
  ];

  const questionsDatabase: Question[] = [
    // Criação
    { id: "1", text: "O que Deus criou no primeiro dia?", options: ["Animais", "Luz", "Plantas", "Água"], correctAnswer: 1, theme: "Criação" },
    { id: "2", text: "Quantos dias Deus levou para criar o mundo?", options: ["5 dias", "6 dias", "7 dias", "10 dias"], correctAnswer: 1, theme: "Criação" },
    { id: "3", text: "O que Deus criou no sétimo dia?", options: ["Animais", "Plantas", "Ele descansou", "O sol"], correctAnswer: 2, theme: "Criação" },
    
    // Arca de Noé
    { id: "4", text: "Quantos de cada animal Noé levou na arca?", options: ["Um", "Dois", "Três", "Quatro"], correctAnswer: 1, theme: "Arca de Noé" },
    { id: "5", text: "O que Deus usou para mostrar sua promessa a Noé?", options: ["Um arco-íris", "Uma estrela", "Uma montanha", "Um rio"], correctAnswer: 0, theme: "Arca de Noé" },
    { id: "6", text: "Por quantos dias choveu durante o dilúvio?", options: ["40 dias", "30 dias", "50 dias", "60 dias"], correctAnswer: 0, theme: "Arca de Noé" },
    
    // Moisés
    { id: "7", text: "O que Deus deu a Moisés no Monte Sinai?", options: ["Uma espada", "Os Dez Mandamentos", "Uma coroa", "Um mapa"], correctAnswer: 1, theme: "Moisés" },
    { id: "8", text: "Como Moisés partiu o Mar Vermelho?", options: ["Com um barco", "Com as mãos", "Com o poder de Deus", "Com uma ponte"], correctAnswer: 2, theme: "Moisés" },
    { id: "9", text: "O que Moisés transformou em cobra?", options: ["Sua vara", "Sua roupa", "Seus sandálias", "Sua chapéu"], correctAnswer: 0, theme: "Moisés" },
    
    // Davi e Golias
    { id: "10", text: "Quem matou Golias?", options: ["Saul", "Jonatã", "Davi", "Samuel"], correctAnswer: 2, theme: "Davi e Golias" },
    { id: "11", text: "O que Davi usou para lutar contra Golias?", options: ["Uma espada", "Uma lança", "Uma funda", "Um escudo"], correctAnswer: 2, theme: "Davi e Golias" },
    { id: "12", text: "Quão alto era Golias?", options: ["6 pés", "7 pés", "8 pés", "9 pés"], correctAnswer: 1, theme: "Davi e Golias" },
    
    // Daniel na Cova dos Leões
    { id: "13", text: "Por que Daniel foi jogado na cova dos leões?", options: ["Ele roubou comida", "Ele orava a Deus", "Ele quebrou a lei", "Ele fugiu"], correctAnswer: 1, theme: "Daniel na Cova dos Leões" },
    { id: "14", text: "O que aconteceu com os leões?", options: ["Eles comeram Daniel", "Eles dormiram", "Eles fugiram", "Eles falaram"], correctAnswer: 1, theme: "Daniel na Cova dos Leões" },
    { id: "15", text: "Por quantos dias Daniel ficou na cova dos leões?", options: ["1 dia", "2 dias", "3 dias", "7 dias"], correctAnswer: 2, theme: "Daniel na Cova dos Leões" },
    
    // Nascimento de Jesus
    { id: "16", text: "Onde Jesus nasceu?", options: ["Jerusalém", "Belém", "Nazaré", "Egito"], correctAnswer: 1, theme: "Nascimento de Jesus" },
    { id: "17", text: "O que os magos seguiram para encontrar Jesus?", options: ["Uma estrela", "Uma nuvem", "Uma voz", "Um sonho"], correctAnswer: 0, theme: "Nascimento de Jesus" },
    { id: "18", text: "Quais presentes os magos trouxeram para Jesus?", options: ["Brinquedos, roupas, livros", "Ouro, incenso, mirra", "Comida, água, roupas", "Animais, ferramentas, dinheiro"], correctAnswer: 1, theme: "Nascimento de Jesus" },
    
    // Milagres de Jesus
    { id: "19", text: "Quantos pães e peixes Jesus usou para alimentar 5000 pessoas?", options: ["2 pães, 5 peixes", "5 pães, 2 peixes", "7 pães, 3 peixes", "3 pães, 7 peixes"], correctAnswer: 1, theme: "Milagres de Jesus" },
    { id: "20", text: "O que Jesus transformou água em?", options: ["Leite", "Vinho", "Suco", "Mel"], correctAnswer: 1, theme: "Milagres de Jesus" },
    { id: "21", text: "Quem Jesus ressuscitou dos mortos?", options: ["Lázaro", "Pedro", "João", "Tiago"], correctAnswer: 0, theme: "Milagres de Jesus" },
    
    // Parábolas
    { id: "22", text: "Na história do Bom Samaritano, quem ajudou o homem ferido?", options: ["Um sacerdote", "Um levita", "Um samaritano", "Um soldado"], correctAnswer: 2, theme: "Parábolas" },
    { id: "23", text: "O que o Filho Pródigo faz quando volta para casa?", options: ["Exige dinheiro", "Arrepende-se e pede perdão", "Foge novamente", "Briga com o pai"], correctAnswer: 1, theme: "Parábolas" },
    { id: "24", text: "Na história da Ovelha Perdida, quantas ovelhas o pastor tinha?", options: ["90", "95", "99", "100"], correctAnswer: 3, theme: "Parábolas" },
    
    // Os Dez Mandamentos
    { id: "25", text: "Qual é o primeiro mandamento?", options: ["Não roubar", "Não matar", "Ame a Deus de todo o seu coração", "Honre seus pais"], correctAnswer: 2, theme: "Os Dez Mandamentos" },
    { id: "26", text: "Qual mandamento nos diz para lembrar do dia do sábado?", options: ["Primeiro mandamento", "Quarto mandamento", "Sétimo mandamento", "Décimo mandamento"], correctAnswer: 1, theme: "Os Dez Mandamentos" },
    { id: "27", text: "Qual mandamento nos diz para não mentir?", options: ["Terceiro mandamento", "Oitavo mandamento", "Nono mandamento", "Décimo mandamento"], correctAnswer: 2, theme: "Os Dez Mandamentos" },
    
    // História da Páscoa
    { id: "28", text: "O que aconteceu no Domingo de Páscoa?", options: ["Jesus nasceu", "Jesus foi batizado", "Jesus ressuscitou dos mortos", "Jesus subiu ao céu"], correctAnswer: 2, theme: "História da Páscoa" },
    { id: "29", text: "Quem encontrou o túmulo vazio?", options: ["Pedro e João", "Maria Madalena", "Os discípulos", "Os soldados romanos"], correctAnswer: 1, theme: "História da Páscoa" },
    { id: "30", text: "Por quantos dias Jesus ficou no túmulo?", options: ["1 dia", "2 dias", "3 dias", "4 dias"], correctAnswer: 2, theme: "História da Páscoa" },
    
    // História do Natal
    { id: "31", text: "Qual anjo apareceu a Maria?", options: ["Miguel", "Gabriel", "Rafael", "Uriel"], correctAnswer: 1, theme: "História do Natal" },
    { id: "32", text: "Quais animais estavam na estrebaria onde Jesus nasceu?", options: ["Vacas e ovelhas", "Burros e vacas", "Ovelhas e burros", "Todas as acima"], correctAnswer: 3, theme: "História do Natal" },
    { id: "33", text: "O que os pastores viram no céu?", options: ["Uma estrela", "Um anjo", "Uma nuvem", "Um arco-íris"], correctAnswer: 1, theme: "História do Natal" },
    
    // Os Apóstolos
    { id: "34", text: "Quantos apóstolos Jesus tinha?", options: ["10", "11", "12", "13"], correctAnswer: 2, theme: "Os Apóstolos" },
    { id: "35", text: "Qual apóstolo traiu Jesus?", options: ["Pedro", "João", "Judas", "Tomé"], correctAnswer: 2, theme: "Os Apóstolos" },
    { id: "36", text: "Qual apóstolo negou conhecer Jesus três vezes?", options: ["Pedro", "Tiago", "João", "André"], correctAnswer: 0, theme: "Os Apóstolos" },
    
    // Os Frutos do Espírito
    { id: "37", text: "Qual é o primeiro fruto do Espírito?", options: ["Alegria", "Amor", "Paz", "Paciência"], correctAnswer: 1, theme: "Os Frutos do Espírito" },
    { id: "38", text: "Qual fruto do Espírito significa ser gentil com os outros?", options: ["Bondade", "Gentileza", "Fidelidade", "Paciência"], correctAnswer: 1, theme: "Os Frutos do Espírito" },
    { id: "39", text: "O que o autocontrole nos ajuda a fazer?", options: ["Comer mais doces", "Controlar nossas ações e palavras", "Ficar acordado até tarde", "Ser egoísta"], correctAnswer: 1, theme: "Os Frutos do Espírito" },
    
    // Perguntas adicionais
    { id: "40", text: "Qual é o nome do barco que Noé construiu?", options: ["A Arca", "O Navio", "O Barco", "O Vaso"], correctAnswer: 0, theme: "Arca de Noé" },
    { id: "41", text: "Quem era o rei que Davi serviu antes de se tornar rei?", options: ["Saul", "Salomão", "Roboão", "Jeroboão"], correctAnswer: 0, theme: "Davi e Golias" },
    { id: "42", text: "O que Jonas fez quando Deus disse para ele ir a Nínive?", options: ["Obedeceu imediatamente", "Fugiu", "Orou por orientação", "Pediu ajuda"], correctAnswer: 1, theme: "Profetas" },
    { id: "43", text: "Quantos discípulos Jesus escolheu para serem seus apóstolos?", options: ["8", "10", "12", "15"], correctAnswer: 2, theme: "Ministério de Jesus" },
    { id: "44", text: "O que Jesus nos ensinou a orar no Pai Nosso?", options: ["Por dinheiro", "Por comida", "Pelo reino de Deus", "Por fama"], correctAnswer: 2, theme: "Ensinos de Jesus" },
    { id: "45", text: "Qual é a regra de ouro?", options: ["Faça aos outros como você gostaria que fizessem a você", "Sempre diga a verdade", "Compartilhe seus brinquedos", "Seja gentil com os animais"], correctAnswer: 0, theme: "Ensinos de Jesus" },
    { id: "46", text: "O que Jesus disse é o maior mandamento?", options: ["Ame seu próximo", "Honre seus pais", "Ame a Deus de todo o seu coração", "Guarde o sábado"], correctAnswer: 2, theme: "Ensinos de Jesus" },
    { id: "47", text: "O que Jesus usou para curar o cego?", options: ["Um remédio especial", "Lama e água", "Suas mãos", "Uma oração"], correctAnswer: 1, theme: "Milagres de Jesus" },
    { id: "48", text: "O que Jesus disse sobre as crianças?", options: ["Elas são irritantes", "Elas são as maiores no reino dos céus", "Elas devem ficar quietas", "Elas devem trabalhar"], correctAnswer: 1, theme: "Ensinos de Jesus" },
    { id: "49", text: "O que Jesus alimentou as 4000 pessoas com?", options: ["Pão e peixe", "Pão e carne", "Pão e queijo", "Pão e frutas"], correctAnswer: 0, theme: "Milagres de Jesus" },
    { id: "50", text: "O que Jesus disse sobre preocupações?", options: ["Preocupe-se com tudo", "Não se preocupe com o amanhã", "Preocupe-se com dinheiro", "Preocupe-se com o que os outros pensam"], correctAnswer: 1, theme: "Ensinos de Jesus" }
  ];

  const [currentQuestions, setCurrentQuestions] = useState<Question[]>([]);

  // Gerar perguntas aleatórias para cada quiz
  const generateRandomQuestions = () => {
    const shuffled = [...questionsDatabase].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 10);
  };

  // Iniciar quiz
  const startQuiz = () => {
    const newQuestions = generateRandomQuestions();
    setCurrentQuestions(newQuestions);
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setIsAnswered(false);
    setQuizCompleted(false);
    showSuccess("Quiz começou! Boa sorte! 🌟");
  };

  // Lidar com seleção de resposta
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
      showSuccess("Correto! 🎉");
    } else {
      setStats(prev => ({
        ...prev,
        currentStreak: 0
      }));
      showError("Tente novamente! 🤔");
    }
  };

  // Ir para próxima pergunta
  const nextQuestion = () => {
    if (currentQuestion < 9) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setIsAnswered(false);
    } else {
      // Quiz concluído
      setQuizCompleted(true);
      setStats(prev => ({
        ...prev,
        totalQuizzes: prev.totalQuizzes + 1,
        totalQuestions: prev.totalQuestions + 10
      }));
      
      // Conceder recompensas baseadas no desempenho
      const rewards = [];
      if (score >= 8) rewards.push("🏆 Mestre da Bíblia");
      if (score >= 6) rewards.push("⭐ Super Estrela");
      if (score >= 4) rewards.push("🌟 Amigo Fiel");
      if (score >= 2) rewards.push("💖 Coração Bondoso");
      
      setStats(prev => ({
        ...prev,
        rewards: [...prev.rewards, ...rewards]
      }));
      
      showSuccess(`Quiz concluído! Você marcou ${score}/10! 🎊`);
    }
  };

  // Reiniciar quiz com novas perguntas
  const restartQuiz = () => {
    startQuiz();
  };

  // Inicializar no primeiro carregamento
  useEffect(() => {
    startQuiz();
  }, []);

  if (currentQuestions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-xl font-bold">Carregando sua aventura...</p>
        </div>
      </div>
    );
  }

  const currentQ = currentQuestions[currentQuestion];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-300 to-blue-400 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Cabeçalho */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            🌟 Questão Bíblica 🌟
          </h1>
          <p className="text-xl text-white/90 mb-6">
            Aprenda a Palavra de Deus através de quizzes divertidos e aventuras!
          </p>
          
          {/* Exibição de Estatísticas */}
          <div className="flex justify-center gap-4 mb-6">
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Trophy className="text-yellow-400" />
                  <span className="text-white font-bold">Pontuação: {score}/10</span>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white/20 backdrop-blur-sm border-white/30">
              <CardContent className="p-3">
                <div className="flex items-center gap-2">
                  <Star className="text-orange-400" />
                  <span className="text-white font-bold">Sequência: {stats.currentStreak}</span>
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
          
          {/* Barra de Progresso */}
          <div className="w-full max-w-md mx-auto mb-6">
            <Progress value={(currentQuestion + 1) * 10} className="h-3 bg-white/20" />
            <p className="text-white/80 text-sm mt-2">
              Pergunta {currentQuestion + 1} de 10
            </p>
          </div>
        </div>

        {/* Área do Quiz */}
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
                    {currentQuestion < 9 ? "Próxima Pergunta" : "Finalizar Quiz"}
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          /* Resultados do Quiz */
          <Card className="bg-white/95 backdrop-blur-sm border-4 border-yellow-300 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mb-4">
                <div className="text-6xl mb-4">🎉</div>
                <CardTitle className="text-3xl font-bold text-gray-800 mb-2">
                  Quiz Concluído!
                </CardTitle>
                <p className="text-xl text-gray-600">
                  Você marcou {score} de 10!
                </p>
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 mb-4">
                  {score >= 8 ? "🏆 Mestre da Bíblia!" : 
                   score >= 6 ? "⭐ Super Estrela!" : 
                   score >= 4 ? "🌟 Amigo Fiel!" : 
                   score >= 2 ? "💖 Coração Bondoso!" : "🌈 Continue Aprendendo!"}
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
                    <p className="font-semibold text-blue-800">Total de Quizzes</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.totalQuizzes}</p>
                  </div>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <p className="font-semibold text-green-800">Respostas Corretas</p>
                    <p className="text-2xl font-bold text-green-600">{stats.correctAnswers}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="font-semibold text-purple-800">Melhor Sequência</p>
                    <p className="text-2xl font-bold text-purple-600">{stats.bestStreak}</p>
                  </div>
                  <div className="bg-pink-50 p-4 rounded-lg">
                    <p className="font-semibold text-pink-800">Recompensas Ganhas</p>
                    <p className="text-2xl font-bold text-pink-600">{stats.rewards.length}</p>
                  </div>
                </div>
                
                <Button
                  onClick={restartQuiz}
                  className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-3 px-8 rounded-full shadow-lg text-lg"
                >
                  🚀 Começar Nova Aventura!
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Feito com Dyad */}
        <div className="mt-8 text-center">
          <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 inline-block">
            <p className="text-white text-sm">
              Feito com ❤️ para os pequenos de Deus
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;