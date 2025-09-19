import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Dimensions,
  Alert,
  SafeAreaView,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/FontAwesome5';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const MiniGamesScreen = () => {
  const navigation = useNavigation();
  const [currentGame, setCurrentGame] = useState(null);

  const games = [
    { id: 'tic-tac-toe', name: 'Tic Tac Toe', icon: 'times-circle', color: '#3B82F6' },
    { id: 'block-blast', name: 'Block Blast', icon: 'th-large', color: '#8B5CF6' },
    { id: 'puzzle-pieces', name: 'Puzzle Pieces', icon: 'puzzle-piece', color: '#10B981' },
    { id: 'color-match', name: 'Color Match', icon: 'palette', color: '#F59E0B' },
    { id: 'memory', name: 'Memory Game', icon: 'brain', color: '#EC4899' }
  ];

  const GameSelector = () => (
    <SafeAreaView style={styles.container}>
      {/* Gradient Background */}
      <LinearGradient
        colors={['#F0F9FF', '#E0F2FE', '#BAE6FD', '#7DD3FC', '#38BDF8', '#0EA5E9']}
        locations={[0, 0.15, 0.35, 0.55, 0.75, 1]}
        style={styles.gradientBackground}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      />
      {/* Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation.goBack()}
        activeOpacity={0.8}
        accessibilityLabel="Back"
      >
        <Icon name="arrow-left" size={18} color="#0F172A" />
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
      <View style={styles.header}>
        <View style={styles.headerIconContainer}>
          <Icon name="gamepad" size={32} color="#0F172A" />
        </View>
        <Text style={styles.headerTitle}>🎮 Mini Games</Text>
        <Text style={styles.headerSubtitle}>Fun brain games for everyone</Text>
        <View style={styles.headerDivider} />
      </View>
      <ScrollView contentContainerStyle={styles.gamesGrid} showsVerticalScrollIndicator={false}>
        {games.map((game) => (
          <TouchableOpacity
            key={game.id}
            style={[styles.gameCard, { borderColor: game.color }]}
            onPress={() => setCurrentGame(game.id)}
            activeOpacity={0.92}
            accessibilityLabel={game.name}
          >
            <View style={[styles.gameIconBg, { backgroundColor: game.color + '22' }]}>
              <Icon name={game.icon} size={40} color={game.color} />
            </View>
            <View style={styles.gameContent}>
              <Text style={styles.gameName}>{game.name}</Text>
            </View>
            <View style={styles.arrowIcon}>
              <Icon name="chevron-right" size={18} color="#38BDF8" />
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );

  // Back Button for games
  const GameHeader = ({ title, onReset, showReset = true }) => (
    <View style={styles.gameHeader}>
      <TouchableOpacity
        style={styles.headerButton}
        onPress={() => setCurrentGame(null)}
        accessibilityLabel="Back"
      >
        <Icon name="arrow-left" size={18} color="#0F172A" />
        <Text style={styles.headerButtonText}>Back</Text>
      </TouchableOpacity>
      <Text style={styles.gameTitle}>{title}</Text>
      {showReset ? (
        <TouchableOpacity style={styles.headerButton} onPress={onReset}>
          <Icon name="redo" size={18} color="#38BDF8" />
        </TouchableOpacity>
      ) : (
        <View style={styles.headerButton} />
      )}
    </View>
  );

  // --- Tic Tac Toe ---
  const TicTacToe = () => {
    const [board, setBoard] = useState(Array(9).fill(null));
    const [isXNext, setIsXNext] = useState(true);
    const [winner, setWinner] = useState(null);

    const checkWinner = (squares) => {
      const lines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8],
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]
      ];
      for (let line of lines) {
        const [a, b, c] = line;
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
          return squares[a];
        }
      }
      return squares.every(square => square) ? 'tie' : null;
    };

    const handleClick = (index) => {
      if (board[index] || winner) return;
      const newBoard = [...board];
      newBoard[index] = isXNext ? 'X' : 'O';
      setBoard(newBoard);
      setIsXNext(!isXNext);
      const gameWinner = checkWinner(newBoard);
      setWinner(gameWinner);
      if (gameWinner) {
        setTimeout(() => {
          Alert.alert(
            'Game Over!',
            gameWinner === 'tie' ? "It's a tie!" : `${gameWinner} wins!`,
            [{ text: 'OK' }]
          );
        }, 100);
      }
    };

    const resetGame = () => {
      setBoard(Array(9).fill(null));
      setIsXNext(true);
      setWinner(null);
    };

    return (
      <SafeAreaView style={styles.gameContainer}>
        <GameHeader title="Tic Tac Toe" onReset={resetGame} />
        <View style={styles.ticTacToeBoard}>
          <Text style={styles.turnText}>
            {winner === 'tie' ? "It's a Tie!" : winner ? `${winner} Wins!` : `${isXNext ? 'X' : 'O'}'s Turn`}
          </Text>
          <View style={styles.board}>
            {board.map((cell, index) => (
              <TouchableOpacity
                key={index}
                style={styles.cell}
                onPress={() => handleClick(index)}
              >
                <Text style={styles.cellText}>{cell}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </SafeAreaView>
    );
  };

  // --- Block Blast ---
  const BlockBlast = () => {
    const [grid, setGrid] = useState(Array(64).fill(false));
    const [score, setScore] = useState(0);
    const [selectedBlocks, setSelectedBlocks] = useState([]);

    const toggleBlock = (index) => {
      if (selectedBlocks.includes(index)) {
        setSelectedBlocks(selectedBlocks.filter(i => i !== index));
      } else {
        setSelectedBlocks([...selectedBlocks, index]);
      }
    };

    const blastBlocks = () => {
      if (selectedBlocks.length < 2) return;
      const newGrid = [...grid];
      selectedBlocks.forEach(index => {
        newGrid[index] = false;
      });
      setGrid(newGrid);
      setScore(score + selectedBlocks.length * 10);
      setSelectedBlocks([]);
    };

    const resetGame = () => {
      setGrid(Array(64).fill(false));
      setScore(0);
      setSelectedBlocks([]);
      // Add some random blocks
      const newGrid = Array(64).fill(false);
      for (let i = 0; i < 20; i++) {
        const randomIndex = Math.floor(Math.random() * 64);
        newGrid[randomIndex] = true;
      }
      setGrid(newGrid);
    };

    useEffect(() => {
      resetGame();
    }, []);

    return (
      <SafeAreaView style={styles.gameContainer}>
        <GameHeader title="Block Blast" onReset={resetGame} />
        <View style={styles.blockBlastContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.instructionText}>Tap blocks to select, then blast them!</Text>
          <View style={styles.blockGrid}>
            {grid.map((hasBlock, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.blockCell,
                  hasBlock && styles.blockCellActive,
                  selectedBlocks.includes(index) && styles.blockCellSelected
                ]}
                onPress={() => hasBlock && toggleBlock(index)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.blastButton, selectedBlocks.length < 2 && styles.blastButtonDisabled]}
            onPress={blastBlocks}
            disabled={selectedBlocks.length < 2}
          >
            <Text style={styles.blastButtonText}>
              Blast {selectedBlocks.length} blocks
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // --- Puzzle Pieces ---
  const PuzzlePieces = () => {
    const [currentPuzzle, setCurrentPuzzle] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedChoice, setSelectedChoice] = useState(null);

    const puzzles = [
      {
        pattern: [
          ['🟦', '🟦', '🟦'],
          ['🟦', '❓', '🟦'],
          ['🟦', '🟦', '🟦']
        ],
        choices: ['🟦', '🟥', '🟩'],
        correct: 0,
        description: 'Complete the blue square pattern'
      },
      {
        pattern: [
          ['🔴', '🟡', '🔴'],
          ['🟡', '❓', '🟡'],
          ['🔴', '🟡', '🔴']
        ],
        choices: ['🔴', '🟡', '🟢'],
        correct: 0,
        description: 'Fill in the missing piece'
      },
      {
        pattern: [
          ['⭐', '⭐', '⭐'],
          ['⭐', '❓', '⭐'],
          ['⭐', '⭐', '⭐']
        ],
        choices: ['⭐', '🌟', '✨'],
        correct: 0,
        description: 'Complete the star pattern'
      },
      {
        pattern: [
          ['🍎', '🍌', '🍎'],
          ['🍌', '❓', '🍌'],
          ['🍎', '🍌', '🍎']
        ],
        choices: ['🍎', '🍌', '🍊'],
        correct: 0,
        description: 'What fruit is missing?'
      }
    ];

    const checkAnswer = () => {
      if (selectedChoice === null) return;
      const puzzle = puzzles[currentPuzzle];
      if (selectedChoice === puzzle.correct) {
        setScore(score + 10);
        Alert.alert('Correct!', 'Well done!', [
          { text: 'Next', onPress: nextPuzzle }
        ]);
      } else {
        Alert.alert('Try Again!', 'That piece doesn\'t fit.', [
          { text: 'OK' }
        ]);
      }
      setSelectedChoice(null);
    };

    const nextPuzzle = () => {
      if (currentPuzzle < puzzles.length - 1) {
        setCurrentPuzzle(currentPuzzle + 1);
      } else {
        Alert.alert('Congratulations!', `You completed all puzzles! Final score: ${score + 10}`, [
          { text: 'Play Again', onPress: resetGame }
        ]);
      }
    };

    const resetGame = () => {
      setCurrentPuzzle(0);
      setScore(0);
      setSelectedChoice(null);
    };

    const puzzle = puzzles[currentPuzzle];

    return (
      <SafeAreaView style={styles.gameContainer}>
        <GameHeader title="Puzzle Pieces" onReset={resetGame} />
        <View style={styles.puzzlePiecesContainer}>
          <Text style={styles.scoreText}>Score: {score}</Text>
          <Text style={styles.puzzleDescription}>{puzzle.description}</Text>
          <View style={styles.puzzleGrid}>
            {puzzle.pattern.map((row, rowIndex) => (
              <View key={rowIndex} style={styles.puzzleRow}>
                {row.map((piece, colIndex) => (
                  <View key={colIndex} style={styles.puzzlePiece}>
                    <Text style={styles.puzzlePieceText}>
                      {piece === '❓' && selectedChoice !== null
                        ? puzzle.choices[selectedChoice]
                        : piece}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>
          <Text style={styles.choicesLabel}>Choose the missing piece:</Text>
          <View style={styles.choicesContainer}>
            {puzzle.choices.map((choice, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.choiceButton,
                  selectedChoice === index && styles.choiceButtonSelected
                ]}
                onPress={() => setSelectedChoice(index)}
              >
                <Text style={styles.choiceText}>{choice}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity
            style={[
              styles.submitButton,
              selectedChoice === null && styles.submitButtonDisabled
            ]}
            onPress={checkAnswer}
            disabled={selectedChoice === null}
          >
            <Text style={styles.submitButtonText}>Check Answer</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  };

  // --- Color Match ---
  const ColorMatch = () => {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD'];
    const [targetColor, setTargetColor] = useState(colors[0]);
    const [score, setScore] = useState(0);
    const [timeLeft, setTimeLeft] = useState(30);
    const [gameActive, setGameActive] = useState(false);

    useEffect(() => {
      let interval;
      if (gameActive && timeLeft > 0) {
        interval = setInterval(() => {
          setTimeLeft(time => time - 1);
        }, 1000);
      } else if (timeLeft === 0) {
        setGameActive(false);
        Alert.alert('Time\'s Up!', `Final Score: ${score}`);
      }
      return () => clearInterval(interval);
    }, [gameActive, timeLeft]);

    const startGame = () => {
      setScore(0);
      setTimeLeft(30);
      setGameActive(true);
      setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
    };

    const selectColor = (color) => {
      if (!gameActive) return;
      if (color === targetColor) {
        setScore(score + 1);
        setTargetColor(colors[Math.floor(Math.random() * colors.length)]);
      } else {
        setScore(Math.max(0, score - 1));
      }
    };

    return (
      <SafeAreaView style={styles.gameContainer}>
        <GameHeader title="Color Match" onReset={startGame} showReset={gameActive} />
        <View style={styles.colorMatchContainer}>
          <View style={styles.gameStats}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.timerText}>Time: {timeLeft}s</Text>
          </View>
          {gameActive ? (
            <>
              <Text style={styles.instructionText}>Match this color:</Text>
              <View style={[styles.targetColor, { backgroundColor: targetColor }]} />
              <View style={styles.colorGrid}>
                {colors.map((color, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[styles.colorOption, { backgroundColor: color }]}
                    onPress={() => selectColor(color)}
                  />
                ))}
              </View>
            </>
          ) : (
            <TouchableOpacity style={styles.startButton} onPress={startGame}>
              <Text style={styles.startButtonText}>Start Game</Text>
            </TouchableOpacity>
          )}
        </View>
      </SafeAreaView>
    );
  };

  // --- Memory Game ---
  const MemoryGame = () => {
    const [cards, setCards] = useState([]);
    const [flippedCards, setFlippedCards] = useState([]);
    const [matchedPairs, setMatchedPairs] = useState([]);
    const [moves, setMoves] = useState(0);
    const [gameWon, setGameWon] = useState(false);

    const symbols = ['🐶', '🐱', '🐭', '🐹', '🐰', '🦊', '🐻', '🐼'];

    const initializeGame = () => {
      const gameCards = [];
      symbols.slice(0, 6).forEach((symbol, index) => {
        gameCards.push({ id: index * 2, symbol, matched: false });
        gameCards.push({ id: index * 2 + 1, symbol, matched: false });
      });
      // Shuffle cards
      for (let i = gameCards.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [gameCards[i], gameCards[j]] = [gameCards[j], gameCards[i]];
      }
      setCards(gameCards);
      setFlippedCards([]);
      setMatchedPairs([]);
      setMoves(0);
      setGameWon(false);
    };

    useEffect(() => {
      initializeGame();
    }, []);

    useEffect(() => {
      if (flippedCards.length === 2) {
        const [first, second] = flippedCards;
        setMoves(moves + 1);
        if (cards[first].symbol === cards[second].symbol) {
          setMatchedPairs([...matchedPairs, cards[first].symbol]);
          setTimeout(() => {
            setFlippedCards([]);
            if (matchedPairs.length + 1 === symbols.slice(0, 6).length) {
              setGameWon(true);
              Alert.alert('Congratulations!', `You won in ${moves + 1} moves!`);
            }
          }, 1000);
        } else {
          setTimeout(() => {
            setFlippedCards([]);
          }, 1000);
        }
      }
    }, [flippedCards, cards, matchedPairs, moves]);

    const flipCard = (index) => {
      if (flippedCards.length === 2 || flippedCards.includes(index) ||
        matchedPairs.includes(cards[index].symbol)) return;
      setFlippedCards([...flippedCards, index]);
    };

    return (
      <SafeAreaView style={styles.gameContainer}>
        <GameHeader title="Memory Game" onReset={initializeGame} />
        <View style={styles.memoryContainer}>
          <Text style={styles.movesText}>Moves: {moves}</Text>
          {gameWon && <Text style={styles.winText}>🎉 You Won! 🎉</Text>}
          <View style={styles.memoryGrid}>
            {cards.map((card, index) => (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.memoryCard,
                  (flippedCards.includes(index) || matchedPairs.includes(card.symbol)) && styles.memoryCardFlipped
                ]}
                onPress={() => flipCard(index)}
              >
                <Text style={styles.memoryCardText}>
                  {flippedCards.includes(index) || matchedPairs.includes(card.symbol) ? card.symbol : '?'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.instructionText}>Find matching pairs!</Text>
        </View>
      </SafeAreaView>
    );
  };

  const renderGame = () => {
    switch (currentGame) {
      case 'tic-tac-toe':
        return <TicTacToe />;
      case 'block-blast':
        return <BlockBlast />;
      case 'puzzle-pieces':
        return <PuzzlePieces />;
      case 'color-match':
        return <ColorMatch />;
      case 'memory':
        return <MemoryGame />;
      default:
        return <GameSelector />;
    }
  };

  return renderGame();
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  gradientBackground: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: -1,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    zIndex: 10,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.2)',
  },
  backButtonText: {
    color: '#0F172A',
    fontSize: 15,
    fontWeight: '600',
    marginLeft: 6,
  },
  header: {
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 20,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
    zIndex: 1,
  },
  headerIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 8,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#0F172A',
    marginBottom: 4,
    textAlign: 'center',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#475569',
    fontWeight: '400',
    textAlign: 'center',
  },
  headerDivider: {
    width: 60,
    height: 3,
    backgroundColor: '#38BDF8',
    borderRadius: 2,
    marginTop: 12,
  },
  gamesGrid: {
    paddingHorizontal: 16,
    paddingBottom: 100,
    paddingTop: 10,
  },
  gameCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    elevation: 8,
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    overflow: 'hidden',
    alignItems: 'center',
    borderWidth: 2,
  },
  gameIconBg: {
    width: 85,
    height: 85,
    borderRadius: 16,
    marginLeft: 12,
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  gameContent: {
    flex: 1,
    paddingVertical: 12,
    paddingRight: 12,
  },
  gameName: {
    fontWeight: 'bold',
    color: '#0F172A',
    fontSize: 20,
    marginBottom: 6,
  },
  arrowIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#E0F2FE',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  // Game Header
  gameHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E0F2FE',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 10,
    minWidth: 60,
    justifyContent: 'center',
  },
  headerButtonText: {
    fontSize: 16,
    color: '#38BDF8',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  gameTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0F172A',
  },
  // Tic Tac Toe
  gameContainer: {
    flex: 1,
    backgroundColor: '#F0F9FF',
  },
  ticTacToeBoard: {
    alignItems: 'center',
    padding: 20,
  },
  turnText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 20,
  },
  board: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 300,
    height: 300,
  },
  cell: {
    width: 100,
    height: 100,
    backgroundColor: 'white',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  // Block Blast
  blockBlastContainer: {
    alignItems: 'center',
    padding: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  instructionText: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  blockGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: 320,
    height: 320,
    marginBottom: 20,
  },
  blockCell: {
    width: 40,
    height: 40,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  blockCellActive: {
    backgroundColor: '#3B82F6',
  },
  blockCellSelected: {
    backgroundColor: '#EF4444',
  },
  blastButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
  },
  blastButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  blastButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  // Puzzle Pieces
  puzzlePiecesContainer: {
    alignItems: 'center',
    padding: 20,
  },
  puzzleDescription: {
    fontSize: 18,
    color: '#6B7280',
    textAlign: 'center',
    marginBottom: 20,
  },
  puzzleGrid: {
    marginBottom: 30,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 15,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  puzzleRow: {
    flexDirection: 'row',
  },
  puzzlePiece: {
    width: 70,
    height: 70,
    backgroundColor: '#F9FAFB',
    borderWidth: 2,
    borderColor: '#D1D5DB',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  puzzlePieceText: {
    fontSize: 32,
  },
  choicesLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 15,
  },
  choicesContainer: {
    flexDirection: 'row',
    marginBottom: 30,
  },
  choiceButton: {
    width: 80,
    height: 80,
    backgroundColor: 'white',
    borderWidth: 3,
    borderColor: '#D1D5DB',
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  choiceButtonSelected: {
    borderColor: '#10B981',
    backgroundColor: '#ECFDF5',
  },
  choiceText: {
    fontSize: 40,
  },
  submitButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 40,
    paddingVertical: 15,
    borderRadius: 10,
  },
  submitButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  submitButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  // Color Match
  colorMatchContainer: {
    alignItems: 'center',
    padding: 20,
  },
  gameStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 20,
  },
  timerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#EF4444',
  },
  targetColor: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginVertical: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
  },
  colorOption: {
    width: 80,
    height: 80,
    borderRadius: 40,
    margin: 10,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  startButton: {
    backgroundColor: '#3B82F6',
    paddingHorizontal: 40,
    paddingVertical: 20,
    borderRadius: 15,
    marginTop: 100,
  },
  startButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
  // Memory Game
  memoryContainer: {
    alignItems: 'center',
    padding: 20,
  },
  movesText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1F2937',
    marginBottom: 10,
  },
  winText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#10B981',
    marginBottom: 20,
  },
  memoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    marginBottom: 20,
  },
  memoryCard: {
    width: 80,
    height: 80,
    backgroundColor: '#3B82F6',
    borderRadius: 10,
    margin: 5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  memoryCardFlipped: {
    backgroundColor: 'white',
  },
  memoryCardText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1F2937',
  },
});

export default MiniGamesScreen;
// ...existing code...