import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Gamepad2, Brain, School, Type, Trophy, ArrowLeft, X, Loader2, Timer, CheckCircle, XCircle, Zap, Play, MapPin, BarChart3 } from 'lucide-react';
import { useGame } from '../context/GameContext';
import { callClaude } from '../api/claude';
import { TRIVIA_QUESTIONS } from '../data/triviaQuestions';
import { getLevel, LEVELS } from '../utils/credSystem';
import PageTransition from '../components/layout/PageTransition';

const COLLEGE_CLUES = [
  { clue: "India's oldest IIT, established in 1951 in West Bengal", answer: "IIT Kharagpur" },
  { clue: "Known as the 'MIT of India', located in Pilani, Rajasthan", answer: "BITS Pilani" },
  { clue: "This IIT's motto is 'Tamaso Ma Jyotirgamaya', located in Mumbai", answer: "IIT Bombay" },
  { clue: "Founded in 1959, this IIT is in the foothills of the Himalayas in Uttarakhand", answer: "IIT Roorkee" },
  { clue: "India's top law school, located in Bangalore, established in 1987", answer: "NLSIU Bangalore" },
  { clue: "This IIIT in Hyderabad is famous for its research in AI and NLP", answer: "IIIT Hyderabad" },
  { clue: "Known for its beautiful campus on the banks of Ganges, this is India's oldest central university", answer: "BHU Varanasi" },
  { clue: "This NIT in Tamil Nadu is consistently ranked among the top NITs", answer: "NIT Trichy" },
  { clue: "Previously known as DCE, this Delhi engineering college became a university", answer: "DTU Delhi" },
  { clue: "This private university in Karnataka is known for its medical and engineering programs", answer: "Manipal University" },
];

export default function Games() {
  const navigate = useNavigate();
  const { earnCred, addGameScore, credScore } = useGame();
  const [activeGame, setActiveGame] = useState(null);

  // Trivia state
  const [triviaQuestions, setTriviaQuestions] = useState([]);
  const [triviaIndex, setTriviaIndex] = useState(0);
  const [triviaScore, setTriviaScore] = useState(0);
  const [triviaSelected, setTriviaSelected] = useState(null);
  const [triviaLoading, setTriviaLoading] = useState(false);
  const [triviaTimer, setTriviaTimer] = useState(15);
  const [triviaFinished, setTriviaFinished] = useState(false);

  // Guess College state
  const [gcIndex, setGcIndex] = useState(0);
  const [gcScore, setGcScore] = useState(0);
  const [gcAnswer, setGcAnswer] = useState('');
  const [gcFeedback, setGcFeedback] = useState(null);
  const [gcFinished, setGcFinished] = useState(false);

  // Word Chain state
  const [wcCategory, setWcCategory] = useState('Indian Cities');
  const [wcWords, setWcWords] = useState([]);
  const [wcInput, setWcInput] = useState('');
  const [wcTimer, setWcTimer] = useState(60);
  const [wcStarted, setWcStarted] = useState(false);
  const [wcFinished, setWcFinished] = useState(false);

  const apiKey = localStorage.getItem('campusvibe_api_key');

  const startTrivia = async () => {
    setActiveGame('trivia');
    setTriviaLoading(true);
    setTriviaIndex(0);
    setTriviaScore(0);
    setTriviaSelected(null);
    setTriviaFinished(false);

    if (apiKey) {
      try {
        const result = await callClaude(
          'Generate 10 multiple choice trivia questions for Indian college students. Mix topics: Indian colleges, Bollywood, cricket, tech, general knowledge. Return ONLY valid JSON array: [{"question":"...","options":["a","b","c","d"],"correctIndex":0}]',
          'Generate trivia questions now.',
          apiKey
        );
        if (result) {
          const parsed = JSON.parse(result.replace(/```json?\n?/g, '').replace(/```/g, '').trim());
          if (Array.isArray(parsed) && parsed.length > 0) {
            setTriviaQuestions(parsed.slice(0, 10));
            setTriviaLoading(false);
            return;
          }
        }
      } catch {}
    }
    const shuffled = [...TRIVIA_QUESTIONS].sort(() => Math.random() - 0.5).slice(0, 10);
    setTriviaQuestions(shuffled);
    setTriviaLoading(false);
  };

  const answerTrivia = (index) => {
    if (triviaSelected !== null) return;
    setTriviaSelected(index);
    if (navigator.vibrate) navigator.vibrate(30);
    const correct = triviaQuestions[triviaIndex].correctIndex === index;
    if (correct) setTriviaScore(s => s + 1);

    setTimeout(() => {
      if (triviaIndex + 1 < triviaQuestions.length) {
        setTriviaIndex(i => i + 1);
        setTriviaSelected(null);
      } else {
        setTriviaFinished(true);
        const finalScore = correct ? triviaScore + 1 : triviaScore;
        addGameScore('trivia', finalScore);
        if (finalScore >= 7) earnCred('win_game');
      }
    }, 1000);
  };

  const checkGuessCollege = () => {
    const correct = gcAnswer.toLowerCase().includes(COLLEGE_CLUES[gcIndex].answer.toLowerCase().split(' ')[0].toLowerCase());
    setGcFeedback(correct ? 'correct' : 'wrong');
    if (navigator.vibrate) navigator.vibrate(correct ? [30] : [50, 30, 50]);
    if (correct) setGcScore(s => s + 1);

    setTimeout(() => {
      setGcAnswer('');
      setGcFeedback(null);
      if (gcIndex + 1 < 5) {
        setGcIndex(i => i + 1);
      } else {
        setGcFinished(true);
        addGameScore('guessCollege', correct ? gcScore + 1 : gcScore);
      }
    }, 1500);
  };

  const submitWordChain = () => {
    if (!wcInput.trim()) return;
    const word = wcInput.trim();
    if (wcWords.length > 0) {
      const lastWord = wcWords[wcWords.length - 1];
      if (word[0].toLowerCase() !== lastWord[lastWord.length - 1].toLowerCase()) {
        return;
      }
    }
    setWcWords(prev => [...prev, word]);
    setWcInput('');
  };

  const games = [
    {
      id: 'trivia',
      label: 'Campus Trivia',
      emoji: '🧠',
      desc: 'Test your knowledge with AI-generated questions',
      color: 'text-accent-purple',
      bg: 'bg-accent-purple/10',
      border: 'border-accent-purple/20',
      gradient: 'from-accent-purple/5 to-transparent',
      icon: Brain,
      difficulty: 'Medium',
      reward: '+20 Cred',
    },
    {
      id: 'guessCollege',
      label: 'Guess the College',
      emoji: '🏫',
      desc: 'Identify Indian colleges from clues',
      color: 'text-accent-warm',
      bg: 'bg-accent-warm/10',
      border: 'border-accent-warm/20',
      gradient: 'from-accent-warm/5 to-transparent',
      icon: School,
      difficulty: 'Hard',
      reward: '+15 Cred',
    },
    {
      id: 'wordChain',
      label: 'Word Chain',
      emoji: '🔤',
      desc: 'Chain words by their last letter',
      color: 'text-accent',
      bg: 'bg-accent/10',
      border: 'border-accent/20',
      gradient: 'from-accent/5 to-transparent',
      icon: Type,
      difficulty: 'Easy',
      reward: '+10 Cred',
    },
  ];

  // --- Game screens ---

  if (activeGame === 'trivia') {
    if (triviaLoading) {
      return (
        <PageTransition>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <Loader2 className="w-8 h-8 text-accent animate-spin mb-4" />
            <p className="text-text-secondary">AI is creating your trivia...</p>
          </div>
        </PageTransition>
      );
    }

    if (triviaFinished) {
      return (
        <PageTransition>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-6xl mb-4"
            >
              {triviaScore >= 7 ? '🏆' : triviaScore >= 4 ? '👏' : '😅'}
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">
              {triviaScore}/{triviaQuestions.length}
            </h2>
            <p className="text-text-secondary mb-2">
              {triviaScore >= 7 ? 'Amazing! You nailed it!' : triviaScore >= 4 ? 'Not bad at all!' : 'Better luck next time!'}
            </p>
            {triviaScore >= 7 && (
              <p className="text-accent font-semibold text-sm mb-4 flex items-center gap-1">
                <Zap className="w-4 h-4" /> +20 Cred earned!
              </p>
            )}
            <div className="flex gap-3">
              <button onClick={startTrivia} className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold active:scale-95 transition-transform">Play Again</button>
              <button onClick={() => setActiveGame(null)} className="px-6 py-3 rounded-xl bg-card border border-border text-text-secondary font-semibold">Back</button>
            </div>
          </div>
        </PageTransition>
      );
    }

    const q = triviaQuestions[triviaIndex];
    return (
      <PageTransition>
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setActiveGame(null)} className="p-2" aria-label="Exit game"><X className="w-5 h-5 text-text-secondary" /></button>
            <span className="text-sm text-text-secondary font-medium">{triviaIndex + 1}/{triviaQuestions.length}</span>
            <span className="text-sm font-bold text-accent flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {triviaScore}</span>
          </div>
          <div className="w-full h-1.5 bg-card-alt rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-accent rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((triviaIndex + 1) / triviaQuestions.length) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <h3 className="text-lg font-semibold text-text-primary mb-6 leading-relaxed">{q?.question}</h3>
          <div className="space-y-3" role="radiogroup" aria-label="Answer options">
            {q?.options?.map((opt, i) => {
              let style = 'bg-card border border-border text-text-primary hover:border-accent/30';
              if (triviaSelected !== null) {
                if (i === q.correctIndex) style = 'bg-success/20 border border-success text-success';
                else if (i === triviaSelected) style = 'bg-accent-danger/20 border border-accent-danger text-accent-danger';
              }
              return (
                <motion.button
                  key={i}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => answerTrivia(i)}
                  disabled={triviaSelected !== null}
                  role="radio"
                  aria-checked={triviaSelected === i}
                  className={`w-full text-left px-4 py-3.5 rounded-xl text-sm font-medium transition-all ${style}`}
                >
                  <span className="text-text-tertiary mr-2 font-semibold">{String.fromCharCode(65 + i)}.</span>
                  {opt}
                </motion.button>
              );
            })}
          </div>
        </div>
      </PageTransition>
    );
  }

  if (activeGame === 'guessCollege') {
    if (gcFinished) {
      return (
        <PageTransition>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-6xl mb-4"
            >
              {gcScore >= 4 ? '🏆' : '🏫'}
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">{gcScore}/5</h2>
            <p className="text-text-secondary mb-6">{gcScore >= 4 ? 'College expert!' : 'Keep learning!'}</p>
            <div className="flex gap-3">
              <button onClick={() => { setGcIndex(0); setGcScore(0); setGcFinished(false); }} className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold active:scale-95 transition-transform">Play Again</button>
              <button onClick={() => setActiveGame(null)} className="px-6 py-3 rounded-xl bg-card border border-border text-text-secondary font-semibold">Back</button>
            </div>
          </div>
        </PageTransition>
      );
    }

    return (
      <PageTransition>
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setActiveGame(null)} className="p-2" aria-label="Exit game"><X className="w-5 h-5 text-text-secondary" /></button>
            <span className="text-sm text-text-secondary font-medium">Round {gcIndex + 1}/5</span>
            <span className="text-sm font-bold text-accent flex items-center gap-1"><Zap className="w-3.5 h-3.5" /> {gcScore}</span>
          </div>
          <div className="w-full h-1.5 bg-card-alt rounded-full mb-6 overflow-hidden">
            <motion.div
              className="h-full bg-accent-warm rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((gcIndex + 1) / 5) * 100}%` }}
              transition={{ duration: 0.3 }}
            />
          </div>
          <div className="p-6 rounded-xl bg-gradient-to-br from-accent-warm/10 to-transparent border border-accent-warm/20 mb-6 text-center">
            <School className="w-8 h-8 text-accent-warm mx-auto mb-3" />
            <p className="text-text-primary leading-relaxed">{COLLEGE_CLUES[gcIndex]?.clue}</p>
          </div>
          <input
            value={gcAnswer}
            onChange={e => setGcAnswer(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && checkGuessCollege()}
            placeholder="Type the college name..."
            aria-label="Your answer"
            className="w-full bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent transition-all mb-3"
          />
          <AnimatePresence>
            {gcFeedback && (
              <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className={`flex items-center gap-2 p-3 rounded-xl mb-3 ${gcFeedback === 'correct' ? 'bg-success/10 text-success' : 'bg-accent-danger/10 text-accent-danger'}`} role="alert">
                {gcFeedback === 'correct' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                <span className="text-sm font-medium">{gcFeedback === 'correct' ? 'Correct!' : `It was ${COLLEGE_CLUES[gcIndex]?.answer}`}</span>
              </motion.div>
            )}
          </AnimatePresence>
          <button onClick={checkGuessCollege} disabled={!gcAnswer.trim()} className="w-full py-3 rounded-xl bg-accent text-primary font-semibold active:scale-[0.98] transition-transform disabled:opacity-50">Submit Answer</button>
        </div>
      </PageTransition>
    );
  }

  if (activeGame === 'wordChain') {
    if (wcFinished) {
      return (
        <PageTransition>
          <div className="flex flex-col items-center justify-center min-h-[60vh] px-4">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 300, damping: 15 }}
              className="text-6xl mb-4"
            >
              🔤
            </motion.div>
            <h2 className="text-2xl font-display font-bold text-text-primary mb-2">{wcWords.length} words</h2>
            <p className="text-text-secondary mb-6">{wcWords.length >= 8 ? 'Word master!' : 'Good try!'}</p>
            <div className="flex gap-3">
              <button onClick={() => { setWcWords([]); setWcFinished(false); setWcStarted(false); }} className="px-6 py-3 rounded-xl bg-accent text-primary font-semibold active:scale-95 transition-transform">Play Again</button>
              <button onClick={() => setActiveGame(null)} className="px-6 py-3 rounded-xl bg-card border border-border text-text-secondary font-semibold">Back</button>
            </div>
          </div>
        </PageTransition>
      );
    }

    return (
      <PageTransition>
        <div className="px-4 pt-2">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setActiveGame(null)} className="p-2" aria-label="Exit game"><X className="w-5 h-5 text-text-secondary" /></button>
            <span className="text-sm text-accent-warm font-bold">{wcCategory}</span>
            <span className="text-sm font-bold text-accent">{wcWords.length} words</span>
          </div>
          {!wcStarted ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 rounded-2xl bg-accent/10 flex items-center justify-center mx-auto mb-4">
                <Type className="w-8 h-8 text-accent" />
              </div>
              <h3 className="font-display font-bold text-text-primary mb-2">Word Chain</h3>
              <p className="text-sm text-text-secondary mb-4">Type words starting with the last letter of the previous word.</p>
              <p className="text-xs text-text-tertiary mb-4">Choose a category:</p>
              <div className="flex gap-2 justify-center mb-6 flex-wrap">
                {['Indian Cities', 'Bollywood Movies', 'Food Items'].map(c => (
                  <button
                    key={c}
                    onClick={() => setWcCategory(c)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${wcCategory === c ? 'bg-accent text-primary' : 'bg-card text-text-secondary border border-border hover:border-accent/30'}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              <button onClick={() => setWcStarted(true)} className="px-8 py-3 rounded-xl bg-accent text-primary font-semibold active:scale-95 transition-transform">Start!</button>
            </div>
          ) : (
            <>
              <div className="flex flex-wrap gap-2 mb-4 min-h-[60px] p-3 rounded-xl bg-card border border-border">
                {wcWords.map((w, i) => (
                  <motion.span
                    key={i}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="px-2 py-1 bg-accent/10 text-accent rounded-lg text-sm"
                  >
                    {w}
                  </motion.span>
                ))}
                {wcWords.length === 0 && <p className="text-text-tertiary text-sm">Type any word to start...</p>}
              </div>
              {wcWords.length > 0 && (
                <p className="text-xs text-text-secondary mb-2">Next word must start with: <span className="text-accent font-bold text-base">{wcWords[wcWords.length - 1].slice(-1).toUpperCase()}</span></p>
              )}
              <div className="flex gap-2">
                <input
                  value={wcInput}
                  onChange={e => setWcInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && submitWordChain()}
                  placeholder="Type a word..."
                  aria-label="Enter a word"
                  className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-text-primary placeholder:text-text-tertiary outline-none focus:border-accent"
                />
                <button onClick={submitWordChain} className="px-4 rounded-xl bg-accent text-primary font-semibold active:scale-95 transition-transform" aria-label="Submit word">Go</button>
              </div>
              <button onClick={() => { setWcFinished(true); addGameScore('wordChain', wcWords.length); }} className="w-full mt-4 py-2 rounded-xl bg-card border border-border text-text-secondary text-sm font-medium hover:border-accent/30 transition-colors">Finish Game</button>
            </>
          )}
        </div>
      </PageTransition>
    );
  }

  // --- Main game selection screen ---

  const level = getLevel(credScore || 0);
  const levelIndex = LEVELS.findIndex(l => l.name === level.name);
  const levelFloor = level.min;
  const levelCeil = level.max === Infinity ? level.min + 200 : level.max;
  const levelProgress = Math.min(
    100,
    Math.max(0, ((credScore - levelFloor) / (levelCeil - levelFloor)) * 100)
  );

  const startGame = (gameId) => {
    setActiveGame(gameId);
    if (gameId === 'trivia') startTrivia();
    if (gameId === 'guessCollege') { setGcIndex(0); setGcScore(0); setGcFinished(false); }
    if (gameId === 'wordChain') { setWcWords([]); setWcFinished(false); setWcStarted(false); }
  };

  const trivia = games.find(g => g.id === 'trivia');
  const guess = games.find(g => g.id === 'guessCollege');
  const wordChain = games.find(g => g.id === 'wordChain');

  return (
    <PageTransition>
      <div className="pt-2 px-4 pb-4">
        <section className="relative overflow-hidden mb-8 rounded-2xl p-6 bg-card/70 border-l-4 border-accent shadow-[0_0_30px_rgba(200,245,96,0.05)]">
          <div
            aria-hidden="true"
            className="absolute -right-8 -top-8 w-40 h-40 bg-accent/10 blur-[60px] rounded-full"
          />
          <div className="relative z-10">
            <p className="text-xs font-bold uppercase tracking-widest text-accent/70 mb-1">
              Your Standing
            </p>
            <div className="flex items-end gap-3">
              <h2 className="font-display font-black text-5xl tracking-[-0.04em] text-accent leading-none">
                {credScore}
              </h2>
              <span className="text-lg font-bold text-text-primary mb-1">Cred Points</span>
            </div>
            <div className="mt-4 flex items-center gap-3">
              <div className="h-2 flex-1 bg-card-alt rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${levelProgress}%` }}
                  transition={{ duration: 0.6, ease: 'easeOut' }}
                  className="h-full bg-gradient-to-r from-accent to-[#a8d84f] rounded-full shadow-[0_0_10px_rgba(200,245,96,0.4)]"
                />
              </div>
              <span className="text-xs font-bold uppercase tracking-wider text-text-tertiary whitespace-nowrap">
                {level.emoji} Level {levelIndex + 1}
              </span>
            </div>
          </div>
        </section>

        <div className="flex justify-between items-center mb-5">
          <h3 className="font-display font-bold text-xl text-text-primary tracking-tight">
            Active Arenas
          </h3>
          <button
            onClick={() => navigate('/leaderboard')}
            className="flex items-center gap-2 py-2 px-4 rounded-full bg-accent-purple/20 text-accent-purple border border-accent-purple/30 hover:bg-accent-purple/30 transition-all active:scale-95"
          >
            <BarChart3 className="w-3.5 h-3.5" />
            <span className="text-xs font-black uppercase tracking-tight">Leaderboard</span>
          </button>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <motion.button
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => startGame('trivia')}
            className="col-span-2 relative overflow-hidden rounded-2xl bg-card-alt aspect-[16/9] md:aspect-[21/9] group active:scale-[0.98] transition-transform"
            aria-label="Play Campus Trivia"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 via-transparent to-transparent" />
            <div
              aria-hidden="true"
              className="absolute -right-10 top-1/2 -translate-y-1/2 text-[180px] leading-none font-display font-black text-accent-purple/10 select-none"
            >
              {trivia.emoji}
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-surface via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 p-5 w-full flex justify-between items-end">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-accent-warm/20 text-accent-warm border border-accent-warm/30">
                    MEDIUM
                  </span>
                  <span className="text-accent font-bold text-xs">+20 Cred</span>
                </div>
                <h4 className="font-display font-black text-2xl tracking-[-0.02em] text-text-primary">
                  Campus Trivia
                </h4>
              </div>
              <div className="w-12 h-12 rounded-full bg-accent text-primary flex items-center justify-center shadow-[0_0_20px_rgba(200,245,96,0.4)] group-hover:scale-110 transition-transform">
                <Play className="w-5 h-5 fill-primary" strokeWidth={0} />
              </div>
            </div>
          </motion.button>

          <GameTile
            delay={0.05}
            onClick={() => startGame('guessCollege')}
            title={guess.label}
            IconComp={MapPin}
            iconBg="bg-accent-danger/20"
            iconColor="text-accent-danger"
            difficulty="Hard"
            difficultyStyle="bg-accent-danger/20 text-accent-danger border-accent-danger/30"
            reward="+15 Cred"
            cta="Start Match"
            glowColor="bg-accent-danger/5"
          />

          <GameTile
            delay={0.1}
            onClick={() => startGame('wordChain')}
            title={wordChain.label}
            IconComp={Type}
            iconBg="bg-accent-purple/20"
            iconColor="text-accent-purple"
            difficulty="Easy"
            difficultyStyle="bg-accent/20 text-accent border-accent/30"
            reward="+10 Cred"
            cta="Jump In"
            glowColor="bg-accent/5"
          />
        </div>

        <section className="mt-8 p-5 rounded-2xl bg-gradient-to-br from-card to-card/60 border border-border">
          <h5 className="text-xs font-black uppercase tracking-widest text-text-tertiary mb-4">
            Daily Quest
          </h5>
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-accent-warm/20 flex items-center justify-center text-accent-warm">
              <Zap className="w-5 h-5 fill-accent-warm" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-text-primary">Win 3 Games of Word Chain</p>
              <p className="text-xs text-text-tertiary mt-0.5">
                Reward: Exclusive "Word-Smith" Badge
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-black text-accent-warm">1/3</p>
            </div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
}

function GameTile({ delay, onClick, title, IconComp, iconBg, iconColor, difficulty, difficultyStyle, reward, cta, glowColor }) {
  return (
    <motion.button
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="relative overflow-hidden rounded-2xl bg-card aspect-square p-5 flex flex-col justify-between text-left active:scale-[0.98] transition-transform"
      aria-label={`Play ${title}`}
    >
      <div
        aria-hidden="true"
        className={`absolute -right-4 -bottom-4 w-32 h-32 blur-3xl rounded-full ${glowColor}`}
      />
      <div className="relative">
        <div className={`w-11 h-11 rounded-xl ${iconBg} ${iconColor} flex items-center justify-center mb-3`}>
          <IconComp className="w-5 h-5" />
        </div>
        <h4 className="font-display font-black text-xl leading-tight tracking-[-0.02em] text-text-primary">
          {title}
        </h4>
        <div className="flex items-center gap-2 mt-2">
          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase border ${difficultyStyle}`}>
            {difficulty}
          </span>
          <span className="text-accent font-bold text-xs">{reward}</span>
        </div>
      </div>
      <span className="relative w-full py-2.5 rounded-full bg-card-alt font-bold text-[11px] uppercase tracking-widest text-text-primary text-center">
        {cta}
      </span>
    </motion.button>
  );
}
