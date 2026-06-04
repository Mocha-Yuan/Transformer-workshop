export interface InterpreterChoice {
  id: string;
  label: string;
  moduleNames: string[];
  explanation: string;
  contrast: string;
}

interface InterpreterChoicePanelProps {
  choices: InterpreterChoice[];
  selectedChoiceId: string;
  onSelect: (choiceId: string) => void;
}

export function InterpreterChoicePanel({ choices, selectedChoiceId, onSelect }: InterpreterChoicePanelProps) {
  return (
    <section className="interpreter-choice-panel" aria-label="译员思考选择题">
      <p className="screen-label">译员思考选择题</p>
      <h2>如果你是译员，面对这句话，你会先关注什么？</h2>
      <div className="interpreter-choice-list">
        {choices.map((choice, index) => (
          <button
            className={choice.id === selectedChoiceId ? 'interpreter-choice is-selected' : 'interpreter-choice'}
            key={choice.id}
            onClick={() => onSelect(choice.id)}
            type="button"
          >
            <span>{index + 1}</span>
            <strong>{choice.label}</strong>
          </button>
        ))}
      </div>
    </section>
  );
}
