import React, { useState, useEffect } from 'react';
import DFAVisualization from './dfavixgraph';

function MinimizeDFA({ graph }) {
  const [minimizedGraph, setMinimizedGraph] = useState(null);

  useEffect(() => {
    minimizeDFA();
  }, [graph]);

  function minimizeDFA() {
    const A = new Set([graph.startState]);
    const B = new Set();
  
    while (A.size > 0) {
      const q = A.values().next().value;
      A.delete(q);
  
      for (const a of [0, 1]) {
        // Check if the transition is found
        const transition = graph.transitions.find(t => t.source === q && t.input === a);
        if (transition) {
          const nextState = transition.target;
          
          // Add nextState to A or B based on its presence in A or B
          if (A.has(nextState)) {
            A.add(nextState);
          }
          if (B.has(nextState)) {
            B.add(nextState);
          }
        }
      }
    }
  
    const minimizedStates = [...A, ...B];
    const minimizedTransitions = [];
    for (const state of minimizedStates) {
      for (const input of [0, 1]) {
        // Check if the transition is found
        const transition = graph.transitions.find(t => t.source === state && t.input === input);
        if (transition) {
          const nextState = transition.target;
          const minimizedNextState = minimizedStates.indexOf(nextState);
          minimizedTransitions.push({
            source: state,
            input,
            target: minimizedNextState,
          });
        }
      }
    }
  
    setMinimizedGraph({
      startState: graph.startState,
      finalStates: graph.finalStates.filter(s => A.has(s)),
      states: minimizedStates,
      transitions: minimizedTransitions,
    });
  }
  

  if (minimizedGraph) {
    console.log(minimizedGraph);
  }

  return (
    <div>
      <DFAVisualization 
        graph={minimizedGraph}
      />
    </div>
  );
}

export default MinimizeDFA;
