import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  StatusBar,
  TextInput,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Icon = FontAwesome5;

const MiniGamesScreen = () => {
  const navigation = useNavigation();
  const [currentGame, setCurrentGame] = useState(null);

  // GAMES FOR SENIOR LEARNERS
  const games = [
    { id: 'number-seq',   name: 'Number Sequence',   icon: 'sort-numeric-up', color: '#3B82F6', description: 'Fill in missing numbers to build math skills', levels: 5 },
    { id: 'bugtong',      name: 'Bugtong (Riddles)', icon: 'lightbulb',       color: '#EC4899', description: 'Solve classic Filipino riddles and test your memory', levels: 4 },
    { id: 'memory-match', name: 'Memory Match',      icon: 'images',          color: '#10B981', description: 'Match household items to strengthen memory', levels: 5 },
    { id: 'health-facts', name: 'Health & Wellness', icon: 'heart',           color: '#F59E0B', description: 'Learn wellness tips through true or false questions', levels: 4 },
  ];

  // --- Shared full-bleed background --------------------------------------------
  const Screen = ({ children }) => (
    <View style={styles.screenRoot}>
      <LinearGradient
        colors={['#0EA5E9', '#38BDF8', '#7DD3FC', '#BAE6FD', '#E0F2FE', '#F0F9FF']}
        locations={[0, 0.18, 0.38, 0.6, 0.8, 1]}
        style={StyleSheet.absoluteFillObject}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      <SafeAreaView style={styles.safeArea}>{children}</SafeAreaView>
    </View>
  );

  const ProgressBar = ({ current, total, color }) => (
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, { width: `${Math.min(100, (current / total) * 100)}%`, backgroundColor: color }]} />
    </View>
  );

  const BackBtn = () => (
    <TouchableOpacity
      style={styles.backButton}
      onPress={() => navigation.goBack()}
      activeOpacity={0.85}
    >
      <LinearGradient
        colors={["#74bfe2", "#6abfe9"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.backButtonGradient}
      >
        <Ionicons name="arrow-back" size={18} color="#fff" />
      </LinearGradient>
    </TouchableOpacity>
  );

  const PageHeader = () => (
    <View style={styles.pageHeader}>
      <View style={styles.pageHeaderTop}>
        <BackBtn />
        <View style={styles.pageHeaderBadge}>
          <Ionicons name="trophy" size={18} color="#F59E0B" />
          <Text style={styles.pageHeaderBadgeText}>Brain Games</Text>
        </View>
      </View>
      <Text style={styles.pageHeaderTitle}>Cognitive Games</Text>
      <Text style={styles.pageHeaderSub}>Fun daily exercises to keep your mind sharp</Text>
    </View>
  );

  // --- Game Selector ------------------------------------------------------------
  const GameHeader = ({ title, onReset, score, level, totalLevels, questionInLevel, totalInLevel, color }) => (
    <View style={styles.gameHeader}>
      <View style={styles.gameHeaderRow}>
        <TouchableOpacity style={styles.headerButton} onPress={() => setCurrentGame(null)} activeOpacity={0.8}>
          <Icon name='arrow-left' size={16} color='#0F172A' />
          <Text style={styles.headerButtonText}>Back</Text>
        </TouchableOpacity>
        <View style={styles.gameHeaderCenter}>
          <Text style={styles.gameTitle}>{title}</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={onReset}>
          <Icon name='redo' size={16} color={color} />
        </TouchableOpacity>
      </View>
      <View style={styles.gameStats}>
        <View style={styles.statPill}>
          <Icon name='star' size={11} color='#F59E0B' />
          <Text style={styles.statPillText}>Score: {score}</Text>
        </View>
        <View style={styles.statPill}>
          <Icon name='layer-group' size={11} color={color} />
          <Text style={styles.statPillText}>Level {level}{totalLevels ? ` / ${totalLevels}` : ''}</Text>
        </View>
      </View>
      {totalInLevel ? (
        <View style={styles.progressWrap}>
          <ProgressBar current={questionInLevel} total={totalInLevel} color={color} />
          <Text style={styles.progressLabel}>{questionInLevel} of {totalInLevel} in this level</Text>
        </View>
      ) : null}
    </View>
  );

  const GameShell = ({ title, onReset, score, level, totalLevels, questionInLevel, totalInLevel, color, icon, children }) => (
    <Screen>
      <GameHeader
        title={title} onReset={onReset} score={score} level={level}
        totalLevels={totalLevels} questionInLevel={questionInLevel} totalInLevel={totalInLevel} color={color}
      />
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false} contentContainerStyle={styles.gameScrollContent}>
        <View style={styles.lessonHeader}>
          <View style={[styles.lessonIconBubble, { backgroundColor: color + '1F' }]}>
            <Icon name={icon} size={24} color={color} />
          </View>
          {children[0]}
        </View>
        {children.slice(1)}
      </ScrollView>
    </Screen>
  );

  const LevelUpBanner = ({ visible, color }) => {
    if (!visible) return null;
    return (
      <View style={[styles.levelUpBanner, { borderColor: color, backgroundColor: color + '15' }]}>
        <Icon name='medal' size={20} color={color} />
        <Text style={[styles.levelUpText, { color }]}>Level Up! New challenges unlocked.</Text>
      </View>
    );
  };

  // -------------------------------------------------------------------------------
  // GAME 1 - NUMBER SEQUENCE - 5 curated levels, sequential (no random repeats)
  // -------------------------------------------------------------------------------
  const NumberSequence = () => {
    const CURRICULUM = [
      [
        { numbers: [2, 4, 6, '?', 10], answer: '8', difficulty: 'Level 1 - Easy' },
        { numbers: [1, 2, 3, '?', 5], answer: '4', difficulty: 'Level 1 - Easy' },
        { numbers: [5, 10, 15, '?', 25], answer: '20', difficulty: 'Level 1 - Easy' },
        { numbers: [10, 9, 8, '?', 6], answer: '7', difficulty: 'Level 1 - Easy' },
        { numbers: [1, 3, 5, '?', 9], answer: '7', difficulty: 'Level 1 - Easy' },
      ],
      [
        { numbers: [3, 6, 9, '?', 15], answer: '12', difficulty: 'Level 2 - Easy+' },
        { numbers: [20, 18, 16, '?', 12], answer: '14', difficulty: 'Level 2 - Easy+' },
        { numbers: [2, 4, 8, '?', 32], answer: '16', difficulty: 'Level 2 - Easy+' },
        { numbers: [1, 4, 7, '?', 13], answer: '10', difficulty: 'Level 2 - Easy+' },
        { numbers: [50, 45, 40, '?', 30], answer: '35', difficulty: 'Level 2 - Easy+' },
      ],
      [
        { numbers: [1, 4, 9, '?', 25], answer: '16', difficulty: 'Level 3 - Medium' },
        { numbers: [100, 90, 80, '?', 60], answer: '70', difficulty: 'Level 3 - Medium' },
        { numbers: [3, 6, 12, '?', 48], answer: '24', difficulty: 'Level 3 - Medium' },
        { numbers: [2, 5, 10, 17, '?'], answer: '26', difficulty: 'Level 3 - Medium' },
        { numbers: [1, 2, 4, 7, '?'], answer: '11', difficulty: 'Level 3 - Medium' },
      ],
      [
        { numbers: [1, 1, 2, 3, '?', 8], answer: '5', difficulty: 'Level 4 - Hard' },
        { numbers: [2, 6, 18, '?', 162], answer: '54', difficulty: 'Level 4 - Hard' },
        { numbers: [81, 27, 9, '?', 1], answer: '3', difficulty: 'Level 4 - Hard' },
        { numbers: [1, 8, 27, '?', 125], answer: '64', difficulty: 'Level 4 - Hard' },
        { numbers: [5, 11, 23, '?', 95], answer: '47', difficulty: 'Level 4 - Hard' },
      ],
      [
        { numbers: [2, 3, 5, 8, '?', 21], answer: '13', difficulty: 'Level 5 - Expert' },
        { numbers: [7, 14, 28, '?', 112], answer: '56', difficulty: 'Level 5 - Expert' },
        { numbers: [4, 9, 16, 25, '?'], answer: '36', difficulty: 'Level 5 - Expert' },
        { numbers: [3, 9, 27, '?', 243], answer: '81', difficulty: 'Level 5 - Expert' },
        { numbers: [1, 2, 6, 24, '?'], answer: '120', difficulty: 'Level 5 - Expert' },
      ],
    ];

    const [levelIndex, setLevelIndex] = useState(0);
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [feedback, setFeedback] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const current = CURRICULUM[levelIndex][qIndex];

    const handleSubmit = () => {
      if (!inputValue.trim()) return;
      const isCorrect = inputValue.trim() === current.answer;
      if (isCorrect) setScore(s => s + 15 * (levelIndex + 1));
      setFeedback(isCorrect ? 'correct' : 'wrong');
    };

    const handleNext = () => {
      setShowLevelUp(false);
      if (qIndex + 1 < CURRICULUM[levelIndex].length) {
        setQIndex(qIndex + 1);
      } else if (levelIndex + 1 < CURRICULUM.length) {
        setLevelIndex(levelIndex + 1);
        setQIndex(0);
        setShowLevelUp(true);
      } else {
        setLevelIndex(0);
        setQIndex(0);
        setShowLevelUp(true);
      }
      setInputValue('');
      setFeedback(null);
    };

    const handleReset = () => {
      setLevelIndex(0);
      setQIndex(0);
      setScore(0);
      setInputValue('');
      setFeedback(null);
      setShowLevelUp(false);
    };

    return (
      <GameShell
        title='Number Sequence' onReset={handleReset} score={score}
        level={levelIndex + 1} totalLevels={CURRICULUM.length}
        questionInLevel={qIndex + 1} totalInLevel={CURRICULUM[levelIndex].length}
        color='#3B82F6' icon='sort-numeric-up'
      >
        <View>
          <Text style={styles.lessonTitle}>Fill the Missing Number</Text>
          <Text style={styles.lessonSubtitle}>Look at the pattern and find the missing number.</Text>
        </View>
        <LevelUpBanner visible={showLevelUp} color='#3B82F6' />
        <View style={styles.numberSequenceContainer}>
          <Text style={styles.difficultyBadge}>{current.difficulty}</Text>
          <View style={styles.sequenceRow}>
            {current.numbers.map((num, idx) => (
              <View key={idx} style={[styles.numberBox, num === '?' && styles.numberBoxMissing]}>
                <Text style={styles.numberText}>{num}</Text>
              </View>
            ))}
          </View>
        </View>
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Answer:</Text>
          <TextInput
            style={styles.numberInput}
            placeholder='Enter number'
            placeholderTextColor='#94A3B8'
            keyboardType='numeric'
            value={inputValue}
            onChangeText={setInputValue}
            maxLength={3}
            editable={!feedback}
          />
        </View>
        {!feedback ? (
          <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} activeOpacity={0.88}>
            <Icon name='check' size={17} color='#fff' />
            <Text style={styles.submitBtnText}>Check Answer</Text>
          </TouchableOpacity>
        ) : (
          <View>
            <View style={feedback === 'correct' ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
              <Icon name={feedback === 'correct' ? 'check-circle' : 'times-circle'} size={22} color={feedback === 'correct' ? '#059669' : '#DC2626'} />
              <Text style={feedback === 'correct' ? styles.feedbackCorrectText : styles.feedbackWrongText}>
                {feedback === 'correct' ? 'Excellent! That is correct.' : `Not quite. The answer is ${current.answer}.`}
              </Text>
            </View>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#3B82F6' }]} onPress={handleNext} activeOpacity={0.88}>
              <Icon name='arrow-right' size={14} color='#fff' />
              <Text style={styles.nextBtnText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameShell>
    );
  };

  // -------------------------------------------------------------------------------
  // GAME 2 - BUGTONG (RIDDLES) - 4 curated levels of classic Filipino riddles
  // -------------------------------------------------------------------------------
  const Bugtong = () => {
    const CURRICULUM = [
      [
        { riddle: 'Bao kong bukol, isang salop ang laman.', answer: 'Niyog', options: ['Niyog', 'Kalabasa', 'Bola', 'Palayok'] },
        { riddle: 'Dalawang magkapatid, magkasing-itim, magkalapit ngunit hindi nagkikita.', answer: 'Mata', options: ['Mata', 'Tainga', 'Bibig', 'Ilong'] },
        { riddle: 'Isang butil na palay, sikip sa buong bahay.', answer: 'Ilaw', options: ['Ilaw', 'Bigas', 'Hangin', 'Tubig'] },
        { riddle: 'Matandang sabon, hugasan man ay hindi nauubos-ubos.', answer: 'Buwan', options: ['Buwan', 'Araw', 'Bituin', 'Ulap'] },
        { riddle: 'Isda ko sa Mariveles, ang kaliskis ay nasa loob.', answer: 'Payong', options: ['Payong', 'Isda', 'Bag', 'Sombrero'] },
      ],
      [
        { riddle: 'Nagtago si Pedro, nakalitaw ang ulo.', answer: 'Pako', options: ['Pako', 'Susi', 'Karayom', 'Lapis'] },
        { riddle: 'Bahay ni Katong, magaspang sa labas, makinis sa loob.', answer: 'Itlog', options: ['Itlog', 'Bato', 'Saging', 'Kahon'] },
        { riddle: 'Apat ang paa, ngunit hindi makalakad.', answer: 'Mesa', options: ['Mesa', 'Aso', 'Pusa', 'Kabayo'] },
        { riddle: 'Suot ay damit, hubad kapag kakainin.', answer: 'Saging', options: ['Saging', 'Mangga', 'Bayabas', 'Puno'] },
        { riddle: 'Hindi tao, hindi hayop, ngunit may bahay na dala-dala.', answer: 'Pagong', options: ['Pagong', 'Aso', 'Ibon', 'Isda'] },
      ],
      [
        { riddle: 'Hindi maiwan kahit saan ka pumunta.', answer: 'Anino', options: ['Anino', 'Ulap', 'Ilaw', 'Ulan'] },
        { riddle: "May mata't walang kilay.", answer: 'Karayom', options: ['Karayom', 'Gunting', 'Kutsara', 'Tinidor'] },
        { riddle: "Umaga'y apat ang paa, tanghali'y dalawa, gabi'y tatlo.", answer: 'Tao', options: ['Tao', 'Aso', 'Pusa', 'Ibon'] },
        { riddle: 'Bumubukas at nagsasara, walang bisagra.', answer: 'Bibig', options: ['Bibig', 'Pinto', 'Bintana', 'Kahon'] },
        { riddle: 'May buhok na walang ulo.', answer: 'Mais', options: ['Mais', 'Saging', 'Kamatis', 'Sibuyas'] },
      ],
      [
        { riddle: 'Wala kang kasalanan, ngunit napapaiyak kita.', answer: 'Sibuyas', options: ['Sibuyas', 'Sili', 'Kamatis', 'Luya'] },
        { riddle: 'Tuwing gabi ay lumalabas, tuwing umaga ay nawawala.', answer: 'Bituin', options: ['Bituin', 'Ulap', 'Ibon', 'Paruparo'] },
        { riddle: 'Makulay pagkatapos ng ulan, hindi mo mahawakan.', answer: 'Bahaghari', options: ['Bahaghari', 'Ulap', 'Kidlat', 'Bituin'] },
        { riddle: 'Bumabagsak mula sa langit, ngunit hindi nasasaktan.', answer: 'Ulan', options: ['Ulan', 'Bato', 'Niyebe', 'Bituin'] },
        { riddle: 'Walang paa, ngunit lumalakad papuntang dagat.', answer: 'Ilog', options: ['Ilog', 'Daan', 'Ulan', 'Hangin'] },
      ],
    ];

    const [levelIndex, setLevelIndex] = useState(0);
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [selected, setSelected] = useState(null);
    const [result, setResult] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const current = CURRICULUM[levelIndex][qIndex];

    const handleAnswer = (choice) => {
      if (result) return;
      setSelected(choice);
      if (choice === current.answer) {
        setScore(s => s + 15 * (levelIndex + 1));
        setResult('correct');
      } else {
        setResult('wrong');
      }
    };

    const handleNext = () => {
      setShowLevelUp(false);
      if (qIndex + 1 < CURRICULUM[levelIndex].length) {
        setQIndex(qIndex + 1);
      } else if (levelIndex + 1 < CURRICULUM.length) {
        setLevelIndex(levelIndex + 1);
        setQIndex(0);
        setShowLevelUp(true);
      } else {
        setLevelIndex(0);
        setQIndex(0);
        setShowLevelUp(true);
      }
      setSelected(null);
      setResult(null);
    };

    const handleReset = () => {
      setLevelIndex(0);
      setQIndex(0);
      setScore(0);
      setSelected(null);
      setResult(null);
      setShowLevelUp(false);
    };

    return (
      <GameShell
        title='Bugtong' onReset={handleReset} score={score}
        level={levelIndex + 1} totalLevels={CURRICULUM.length}
        questionInLevel={qIndex + 1} totalInLevel={CURRICULUM[levelIndex].length}
        color='#EC4899' icon='lightbulb'
      >
        <View>
          <Text style={styles.lessonTitle}>Bugtong - Mga Palaisipan</Text>
          <Text style={styles.lessonSubtitle}>Sagutin ang klasikong bugtong ng mga Pilipino!</Text>
        </View>
        <LevelUpBanner visible={showLevelUp} color='#EC4899' />
        <View style={styles.bugtongQuestionContainer}>
          <Text style={styles.bugtongQuestionText}>{current.riddle}</Text>
        </View>
        <View style={styles.bugtongOptions}>
          {current.options.map((option, i) => {
            let bg = '#fff', borderColor = '#E2E8F0', textColor = '#0F172A';
            if (result && option === current.answer) { bg = '#059669'; borderColor = '#059669'; textColor = '#fff'; }
            else if (result === 'wrong' && option === selected) { bg = '#DC2626'; borderColor = '#DC2626'; textColor = '#fff'; }
            return (
              <TouchableOpacity key={i} style={[styles.bugtongOption, { backgroundColor: bg, borderColor }]} onPress={() => handleAnswer(option)} activeOpacity={0.8} disabled={!!result}>
                <Text style={[styles.bugtongOptionText, { color: textColor }]}>{option}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        {result && (
          <View>
            <View style={result === 'correct' ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
              <Icon name={result === 'correct' ? 'check-circle' : 'times-circle'} size={20} color={result === 'correct' ? '#059669' : '#DC2626'} />
              <Text style={result === 'correct' ? styles.feedbackCorrectText : styles.feedbackWrongText}>
                {result === 'correct' ? 'Tama! Magaling.' : `Mali. Ang sagot ay ${current.answer}.`}
              </Text>
            </View>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#EC4899' }]} onPress={handleNext} activeOpacity={0.88}>
              <Icon name='arrow-right' size={14} color='#fff' />
              <Text style={styles.nextBtnText}>Susunod na Bugtong</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameShell>
    );
  };

  // -------------------------------------------------------------------------------
  // GAME 3 - MEMORY MATCH - grid grows with each level, item sets never repeat
  // back-to-back, and the whole pool only cycles after level 5
  // -------------------------------------------------------------------------------
  const MemoryMatch = () => {
    const ITEM_POOL = ['☕', '🥄', '🍚', '🧺', '🔑', '🚪', '🪑', '🛏️', '🧴', '🧼', '🪥', '🧻', '🍲', '🥢', '🍜', '🥣', '📺', '📻', '☎️', '💡', '👓', '⌚', '🧦', '👞'];
    const PAIRS_BY_LEVEL = [4, 5, 6, 7, 8];

    const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

    const buildDeck = useCallback((levelNum) => {
      const pairCount = PAIRS_BY_LEVEL[(levelNum - 1) % PAIRS_BY_LEVEL.length];
      const chosen = shuffle(ITEM_POOL).slice(0, pairCount);
      return shuffle([...chosen, ...chosen]).map((emoji, i) => ({ id: i, emoji, flipped: false, matched: false }));
    }, []);

    const [level, setLevel] = useState(1);
    const [cards, setCards] = useState(() => buildDeck(1));
    const [flipped, setFlipped] = useState([]);
    const [score, setScore] = useState(0);
    const [moves, setMoves] = useState(0);
    const [disabled, setDisabled] = useState(false);
    const [won, setWon] = useState(false);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const startLevel = useCallback((levelNum) => {
      setCards(buildDeck(levelNum));
      setFlipped([]);
      setMoves(0);
      setDisabled(false);
      setWon(false);
    }, [buildDeck]);

    const resetGame = () => {
      setLevel(1);
      setScore(0);
      setShowLevelUp(false);
      startLevel(1);
    };

    const goToNextLevel = () => {
      const next = level + 1;
      setLevel(next);
      setShowLevelUp(true);
      startLevel(next);
    };

    React.useEffect(() => {
      if (flipped.length === 2) {
        setDisabled(true);
        setMoves(m => m + 1);
        const [a, b] = flipped;
        setCards(prev => {
          if (prev[a].emoji === prev[b].emoji) {
            const next = prev.map((c, i) => (i === a || i === b ? { ...c, matched: true, flipped: true } : c));
            if (next.every(c => c.matched)) {
              setWon(true);
              setScore(s => s + 50);
            } else {
              setScore(s => s + 20);
            }
            setFlipped([]);
            setDisabled(false);
            return next;
          } else {
            setTimeout(() => {
              setCards(prev2 => prev2.map((c, i) => (i === a || i === b ? { ...c, flipped: false } : c)));
              setFlipped([]);
              setDisabled(false);
            }, 1300);
            return prev;
          }
        });
      }
    }, [flipped]);

    const flipCard = (index) => {
      if (disabled || cards[index].flipped || cards[index].matched) return;
      if (flipped.length >= 2) return;
      setCards(prev => prev.map((c, i) => (i === index ? { ...c, flipped: true } : c)));
      setFlipped(prev => [...prev, index]);
    };

    const pairCount = PAIRS_BY_LEVEL[(level - 1) % PAIRS_BY_LEVEL.length];

    return (
      <GameShell
        title='Memory Match' onReset={resetGame} score={score}
        level={level} totalLevels={null} questionInLevel={null} totalInLevel={null}
        color='#10B981' icon='images'
      >
        <View>
          <Text style={styles.lessonTitle}>Match the Pairs</Text>
          <Text style={styles.lessonSubtitle}>Flip cards and find matching household items!</Text>
        </View>
        <LevelUpBanner visible={showLevelUp} color='#10B981' />
        <View style={styles.statsRow}>
          <View style={styles.statPill}><Icon name='shoe-prints' size={13} color='#10B981' /><Text style={styles.statPillText}>Moves: {moves}</Text></View>
          <View style={styles.statPill}><Icon name='th-large' size={13} color='#10B981' /><Text style={styles.statPillText}>{pairCount} Pairs</Text></View>
        </View>
        {won && (
          <View style={styles.wonBanner}>
            <Icon name='trophy' size={26} color='#F59E0B' style={{ marginBottom: 8 }} />
            <Text style={styles.wonText}>All pairs found! Great job!</Text>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#10B981', marginTop: 8 }]} onPress={goToNextLevel} activeOpacity={0.88}>
              <Icon name='arrow-right' size={14} color='#fff' />
              <Text style={styles.nextBtnText}>Next Level</Text>
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

  // -------------------------------------------------------------------------------
  // GAME 4 - HEALTH & WELLNESS FACTS - 4 curated levels
  // -------------------------------------------------------------------------------
  const HealthFacts = () => {
    const CURRICULUM = [
      [
        { statement: 'Drinking water helps keep your body healthy.', answer: true, explanation: 'Staying hydrated is important for all body functions.' },
        { statement: 'Walking for 30 minutes daily improves heart health.', answer: true, explanation: 'Regular physical activity strengthens your heart.' },
        { statement: 'Getting 7-9 hours of sleep is important for seniors.', answer: true, explanation: 'Good sleep helps your body repair and stay healthy.' },
        { statement: 'Eating fruits and vegetables reduces heart disease risk.', answer: true, explanation: 'A healthy diet helps maintain cardiovascular health.' },
      ],
      [
        { statement: 'Sugar is bad for teeth but good for bones.', answer: false, explanation: 'Sugar is bad for health overall. Milk and exercise help bones.' },
        { statement: 'Friends and social activities reduce stress and depression.', answer: true, explanation: 'Staying connected is important for mental health.' },
        { statement: 'Memory games help keep your mind sharp as you age.', answer: true, explanation: 'Mental exercises help maintain cognitive function.' },
        { statement: 'Seniors cannot learn new skills.', answer: false, explanation: 'Seniors can absolutely learn new skills! The brain stays capable.' },
      ],
      [
        { statement: 'Regular medical check-ups can catch health problems early.', answer: true, explanation: 'Preventive care is essential for healthy aging.' },
        { statement: 'Sitting all day is bad for your health.', answer: true, explanation: 'Prolonged sitting increases various health risks.' },
        { statement: 'High blood pressure often has no symptoms.', answer: true, explanation: "Check blood pressure regularly - many people don't know they have it." },
        { statement: 'Stretching daily helps prevent falls and injuries.', answer: true, explanation: 'Flexibility exercises reduce injury risk.' },
      ],
      [
        { statement: 'Smoking increases the risk of heart disease and cancer.', answer: true, explanation: 'Quitting smoking at any age improves health outcomes.' },
        { statement: 'It is normal for blood pressure to stay exactly the same all day.', answer: false, explanation: 'Blood pressure naturally rises and falls throughout the day.' },
        { statement: 'Taking medications exactly as prescribed helps prevent complications.', answer: true, explanation: "Following your doctor's instructions keeps treatment effective and safe." },
        { statement: 'Skipping meals is a healthy way to manage weight in older adults.', answer: false, explanation: 'Skipping meals can cause low blood sugar and nutrient deficiencies.' },
      ],
    ];

    const [levelIndex, setLevelIndex] = useState(0);
    const [qIndex, setQIndex] = useState(0);
    const [score, setScore] = useState(0);
    const [answered, setAnswered] = useState(false);
    const [chosen, setChosen] = useState(null);
    const [showLevelUp, setShowLevelUp] = useState(false);

    const current = CURRICULUM[levelIndex][qIndex];

    const handleAnswer = (val) => {
      if (answered) return;
      setChosen(val);
      setAnswered(true);
      if (val === current.answer) setScore(s => s + 10 * (levelIndex + 1));
    };

    const nextQuestion = () => {
      setShowLevelUp(false);
      if (qIndex + 1 < CURRICULUM[levelIndex].length) {
        setQIndex(qIndex + 1);
      } else if (levelIndex + 1 < CURRICULUM.length) {
        setLevelIndex(levelIndex + 1);
        setQIndex(0);
        setShowLevelUp(true);
      } else {
        setLevelIndex(0);
        setQIndex(0);
        setShowLevelUp(true);
      }
      setAnswered(false);
      setChosen(null);
    };

    const handleReset = () => {
      setLevelIndex(0);
      setQIndex(0);
      setScore(0);
      setAnswered(false);
      setChosen(null);
      setShowLevelUp(false);
    };

    const isCorrect = chosen === current.answer;

    return (
      <GameShell
        title='Health & Wellness' onReset={handleReset} score={score}
        level={levelIndex + 1} totalLevels={CURRICULUM.length}
        questionInLevel={qIndex + 1} totalInLevel={CURRICULUM[levelIndex].length}
        color='#F59E0B' icon='heart'
      >
        <View>
          <Text style={styles.lessonTitle}>Health & Wellness Facts</Text>
          <Text style={styles.lessonSubtitle}>Learn wellness tips - True or False?</Text>
        </View>
        <LevelUpBanner visible={showLevelUp} color='#F59E0B' />
        <View style={styles.trueOrFalseQuestionContainer}>
          <Text style={styles.trueOrFalseQuestionText}>{current.statement}</Text>
        </View>
        {!answered ? (
          <View style={styles.tfButtons}>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#059669' }]} onPress={() => handleAnswer(true)} activeOpacity={0.85}>
              <Icon name='check' size={20} color='#fff' />
              <Text style={styles.tfBtnText}>True</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.tfBtn, { backgroundColor: '#DC2626' }]} onPress={() => handleAnswer(false)} activeOpacity={0.85}>
              <Icon name='times' size={20} color='#fff' />
              <Text style={styles.tfBtnText}>False</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <View style={isCorrect ? styles.feedbackCorrectCard : styles.feedbackWrongCard}>
              <Icon name={isCorrect ? 'check-circle' : 'times-circle'} size={20} color={isCorrect ? '#059669' : '#DC2626'} />
              <Text style={isCorrect ? styles.feedbackCorrectText : styles.feedbackWrongText}>
                {isCorrect ? 'Excellent!' : 'The answer is ' + (current.answer ? 'TRUE' : 'FALSE')}
              </Text>
            </View>
            <View style={styles.exampleContainer}>
              <Icon name='lightbulb' size={15} color='#F59E0B' />
              <Text style={styles.exampleText}>{current.explanation}</Text>
            </View>
            <TouchableOpacity style={[styles.nextBtn, { backgroundColor: '#F59E0B' }]} onPress={nextQuestion} activeOpacity={0.88}>
              <Icon name='arrow-right' size={14} color='#fff' />
              <Text style={styles.nextBtnText}>Next Question</Text>
            </TouchableOpacity>
          </View>
        )}
      </GameShell>
    );
  };

  const renderGame = () => {
    const gameComponent = (() => {
      switch (currentGame) {
        case 'number-seq':   return <NumberSequence />;
        case 'bugtong':      return <Bugtong />;
        case 'memory-match': return <MemoryMatch />;
        case 'health-facts': return <HealthFacts />;
        default:             return null;
      }
    })();

    if (gameComponent) return gameComponent;

    // GameSelector view with PageHeader
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <LinearGradient
            colors={["#F0F9FF", "#E0F2FE", "#BAE6FD", "#7DD3FC", "#38BDF8", "#0EA5E9"]}
            locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
            style={styles.gradientBackground}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          />

          <PageHeader />

          <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <View style={styles.heroSummaryCard}>
              <LinearGradient
                colors={["rgba(245, 158, 11, 0.16)", "rgba(251, 146, 60, 0.12)"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.heroSummaryGradient}
              />
              <View style={styles.heroSummaryContent}>
                <Text style={styles.heroSummaryTitle}>Sharpen Your Mind</Text>
                <Text style={styles.heroSummaryText}>Challenge yourself with fun games designed to keep your mind active and engaged.</Text>
              </View>
            </View>

            <View style={styles.moduleGrid}>
              {games.map((game) => (
                <TouchableOpacity
                  key={game.id}
                  style={styles.moduleCard}
                  onPress={() => setCurrentGame(game.id)}
                  activeOpacity={0.9}
                >
                  <View style={[styles.moduleAccent, { backgroundColor: game.color }]} />
                  <View style={[styles.moduleIconBg, { backgroundColor: game.color + '1F' }]}>
                    <Icon name={game.icon} size={30} color={game.color} />
                  </View>
                  <View style={styles.moduleContent}>
                    <Text style={styles.moduleTitle}>{game.name}</Text>
                    <Text style={styles.moduleDescription}>{game.description}</Text>
                    <View style={[styles.levelChip, { backgroundColor: game.color + '1A' }]}>
                      <Icon name='layer-group' size={10} color={game.color} />
                      <Text style={[styles.levelChipText, { color: game.color }]}>{game.levels} Levels</Text>
                    </View>
                  </View>
                  <View style={styles.arrowIconWrap}>
                    <Icon name='chevron-right' size={16} color='#94A3B8' />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  };

  return renderGame();
};

const styles = StyleSheet.create({
  screenRoot: { flex: 1, backgroundColor: '#0EA5E9' },
  safeArea: { flex: 1, backgroundColor: '#E0F2FE' },
  container: { flex: 1, position: 'relative' },
  gradientBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  scrollView: { flex: 1 },
  scrollContent: { padding: 24, paddingBottom: 60 },
  gameScrollContent: { padding: 20, paddingBottom: 60 },

  // Page Header
  pageHeader: {
    paddingHorizontal: 24,
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 6 : 16,
    paddingBottom: 20,
  },
  pageHeaderTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  backButton: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonGradient: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.16,
    shadowRadius: 10,
    elevation: 6,
  },
  pageHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(245, 158, 11, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pageHeaderBadgeText: {
    color: '#0F172A',
    fontWeight: '700',
    fontSize: 13,
  },
  pageHeaderTitle: {
    color: '#0F172A',
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  pageHeaderSub: {
    color: '#475569',
    fontSize: 16,
    lineHeight: 24,
  },

  // Hero Summary Card
  heroSummaryCard: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
    backgroundColor: '#ffffff',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    position: 'relative',
  },
  heroSummaryGradient: {
    ...StyleSheet.absoluteFillObject,
  },
  heroSummaryContent: {
    padding: 20,
  },
  heroSummaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 6,
  },
  heroSummaryText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 20,
  },

  moduleGrid: { gap: 14 },
  moduleCard: {
    backgroundColor: '#fff', borderRadius: 18, paddingVertical: 16, paddingRight: 14, paddingLeft: 0,
    flexDirection: 'row', alignItems: 'center', minHeight: 100, overflow: 'hidden',
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 3,
  },
  moduleAccent: { width: 6, alignSelf: 'stretch', marginRight: 16, borderTopRightRadius: 3, borderBottomRightRadius: 3 },
  moduleIconBg: { width: 58, height: 58, borderRadius: 29, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  moduleContent: { flex: 1 },
  moduleTitle: { fontSize: 17, fontWeight: '700', color: '#0F172A', marginBottom: 3 },
  moduleDescription: { fontSize: 13.5, color: '#64748B', lineHeight: 18, marginBottom: 8 },
  levelChip: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
  levelChipText: { marginLeft: 5, fontSize: 11, fontWeight: '700' },
  arrowIconWrap: { marginLeft: 8 },

  gameHeader: {
    paddingTop: Platform.OS === 'android' ? (StatusBar.currentHeight ?? 24) + 6 : 6,
    paddingBottom: 14, paddingHorizontal: 16, backgroundColor: 'rgba(255,255,255,0.97)',
    elevation: 4, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08, shadowRadius: 4, borderBottomLeftRadius: 20, borderBottomRightRadius: 20,
  },
  gameHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  gameHeaderCenter: { flex: 1, alignItems: 'center' },
  headerButton: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9',
    paddingHorizontal: 12, paddingVertical: 9, borderRadius: 12,
    minWidth: 56, justifyContent: 'center',
  },
  headerButtonText: { fontSize: 14, color: '#0F172A', fontWeight: '600', marginLeft: 6 },
  gameTitle: { fontSize: 18, fontWeight: '800', color: '#0F172A', textAlign: 'center' },
  gameStats: { flexDirection: 'row', justifyContent: 'center', gap: 10, marginTop: 10 },
  statPill: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 16 },
  statPillText: { marginLeft: 6, fontSize: 12.5, fontWeight: '700', color: '#0F172A' },

  progressWrap: { marginTop: 10, paddingHorizontal: 4 },
  progressTrack: { height: 8, borderRadius: 4, backgroundColor: '#E2E8F0', overflow: 'hidden' },
  progressFill: { height: 8, borderRadius: 4 },
  progressLabel: { marginTop: 5, fontSize: 11.5, color: '#64748B', textAlign: 'center' },

  lessonHeader: {
    alignItems: 'center', marginBottom: 22, backgroundColor: '#fff',
    padding: 24, borderRadius: 22, elevation: 6,
    shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 10,
  },
  lessonIconBubble: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  lessonTitle: { fontSize: 22, fontWeight: '800', color: '#0F172A', textAlign: 'center', marginBottom: 8 },
  lessonSubtitle: { fontSize: 15, color: '#64748B', textAlign: 'center', lineHeight: 21 },

  levelUpBanner: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderRadius: 14, paddingVertical: 12, paddingHorizontal: 14, marginBottom: 18 },
  levelUpText: { marginLeft: 8, fontSize: 14.5, fontWeight: '700' },

  numberSequenceContainer: { backgroundColor: '#fff', borderRadius: 20, padding: 22, marginBottom: 22, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },
  difficultyBadge: { fontSize: 12.5, fontWeight: '700', color: '#3B82F6', marginBottom: 16, textAlign: 'center', letterSpacing: 0.3 },
  sequenceRow: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', flexWrap: 'wrap', rowGap: 10 },
  numberBox: { width: 52, height: 52, borderRadius: 14, backgroundColor: '#3B82F6', justifyContent: 'center', alignItems: 'center' },
  numberBoxMissing: { backgroundColor: '#F59E0B' },
  numberText: { fontSize: 22, fontWeight: '800', color: '#fff' },

  inputSection: { marginBottom: 18 },
  inputLabel: { fontSize: 14.5, fontWeight: '700', color: '#0F172A', marginBottom: 8 },
  numberInput: { borderWidth: 2, borderColor: '#DBEAFE', borderRadius: 14, padding: 16, fontSize: 20, fontWeight: '700', color: '#0F172A', backgroundColor: '#fff', textAlign: 'center' },

  submitBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#3B82F6', paddingVertical: 16, borderRadius: 14, elevation: 2, shadowColor: '#3B82F6', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 6 },
  submitBtnText: { marginLeft: 8, fontSize: 16.5, fontWeight: '700', color: '#fff' },

  nextBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 14, borderRadius: 14, marginTop: 16, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5 },
  nextBtnText: { marginLeft: 8, fontSize: 15, fontWeight: '700', color: '#fff' },

  bugtongQuestionContainer: { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: '#EC4899', padding: 22, borderRadius: 18, marginBottom: 20, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },
  bugtongQuestionText: { fontSize: 19, fontWeight: '700', color: '#0F172A', textAlign: 'center', lineHeight: 27 },
  bugtongOptions: { marginBottom: 4 },
  bugtongOption: { borderWidth: 2, borderRadius: 14, paddingVertical: 16, paddingHorizontal: 16, marginBottom: 10, justifyContent: 'center', alignItems: 'center' },
  bugtongOptionText: { fontSize: 16.5, fontWeight: '700', textAlign: 'center' },

  statsRow: { flexDirection: 'row', justifyContent: 'center', gap: 12, marginBottom: 18 },
  wonBanner: { backgroundColor: '#fff', borderRadius: 20, padding: 22, alignItems: 'center', marginBottom: 20, borderWidth: 2, borderColor: '#22C55E' },
  wonText: { fontSize: 17, fontWeight: '700', color: '#0F172A', textAlign: 'center' },

  cardGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  flipCard: { width: '23%', aspectRatio: 1, borderRadius: 14, backgroundColor: '#10B981', justifyContent: 'center', alignItems: 'center', marginBottom: 12, elevation: 2, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4 },
  flipCardOpen: { backgroundColor: '#fff', borderWidth: 2, borderColor: '#10B981' },
  flipCardMatched: { backgroundColor: '#D1FAE5', borderWidth: 2, borderColor: '#059669' },
  flipCardEmoji: { fontSize: 30 },

  trueOrFalseQuestionContainer: { backgroundColor: '#fff', borderLeftWidth: 5, borderLeftColor: '#F59E0B', borderRadius: 18, padding: 22, marginBottom: 22, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.06, shadowRadius: 8 },
  trueOrFalseQuestionText: { fontSize: 18.5, fontWeight: '700', color: '#0F172A', lineHeight: 26, textAlign: 'center' },
  tfButtons: { flexDirection: 'row', gap: 12, marginBottom: 4 },
  tfBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 18, borderRadius: 14, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.15, shadowRadius: 5 },
  tfBtnText: { marginLeft: 8, fontSize: 16.5, fontWeight: '700', color: '#fff' },

  exampleContainer: { flexDirection: 'row', backgroundColor: '#FFFBEB', borderRadius: 14, padding: 15, marginTop: 16, borderLeftWidth: 4, borderLeftColor: '#F59E0B' },
  exampleText: { flex: 1, fontSize: 14.5, color: '#0F172A', lineHeight: 20, marginLeft: 10 },

  feedbackCorrectCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#ECFDF5', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: '#059669', marginTop: 4 },
  feedbackCorrectText: { flex: 1, marginLeft: 10, fontSize: 15.5, color: '#059669', fontWeight: '700' },
  feedbackWrongCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FEF2F2', padding: 16, borderRadius: 14, borderWidth: 1.5, borderColor: '#DC2626', marginTop: 4 },
  feedbackWrongText: { flex: 1, marginLeft: 10, fontSize: 15.5, color: '#DC2626', fontWeight: '700' },
});

export default MiniGamesScreen;