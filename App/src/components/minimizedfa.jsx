import React, { useState, useEffect } from 'react';
import DFAVisualization from './dfavixgraph';

   /**
   * Minimization of DFA using equivalence classes
   * Steps for the Minimization of DFA :

  Step 1: Create pairs of all states in the DFA.

Generate a list of all possible pairs of states in the DFA. This list will serve as the basis for the equivalence checking process.

Step 2: Mark pairs that distinguish final and non-final states.

For each pair of states (p, q), mark the pair if p is a final state and q is not, or vice versa. This step ensures that final states and non-final states are always considered distinguishable.

Step 3: Mark pairs that lead to distinguishable states for any input symbol.

Iterate through all input symbols (σ) and all unmarked pairs of states (p, q). For each pair (p, q), check the pair (δ(p, σ), δ(q, σ)). If (δ(p, σ), δ(q, σ)) is already marked, then mark (p, q) as well. This step ensures that pairs of states that lead to different states for any input are considered distinguishable.

Step 4: Repeat Step 3 until no more pairs can be marked.

Continue iterating through input symbols and unmarked pairs of states until no new pairs can be marked. This indicates that the equivalence checking process is complete.

Step 5: Combine unmarked pairs into equivalence classes.

Group all unmarked pairs of states into equivalence classes. Each equivalence class represents a set of states that are indistinguishable from each other based on their behavior for all input symbols.

Step 6: Construct the minimized DFA.
example props:
const graph = {
        states: ["q0", "q1", "q2", "q3", "q4", "q5"],
        transitions: [
            { source: "q0", target: "q1", label: "0" },
            { source: "q0", target: "q2", label: "1" },
            { source: "q1", target: "q3", label: "0" },
            { source: "q1", target: "q4", label: "1" },
            { source: "q2", target: "q4", label: "0" },
            { source: "q2", target: "q3", label: "1" },
            { source: "q3", target: "q5", label: "0" },
            { source: "q3", target: "q5", label: "1" },
            { source: "q4", target: "q5", label: "0" },
            { source: "q4", target: "q5", label: "1" },
            { source: "q5", target: "q5", label: "0" },
            { source: "q5", target: "q5", label: "1" },
        ],
        startState: "q0",
        finalStates: ["q1", "q2", "q5"],
        alphabet: ["1", "0"],
        };


    prop: 
     const [graph, setGraph] = useState({
    states: [],
    transitions: [],
    startState: "",
    finalStates: [],
    alphabet: [],
  });
   */

