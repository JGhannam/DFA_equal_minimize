import React, { useState, useEffect } from 'react';
import DFAVisualization from './dfavixgraph';

function MinimizeDFA({ graph }) {
  const [minimizedGraph, setMinimizedGraph] = useState(null);

  useEffect(() => {
    minimizeDFA();
  }, [graph]);

  function minimizeDFA() {
    if (!graph || !graph.transitions || graph.transitions.length === 0) {
      return;
    }

    // Step 1: Partition states into two sets - final states and non-final states
    const finalStates = new Set(graph.finalStates);
    const partitions = [finalStates, new Set([...graph.states].filter(state => !finalStates.has(state)))];

    // Step 2: Refine partitions until no further refinement is possible
    let refined = true;
    while (refined) {
      refined = false;

      for (const partition of partitions) {
        const newPartitions = new Map();

        for (const state of partition) {
          for (const symbol of graph.alphabet) {
            const nextState = graph.transitions.find(t => t.source === state && t.input === symbol)?.target;
            const targetPartition = partitions.find(p => p.has(nextState));

            if (newPartitions.has(targetPartition)) {
              newPartitions.get(targetPartition).add(state);
            } else {
              newPartitions.set(targetPartition, new Set([state]));
            }
          }
        }

        if (newPartitions.size > 1) {
          refined = true;
          partitions.splice(partitions.indexOf(partition), 1, ...newPartitions.values());
        }
      }
    }

    // Step 3: Build the minimized DFA
    const stateToPartitionMap = new Map();
    partitions.forEach((partition, index) => {
      partition.forEach(state => stateToPartitionMap.set(state, index));
    });

    const minimizedStates = Array.from(stateToPartitionMap.values());
    const minimizedTransitions = graph.transitions
      .filter(t => partitions[stateToPartitionMap.get(t.source)].has(t.target))
      .map(t => ({
        source: stateToPartitionMap.get(t.source),
        input: t.input,
        target: stateToPartitionMap.get(t.target),
      }));

    setMinimizedGraph({
      startState: stateToPartitionMap.get(graph.startState),
      finalStates: Array.from(finalStates).map(state => stateToPartitionMap.get(state)),
      states: Array.from(partitions.keys()),
      transitions: minimizedTransitions,
    });
  }

  return (
    <div>
      <DFAVisualization graph={minimizedGraph} />
    </div>
  );
}

export default MinimizeDFA;
