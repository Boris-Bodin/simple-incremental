export type BuyAmount = 1 | 10 | 100 | 'max';

const OPTIONS: BuyAmount[] = [1, 10, 100, 'max'];

interface Props {
  value: BuyAmount;
  onChange: (amount: BuyAmount) => void;
}

export function BuyAmountSelector({ value, onChange }: Props) {
  return (
    <div className="buy-amount" role="group" aria-label="Buy amount">
      {OPTIONS.map((option) => (
        <button
          key={option}
          type="button"
          className={`buy-amount-option${value === option ? ' is-active' : ''}`}
          aria-pressed={value === option}
          onClick={() => onChange(option)}
        >
          {option === 'max' ? 'Max' : `×${option}`}
        </button>
      ))}
    </div>
  );
}
