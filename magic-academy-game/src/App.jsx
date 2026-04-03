import { useMemo, useState } from 'react';

const LEVELS = [
  {
    id: 1,
    title: 'Level 1: Crystal ×11 Spell',
    subtitle: 'Neighbor addition magic',
    description:
      'For a 2-digit number ab, place the sum in the middle: a(a+b)b. If the sum is 10+, carry the extra.',
    generateQuestion: () => {
      const n = Math.floor(Math.random() * 89) + 11;
      return { prompt: `${n} × 11`, value: n };
    },
    stepsFor: (n) => {
      const a = Math.floor(n / 10);
      const b = n % 10;
      const mid = a + b;
      const solution = n * 11;
      return [
        `Take digits: ${a} and ${b}.`,
        `Add neighbors: ${a} + ${b} = ${mid}.`,
        mid >= 10
          ? `Middle is 10 or more, so carry 1. Final magic number is ${solution}.`
          : `Place the sum in between: ${a}${mid}${b} = ${solution}.`,
      ];
    },
  },
  {
    id: 2,
    title: 'Level 2: Moonbeam ×5 Spell',
    subtitle: 'Half + odd bonus',
    description:
      'Divide by 2, then append 0 if even, append 5 if odd.',
    generateQuestion: () => {
      const n = Math.floor(Math.random() * 90) + 10;
      return { prompt: `${n} × 5`, value: n };
    },
    stepsFor: (n) => {
      const half = Math.floor(n / 2);
      const odd = n % 2 === 1;
      return [
        `Take ${n} and find half: ${odd ? `${n} ÷ 2 = ${half} remainder 1` : `${n} ÷ 2 = ${half}`}.`,
        odd ? 'The number is odd, so add bonus 5 at the end.' : 'The number is even, so add 0 at the end.',
        `Result: ${n} × 5 = ${n * 5}.`,
      ];
    },
  },
  {
    id: 3,
    title: 'Level 3: Dragon ×9 Spell',
    subtitle: 'Complement to 9',
    description:
      'For n × 9, do (n − 1) and then (10 − n).',
    generateQuestion: () => {
      const n = Math.floor(Math.random() * 9) + 1;
      return { prompt: `${n} × 9`, value: n };
    },
    stepsFor: (n) => [
      `First digit is one less than ${n}: ${n - 1}.`,
      `Second digit complements to 9: ${10 - n}.`,
      `Result: ${n} × 9 = ${(n - 1) * 10 + (10 - n)}.`,
    ],
  },
];

function App() {
  const [levelIndex, setLevelIndex] = useState(0);
  const [stars, setStars] = useState(0);
  const [streak, setStreak] = useState(0);
  const [reward, setReward] = useState('');
  const [question, setQuestion] = useState(() => LEVELS[0].generateQuestion());
  const [stepIndex, setStepIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [status, setStatus] = useState('idle');

  const level = LEVELS[levelIndex];
  const steps = useMemo(() => level.stepsFor(question.value), [level, question]);
  const correct = level.id === 3 ? (question.value - 1) * 10 + (10 - question.value) : question.value * (level.id === 1 ? 11 : 5);

  const resetRound = (newLevelIndex = levelIndex) => {
    setQuestion(LEVELS[newLevelIndex].generateQuestion());
    setStepIndex(0);
    setAnswer('');
    setStatus('idle');
  };

  const checkAnswer = () => {
    if (Number(answer) === correct) {
      const newStars = stars + 1;
      const newStreak = streak + 1;
      setStars(newStars);
      setStreak(newStreak);
      setStatus('correct');
      setReward(newStreak % 3 === 2 ? '✨ New wand sticker unlocked!' : '⭐ Great spell casting!');
    } else {
      setStatus('wrong');
      setStreak(0);
      setReward('Try again, young wizard!');
    }
  };

  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex(stepIndex + 1);
      return;
    }
    checkAnswer();
  };

  const nextLevel = () => {
    const idx = (levelIndex + 1) % LEVELS.length;
    setLevelIndex(idx);
    resetRound(idx);
  };

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-3xl flex-col px-4 py-6 text-slate-100">
      <header className="mb-4 rounded-3xl border border-violet-300/40 bg-slate-900/70 p-4 shadow-glow">
        <h1 className="text-center text-3xl font-black text-yellow-300 sm:text-4xl">🧙 Magic Academy Math Quest</h1>
        <p className="mt-2 text-center text-sm text-violet-100 sm:text-base">Learn lightning-fast mental math spells for ages 5–8!</p>
        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-lg">
          <span className="rounded-full bg-amber-300 px-4 py-2 font-bold text-slate-900">Stars: {stars} ⭐</span>
          <span className="rounded-full bg-emerald-300 px-4 py-2 font-bold text-slate-900">Streak: {streak} 🔥</span>
        </div>
      </header>

      <section className="mb-4 rounded-3xl border border-indigo-300/40 bg-slate-900/70 p-4">
        <h2 className="text-2xl font-extrabold text-cyan-300">{level.title}</h2>
        <p className="text-violet-200">{level.subtitle}</p>
        <p className="mt-2 text-sm text-slate-200">{level.description}</p>
      </section>

      <section className="flex-1 rounded-3xl border border-fuchsia-300/50 bg-slate-900/70 p-4">
        <div className="rounded-2xl bg-indigo-950/70 p-4 text-center">
          <p className="text-lg text-violet-100">Cast this spell:</p>
          <p className="mt-1 text-5xl font-black text-yellow-200">{question.prompt}</p>
        </div>

        <div className="mt-4 rounded-2xl bg-slate-800/80 p-4">
          <p className="text-sm uppercase tracking-wide text-fuchsia-200">Step {stepIndex + 1}</p>
          <p className={`mt-2 text-lg font-semibold ${status === 'wrong' ? 'animate-wiggle text-rose-300' : 'animate-pop text-cyan-100'}`}>
            {steps[stepIndex]}
          </p>
          {stepIndex < steps.length - 1 && (
            <button
              onClick={nextStep}
              className="mt-4 w-full rounded-2xl bg-cyan-400 px-5 py-4 text-xl font-black text-slate-900 transition hover:scale-[1.02]"
            >
              Next Step ➜
            </button>
          )}
        </div>

        {stepIndex === steps.length - 1 && (
          <div className="mt-4 rounded-2xl bg-slate-800/80 p-4">
            <label className="mb-2 block text-center text-lg font-semibold text-violet-100">Type your answer</label>
            <input
              inputMode="numeric"
              value={answer}
              onChange={(e) => setAnswer(e.target.value.replace(/[^0-9]/g, ''))}
              className="w-full rounded-2xl border-2 border-violet-300 bg-slate-900 px-4 py-4 text-center text-3xl font-black text-yellow-200 outline-none focus:border-cyan-300"
              placeholder="?"
            />
            <button
              onClick={checkAnswer}
              className="mt-4 w-full rounded-2xl bg-emerald-400 px-5 py-4 text-xl font-black text-slate-900 transition hover:scale-[1.02]"
            >
              Check Spell ✅
            </button>
          </div>
        )}

        {status !== 'idle' && (
          <div
            className={`mt-4 rounded-2xl p-4 text-center text-xl font-black ${
              status === 'correct' ? 'animate-pop bg-emerald-300 text-emerald-950' : 'animate-wiggle bg-rose-300 text-rose-950'
            }`}
          >
            {reward}
          </div>
        )}

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <button
            onClick={() => resetRound()}
            className="rounded-2xl bg-violet-400 px-4 py-4 text-lg font-black text-slate-900"
          >
            New Problem
          </button>
          <button
            onClick={nextLevel}
            className="rounded-2xl bg-yellow-300 px-4 py-4 text-lg font-black text-slate-900"
          >
            Next Level
          </button>
          <button
            onClick={() => {
              setStars(0);
              setStreak(0);
              setReward('');
              resetRound();
            }}
            className="col-span-2 rounded-2xl bg-rose-300 px-4 py-4 text-lg font-black text-slate-900 sm:col-span-1"
          >
            Reset Quest
          </button>
        </div>
      </section>

      <footer className="mt-4 text-center text-xs text-slate-300">
        Ready for Cloudflare Pages: build command <code>npm run build</code>, output folder <code>dist</code>.
      </footer>
    </main>
  );
}

export default App;
