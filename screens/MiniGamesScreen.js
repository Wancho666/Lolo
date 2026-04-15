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
    { id: 'color-match',   name: 'Color Match',   icon: 'palette',      color: '#3B82F6', description: 'Itugma ang mga kulay sa kanilang mga pangalan' },
    { id: 'word-scramble', name: 'Bugtong',        icon: 'question',     color: '#EC4899', description: 'Hulaan ang sagot sa bugtong' },
    { id: 'pair-match',    name: 'Pair Match',     icon: 'clone',        color: '#10B981', description: 'Baliktarin ang mga card at hanapin ang magkapares' },
    { id: 'true-or-false', name: 'Tama o Mali',    icon: 'check-circle', color: '#F59E0B', description: 'Subukan ang inyong kaalaman sa mga katotohanan tungkol sa Pilipinas' },
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

        <TouchableOpacity style={styles.backButton} onPress={() => navigation.navigate('HomeScreen')} activeOpacity={0.8}>
          <Icon name="arrow-left" size={18} color="#0F172A" />
          <Text style={styles.backButtonText}>Back</Text>
        </TouchableOpacity>

        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIconContainer}>
              <Icon name="brain" size={32} color="#0F172A" />
            </View>
            <Text style={styles.headerTitle}>🧠 Brain Training</Text>
            <Text style={styles.headerSubtitle}>Cognitive exercises for mental fitness</Text>
            <View style={styles.headerDivider} />
          </View>

          {/* Game Cards */}
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

          {/* Footer */}
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
      <View style={styles.gameHeaderRow}>
        <TouchableOpacity style={styles.headerButton} onPress={() => setCurrentGame(null)} activeOpacity={0.8}>
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
    <SafeAreaView style={styles.safeAreaGame}>
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

    // FIX: Use ref to track streak without stale closures
    const streakRef = useRef(0);
    const scoreRef  = useRef(0);
    const levelRef  = useRef(1);

    const buildRound = useCallback(() => {
      const word = colorData[Math.floor(Math.random() * colorData.length)];
      let inkIdx;
      do { inkIdx = Math.floor(Math.random() * colorData.length); } while (colorData[inkIdx].name === word.name);
      const inkColor    = colorData[inkIdx];
      const distractors = colorData.filter(c => c.name !== inkColor.name).sort(() => Math.random() - 0.5).slice(0, 3);
      setRound({ word, inkColor });
      setOptions([...distractors, inkColor].sort(() => Math.random() - 0.5));
      setFeedback(null);
      Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { buildRound(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnswer = (chosen) => {
      if (feedback) return;
      const correct = chosen.name === round.inkColor.name;
      setFeedback(correct ? 'correct' : 'wrong');

      if (correct) {
        const bonus     = streakRef.current >= 2 ? 5 : 0;
        const newScore  = scoreRef.current + 10 + bonus;
        const newStreak = streakRef.current + 1;
        streakRef.current = newStreak;
        scoreRef.current  = newScore;
        setScore(newScore);
        setStreak(newStreak);
        if (newScore >= levelRef.current * 60) {
          const newLevel = levelRef.current + 1;
          levelRef.current = newLevel;
          setLevel(newLevel);
        }
      } else {
        streakRef.current = 0;
        setStreak(0);
      }

      Animated.timing(fadeAnim, { toValue: 0, duration: 300, useNativeDriver: true })
        .start(() => setTimeout(buildRound, 200));
    };

    const handleReset = () => {
      streakRef.current = 0;
      scoreRef.current  = 0;
      levelRef.current  = 1;
      setScore(0);
      setLevel(1);
      setStreak(0);
      buildRound();
    };

    return (
      <GameShell title="Color Match" onReset={handleReset} score={score} level={level}>
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
  // GAME 2 — BUGTONG
  // ═══════════════════════════════════════════════════════════════════════════════
  const Bugtong = () => {
    const bugtongList = [
      { riddle: 'Ano ang puno na walang dahon?',                           answer: 'Saging',           options: ['Saging', 'Mangga', 'Bayabas', 'Kalabasa'] },
      { riddle: 'Ano ang bahay na walang pintuan?',                        answer: 'Itlog',            options: ['Itlog', 'Bahay', 'Silo', 'Kubo'] },
      { riddle: 'Ano ang puno na nagiging bato?',                          answer: 'Bato',             options: ['Bato', 'Puno', 'Lupa', 'Dagat'] },
      { riddle: 'Ano ang ilog na hindi tumatakbo?',                        answer: 'Pasig',            options: ['Pasig', 'Cagayan', 'Pampanga', 'Agusan'] },
      { riddle: 'Ano ang bundok na maaaring kainin?',                      answer: 'Pinatuyong isda',  options: ['Pinatuyong isda', 'Bundok', 'Tinapay', 'Gulay'] },
      { riddle: 'Ano ang hayop na may sungay na maaaring kainin?',         answer: 'Kalabasa',         options: ['Kalabasa', 'Baka', 'Kambing', 'Toro'] },
      { riddle: 'Ano ang tubig na hindi basang-basang?',                   answer: 'Litrato',          options: ['Litrato', 'Dagat', 'Ilog', 'Lawang'] },
      { riddle: 'Ano ang puno na nagiging damit?',                         answer: 'Piyesta',          options: ['Piyesta', 'Mangga', 'Sampaloc', 'Bayabas'] },
      { riddle: 'Ano ang araw na walang liwanag?',                         answer: 'Linggo',           options: ['Linggo', 'Lunes', 'Martes', 'Miyerkules'] },
      { riddle: 'Ano ang ulan na hindi nababasa?',                         answer: 'Ulan ng apoy',     options: ['Ulan ng apoy', 'Ulan ng tubig', 'Ulan ng bato', 'Ulan ng dahon'] },
    ];

    const [score, setScore]       = useState(0);
    const [level, setLevel]       = useState(1);
    const [current, setCurrent]   = useState(null);
    const [selected, setSelected] = useState(null);
    const [result, setResult]     = useState(null);

    // FIX: refs to avoid stale closures
    const scoreRef = useRef(0);
    const levelRef = useRef(1);

    const buildRound = useCallback(() => {
      const entry = bugtongList[Math.floor(Math.random() * bugtongList.length)];
      setCurrent(entry);
      setSelected(null);
      setResult(null);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => { buildRound(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnswer = (choice) => {
      if (result || !current) return;
      setSelected(choice);

      if (choice === current.answer) {
        const gained   = 15 * levelRef.current;
        const newScore = scoreRef.current + gained;
        scoreRef.current = newScore;
        setScore(newScore);
        setResult('correct');
        if (newScore >= levelRef.current * 75) {
          const newLevel = levelRef.current + 1;
          levelRef.current = newLevel;
          setLevel(newLevel);
        }
        setTimeout(buildRound, 1500);
      } else {
        setResult('wrong');
        setTimeout(() => { setSelected(null); setResult(null); }, 900);
      }
    };

    const handleReset = () => {
      scoreRef.current = 0;
      levelRef.current = 1;
      setScore(0);
      setLevel(1);
      buildRound();
    };

    return (
      <GameShell title="Bugtong" onReset={handleReset} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Bugtong</Text>
          <Text style={styles.lessonSubtitle}>Hulaan ang sagot sa bugtong na ibinigay!</Text>
        </View>

        {current && (
          <View style={styles.exampleContainer}>
            <Text style={styles.exampleText}>{current.riddle}</Text>
          </View>
        )}

        <View style={styles.bugtongOptions}>
          {current && current.options.map((option, i) => {
            let bg = '#fff', borderColor = '#BAE6FD', textColor = '#0F172A';
            if (result === 'correct' && option === current.answer) { bg = '#059669'; borderColor = '#059669'; textColor = '#fff'; }
            else if (result === 'wrong' && option === selected)    { bg = '#DC2626'; borderColor = '#DC2626'; textColor = '#fff'; }
            return (
              <TouchableOpacity key={i} style={[styles.bugtongOption, { backgroundColor: bg, borderColor }]} onPress={() => handleAnswer(option)} activeOpacity={0.8} disabled={!!result}>
                <Text style={[styles.bugtongOptionText, { color: textColor }]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {result && (
          <View style={result === 'correct' ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
            <Icon name={result === 'correct' ? 'check-circle' : 'times-circle'} size={20} color={result === 'correct' ? '#059669' : '#DC2626'} />
            <Text style={result === 'correct' ? styles.feedbackCorrectText : styles.feedbackWrongText}>
              {result === 'correct' ? `Tama! Ang sagot ay "${current?.answer}".` : 'Mali — subukan ulit!'}
            </Text>
          </View>
        )}
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 3 — PAIR MATCH
  // ═══════════════════════════════════════════════════════════════════════════════
  const PairMatch = () => {
    const emojiSets = [
      ['🍎','🍌','🍇','🍓'],
      ['🐶','🐱','🐸','🐧'],
      ['🚗','✈️','🚢','🚂'],
      ['⚽','🏀','🎾','🏐'],
      ['🎸','🎹','🎺','🥁'],
    ];

    const buildDeck = useCallback(() => {
      const set = emojiSets[Math.floor(Math.random() * emojiSets.length)];
      return [...set, ...set]
        .sort(() => Math.random() - 0.5)
        .map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const [cards, setCards]       = useState(() => buildDeck());
    const [flipped, setFlipped]   = useState([]);
    const [score, setScore]       = useState(0);
    const [level, setLevel]       = useState(1);
    const [moves, setMoves]       = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon]           = useState(false);

    const resetGame = useCallback(() => {
      setCards(buildDeck());
      setFlipped([]);
      setMoves(0);
      setDisabled(false);
      setWon(false);
    }, [buildDeck]);

    useEffect(() => {
      if (flipped.length === 2) {
        setDisabled(true);
        setMoves(m => m + 1);
        const [a, b] = flipped;

        setCards(prev => {
          if (prev[a].emoji === prev[b].emoji) {
            const next = prev.map((c, i) =>
              i === a || i === b ? { ...c, matched: true, flipped: true } : c
            );
            // Check win after matching
            if (next.every(c => c.matched)) {
              setWon(true);
              setLevel(l => l + 1);
            }
            setScore(s => s + 20);
            setFlipped([]);
            setDisabled(false);
            return next;
          } else {
            // Flip back after delay
            setTimeout(() => {
              setCards(prev2 => prev2.map((c, i) =>
                i === a || i === b ? { ...c, flipped: false } : c
              ));
              setFlipped([]);
              setDisabled(false);
            }, 900);
            return prev;
          }
        });
      }
    }, [flipped]); // eslint-disable-line react-hooks/exhaustive-deps

    const flipCard = (index) => {
      if (disabled || cards[index].flipped || cards[index].matched) return;
      if (flipped.length >= 2) return;
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
            <TouchableOpacity
              key={card.id}
              style={[
                styles.flipCard,
                card.flipped && !card.matched && styles.flipCardOpen,
                card.matched && styles.flipCardMatched,
              ]}
              onPress={() => flipCard(index)}
              activeOpacity={0.85}
              disabled={card.matched || disabled}
            >
              <Text style={styles.flipCardEmoji}>{card.flipped || card.matched ? card.emoji : '❓'}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </GameShell>
    );
  };

  // ═══════════════════════════════════════════════════════════════════════════════
  // GAME 4 — TRUE OR FALSE
  // FIX: Removed duplicate nested TrueOrFalse declaration; single clean component
  // ═══════════════════════════════════════════════════════════════════════════════
  const TrueOrFalse = () => {
    const facts = [
      { statement: 'Ang Pilipinas ay mayroong 7,107 isla.',                                        answer: true,  explanation: 'Oo, ang Pilipinas ay isang archipelago na mayroong higit sa 7,000 isla.' },
      { statement: 'Ang Maynila ay ang kabisera ng Pilipinas.',                                     answer: true,  explanation: 'Ang Maynila ang kabisera ng Pilipinas mula pa noong 1898.' },
      { statement: 'Ang Pinatubo ay isang bulkan na sumabog noong 1991.',                           answer: true,  explanation: 'Ang Bulkang Pinatubo ay sumabog noong Hunyo 1991 at isa sa pinakamalaking pagsabog sa mundo.' },
      { statement: 'Ang Baybayin ay ang unang alpabetong ginamit sa Pilipinas.',                    answer: false, explanation: 'Ang Baybayin ay isang sistema ng pagsulat na ginamit ng mga katutubo bago dumating ang mga Espanyol.' },
      { statement: 'Ang Pilipinas ay naging kolonya ng Espanya sa loob ng 300 taon.',               answer: true,  explanation: 'Mula 1565 hanggang 1898, ang Pilipinas ay kolonya ng Espanya.' },
      { statement: 'Ang Rizal ay ang bayani ng Pilipinas.',                                         answer: true,  explanation: 'Si Jose Rizal ay itinuturing na pambansang bayani ng Pilipinas.' },
      { statement: 'Ang Pilipinas ay mayroong tatlong wika na opisyal.',                            answer: true,  explanation: 'Ang Filipino, Ingles, at Espanyol ang tatlong opisyal na wika.' },
      { statement: 'Ang Banaue Rice Terraces ay isa sa mga Seven Wonders of the World.',            answer: false, explanation: 'Ito ay isa sa mga UNESCO World Heritage Sites, hindi sa Seven Wonders of the World.' },
      { statement: 'Ang Pilipinas ay mayroong pinakamahabang Christmas season sa mundo.',           answer: true,  explanation: 'Mula Setyembre hanggang Enero, ipinagdiriwang ang Pasko sa Pilipinas.' },
      { statement: 'Ang Lapu-Lapu ay ang unang Filipino na tumutol sa mga Espanyol.',               answer: true,  explanation: 'Si Lapu-Lapu ay nagwagi laban kay Magellan noong 1521.' },
      { statement: 'Ang Pilipinas ay mayroong higit sa 100 wika.',                                  answer: false, explanation: 'Mayroong higit sa 170 wika sa Pilipinas.' },
      { statement: 'Ang Intramuros ay ang matandang lungsod ng Maynila.',                           answer: true,  explanation: 'Ito ang walled city na itinayo ng mga Espanyol.' },
      { statement: 'Ang Pilipinas ay ang unang bansa sa Asya na nagkaroon ng republika.',           answer: true,  explanation: 'Ang Unang Republika ng Pilipinas ay itinatag noong 1899.' },
      { statement: 'Ang Taal Volcano ay ang pinakamaliit na bulkan sa mundo.',                      answer: true,  explanation: 'Ito ay may crater lake sa loob ng isang isla.' },
      { statement: 'Ang Pilipinas ay mayroong 81 lalawigan.',                                       answer: true,  explanation: 'Kasama ang National Capital Region.' },
    ];

    const [score, setScore]             = useState(0);
    const [level, setLevel]             = useState(1);
    const [index, setIndex]             = useState(() => Math.floor(Math.random() * facts.length));
    const [answered, setAnswered]       = useState(false);
    const [chosen, setChosen]           = useState(null);
    const [usedIndices, setUsedIndices] = useState([index]);

    // FIX: refs to avoid stale closures
    const scoreRef = useRef(0);
    const levelRef = useRef(1);

    const current = facts[index];

    const nextQuestion = useCallback(() => {
      setUsedIndices(prev => {
        const remaining = facts.map((_, i) => i).filter(i => !prev.includes(i));
        let next;
        if (remaining.length === 0) {
          // Reset used list when all questions exhausted
          next = Math.floor(Math.random() * facts.length);
          setIndex(next);
          return [next];
        } else {
          next = remaining[Math.floor(Math.random() * remaining.length)];
          setIndex(next);
          return [...prev, next];
        }
      });
      setAnswered(false);
      setChosen(null);
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    const handleAnswer = (val) => {
      if (answered) return;
      setChosen(val);
      setAnswered(true);
      if (val === current.answer) {
        const gained   = 10 * levelRef.current;
        const newScore = scoreRef.current + gained;
        scoreRef.current = newScore;
        setScore(newScore);
        if (newScore >= levelRef.current * 50) {
          const newLevel = levelRef.current + 1;
          levelRef.current = newLevel;
          setLevel(newLevel);
        }
      }
    };

    const handleReset = () => {
      scoreRef.current = 0;
      levelRef.current = 1;
      const startIdx = Math.floor(Math.random() * facts.length);
      setScore(0);
      setLevel(1);
      setUsedIndices([startIdx]);
      setAnswered(false);
      setChosen(null);
      setIndex(startIdx);
    };

    const isCorrect = chosen === current.answer;

    return (
      <GameShell title="Tama o Mali" onReset={handleReset} score={score} level={level}>
        <View style={styles.lessonHeader}>
          <Text style={styles.lessonTitle}>Tama o Mali</Text>
          <Text style={styles.lessonSubtitle}>Basahin ang pahayag nang mabuti — Tama ba o Mali?</Text>
        </View>

        <View style={[styles.tipCard, { borderLeftColor: '#0EA5E9' }]}>
          <Text style={styles.tipDescription}>{current.statement}</Text>
        </View>

        {!answered ? (
          <View style={styles.tfButtons}>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#059669' }]} onPress={() => handleAnswer(true)} activeOpacity={0.85}>
              <Icon name="check" size={22} color="#fff" />
              <Text style={styles.tfBtnText}>Tama</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#DC2626' }]} onPress={() => handleAnswer(false)} activeOpacity={0.85}>
              <Icon name="times" size={22} color="#fff" />
              <Text style={styles.tfBtnText}>Mali</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={isCorrect ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
              <Icon name={isCorrect ? 'check-circle' : 'times-circle'} size={20} color={isCorrect ? '#059669' : '#DC2626'} />
              <Text style={isCorrect ? styles.feedbackCorrectText : styles.feedbackWrongText}>
                {isCorrect ? 'Tama!' : `Ang sagot ay ${current.answer ? 'TAMA' : 'MALI'}.`}
              </Text>
            </View>
            <View style={styles.exampleContainer}>
              <Text style={styles.exampleText}>{current.explanation}</Text>
            </View>
            <TouchableOpacity style={[styles.simulatorBtn, { alignSelf: 'center', marginTop: 4 }]} onPress={nextQuestion}>
              <Icon name="arrow-right" size={14} color="#059669" />
              <Text style={styles.simulatorBtnText}>Susunod na Tanong</Text>
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
      case 'word-scramble': return <Bugtong />;      // FIX: was missing, now correctly routes
      case 'pair-match':    return <PairMatch />;
      case 'true-or-false': return <TrueOrFalse />;
      default:              return <GameSelector />;
    }
  };

  return renderGame();
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({

  safeArea: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  safeAreaGame: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  container: {
    flex: 1,
  },
  gradientBackground: {
    position: 'absolute',
    left: 0, right: 0, top: 0, bottom: 0,
  },
  scrollView: { flex: 1 },
  scrollContent: {
    padding: 20,
    paddingTop: 80,
    paddingBottom: 60,
  },
  gameScrollContent: {
    padding: 20,
    paddingBottom: 60,
  },

  backButton: {
    position: 'absolute', top: Platform.OS === 'ios' ? 50 : 30, left: 20,
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.12, shadowRadius: 4, zIndex: 10,
  },
  backButtonText: { marginLeft: 6, fontSize: 15, fontWeight: '600', color: '#0F172A' },

  header: {
    alignItems: 'center', marginBottom: 28, backgroundColor: 'rgba(255,255,255,0.92)',
    padding: 24, borderRadius: 20, elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08, shadowRadius: 6,
  },
  headerIconContainer: {
    width: 72, height: 72, borderRadius: 36,
    backgroundColor: '#F0F9FF',
    justifyContent: 'center', alignItems: 'center', marginBottom: 12,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1, shadowRadius: 8, elevation: 5,
  },
  headerTitle: {
    fontSize: 26, fontWeight: 'bold', color: '#0F172A',
    textAlign: 'center', marginBottom: 4,
    textShadowColor: 'rgba(255, 255, 255, 0.8)',
    textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 2,
  },
  headerSubtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 16, fontWeight: '400' },
  headerDivider: { width: 50, height: 4, backgroundColor: '#38BDF8', borderRadius: 2 },

  moduleGrid: { gap: 16 },
  moduleCard: {
    backgroundColor: 'rgba(255,255,255,0.95)', borderRadius: 14, padding: 18,
    flexDirection: 'row', alignItems: 'center',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 6, elevation: 3,
  },
  moduleIconBg: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  moduleContent: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: '600', color: '#0F172A', marginBottom: 3 },
  moduleDescription: { fontSize: 13, color: '#64748B', lineHeight: 18 },
  arrowIcon: { marginLeft: 12 },

  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 18, borderRadius: 14, marginTop: 24, alignItems: 'center',
  },
  footerText: { fontSize: 15, color: '#0F172A', fontWeight: '500', textAlign: 'center' },
  footerSubtext: { fontSize: 14, color: '#475569', textAlign: 'center', marginTop: 8, fontStyle: 'italic' },

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
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
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
    flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 8,
  },

  lessonHeader: {
    alignItems: 'center', marginBottom: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24, borderRadius: 20, elevation: 6,
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

  tipCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    padding: 24, borderRadius: 16, marginBottom: 20,
    elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 6,
    borderLeftWidth: 6, borderLeftColor: '#38BDF8',
  },
  tipDescription: { fontSize: 18, color: '#475569', lineHeight: 26, textAlign: 'center' },

  exampleContainer: {
    backgroundColor: 'rgba(14, 165, 233, 0.1)',
    padding: 16, borderRadius: 8, marginBottom: 20,
  },
  exampleText: { fontSize: 16, color: '#0F172A', lineHeight: 22, textAlign: 'center' },

  simulatorBtn: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: 'rgba(5, 150, 105, 0.1)',
    paddingHorizontal: 16, paddingVertical: 10,
    borderRadius: 8, borderWidth: 1, borderColor: '#059669',
    alignSelf: 'flex-start',
  },
  simulatorBtnText: { marginLeft: 8, fontSize: 15, fontWeight: '600', color: '#059669' },

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

  streakCard: {
    backgroundColor: 'rgba(249, 115, 22, 0.12)',
    borderWidth: 1.5, borderColor: '#F97316',
    borderRadius: 12, paddingVertical: 10, paddingHorizontal: 20,
    marginBottom: 16, alignSelf: 'center',
  },
  streakText: { fontSize: 16, fontWeight: 'bold', color: '#EA580C' },

  gameContentCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20, padding: 32, alignItems: 'center', marginBottom: 24,
    elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1, shadowRadius: 8,
  },

  // Color Match
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

  // Bugtong
  bugtongOptions: { gap: 12, marginBottom: 4 },
  bugtongOption: {
    paddingVertical: 16, borderRadius: 12,
    alignItems: 'center', elevation: 3,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1, shadowRadius: 4, borderWidth: 2,
  },
  bugtongOptionText: { fontSize: 18, fontWeight: '600', color: '#0F172A' },

  // Pair Match
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

  // True or False
  tfButtons: { flexDirection: 'row', gap: 14, width: '100%', marginBottom: 12 },
  tfBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 22, borderRadius: 16, gap: 10,
    elevation: 4, shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4,
  },
  tfBtnText: { fontSize: 22, fontWeight: 'bold', color: '#fff' },
});

export default MiniGamesScreen;