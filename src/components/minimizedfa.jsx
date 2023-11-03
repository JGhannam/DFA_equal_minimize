import React, { Component } from 'react';
import DFAVisualization from './dfavixgraph';

class MinimizedDFA extends Component {
  constructor(props) {
    super(props);
    this.state = {
      minimizedGraph: this.minimizeDFA(props.graph),
    };
  }

  getNextState(state, symbol, graph) {
    for (let transition of graph.transitions) {
      if (transition.from === state && transition.symbol === symbol) {
        return transition.to;
      }
    }
    return null;
  }

  removeUnreachableStates(graph) {
    let reachableStates = new Set([graph.startState]);
    let newStates = new Set([graph.startState]);

    while (newStates.size > 0) {
      let currentStates = new Set(newStates);
      newStates.clear();

      for (let state of currentStates) {
        for (let transition of graph.transitions) {
          if (transition.from === state && !reachableStates.has(transition.to)) {
            reachableStates.add(transition.to);
            newStates.add(transition.to);
          }
        }
      }
    }

    graph.states = graph.states.filter(state => reachableStates.has(state));
    graph.transitions = graph.transitions.filter(transition => reachableStates.has(transition.from));
  }

  partitionStates(graph) {
    let finalStates = new Set(graph.finalStates);
    let nonFinalStates = new Set(graph.states.filter(state => !finalStates.has(state)));
    return [Array.from(finalStates), Array.from(nonFinalStates)];
  }

  mergeIndistinguishableStates(graph, partitions) {
    let newPartitions = [];
    let symbols = [...new Set(graph.transitions.map(transition => transition.symbol))];

    for (let partition of partitions) {
      let groups = new Map();
      for (let state of partition) {
        let key = symbols.map(symbol => this.getNextState(state, symbol, graph)).join(",");
        let group = groups.get(key) || [];
        group.push(state);
        groups.set(key, group);
      }
      newPartitions.push(...groups.values());
    }

    return newPartitions;
  }

  minimizeDFA(graph) {
    this.removeUnreachableStates(graph);
    let partitions = this.partitionStates(graph);

    let oldPartitions;
    do {
      oldPartitions = partitions;
      partitions = this.mergeIndistinguishableStates(graph, partitions);
    } while (partitions.length !== oldPartitions.length);

    // Update the graph with the new states and transitions
    graph.states = partitions.map(partition => partition.join(","));
    graph.transitions = graph.transitions.map(transition => ({
      from: partitions.find(partition => partition.includes(transition.from)).join(","),
      to: partitions.find(partition => partition.includes(transition.to)).join(","),
      symbol: transition.symbol
    }));
    graph.startState = partitions.find(partition => partition.includes(graph.startState)).join(",");
    graph.finalStates = graph.finalStates.map(state => partitions.find(partition => partition.includes(state)).join(","));

    return graph;
  }

  render() {
    return <DFAVisualization graph={this.state.minimizedGraph} />;
  }
}

export default MinimizedDFA;