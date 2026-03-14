'use client';

import { useState } from 'react';
import ViewSourceButton from '@/components/ui/ViewSourceButton';
import '../../styles/demos/calculator.css';

type CalculatorMode = 'normal' | 'scientific';
type ButtonType = 'number' | 'operator' | 'equals' | 'memory' | 'scientific';

interface HistoryEntry {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

interface CalculatorButton {
  value: string;
  type: ButtonType;
  display?: string;
  scientific?: boolean;
  row?: number;
  col?: number;
}

const normalButtons: CalculatorButton[] = [
  { value: 'MC', type: 'memory', display: 'MC', row: 0, col: 0 },
  { value: 'MR', type: 'memory', display: 'MR', row: 0, col: 1 },
  { value: 'M+', type: 'memory', display: 'M+', row: 0, col: 2 },
  { value: 'M-', type: 'memory', display: 'M-', row: 0, col: 3 },
  { value: 'MS', type: 'memory', display: 'MS', row: 0, col: 4 },
  { value: 'C', type: 'equals', display: 'C', row: 1, col: 0 },
  { value: '%', type: 'operator', display: '%', row: 1, col: 1 },
  { value: '/', type: 'operator', display: '÷', row: 1, col: 2 },
  { value: '*', type: 'operator', display: '×', row: 1, col: 3 },
  { value: '7', type: 'number', display: '7', row: 2, col: 0 },
  { value: '8', type: 'number', display: '8', row: 2, col: 1 },
  { value: '9', type: 'number', display: '9', row: 2, col: 2 },
  { value: '-', type: 'operator', display: '-', row: 2, col: 3 },
  { value: '4', type: 'number', display: '4', row: 3, col: 0 },
  { value: '5', type: 'number', display: '5', row: 3, col: 1 },
  { value: '6', type: 'number', display: '6', row: 3, col: 2 },
  { value: '+', type: 'operator', display: '+', row: 3, col: 3 },
  { value: '1', type: 'number', display: '1', row: 4, col: 0 },
  { value: '2', type: 'number', display: '2', row: 4, col: 1 },
  { value: '3', type: 'number', display: '3', row: 4, col: 2 },
  { value: '(', type: 'operator', display: '(', row: 4, col: 3 },
  { value: '0', type: 'number', display: '0', row: 5, col: 0 },
  { value: '.', type: 'number', display: '.', row: 5, col: 1 },
  { value: '=', type: 'equals', display: '=', row: 5, col: 2 },
  { value: ')', type: 'operator', display: ')', row: 5, col: 3 },
];

const scientificButtons: CalculatorButton[] = [
  { value: 'sin', type: 'scientific', display: 'sin', scientific: true, row: 1, col: 4 },
  { value: 'cos', type: 'scientific', display: 'cos', scientific: true, row: 1, col: 5 },
  { value: 'tan', type: 'scientific', display: 'tan', scientific: true, row: 1, col: 6 },
  { value: 'Rad', type: 'scientific', display: 'Rad', scientific: true, row: 1, col: 7 },
  { value: 'asin', type: 'scientific', display: 'asin', scientific: true, row: 2, col: 4 },
  { value: 'acos', type: 'scientific', display: 'acos', scientific: true, row: 2, col: 5 },
  { value: 'atan', type: 'scientific', display: 'atan', scientific: true, row: 2, col: 6 },
  { value: 'Ans', type: 'scientific', display: 'Ans', scientific: true, row: 2, col: 7 },
  { value: 'log', type: 'scientific', display: 'log', scientific: true, row: 3, col: 4 },
  { value: 'ln', type: 'scientific', display: 'ln', scientific: true, row: 3, col: 5 },
  { value: 'sqrt', type: 'scientific', display: '√', scientific: true, row: 3, col: 6 },
  { value: 'cbrt', type: 'scientific', display: '∛', scientific: true, row: 3, col: 7 },
  { value: 'x²', type: 'scientific', display: 'x²', scientific: true, row: 4, col: 4 },
  { value: 'x³', type: 'scientific', display: 'x³', scientific: true, row: 4, col: 5 },
  { value: '^', type: 'scientific', display: '^', scientific: true, row: 4, col: 6 },
  { value: 'π', type: 'scientific', display: 'π', scientific: true, row: 4, col: 7 },
  { value: '±', type: 'scientific', display: '±', scientific: true, row: 5, col: 4 },
  { value: 'backspace', type: 'scientific', display: '←', scientific: true, row: 5, col: 5 },
  { value: 'e', type: 'scientific', display: 'e', scientific: true, row: 5, col: 6 },
  { value: 'clear', type: 'scientific', display: 'C', scientific: true, row: 5, col: 7 },
];

export default function Calculator() {
  const [mode, setMode] = useState<CalculatorMode>('normal');
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [memory, setMemory] = useState(0);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [showHistory, setShowHistory] = useState(false);
  const [currentExpression, setCurrentExpression] = useState('');
  const [lastAnswer, setLastAnswer] = useState<number | null>(null);

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      case '%': return first % second;
      default: return second;
    }
  };

  const handleScientific = (func: string) => {
    // Clear : même logique de reset que le bouton C en mode normal
    if (func === 'clear') {
      setDisplay('0');
      setPreviousValue(null);
      setOperation(null);
      setCurrentExpression('');
      setWaitingForOperand(false);
      return;
    }
    // Backspace : supprimer le dernier caractère (display + expression)
    if (func === 'backspace') {
      const newDisplay = display.slice(0, -1).trim();
      const nextDisplay = newDisplay === '' || newDisplay === '-' ? '0' : newDisplay;
      setDisplay(nextDisplay);
      setCurrentExpression(currentExpression.slice(0, -1));
      if (nextDisplay === '0') setWaitingForOperand(false);
      return;
    }
    // Rad : non implémenté (pas de mise à jour d'état)
    if (func === 'Rad') {
      return;
    }

    const inputValue = parseFloat(display);
    let result: number;

    switch (func) {
      case 'sin': result = Math.sin(inputValue); break;
      case 'cos': result = Math.cos(inputValue); break;
      case 'tan': result = Math.tan(inputValue); break;
      case 'asin': result = Math.asin(inputValue); break;
      case 'acos': result = Math.acos(inputValue); break;
      case 'atan': result = Math.atan(inputValue); break;
      case 'log': result = Math.log10(inputValue); break;
      case 'ln': result = Math.log(inputValue); break;
      case 'sqrt': result = Math.sqrt(inputValue); break;
      case 'cbrt': result = Math.cbrt(inputValue); break;
      case 'x²': result = Math.pow(inputValue, 2); break;
      case 'x³': result = Math.pow(inputValue, 3); break;
      case 'π': result = Math.PI; break;
      case 'e': result = Math.E; break;
      case '±': result = -inputValue; break;
      case 'Ans': 
        if (lastAnswer !== null) {
          setDisplay(String(lastAnswer));
          setCurrentExpression(String(lastAnswer));
          setWaitingForOperand(true);
          return;
        }
        return;
      default: return;
    }

    setDisplay(String(result));
    setCurrentExpression(String(result));
    setWaitingForOperand(true);
    
    // Ajouter à l'historique pour les fonctions scientifiques
    {
      const historyEntry: HistoryEntry = {
        id: Date.now().toString(),
        expression: `${func}(${inputValue})`,
        result: String(result),
        timestamp: new Date()
      };
      setHistory(prev => [historyEntry, ...prev].slice(0, 50));
      setLastAnswer(result);
    }
  };

  const handleMemory = (op: string) => {
    const inputValue = parseFloat(display);
    switch (op) {
      case 'MC': setMemory(0); break;
      case 'MR': setDisplay(String(memory)); setWaitingForOperand(true); break;
      case 'M+': setMemory(memory + inputValue); setWaitingForOperand(true); break;
      case 'M-': setMemory(memory - inputValue); setWaitingForOperand(true); break;
      case 'MS': setMemory(inputValue); setWaitingForOperand(true); break;
    }
  };

  const handleButtonClick = (button: CalculatorButton) => {
    switch (button.type) {
      case 'number':
        if (button.value === '.') {
          if (waitingForOperand) {
            setDisplay('0.');
            setCurrentExpression('0.');
            setWaitingForOperand(false);
          } else if (display.indexOf('.') === -1) {
            setDisplay(display + '.');
            setCurrentExpression(currentExpression + '.');
          }
        } else {
          if (waitingForOperand) {
            setDisplay(button.value);
            setCurrentExpression(button.value);
            setWaitingForOperand(false);
          } else {
            const newDisplay = display === '0' ? button.value : display + button.value;
            setDisplay(newDisplay);
            setCurrentExpression(currentExpression === '' ? button.value : currentExpression + button.value);
          }
        }
        break;
      case 'operator':
        if (button.value === '(' || button.value === ')') {
          const newDisplay = display + button.value;
          setDisplay(newDisplay);
          setCurrentExpression(currentExpression + button.value);
        } else {
          const inputValue = parseFloat(display);
          const displayValue = button.value === '*' ? '×' : button.value === '/' ? '÷' : button.value;
          
          if (previousValue === null) {
            setPreviousValue(inputValue);
            setCurrentExpression(display + ' ' + displayValue + ' ');
          } else if (operation) {
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setPreviousValue(newValue);
            setCurrentExpression(String(newValue) + ' ' + displayValue + ' ');
          } else {
            setCurrentExpression(currentExpression + ' ' + displayValue + ' ');
          }
          setWaitingForOperand(true);
          setOperation(button.value);
        }
        break;
      case 'equals':
        if (button.value === 'C') {
          setDisplay('0');
          setPreviousValue(null);
          setOperation(null);
          setCurrentExpression('');
        } else if (button.value === '=') {
          if (operation && previousValue !== null) {
            const inputValue = parseFloat(display);
            const expression = `${previousValue} ${operation} ${inputValue}`;
            const newValue = calculate(previousValue, inputValue, operation);
            setDisplay(String(newValue));
            setLastAnswer(newValue);
            
            // Ajouter à l'historique
            const historyEntry: HistoryEntry = {
              id: Date.now().toString(),
              expression: expression,
              result: String(newValue),
              timestamp: new Date()
            };
            setHistory(prev => [historyEntry, ...prev].slice(0, 50)); // Garder les 50 derniers
            
            setPreviousValue(null);
            setOperation(null);
            setCurrentExpression('');
            setWaitingForOperand(true);
          } else if (currentExpression) {
            // Essayer d'évaluer l'expression complète
            try {
              const expression = currentExpression.replace(/×/g, '*').replace(/÷/g, '/');
              const result = Function(`"use strict"; return (${expression})`)();
              setDisplay(String(result));
              setLastAnswer(result);
              
              const historyEntry: HistoryEntry = {
                id: Date.now().toString(),
                expression: currentExpression,
                result: String(result),
                timestamp: new Date()
              };
              setHistory(prev => [historyEntry, ...prev].slice(0, 50));
              setCurrentExpression('');
            } catch (e) {
              // Ignorer les erreurs d'évaluation
            }
          }
        }
        break;
      case 'memory':
        handleMemory(button.value);
        break;
      case 'scientific':
        handleScientific(button.value);
        break;
    }
  };

  const toggleMode = () => {
    setMode(mode === 'normal' ? 'scientific' : 'normal');
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const useHistoryEntry = (entry: HistoryEntry) => {
    setDisplay(entry.result);
    setLastAnswer(parseFloat(entry.result));
    setWaitingForOperand(true);
    setCurrentExpression('');
  };

  const allButtons = mode === 'scientific' 
    ? [...normalButtons, ...scientificButtons]
    : normalButtons;

  return (
    <div style={{ position: 'relative' }}>
      <ViewSourceButton filename="Calculator.tsx" />
      <section className="wf-section wf-hero">
        <div className="wf-hero-bg">
          <div className="wf-starfield-layer"></div>
          <div className="blob blob-1"></div>
          <div className="blob blob-2"></div>
          <div className="blob blob-3"></div>
          <div className="curve-glow curve-glow-1"></div>
          <div className="curve-glow curve-glow-2"></div>
        </div>
        <div className="wf-inner hero-inner">
          <div className="wf-hero-content">
            <div className="wf-hero-text">
              <p className="eyebrow">Calculatrice Interactive</p>
              <h1 className="wf-hero-title">
                Calculatrice<br />
                <span className="underline-wave">Scientifique</span>
              </h1>
              <p className="lead">
                Calculatrice scientifique avec fonctions trigonométriques, conversions d&apos;unités et historique.
                Interface moderne et intuitive.
              </p>
            </div>
          </div>
        </div>
        <div className="wf-wave-divider wf-wave-bottom">
          <svg viewBox="0 0 1440 240" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveHeroGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="40%" stopColor="#10163B" />
                <stop offset="75%" stopColor="#1B355A" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveHeroGrad)" d="M0,160 C260,220 420,80 720,140 C1040,200 1180,260 1440,200 L1440,240 L0,240 Z" />
          </svg>
        </div>
      </section>

      <section className="wf-section wf-projects">
        <div className="wf-wave-divider wf-wave-top">
          <svg viewBox="0 0 1440 180" preserveAspectRatio="none">
            <defs>
              <linearGradient id="waveControlsGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#050716" />
                <stop offset="30%" stopColor="#10163B" />
                <stop offset="70%" stopColor="#241848" />
                <stop offset="100%" stopColor="#050716" />
              </linearGradient>
            </defs>
            <path fill="url(#waveControlsGrad)" d="M0,40 C260,-10 420,140 720,90 C1040,40 1180,-40 1440,10 L1440,0 L0,0 Z" />
          </svg>
        </div>

        <div className="wf-inner">
          <div className="calculator-wrapper">
            <div className={`calculator-container ${mode === 'scientific' ? 'scientific-mode' : ''}`}>
              <div className="calculator-header">
                <button onClick={toggleMode} className="calculator-mode-btn">
                  Mode {mode === 'normal' ? 'Scientifique' : 'Normal'}
                </button>
                <button 
                  onClick={() => setShowHistory(!showHistory)} 
                  className="calculator-history-toggle"
                >
                  {showHistory ? '📋 Masquer' : '📋 Historique'}
                  {history.length > 0 && <span className="history-badge">{history.length}</span>}
                </button>
              </div>

              <div className="calculator-screen">
                {currentExpression && currentExpression !== display && (
                  <div className="calculator-expression">{currentExpression}</div>
                )}
                <span className="calculator-display-text">{display}</span>
              </div>

              <div className="calculator-memory-group">
                {normalButtons.filter(b => b.type === 'memory').map((btn, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleButtonClick(btn)}
                    className="calculator-btn-memory"
                  >
                    {btn.display}
                  </button>
                ))}
              </div>

              <div className={`calculator-grid ${mode === 'scientific' ? 'scientific-mode' : ''}`}>
                {allButtons
                  .filter(b => b.type !== 'memory')
                  .map((btn, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleButtonClick(btn)}
                      className={`calculator-btn calculator-btn-${btn.type === 'number' ? 'number' : btn.type === 'operator' ? 'operator' : btn.type === 'equals' ? 'equals' : 'scientific'}`}
                      style={{
                        gridRow: btn.row !== undefined ? btn.row + 1 : 'auto',
                        gridColumn: btn.col !== undefined ? btn.col + 1 : 'auto',
                      }}
                    >
                      {btn.display || btn.value}
                    </button>
                  ))}
              </div>

              {showHistory && (
                <div className="calculator-history">
                  <div className="calculator-history-header">
                    <h3>Historique</h3>
                    <button onClick={clearHistory} className="calculator-clear-history">
                      Effacer
                    </button>
                  </div>
                  <div className="calculator-history-list">
                    {history.length === 0 ? (
                      <div className="calculator-history-empty">
                        Aucun calcul dans l&apos;historique
                      </div>
                    ) : (
                      history.map(entry => (
                        <div 
                          key={entry.id} 
                          className="calculator-history-item"
                          onClick={() => useHistoryEntry(entry)}
                        >
                          <div className="calculator-history-expression">{entry.expression}</div>
                          <div className="calculator-history-result">= {entry.result}</div>
                          <div className="calculator-history-time">
                            {entry.timestamp.toLocaleTimeString('fr-FR', { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
