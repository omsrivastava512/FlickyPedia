import { useState } from "react";

interface StarRatingProps {
  maxRating?: number;
  color?: string;
  size?: number;
  containerClassName?: string;
  messages?: string[];
  setExternalRating?: React.Dispatch<React.SetStateAction<number>>;
  submitButtonClass?: string;
  submitButtonContent?:string;
  resetButtonClass?: string;
  showReset?:boolean;
  submitFunction?: () => void;
  resetFunction?: () => void;
}
interface StarProps {
  index: number;
  rating: number;
  color: string;
  size: number;
  handleHover: () => void;
  handleClick: () => void;
}

const ratingStyle = {
  display: "flex",
  gap: 4,
  alignItems: "center",
  justifyContent: "center",
};
const starStyle = {
  width: "1em",
  height: "1em",
  backgroundColor: "lightgray",
  cursor: "pointer",
  clipPath:
    "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",

};



export const StarRating = (props: StarRatingProps) => {
  const [rating, setRating] = useState(0);
  const [ratingFinal, setRatingFinal] = useState(false);

  const {
    maxRating = 10,
    color = "gold",
    size = 1,
    containerClassName = "",
    messages = [],
    setExternalRating,
    submitFunction = () => { },
    submitButtonClass = "",
    submitButtonContent = "Submit",
    resetButtonClass = "",
    resetFunction = () => { },
    showReset=false,
  } = props


  const stars = Array.from({ length: maxRating }, (_, index) => (
    <Star
      key={index}
      {...{ index, size, color, rating, }}
      handleHover={() => {
        highlightStars(index);
      }}
      handleClick={() => {
        handleClick(index);
      }}
    />
  ));
  const content = (() => {
    if (messages.length === maxRating) return messages[rating - 1];
    if (messages.length < maxRating && messages.length > 1)
      return messages[Math.ceil(rating / (maxRating / messages.length)) - 1];
    return rating;

  })()
  const handleExit = () => {
    highlightStars(-1);
  }

  const highlightStars = (index: number) => {
    if (!ratingFinal) setRating(index + 1);
  };
  const handleClick = (index: number) => {
    setRating(index + 1);
    setRatingFinal(true);
    if (setExternalRating) setExternalRating(index + 1);
  };
  const resetHandler = () => {
    resetFunction();
    setRatingFinal(false);
    setRating(0);
  };



  return (
    <>
      <div style={ratingStyle} className={containerClassName}
        onMouseLeave={handleExit}>
        {stars}
        <p style={{ width: "1em", height: "1em", textAlign: "right" }}>{rating ? content : ""}</p>
      </div>
      {ratingFinal && (
        <div style={{ display: 'flex', width: '100%', justifyContent: "space-evenly" }}>
          <button hidden={!showReset} className={resetButtonClass}
            onClick={resetHandler}
          >
            Reset
          </button>
          <button className={submitButtonClass}
            onClick={submitFunction}
          >
            {submitButtonContent}
          </button>
        </div>
      )}
    </>
  );
};

const Star = ({
  index,
  rating,
  color,
  size,
  handleHover,
  handleClick,
}: StarProps) => {
  return (
    <span
      onMouseEnter={handleHover}
      onClick={handleClick}
      style={{
        ...starStyle,
        backgroundColor: index < rating ? color : "lightgray",
        fontSize: `${size}em`,

        transition: "background-color 0.2s ease-in-out",
      }}
    ></span>
  );
};
