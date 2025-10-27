import React from 'react';
import ModifierToggle from './ModifierToggle';
import { useGameModifiers } from '../GameModifiersContext';

const MODIFIERS = [
  {
    key: 'variableTarget',
    label: 'Variable Target Size',
    description: 'Target changes size each time it appears.',
    id: 'mod-var-size',
  },
  {
    key: 'adaptiveDifficulty',
    label: 'Adaptive Difficulty',
    description: 'Target auto-moves after 3s (speed increases every 10 hits).',
    id: 'mod-adaptive',
  },
  {
    key: 'distractors',
    label: 'Distractors',
    description: 'Random cells flash violet. Clicking them penalizes you.',
    id: 'mod-distractors',
  },
];

const ModifiersPanel = () => {
  const { modifiers, setModifiers } = useGameModifiers();
  return (
    <div className="flex flex-col gap-4 mt-4">
      {MODIFIERS.map(mod => (
        <ModifierToggle
          key={mod.key}
          label={mod.label}
          description={mod.description}
          checked={modifiers[mod.key]}
          onChange={v => setModifiers(m => ({ ...m, [mod.key]: v }))}
          id={mod.id}
        />
      ))}
    </div>
  );
};
export default ModifiersPanel; 