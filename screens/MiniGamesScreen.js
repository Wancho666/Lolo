import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  SafeAreaView,
  Animated,
  Platform,
  StatusBar,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const { width } = Dimensions.get('window');

const MiniGamesScreen = () => {
  const navigation = useNavigation();
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    { id: 'color-match',   name: 'Color Match',   icon: 'palette',      color: '#3B82F6', description: 'Match colors to their names' },
    { id: 'math-quiz',     name: 'Quick Math',    icon: 'calculator',   color: '#8B5CF6', description: 'Simple arithmetic to keep your mind sharp' },
    { id: 'word-scramble', name: 'Word Scramble', icon: 'spell-check',  color: '#EC4899', description: 'Unscramble the hidden word' },
    { id: 'pair-match',    name: 'Pair Match',    icon: 'clone',        color: '#10B981', description: 'Flip cards and find matching pairs' },
    { id: 'true-or-false', name: 'True or False', icon: 'check-circle', color: '#F59E0B', description: 'Test your knowledge with fun facts' },
  ];

  // ─── Shared Gradient Background ──────────────────────────────────────────────
  const GradientBg = () => (
    <LinearGradient
      colors={['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9']}
      locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
      style={styles.gradientBackground}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    />
  );

  // ─── Game Selector ────────────────────────────────────────────────────────────
  const GameSelector = () => (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <GradientBg />

        {/* Inline nav bar — same flow as gameHeader, never overlaps */}
        <View style={styles.selectorNavBar}>
          <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()} activeOpacity={0.8}>
            <Icon name="arrow-left" size={18} color="#0F172A" />
            <Text style={styles.headerButtonText}>Back</Text>
          </TouchableOpacity>
          <View style={{ flex: 1 }} />
        </View>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header — matches InternetBrowsingScreen header card */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="brain" size={32} color="#0F172A" />
            </View>
            <Text style={styles.headerTitle}>🧠 Brain Training</Text>
            <Text style={styles.headerSubtitle}>Cognitive exercises for mental fitness</Text>
            <View style={styles.headerDivider} />
          </View>

          {/* Game Cards — matches moduleCard */}
          <View style={styles.moduleGrid}>
            {games.map((game) => (
              <TouchableOpacity
                key={game.id}
                style={styles.moduleCard}
                onPress={() => setCurrentGame(game.id)}
                activeOpacity={0.92}
              >
                <View style={[styles.moduleIconBg, { backgroundColor: game.color + '22' }]}>
                  <Icon name={game.icon} size={32} color={game.color} />
                </View>
                <View style={styles.moduleContent}>
                  <Text style={styles.moduleTitle}>{game.name}</Text>
                  <Text style={styles.moduleDescription}>{game.description}</Text>
                </View>
                <View style={styles.arrowIcon}>
                  <Icon name="chevron-right" size={18} color="#38BDF8" />
                </View>
              </TouchableOpacity>
            ))}
          </View>

          {/* Footer — matches InternetBrowsingScreen footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>💡 Tip: Pumili ng laro at simulan ang iyong brain training!</Text>
            <Text style={styles.footerSubtext}>Bawat laro ay nagpapalakas ng inyong memorya at isip.</Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  // ─── Shared Game Header Bar ───────────────────────────────────────────────────
  const GameHeader = ({ title, onReset, score = null, level = null }) => (
    <View style={styles.gameHeader}>
      {/* Row 1: Back + Reset buttons */}
      <View style={styles.gameHeaderRow}>
        <TouchableOpacity style={styles.headerButton} onPress={() => setCurrentGame(null)}>
          <Icon name="arrow-left" size={18} color="#0F172A" />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.gameHeaderCenter}>
          <Text style={styles.gameTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={onReset}>
          <Icon name="redo" size={18} color="#38BDF8" />
        </TouchableOpacity>
      </View>
      {/* Row 2: Score / Level pills — only when needed */}
      {(score !== null || level !== null) && (
        <View style={styles.gameStats}>
          {score !== null && (
            <View style={styles.statPill}>
              <Icon name="star" size={12} color="#F59E0B" />
              <Text style={styles.statPillText}>Score: {score}</Text>
            </View>
          )}
          {level !== null && (
            <View style={styles.statPill}>
              <Icon name="layer-group" size={12} color="#38BDF8" />
              <Text style={styles.statPillText}>Level: {level}</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );

  // ─── Shared Game Shell ────────────────────────────────────────────────────────
  const GameShell = ({ title, onReset, score, level, children }) => (
    <SafeAreaView style={styles.safeAreaGame} edges={['bottom', 'left', 'right']}>
      <View style={styles.container}>
        <GradientBg />
        <GameHeader title={title} onReset={onReset} score={score} level={level} />
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.gameScrollContent}>
          {children}
        </ScrollView>
      </View>
    </SafeAreaView>
  );

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 1 — COLOR MATCH
  // ═══════════════════════════════════════════════════════════════════════════════
  const ColorMatch = () => {
    const colorData = [
      { name: 'Red',    hex: '#EF4444' },
      { name: 'Blue',   hex: '#3B82F6' },
      { name: 'Green',  hex: '#10B981' },
      { name: 'Yellow', hex: '#EAB308' },
      { name: 'Purple', hex: '#8B5CF6' },
      { name: 'Orange', hex: '#F97316' },
    ];
    const [score, setScore]       = useState(0);
    const [level, setLevel]       = useState(1);
    const [round, setRound]       = useState(null);
    const [options, setOptions]   = useState([]);
    const [streak, setStreak]     = useState(0);
    const [feedback, setFeedback] = useState(null);
    const fadeAnim                = useRef(new Animated.Value(1)).current;

    const buildRound = useCallback(() => {
      const word = colorData[Math.floor(Math.random() * colorData.length)];
      let inkIdx;
      do { inkIdx = Math.floor(Math.random() * colorData.length); } while (colorData[inkIdx].name === word.name);
      const inkColor   = colorData[inkIdx];
      const distractors = colorData.filter(c => c.name !== inkColor.name).sort(() => Math.random() - 0.5).slice(0, 3);
      setRound({ word, inkColor });
      setOptions([...distractors, inkColor].sort(() => Math.random() - 0.5));
      setFeedback(null);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }, []);

    useEffect(() => { buildRound(); }, []);

    const handleAnswer = (chosen) => {
      if (feedback) return;
      const correct = chosen.name === round.inkColor.name;
      setFeedback(correct ? 'correct' : 'wrong');
      if (correct) { setScore(s => s + 10 + (streak >= 2 ? 5 : 0)); setStreak(s => s + 1); if ((score + 10) >= level * 60) setLevel(l => l + 1); }
      else { setStreak(0); }
      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }).start(() => setTimeout(buildRound, 200));
    };

    return (
      <GameShell title="Color Match" onReset={() => { setScore(0); setLevel(1); setStreak(0); buildRound(); }} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Color Match</Text>
          <Text style={styles.lessonSubtitle}>Tap the color that matches the INK — not what the word says!</Text>
        </View>

        {streak >= 3 && (
          <View style={styles.streakCard}>
            <Text style={styles.streakText}>🔥 {streak} streak! Bonus points!</Text>
          </View>
        )}

        {round && (
          <Animated.View style={[styles.gameContentCard, { opacity: fadeAnim }]}>
            <Text style={[styles.colorWord, { color: round.inkColor.hex }]}>{round.word.name}</Text>
            <Text style={styles.colorHint}>What color is the ink?</Text>
          </Animated.View>
        )}

        <View style={styles.colorOptionsGrid}>
          {options.map((opt, i) => (
            <TouchableOpacity key={i} style={[styles.colorOptionBtn, { backgroundColor: opt.hex }]} onPress={() => handleAnswer(opt)} activeOpacity={0.85}>
              <Text style={styles.colorOptionText}>{opt.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {feedback && (
          <View style={feedback === 'correct' ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
            <Icon name={feedback === 'correct' ? 'check-circle' : 'times-circle'} size={20} color={feedback === 'correct' ? '#059669' : '#DC2626'} />
            <Text style={feedback === 'correct' ? styles.feedbackCorrectText : styles.feedbackWrongText}>
              {feedback === 'correct' ? 'Correct!' : 'Try again!'}
            </Text>
          </View>
        )}
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 2 — QUICK MATH
  // ═══════════════════════════════════════════════════════════════════════════════
  const MathQuiz = () => {
    const [score, setScore]       = useState(0);
    const [level, setLevel]       = useState(1);
    const [question, setQuestion] = useState(null);
    const [options, setOptions]   = useState([]);
    const [answered, setAnswered] = useState(false);
    const [selected, setSelected] = useState(null);
    const timerRef                = useRef(null);

    const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const buildQuestion = useCallback(() => {
      const ops  = level <= 1 ? ['+', '-'] : level === 2 ? ['+', '-', '×'] : ['+', '-', '×', '÷'];
      const op   = ops[Math.floor(Math.random() * ops.length)];
      const maxN = level <= 1 ? 20 : level === 2 ? 50 : 99;
      let a, b, answer;
      if (op === '+')      { a = rand(1, maxN); b = rand(1, maxN); answer = a + b; }
      else if (op === '-') { b = rand(1, maxN); a = rand(b, maxN); answer = a - b; }
      else if (op === '×') { a = rand(2, 12);  b = rand(2, 12);   answer = a * b; }
      else                 { b = rand(2, 9);   answer = rand(2, 12); a = b * answer; }
      const wrongs = new Set();
      while (wrongs.size < 3) {
        const w = answer + (Math.random() < 0.5 ? 1 : -1) * rand(1, Math.max(5, Math.floor(answer * 0.3)));
        if (w !== answer && w >= 0) wrongs.add(w);
      }
      setQuestion({ a, b, op, answer, text: `${a} ${op} ${b}` });
      setOptions([answer, ...Array.from(wrongs)].sort(() => Math.random() - 0.5));
      setAnswered(false);
      setSelected(null);
    }, [level]);

    useEffect(() => { buildQuestion(); }, [level]);

    const handleAnswer = (val) => {
      if (answered) return;
      setSelected(val); setAnswered(true); clearTimeout(timerRef.current);
      if (val === question.answer) { setScore(s => s + 10 * level); if (score + 10 * level >= level * 50) setLevel(l => l + 1); }
      timerRef.current = setTimeout(buildQuestion, 1400);
    };
    useEffect(() => () => clearTimeout(timerRef.current), []);

    return (
      <GameShell title="Quick Math" onReset={() => { setScore(0); setLevel(1); }} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Quick Math</Text>
          <Text style={styles.lessonSubtitle}>Solve the math problem as quickly as you can!</Text>
        </View>

        {question && (
          <View style={[styles.gameContentCard, styles.mathCard]}>
            <Text style={styles.mathEquation}>{question.text} = ?</Text>
          </View>
        )}

        <View style={styles.mathOptionsGrid}>
          {options.map((opt, i) => {
            let bg = '#fff', borderColor = '#BAE6FD';
            if (answered && opt === question.answer)                           { bg = '#059669'; borderColor = '#059669'; }
            else if (answered && opt === selected && opt !== question.answer)  { bg = '#DC2626'; borderColor = '#DC2626'; }
            return (
              <TouchableOpacity key={i} style={[styles.mathOption, { backgroundColor: bg, borderColor }]} onPress={() => handleAnswer(opt)} activeOpacity={0.85} disabled={answered}>
                <Text style={[styles.mathOptionText, (answered && (opt === question.answer || opt === selected)) && { color: '#fff' }]}>{opt}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {answered && (
          <View style={selected === question?.answer ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
            <Icon name={selected === question?.answer ? 'check-circle' : 'times-circle'} size={20} color={selected === question?.answer ? '#059669' : '#DC2626'} />
            <Text style={selected === question?.answer ? styles.feedbackCorrectText : styles.feedbackWrongText}>
              {selected === question?.answer ? `Correct! The answer is ${question.answer}.` : `The answer was ${question?.answer}.`}
            </Text>
          </View>
        )}
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 3 — WORD SCRAMBLE
  // ═══════════════════════════════════════════════════════════════════════════════
  const WordScramble = () => {
    const wordList = [
      { word: 'APPLE',   hint: '🍎 A fruit' },          { word: 'BEACH',  hint: '🏖️ A sandy place' },
      { word: 'CLOCK',   hint: '⏰ Tells the time' },    { word: 'DANCE',  hint: '💃 Movement to music' },
      { word: 'EAGLE',   hint: '🦅 A large bird' },      { word: 'FLOWER', hint: '🌸 Grows in a garden' },
      { word: 'GARDEN',  hint: '🌿 Where plants grow' }, { word: 'HONEY',  hint: '🍯 Sweet bee product' },
      { word: 'ISLAND',  hint: '🏝️ Land surrounded by water' }, { word: 'JUNGLE', hint: '🌴 Dense tropical forest' },
      { word: 'KITTEN',  hint: '🐱 A baby cat' },        { word: 'LEMON',  hint: '🍋 A sour yellow fruit' },
      { word: 'MIRROR',  hint: '🪞 Shows your reflection' }, { word: 'NEEDLE', hint: '🧵 Used for sewing' },
      { word: 'ORANGE',  hint: '🍊 A citrus fruit' },    { word: 'PIANO',  hint: '🎹 A musical instrument' },
      { word: 'QUEEN',   hint: '👑 A royal lady' },      { word: 'RIVER',  hint: '🌊 Flowing water' },
      { word: 'SUNSET',  hint: '🌅 Evening sky colors' },{ word: 'TURTLE', hint: '🐢 Has a hard shell' },
    ];
    const [score, setScore]         = useState(0);
    const [level, setLevel]         = useState(1);
    const [current, setCurrent]     = useState(null);
    const [scrambled, setScrambled] = useState([]);
    const [selected, setSelected]   = useState([]);
    const [result, setResult]       = useState(null);
    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const buildRound = useCallback(() => {
      const entry = wordList[Math.floor(Math.random() * wordList.length)];
      let letters = shuffle(entry.word.split(''));
      while (letters.join('') === entry.word) letters = shuffle(letters);
      setCurrent(entry); setScrambled(letters); setSelected([]); setResult(null);
    }, []);

    useEffect(() => { buildRound(); }, []);

    const toggleLetter = (index) => {
      if (result) return;
      setSelected(prev => {
        if (prev.includes(index)) return prev.filter(i => i !== index);
        const next = [...prev, index];
        if (next.length === current.word.length) {
          const formed = next.map(i => scrambled[i]).join('');
          if (formed === current.word) {
            setResult('correct'); setScore(s => s + 15 * level);
            if (score + 15 * level >= level * 75) setLevel(l => l + 1);
            setTimeout(buildRound, 1500);
          } else {
            setResult('wrong');
            setTimeout(() => { setSelected([]); setResult(null); }, 900);
          }
        }
        return next;
      });
    };

    const formed = selected.map(i => scrambled[i]).join('');

    return (
      <GameShell title="Word Scramble" onReset={() => { setScore(0); setLevel(1); buildRound(); }} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Word Scramble</Text>
          <Text style={styles.lessonSubtitle}>Tap the letters in the correct order to spell the word!</Text>
        </View>

        {current && (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleText}>{current.hint}</Text>
          </View>
        )}

        <View style={styles.scrambleAnswer}>
          {current && Array.from({ length: current.word.length }).map((_, i) => (
            <View key={i} style={[styles.scrambleSlot, result === 'correct' && { backgroundColor: '#059669', borderColor: '#059669' }, result === 'wrong' && { backgroundColor: '#FEE2E2', borderColor: '#DC2626' }]}>
              <Text style={[styles.scrambleSlotText, result === 'correct' && { color: '#fff' }]}>{formed[i] || ''}</Text>
            </View>
          ))}
        </View>

        <View style={styles.scrambleLetters}>
          {scrambled.map((letter, i) => {
            const isUsed = selected.includes(i);
            return (
              <TouchableOpacity key={i} style={[styles.scrambleLetter, isUsed && styles.scrambleLetterUsed]} onPress={() => toggleLetter(i)} disabled={isUsed} activeOpacity={0.8}>
                <Text style={[styles.scrambleLetterText, isUsed && { color: '#9CA3AF' }]}>{letter}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity style={styles.listenBtn} onPress={() => { setSelected([]); setResult(null); }}>
          <Icon name="backspace" size={16} color="#38BDF8" />
          <Text style={styles.listenText}>Clear</Text>
        </TouchableOpacity>

        {result && (
          <View style={result === 'correct' ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
            <Icon name={result === 'correct' ? 'check-circle' : 'times-circle'} size={20} color={result === 'correct' ? '#059669' : '#DC2626'} />
            <Text style={result === 'correct' ? styles.feedbackCorrectText : styles.feedbackWrongText}>
              {result === 'correct' ? `Correct! "${current?.word}"` : 'Not quite — try again!'}
            </Text>
          </View>
        )}
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 4 — PAIR MATCH
  // ═══════════════════════════════════════════════════════════════════════════════
  const PairMatch = () => {
    const emojiSets = [
      ['🍎','🍌','🍇','🍓'], ['🐶','🐱','🐸','🐧'],
      ['🚗','✈️','🚢','🚂'], ['⚽','🏀','🎾','🏐'], ['🎸','🎹','🎺','🥁'],
    ];
    const buildDeck = useCallback(() => {
      const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
      return [...set, ...set].sort(() => Math.random() - 0.5).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    }, []);

    const [cards, setCards]       = useState(buildDeck);
    const [flipped, setFlipped]   = useState([]);
    const [score, setScore]       = useState(0);
    const [level, setLevel]       = useState(1);
    const [moves, setMoves]       = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon]           = useState(false);

    const resetGame = () => { setCards(buildDeck()); setFlipped([]); setMoves(0); setDisabled(false); setWon(false); };

    useEffect(() => {
      if (flipped.length === 2) {
        setDisabled(true); setMoves(m => m + 1);
        const [a, b] = flipped;
        if (cards[a].emoji === cards[b].emoji) {
          setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, matched: true, flipped: true } : c));
          setFlipped([]); setDisabled(false); setScore(s => s + 20);
          const next = cards.map((c, i) => i === a || i === b ? { ...c, matched: true } : c);
          if (next.every(c => c.matched)) { setWon(true); setLevel(l => l + 1); }
        } else {
          setTimeout(() => { setCards(prev => prev.map((c, i) => i === a || i === b ? { ...c, flipped: false } : c)); setFlipped([]); setDisabled(false); }, 900);
        }
      }
    }, [flipped]);

    const flipCard = (index) => {
      if (disabled || cards[index].flipped || cards[index].matched) return;
      setCards(prev => prev.map((c, i) => i === index ? { ...c, flipped: true } : c));
      setFlipped(prev => [...prev, index]);
    };

    return (
      <GameShell title="Pair Match" onReset={resetGame} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Pair Match</Text>
          <Text style={styles.lessonSubtitle}>Flip two cards at a time and find all matching pairs!</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statPill}><Icon name="shoe-prints" size={14} color="#38BDF8" /><Text style={styles.statPillText}>Moves: {moves}</Text></View>
          <View style={styles.statPill}><Icon name="star" size={14} color="#F59E0B" /><Text style={styles.statPillText}>Score: {score}</Text></View>
        </View>

        {won && (
          <View style={styles.wonBanner}>
            <Icon name="trophy" size={28} color="#F59E0B" style={{ marginBottom: 8 }} />
            <Text style={styles.wonText}>🎉 All pairs found! Well done!</Text>
            <TouchableOpacity style={styles.simulatorBtn} onPress={resetGame}>
              <Icon name="redo" size={14} color="#059669" />
              <Text style={styles.simulatorBtnText}>Play Again</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.cardGrid}>
          {cards.map((card, index) => (
            <TouchableOpacity key={card.id} style={[styles.flipCard, card.flipped && !card.matched && styles.flipCardOpen, card.matched && styles.flipCardMatched]} onPress={() => flipCard(index)} activeOpacity={0.85} disabled={card.matched || disabled}>
              <Text style={styles.flipCardEmoji}>{card.flipped || card.matched ? card.emoji : '❓'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 5 — TRUE OR FALSE
  // ═══════════════════════════════════════════════════════════════════════════════
  const TrueOrFalse = () => {
    const facts = [
      { statement: 'The Great Wall of China can be seen from space with the naked eye.', answer: false, explanation: 'Actually, the wall is too narrow to be seen from space without aid.' },
      { statement: 'Honey never spoils. Archaeologists have found edible honey in ancient Egyptian tombs.', answer: true, explanation: "Honey's low moisture and acidity make it last thousands of years!" },
      { statement: 'A group of flamingos is called a "flock."', answer: false, explanation: 'A group of flamingos is called a "flamboyance."' },
      { statement: 'The human body has more bacterial cells than human cells.', answer: true, explanation: 'We carry roughly 38 trillion bacteria versus 30 trillion human cells.' },
      { statement: "Mt. Everest is the tallest mountain when measured from the Earth's center.", answer: false, explanation: "Mt. Chimborazo in Ecuador is farthest from Earth's center due to the equatorial bulge." },
      { statement: 'Octopuses have three hearts.', answer: true, explanation: 'Two hearts pump blood to the gills; one pumps it to the body.' },
      { statement: 'Lightning never strikes the same place twice.', answer: false, explanation: 'Lightning often strikes the same spot many times. The Empire State Building gets struck ~25 times a year.' },
      { statement: 'Bananas are technically berries, but strawberries are not.', answer: true, explanation: 'Botanically, bananas qualify as berries. Strawberries are "accessory fruits."' },
      { statement: 'A day on Venus is shorter than a year on Venus.', answer: false, explanation: 'A Venusian day (243 Earth days) is longer than its year (225 Earth days).' },
      { statement: 'Goldfish have a memory span of only 3 seconds.', answer: false, explanation: 'Goldfish can remember things for months. The 3-second myth is just that — a myth!' },
      { statement: 'Cleopatra lived closer in time to the Moon landing than to the building of the Great Pyramid.', answer: true, explanation: 'The pyramids are ~2,500 years older than Cleopatra. The Moon landing was only ~2,000 years after her.' },
      { statement: 'The Eiffel Tower grows taller in summer.', answer: true, explanation: 'Heat expands the iron, making the tower up to 15 cm taller on hot days.' },
      { statement: 'Humans share 50% of their DNA with bananas.', answer: true, explanation: 'About half of our genes have a functional equivalent in bananas!' },
      { statement: "The ocean covers about 50% of the Earth's surface.", answer: false, explanation: "Oceans cover about 71% of Earth's surface." },
      { statement: 'Sharks are older than trees.', answer: true, explanation: 'Sharks have existed for ~450 million years; trees evolved only ~350 million years ago.' },
    ];
    const [score, setScore]             = useState(0);
    const [level, setLevel]             = useState(1);
    const [index, setIndex]             = useState(() => Math.floor(Math.random() * facts.length));
    const [answered, setAnswered]       = useState(false);
    const [chosen, setChosen]           = useState(null);
    const [usedIndices, setUsedIndices] = useState([]);
    const current = facts[index];

    const nextQuestion = useCallback(() => {
      const remaining = facts.map((_, i) => i).filter(i => !usedIndices.includes(i));
      if (remaining.length === 0) { setUsedIndices([]); setIndex(Math.floor(Math.random() * facts.length)); }
      else { const next = remaining[Math.floor(Math.random() * remaining.length)]; setUsedIndices(prev => [...prev, next]); setIndex(next); }
      setAnswered(false); setChosen(null);
    }, [usedIndices]);

    const handleAnswer = (val) => {
      if (answered) return;
      setChosen(val); setAnswered(true);
      if (val === current.answer) { setScore(s => s + 10 * level); if (score + 10 * level >= level * 50) setLevel(l => l + 1); }
    };

    const isCorrect = chosen === current.answer;

    return (
      <GameShell title="True or False" onReset={() => { setScore(0); setLevel(1); setUsedIndices([]); setAnswered(false); setChosen(null); setIndex(Math.floor(Math.random() * facts.length)); }} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>True or False</Text>
          <Text style={styles.lessonSubtitle}>Read the statement carefully — is it True or False?</Text>
        </View>

        {/* Fact card — mirrors tipCard with left border accent */}
        <View style={[styles.tipCard, { borderLeftColor: '#0EA5E9' }]}>
          <Text style={styles.tipDescription}>{current.statement}</Text>
        </View>

        {!answered ? (
          <View style={styles.tfButtons}>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#059669' }]} onPress={() => handleAnswer(true)} activeOpacity={0.85}>
              <Icon name="check" size={22} color="#fff" />
              <Text style={styles.tfBtnText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#DC2626' }]} onPress={() => handleAnswer(false)} activeOpacity={0.85}>
              <Icon name="times" size={22} color="#fff" />
              <Text style={styles.tfBtnText}>False</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={isCorrect ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
              <Icon name={isCorrect ? 'check-circle' : 'times-circle'} size={20} color={isCorrect ? '#059669' : '#DC2626'} />
              <Text style={isCorrect ? styles.feedbackCorrectText : styles.feedbackWrongText}>
                {isCorrect ? 'Correct!' : `The answer is ${current.answer ? 'TRUE' : 'FALSE'}.`}
              </Text>
            </View>
            {/* Explanation — mirrors exampleContainer */}
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>{current.explanation}</Text>
            </View>
            <TouchableOpacity style={[styles.simulatorBtn, { alignSelf: 'center', marginTop: 4 }]} onPress={nextQuestion}>
              <Icon name="arrow-right" size={14} color="#059669" />
              <Text style={styles.simulatorBtnText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameShell>
    );
  };

  // ─── Router ───────────────────────────────────────────────────────────────────
  const renderGame = () => {
    switch (currentGame) {
      case 'color-match':   return <ColorMatch />;
      case 'math-quiz':     return <MathQuiz />;
      case 'word-scramble': return <WordScramble />;
      case 'pair-match':    return <PairMatch />;
      case 'true-or-false': return <TrueOrFalse />;
      default:              return <GameSelector />;
    }
  };

  return renderGame();
};

// ─── Styles — mirrors InternetBrowsingScreen exactly ─────────────────────────
const styles = StyleSheet.create({

  // ── Base shells ──────────────────────────────────────────────────────────────
  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  // Game shell: edges={['bottom','left','right']} equivalent — top handled manually
  safeAreaGame: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  gradientBackground: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingTop: 16,   // nav bar is inline now — no extra offset needed
    paddingBottom: 50,
  },
  gameScrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  // ── Selector nav bar — inline flow, never overlaps ───────────────────────────
  selectorNavBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? 24) + 8
      : 12,
    paddingBottom: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.85)',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
  },

  // ── Header card — exact match ─────────────────────────────────────────────────
  header: {
    alignItems: 'center',
    marginBottom: 35,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24,
    borderRadius: 24,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  headerIconContainer: {
    width: 80, height: 80, borderRadius: 40,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  headerTitle: {
    fontSize: 28, fontWeight: 'bold', color: '#0F172A',
    textAlign: 'center', marginBottom: 5,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  headerSubtitle: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 20, fontWeight: '400' },
  headerDivider: { width: 60, height: 4, backgroundColor: '#38BDF8', borderRadius: 2 },

  // ── Module/game cards — exact match ──────────────────────────────────────────
  moduleGrid: { gap: 16 },
  moduleCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16, padding: 20,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 3,
  },
  moduleIconBg: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  moduleContent: { flex: 1 },
  moduleTitle: { fontSize: 18, fontWeight: '600', color: '#0F172A', marginBottom: 4 },
  moduleDescription: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  arrowIcon: { marginLeft: 12 },

  // ── Footer — exact match ──────────────────────────────────────────────────────
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 20, borderRadius: 16, marginTop: 30,
    alignItems: 'center', elevation: 4,
  },
  footerText: { fontSize: 16, color: '#0F172A', fontWeight: '600', textAlign: 'center' },
  footerSubtext: { fontSize: 14, color: '#475569', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },

  // ── In-game header bar ────────────────────────────────────────────────────────
  gameHeader: {
    paddingTop: Platform.OS === 'android'
      ? (StatusBar.currentHeight ?? 24) + 8
      : 12,
    paddingBottom: 10,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    elevation: 4,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(56, 189, 248, 0.15)',
  },
  gameHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  gameHeaderCenter: { flex: 1, alignItems: 'center' },
  headerButton: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 12, borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
    minWidth: 60, justifyContent: 'center',
  },
  headerButtonText: { fontSize: 15, color: '#38BDF8', fontWeight: '600', marginLeft: 6 },
  gameTitle: {
    fontSize: 18, fontWeight: 'bold', color: '#0F172A',
    textShadowColor: 'rgba(255,255,255,0.8)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
    textAlign: 'center',
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
    marginTop: 8,
  },
  statText: { fontSize: 13, color: '#64748B', marginHorizontal: 6 },

  // ── Lesson header inside game — mirrors lessonHeader ─────────────────────────
  lessonHeader: {
    alignItems: 'center', marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24, borderRadius: 20,
    elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  lessonTitle: {
    fontSize: 24, fontWeight: 'bold', color: '#0F172A',
    textAlign: 'center', marginBottom: 10,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  lessonSubtitle: { fontSize: 16, color: '#475569', textAlign: 'center', lineHeight: 22 },

  // ── Tip/content card — mirrors tipCard ───────────────────────────────────────
  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24, borderRadius: 16, marginBottom: 20,
    elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6,
    borderLeftWidth: 6, borderLeftColor: '#38BDF8',
  },
  tipDescription: { fontSize: 18, color: '#475569', lineHeight: 26, textAlign: 'center' },

  // ── Example container — mirrors exampleContainer ──────────────────────────────
  exampleContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 16, borderRadius: 8, marginBottom: 20,
  },
  exampleText: { fontSize: 16, color: '#0F172A', lineHeight: 22, textAlign: 'center' },

  // ── Action buttons — mirrors listenBtn & simulatorBtn ─────────────────────────
  listenBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#38BDF8',
    alignSelf: 'center', marginTop: 4,
  },
  listenText: { color: '#38BDF8', fontSize: 15, marginLeft: 6, fontWeight: '600' },
  simulatorBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#059669',
    alignSelf: 'flex-start',
  },
  simulatorBtnText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#059669' },

  // ── Feedback bubbles — mirrors warningBubble pattern ─────────────────────────
  feedbackCorrectCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    padding: 16, borderRadius: 12,
    borderWidth: 2, borderColor: '#059669',
    marginTop: 16, marginBottom: 8,
  },
  feedbackCorrectText: { marginLeft: 10, fontSize: 16, color: '#059669', fontWeight: '600', flex: 1, lineHeight: 22 },
  feedbackWrongCard: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(220, 38, 38, 0.1)',
    padding: 16, borderRadius: 12,
    borderWidth: 2, borderColor: '#DC2626',
    marginTop: 16, marginBottom: 8,
  },
  feedbackWrongText: { marginLeft: 10, fontSize: 16, color: '#DC2626', fontWeight: '600', flex: 1, lineHeight: 22 },

  // ── Streak banner ─────────────────────────────────────────────────────────────
  streakCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1.5, borderColor: '#F97316',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20,
    marginBottom: 16, alignSelf: 'center',
  },
  streakText: { fontSize: 16, fontWeight: 'bold', color: '#EA580C' },

  // ── Generic game content card ─────────────────────────────────────────────────
  gameContentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 24,
    elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },

  // ── GAME 1: Color Match ───────────────────────────────────────────────────────
  colorWord: { fontSize: 52, fontWeight: 'bold', letterSpacing: 2, marginBottom: 12 },
  colorHint: { fontSize: 16, color: '#64748B', fontWeight: '500' },
  colorOptionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 12, width: '100%',
  },
  colorOptionBtn: {
    width: (width - 80) / 2, paddingVertical: 20, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  colorOptionText: { fontSize: 18, fontWeight: 'bold', color: '#fff' },

  // ── GAME 2: Quick Math ────────────────────────────────────────────────────────
  mathCard: {
    borderLeftWidth: 6, borderLeftColor: '#8B5CF6',
  },
  mathEquation: { fontSize: 44, fontWeight: 'bold', color: '#0F172A', letterSpacing: 2 },
  mathOptionsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 14, width: '100%', marginBottom: 4,
  },
  mathOption: {
    width: (width - 90) / 2, paddingVertical: 22, borderRadius: 16,
    alignItems: 'center', elevation: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4, borderWidth: 2,
  },
  mathOptionText: { fontSize: 28, fontWeight: 'bold', color: '#0F172A' },

  // ── GAME 3: Word Scramble ─────────────────────────────────────────────────────
  scrambleAnswer: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 8, marginBottom: 24,
  },
  scrambleSlot: {
    width: 44, height: 52, borderRadius: 10, borderWidth: 2,
    borderColor: '#38BDF8',
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center', alignItems: 'center', elevation: 2,
  },
  scrambleSlotText: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },
  scrambleLetters: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 10, marginBottom: 16,
  },
  scrambleLetter: {
    width: 52, height: 60, borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.95)',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4,
    borderWidth: 1.5, borderColor: '#BAE6FD',
  },
  scrambleLetterUsed: { backgroundColor: '#F1F5F9', borderColor: '#CBD5E1', elevation: 0 },
  scrambleLetterText: { fontSize: 22, fontWeight: 'bold', color: '#0F172A' },

  // ── GAME 4: Pair Match ────────────────────────────────────────────────────────
  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 16 },
  statPill: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1, borderColor: 'rgba(56, 189, 248, 0.3)', gap: 6, elevation: 2,
  },
  statPillText: { fontSize: 14, fontWeight: '600', color: '#0F172A' },
  wonBanner: {
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    borderRadius: 16, padding: 24, marginBottom: 20,
    alignItems: 'center', borderWidth: 2, borderColor: '#059669',
  },
  wonText: { fontSize: 20, fontWeight: 'bold', color: '#047857', marginBottom: 16, textAlign: 'center' },
  cardGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    justifyContent: 'center', gap: 12, width: '100%',
  },
  flipCard: {
    width: (width - 100) / 4, height: (width - 100) / 4,
    borderRadius: 14, backgroundColor: '#BAE6FD',
    justifyContent: 'center', alignItems: 'center',
    elevation: 4, shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 4,
  },
  flipCardOpen: { backgroundColor: 'rgba(255,255,255,0.95)', borderWidth: 2, borderColor: '#38BDF8' },
  flipCardMatched: { backgroundColor: 'rgba(5, 150, 105, 0.15)', borderWidth: 2, borderColor: '#059669' },
  flipCardEmoji: { fontSize: 32 },

  // ── GAME 5: True or False ─────────────────────────────────────────────────────
  tfButtons: {
    flexDirection: 'row', gap: 14, width: '100%', marginBottom: 12,
  },
  tfBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 22, borderRadius: 16, gap: 10,
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  tfBtnText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
});

export default MiniGamesScreen;