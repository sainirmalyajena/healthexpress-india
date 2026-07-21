'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface FAQAccordionProps {
  faqs: FAQ[];
}

export function FAQAccordion({ faqs }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, i) => (
        <div 
          key={i} 
          className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden transition-all duration-300 hover:border-teal-200"
        >
          <button
            onClick={() => toggleFAQ(i)}
            className="w-full text-left px-6 py-5 flex items-center justify-between gap-4 focus:outline-none"
          >
            <h3 className="text-base md:text-lg font-bold text-slate-900 flex items-start gap-3">
              <span className="text-teal-600 font-black mt-0.5">Q.</span>
              {faq.question}
            </h3>
            <ChevronDown 
              className={`w-5 h-5 text-slate-400 flex-shrink-0 transition-transform duration-300 ${openIndex === i ? 'rotate-180 text-teal-600' : ''}`} 
            />
          </button>
          
          <div 
            className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${
              openIndex === i ? 'max-h-96 pb-6 opacity-100' : 'max-h-0 opacity-0'
            }`}
          >
            <p className="text-slate-600 leading-relaxed text-sm md:text-base pl-8 border-t border-slate-100 pt-4">
              {faq.answer}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
