import { useId } from 'react';
import CodeBlock from './CodeBlock.jsx';
import { Inline } from './Blocks.jsx';

// Section 4 for quiz lessons: one radio group per question.
export default function QuizForm({ questions, answers, onChange, onSubmit, running }) {
  const baseId = useId();
  const answered = answers.filter((answer) => answer !== null).length;

  return (
    <form
      className="quiz"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      {questions.map((question, index) => (
        <fieldset key={index} className="quiz__question">
          <legend>
            <span className="quiz__number">Question {index + 1}.</span> <Inline text={question.q} />
          </legend>
          {question.code && <CodeBlock code={question.code} lang={question.lang ?? 'js'} />}
          {question.options.map((option, optionIndex) => {
            const id = `${baseId}-${index}-${optionIndex}`;
            return (
              <div key={optionIndex} className="quiz__option">
                <input
                  type="radio"
                  id={id}
                  name={`${baseId}-q${index}`}
                  checked={answers[index] === optionIndex}
                  onChange={() => onChange(answers.map((answer, i) => (i === index ? optionIndex : answer)))}
                />
                <label htmlFor={id}>
                  <Inline text={option} />
                </label>
              </div>
            );
          })}
        </fieldset>
      ))}
      <div className="actions">
        <button type="submit" className="button--primary" disabled={running}>
          {running ? 'Grading…' : 'Submit answers'}
        </button>
        <span className="muted">
          {answered} of {questions.length} answered
        </span>
      </div>
    </form>
  );
}
