
import React from 'react';

const TypeAnimation = ({ sequence, speed = 100, repeat = Infinity }) => {
  const [text, setText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  React.useEffect(() => {
    if (index >= sequence.length) {
      if (repeat === Infinity) {
        setIndex(0);
      }
      return;
    }

    const currentItem = sequence[index];
    const currentText = typeof currentItem === "string" ? currentItem : String(currentItem);
    
    // Fixed timing calculation
    const baseSpeed = isDeleting ? speed / 2 : speed;
    const timeout = baseSpeed;

    if (!isDeleting && subIndex === currentText.length) {
      // Wait before starting to delete
      setTimeout(() => setIsDeleting(true), 1500);
      return;
    }

    if (isDeleting && subIndex === 0) {
      setIsDeleting(false);
      setIndex((prev) => prev + 1);
      return;
    }

    const timer = setTimeout(() => {
      if (isDeleting) {
        setSubIndex((prev) => prev - 1);
        setText(currentText.substring(0, subIndex - 1));
      } else {
        setSubIndex((prev) => prev + 1);
        setText(currentText.substring(0, subIndex + 1));
      }
    }, timeout);

    return () => clearTimeout(timer);
  }, [sequence, index, subIndex, isDeleting, speed, repeat]);

  return <span>{text}<span className="typing-cursor">|</span></span>;
};

export default TypeAnimation;
