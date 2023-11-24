//import React, { useState, useEffect } from 'react';
import DFAVisualization from './dfavixgraph';

import React, { Component } from 'react'

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

  export default class MinimizeDFA extends Component {
    constructor(props) {
        super(props);
        this.state = {
            graph: props.graph,
            minimizedGraph: {
                states: [],
                transitions: [],
                startState: "",
                finalStates: [],
                alphabet: [],
            },
            minimized: false,
            minimizedStates: [],
            minimizedTransitions: [],
            minimizedStartState: "",
            minimizedFinalStates: [],
            minimizedAlphabet: [],
        };
        this.minimize = this.minimize.bind(this);
    }

    componentDidMount() {
        this.minimize();
    }

    minimize() {
        let graph = this.state.graph;
        let states = graph.states;
        let transitions = graph.transitions;
        let startState = graph.startState;
        let finalStates = graph.finalStates;
        let alphabet = graph.alphabet;

        let minimizedStates = [];
        let minimizedTransitions = [];
        let minimizedStartState = "";
        let minimizedFinalStates = [];
        let minimizedAlphabet = [];

        // Step 1: Create pairs of all states in the DFA.
        let pairs = [];
        for (let i = 0; i < states.length; i++) {
            for (let j = i + 1; j < states.length; j++) {
                pairs.push([states[i], states[j]]);
            }
        }

        // Step 2: Mark pairs that distinguish final and non-final states.
        let markedPairs = [];
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            let p = pair[0];
            let q = pair[1];
            if ((finalStates.includes(p) && !finalStates.includes(q)) || (!finalStates.includes(p) && finalStates.includes(q))) {
                markedPairs.push(pair);
            }
        }

        // Step 3: Mark pairs that lead to distinguishable states for any input symbol.
        let newMarkedPairs = [];
        let marked = true;
        while (marked) {
            marked = false;
            for (let i = 0; i < alphabet.length; i++) {
                let sigma = alphabet[i];
                for (let j = 0; j < pairs.length; j++) {
                    let pair = pairs[j];
                    if (!markedPairs.includes(pair)) {
                        let p = pair[0];
                        let q = pair[1];
                        let pSigma = this.getTransition(p, sigma, transitions);
                        let qSigma = this.getTransition(q, sigma, transitions);
                        let pSigmaqSigma = [pSigma, qSigma];
                        if (markedPairs.includes(pSigmaqSigma)) {
                            markedPairs.push(pair);
                            marked = true;
                        }
                        else {
                            newMarkedPairs.push(pair);
                        }
                    }
                }
                pairs = newMarkedPairs;
                newMarkedPairs = [];
            }
        }

        // Step 5: Combine unmarked pairs into equivalence classes.
        let equivalenceClasses = [];
        for (let i = 0; i < pairs.length; i++) {
            let pair = pairs[i];
            if (!markedPairs.includes(pair)) {
                equivalenceClasses.push(pair);
            }
        }

        // Step 6: Construct the minimized DFA.
        for (let i = 0; i < equivalenceClasses.length; i++) {
            let equivalenceClass = equivalenceClasses[i];
            let state = equivalenceClass[0];
            minimizedStates.push(state);
            if (finalStates.includes(state)) {
                minimizedFinalStates.push(state);
            }
            if (startState === state) {
                minimizedStartState = state;
            }
        }

        for (let i = 0; i < minimizedStates.length; i++) {
            let state = minimizedStates[i];
            for (let j = 0; j < alphabet.length; j++) {
                let sigma = alphabet[j];
                let transition = this.getTransition(state, sigma, transitions);
                let target = transition[0];
                let label = transition[1];
                if (minimizedStates.includes(target)) {
                    minimizedTransitions.push({ source: state, target: target, label: label });
                }
            }
        }

        minimizedAlphabet = alphabet;

        let minimizedGraph = {
            states: minimizedStates,
            transitions: minimizedTransitions,
            startState: minimizedStartState,
            finalStates: minimizedFinalStates,
            alphabet: minimizedAlphabet,
        };

        this.setState({
            minimizedGraph: minimizedGraph,
            minimized: true,
            minimizedStates: minimizedStates,
            minimizedTransitions: minimizedTransitions,
            minimizedStartState: minimizedStartState,
            minimizedFinalStates: minimizedFinalStates,
            minimizedAlphabet: minimizedAlphabet,
        });
    }

    getTransition(state, sigma, transitions) {
        for (let i = 0; i < transitions.length; i++) {
            let transition = transitions[i];
            if (transition.source === state && transition.label === sigma) {
                return [transition.target, transition.label];
            }
        }
        return null;
    }

    render() {
        return (
            <div>
                <DFAVisualization graph={this.state.minimizedGraph} />
            </div>
        )
    }
}