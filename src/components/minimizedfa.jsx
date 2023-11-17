import React, { useState, useEffect } from 'react';
import DFAVisualization from './dfavixgraph';

function MinimizeDFA({ graph }) {
  const [minimizedGraph, setMinimizedGraph] = useState(null);

  useEffect(() => {
    if (graph) {
      console.log(graph);
      minimize();
    }
  }, [graph]);

  /**
   * Step 1: Identify and remove unreachable states

    A state is unreachable if it cannot be reached from the initial state using any sequence of input symbols.
    Remove all unreachable states from the DFA.

Step 2: Create an initial partition

    Divide the remaining states into two sets:
        Set 1: Contains all final states
        Set 2: Contains all non-final states

Step 3: Refine the partition

    Repeat the following process until the partition remains unchanged:
        For each set in the partition, check if any two states within the set are indistinguishable.
        Two states are indistinguishable if they have the same output for every input symbol.
        If two states are found to be indistinguishable, merge them into a single state.

Step 4: Construct the minimized DFA

    Create a new DFA with the minimized set of states note that the number of states in the minimized DFA will be less than or equal to the number of states in the original DFA. so if received a DFA with 2 it could be 1 state if 5 states are received it could be 3 states or 4 states. so we have to make sure
    Define the transitions between the new states based on the transitions of the original DFA.
    Update the initial state and final states accordingly.

    prop: 
     const [graph1, setGraph1] = useState({
    states: [],
    transitions: [],
    startState: "",
    finalStates: [],
    alphabet: [],
  });
   */

  const minimize = () => {
    let graph1 = graph;
    let states = graph1.states;
    let transitions = graph1.transitions;
    let startState = graph1.startState;
    let finalStates = graph1.finalStates;
    let alphabet = graph1.alphabet;

    // step 1
    let reachableStates = [];
    let visited = [];
    let queue = [];
    queue.push(startState);
    while (queue.length !== 0) {
      let state = queue.shift();
      if (!visited.includes(state)) {
        visited.push(state);
        reachableStates.push(state);
        let transitionsOfState = transitions.filter(
          (transition) => transition.from === state
        );
        for (let i = 0; i < transitionsOfState.length; i++) {
          queue.push(transitionsOfState[i].to);
        }
      }
    }
    console.log("reachableStates", reachableStates);
    let unreachableStates = states.filter(
      (state) => !reachableStates.includes(state)
    );
    console.log("unreachableStates", unreachableStates);
    let newStates = states.filter(
      (state) => !unreachableStates.includes(state)
    );
    console.log("newStates", newStates);
    let newTransitions = transitions.filter(
      (transition) =>
        !unreachableStates.includes(transition.from) &&
        !unreachableStates.includes(transition.to)
    );
    console.log("newTransitions", newTransitions);
    let newStartState = startState;
    if (unreachableStates.includes(startState)) {
      newStartState = "";
    }
    console.log("newStartState", newStartState);
    let newFinalStates = finalStates.filter(
      (state) => !unreachableStates.includes(state)
    );
    console.log("newFinalStates", newFinalStates);
    let newAlphabet = alphabet;
    console.log("newAlphabet", newAlphabet);
    let newGraph = {
      states: newStates,
      transitions: newTransitions,
      startState: newStartState,
      finalStates: newFinalStates,
      alphabet: newAlphabet,
    };
    console.log("newGraph", newGraph);

    // step 2
    let partition = [];
    let finalStatesSet = [];
    let nonFinalStatesSet = [];
    for (let i = 0; i < newStates.length; i++) {
      if (newFinalStates.includes(newStates[i])) {
        finalStatesSet.push(newStates[i]);
      } else {
        nonFinalStatesSet.push(newStates[i]);
      }
    }
    partition.push(finalStatesSet);
    partition.push(nonFinalStatesSet);
    console.log("partition", partition);

    // step 3
    let newPartition = [];
    let isChanged = true;
    while (isChanged) {
      isChanged = false;
      for (let i = 0; i < partition.length; i++) {
        let set = partition[i];
        let newSets = [];
        let visited = [];
        for (let j = 0; j < set.length; j++) {
          if (!visited.includes(set[j])) {
            visited.push(set[j]);
            let newSet = [];
            newSet.push(set[j]);
            for (let k = j + 1; k < set.length; k++) {
              if (!visited.includes(set[k])) {
                let isIndistinguishable = true;
                for (let l = 0; l < newAlphabet.length; l++) {
                  let transition1 = newTransitions.filter(
                    (transition) =>
                      transition.from === set[j] &&
                      transition.symbol === newAlphabet[l]
                  );
                  let transition2 = newTransitions.filter(
                    (transition) =>
                      transition.from === set[k] &&
                      transition.symbol === newAlphabet[l]
                  );
                  if (
                    transition1.length !== 0 &&
                    transition2.length !== 0 &&
                    transition1[0].to !== transition2[0].to
                  ) {
                    isIndistinguishable = false;
                    break;
                  }
                }
                if (isIndistinguishable) {
                  newSet.push(set[k]);
                  visited.push(set[k]);
                }
              }
            }
            newSets.push(newSet);
          }
        }
        if (newSets.length > 1) {
          isChanged = true;
        }
        for (let j = 0; j < newSets.length; j++) {
          newPartition.push(newSets[j]);
        }
      }
      partition = newPartition;
      newPartition = [];
    }
    console.log("partition", partition);

    // step 4
    let newStates1 = [];
    let newTransitions1 = [];
    let newStartState1 = "";
    let newFinalStates1 = [];
    let newAlphabet1 = newAlphabet;
    for (let i = 0; i < partition.length; i++) {
      newStates1.push(partition[i][0]);
      if (partition[i].includes(newStartState)) {
        newStartState1 = partition[i][0];
      }
      if (partition[i].some((state) => newFinalStates.includes(state))) {
        newFinalStates1.push(partition[i][0]);
      }
    }
    for (let i = 0; i < newStates1.length; i++) {
      for (let j = 0; j < newAlphabet1.length; j++) {
        let transition = newTransitions.filter(
          (transition) =>
            transition.from === newStates1[i] &&
            transition.symbol === newAlphabet1[j]
        );
        if (transition.length !== 0) {
          let to = transition[0].to;
          for (let k = 0; k < partition.length; k++) {
            if (partition[k].includes(to)) {
              to = partition[k][0];
              break;
            }
          }
          newTransitions1.push({
            from: newStates1[i],
            to: to,
            symbol: newAlphabet1[j],
          });
        }
      }
    }
    let newGraph1 = {
      states: newStates1,
      transitions: newTransitions1,
      startState: newStartState1,
      finalStates: newFinalStates1,
      alphabet: newAlphabet1,
    };
    console.log("newGraph1", newGraph1);
    setMinimizedGraph(newGraph1);
  }

  


  console.log("new",minimizedGraph);


  

  return (
    <div>
      <DFAVisualization graph={minimizedGraph} />
    </div>
  );
}

export default MinimizeDFA;
