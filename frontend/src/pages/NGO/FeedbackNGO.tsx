// src/pages/ngo/FeedbackNGO.tsx
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import FloatingFoodIcons from '@/components/common/FloatingFoodIcons';
import Card from '@/components/ui/Card';
// import Confetti from 'react-confetti';

const MAX_COMMENT = 200;

const FeedbackNGO: React.FC = () => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [helper, setHelper] = useState('Tap a star to rate');

  // helper text based on rating
  useEffect(() => {
    const texts = [
      'Oh no! What went wrong?',
      'We’ll do better next time.',
      'Not bad, but room for improvement.',
      'Great! Thanks for the feedback.',
      'Awesome! So glad you loved it!',
    ];
    if (rating > 0) setHelper(texts[rating - 1]);
  }, [rating]);

  if (submitted) {
    return (
  <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 overflow-hidden">
    <FloatingFoodIcons />

    <div className="bg-white p-8 rounded-3xl shadow-xl border border-green-50 flex flex-col items-center text-center">
      <motion.h2
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="text-2xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-orange-600"
      >
        Thank You!
      </motion.h2>

      <p className="mb-4 text-gray-700">
        You rated us <span className="font-semibold">{rating}</span> star{rating > 1 ? 's' : ''}.
      </p>

      <motion.button
        onClick={() => {
          setSubmitted(false);
          setRating(0);
          setComment('');
          setHelper('Tap a star to rate');
        }}
        whileHover={{ scale: 1.03 }}
        className="mt-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
      >
        Give More Feedback
      </motion.button>
    </div>
  </div>
);
  }

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-yellow-50 to-orange-50 overflow-hidden">
      <FloatingFoodIcons />

      <div className="p-8 w-80 bg-white rounded-3xl shadow-xl border border-green-50 flex flex-col items-center">


        <motion.h2
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 120, damping: 12 }}
          className="text-2xl font-extrabold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-orange-600"
        >
          Rate & Review
        </motion.h2>

        {/* Stars */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.05 } }
          }}
          className="flex justify-center mb-2 space-x-1"
        >
          {[1,2,3,4,5].map(i => (
            <motion.div
              key={i}
              variants={{
                hidden: { scale: 0 },
                visible: { scale: 1 }
              }}
            >
              <Star
                className={`h-8 w-8 cursor-pointer ${i <= rating ? 'text-yellow-500' : 'text-gray-300'}`}
                onClick={() => setRating(i)}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Helper text */}
        <p className="text-sm text-gray-600 mb-4 italic text-center">{helper}</p>

        {/* Comment box with character count */}
        <textarea
          rows={4}
          value={comment}
          onChange={e => setComment(e.target.value.slice(0, MAX_COMMENT))}
          placeholder="Your feedback…"
          className="w-full px-3 py-2 mb-1 border rounded-lg focus:ring-2 focus:ring-green-500 transition"
        />
        <p className="text-xs text-gray-500 text-right mb-4">
          {comment.length}/{MAX_COMMENT}
        </p>

        {/* Submit button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          onClick={() => { if (rating > 0) setSubmitted(true); }}
          className={`w-full py-2 rounded-lg text-white font-medium transition ${
            rating > 0 ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-300 cursor-not-allowed'
          }`}
          disabled={rating === 0}
        >
          Submit
        </motion.button>
      </div>
    </div>
  );
};

export default FeedbackNGO;
