
import React, { useCallback } from 'react';

const TypeAnimation = ({ sequence, speed = 100, repeat = Infinity }) => {
  const [text, setText] = React.useState("");
  const [index, setIndex] = React.useState(0);
  const [subIndex, setSubIndex] = React.useState(0);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Memoize the text sequence to prevent recalculation
  const textSequence = React.useMemo(() => 
    sequence.filter(item => typeof item === "string"),
    [sequence]
  );
  

  // Handle the typing effect
  const typeEffect = useCallback(() => {
    if (index >= textSequence.length) {
      if (repeat === Infinity) {
        setIndex(0);
      }
      return;
    }

    const currentText = textSequence[index] || "";
    const baseSpeed = isDeleting ? speed / 2 : speed;
    const timeout = Math.max(50, Math.min(baseSpeed, 200));

    if (!isDeleting && subIndex >= currentText.length) {
      const timer = setTimeout(() => {
        requestAnimationFrame(() => setIsDeleting(true));
      }, 1500);
      return () => clearTimeout(timer);
    }

    if (isDeleting && subIndex <= 0) {
      setIsDeleting(false);
      setIndex(prev => (prev + 1) % textSequence.length);
      setSubIndex(0);
      return;
    }

    const timer = setTimeout(() => {
      requestAnimationFrame(() => {
        if (isDeleting) {
          setSubIndex(prev => {
            const newIndex = prev - 1;
            setText(currentText.substring(0, newIndex));
            return newIndex;
          });
        } else {
          setSubIndex(prev => {
            const newIndex = prev + 1;
            setText(currentText.substring(0, newIndex));
            return newIndex;
          });
        }
      });
    }, timeout);

    return () => clearTimeout(timer);
  }, [index, subIndex, isDeleting, speed, repeat, textSequence]);

  React.useEffect(() => {
    typeEffect();
  }, [typeEffect]);

  return <span>{text}<span className="typing-cursor">|</span></span>;
};

export default TypeAnimation;
