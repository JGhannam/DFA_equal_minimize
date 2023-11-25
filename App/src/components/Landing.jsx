import React, { useState } from 'react';
import './style/landing.css';

import DFAVisualization from './dfavixgraph';
// import MinimizeDFA from './minimizedfa';

function Landing() {
  const [graph1, setGraph1] = useState({
    states: [],
    transitions: [],
    startState: "",
    finalStates: [],
    alphabet: [],
  });

  const [graph2, setGraph2] = useState({
    states: [],
    transitions: [],
    startState: "",
    finalStates: [],
    alphabet: [],
  });

  const [mini1, setMini1] = useState(false);
  const [mini2, setMini2] = useState(false);

  function isEqual(graph1, graph2) {
    console.log(graph1, graph2);
    // Check if the number of states, start state, and final states are equal
    if (
      graph1.states.length !== graph2.states.length ||
      graph1.startState !== graph2.startState ||
      graph1.finalStates.length !== graph2.finalStates.length
    ) {
      return false;
    }

    // Check if each state in graph1 is also in graph2
    for (const state of graph1.states) {
      if (!graph2.states.includes(state)) {
        return false;
      }
    }

    // Check if each transition in graph1 is also in graph2
    for (const transition of graph1.transitions) {
      if (
        !graph2.transitions.some(
          (t) =>
            t.source === transition.source &&
            t.target === transition.target &&
            t.label === transition.label
        )
      ) {
        return false;
      }
    }

    // Check for non-determinism
    for (const state of graph1.states) {
      const graph1Transitions = graph1.transitions.filter(t => t.source === state);
      const graph2Transitions = graph2.transitions.filter(t => t.source === state);

      if (!areTransitionSetsEqual(graph1Transitions, graph2Transitions)) {
        return false;
      }
    }

    return true;
  }

  function areTransitionSetsEqual(transitions1, transitions2) {
    if (transitions1.length !== transitions2.length) {
      return false;
    }

    for (const transition of transitions1) {
      if (!transitions2.some(t => t.target === transition.target && t.label === transition.label)) {
        return false;
      }
    }

    return true;
  }

  const handleGraph1Change = (newGraph) => {
    setGraph1(newGraph);
  };

  const handleGraph2Change = (newGraph) => {
    setGraph2(newGraph);
  };

  const addRowToGraph = (graph, setGraph) => {
    const newTransition = { source: '', target: '', label: '' };
    setGraph({
      ...graph,
      transitions: [...graph.transitions, newTransition],
    });
  };

  const deleteRowFromGraph = (graph, setGraph, index) => {
    const updatedTransitions = [...graph.transitions];
    updatedTransitions.splice(index, 1);
    setGraph({ ...graph, transitions: updatedTransitions });
  };

  const updateStartState = (graph, setGraph, value) => {
    setGraph({ ...graph, startState: value });
  };

  const updateFinalStates = (graph, setGraph, value) => {
    const finalStates = value.split(',').map((state) => state.trim());
    setGraph({ ...graph, finalStates });
  };

  const updateStates = (graph, setGraph) => {
    const states = new Set();

    for (const transition of graph.transitions) {
      states.add(transition.source);
      states.add(transition.target);
    }

    if (graph.startState) {
      states.add(graph.startState);
    }

    const allStates = [...states];

    setGraph({ ...graph, states: allStates });
  };

  return (
    <div className="LandingContainer">
      <div className="GraphsInLanding">
        <div className="graphLanding">
          <h1>DFA 1</h1>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Target</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {graph1.transitions.map((transition, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={transition.source}
                      onChange={(e) => {
                        const updatedTransitions = [...graph1.transitions];
                        updatedTransitions[index].source = e.target.value;
                        handleGraph1Change({ ...graph1, transitions: updatedTransitions });
                        updateStates({ ...graph1, transitions: updatedTransitions }, setGraph1);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={transition.target}
                      onChange={(e) => {
                        const updatedTransitions = [...graph1.transitions];
                        updatedTransitions[index].target = e.target.value;
                        handleGraph1Change({ ...graph1, transitions: updatedTransitions });
                        updateStates({ ...graph1, transitions: updatedTransitions }, setGraph1);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={transition.label}
                      onChange={(e) => {
                        if (!graph1.alphabet.includes(e.target.value)) {
                          alert("Please add the new symbol to the alphabet before adding it to the transition");
                        } else {
                          const updatedTransitions = [...graph1.transitions];
                          updatedTransitions[index].label = e.target.value;
                          handleGraph1Change({ ...graph1, transitions: updatedTransitions });
                        }

                        // const updatedTransitions = [...graph1.transitions];
                        // updatedTransitions[index].label = e.target.value;
                        // handleGraph1Change({ ...graph1, transitions: updatedTransitions });
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteRowFromGraph(graph1, setGraph1, index)}>
                      Delete Row
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRowToGraph(graph1, setGraph1)}>Add Row</button>
          <div>
            <label>Alphabet (comma-separated):</label>
            <input
              type="text"
              value={graph1.alphabet.join(', ')}
              onChange={(e) => {
                const alphabet = e.target.value.split(',').map((symbol) => symbol.trim());
                setGraph1({ ...graph1, alphabet });
              }}
            /> 
          </div>
          <div>
            <label>Start State:</label>
            <input
              type="text"
              value={graph1.startState}
              onChange={(e) => {
                updateStartState({ ...graph1, startState: e.target.value }, setGraph1);
                updateStates({ ...graph1, startState: e.target.value }, setGraph1);
              }}
            />
          </div>
          <div>
            <label>Final States (comma-separated):</label>
            <input
              type="text"
              value={graph1.finalStates.join(', ')}
              onChange={(e) => updateFinalStates(graph1, setGraph1, e.target.value)}
            />
          </div>
          <DFAVisualization graph={graph1} />
          <h3>Minimize DFA</h3>
          <button onClick={() => {
            // check if the graph has its states and transitions defined
            if (graph1.states.length === 0 || graph1.transitions.length === 0) {
              alert("Please define the states and transitions of the DFA before minimizing it");
            } else {
              setMini1(true);
            }
          }}>Minimize</button>
          {mini1 ? <MinimizeDFA graph={graph1} /> : null}
        </div>
        <div className="graphLanding">
          <h1>DFA 2</h1>
          <table>
            <thead>
              <tr>
                <th>Source</th>
                <th>Target</th>
                <th>Label</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {graph2.transitions.map((transition, index) => (
                <tr key={index}>
                  <td>
                    <input
                      type="text"
                      value={transition.source}
                      onChange={(e) => {
                        const updatedTransitions = [...graph2.transitions];
                        updatedTransitions[index].source = e.target.value;
                        handleGraph2Change({ ...graph2, transitions: updatedTransitions });
                        updateStates({ ...graph2, transitions: updatedTransitions }, setGraph2);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={transition.target}
                      onChange={(e) => {
                        const updatedTransitions = [...graph2.transitions];
                        updatedTransitions[index].target = e.target.value;
                        handleGraph2Change({ ...graph2, transitions: updatedTransitions });
                        updateStates({ ...graph2, transitions: updatedTransitions }, setGraph2);
                      }}
                    />
                  </td>
                  <td>
                    <input
                      type="text"
                      value={transition.label}
                      onChange={(e) => {
                        if (!graph2.alphabet.includes(e.target.value)) {
                          alert("Please add the new symbol to the alphabet before adding it to the transition");
                        } else {
                          const updatedTransitions = [...graph2.transitions];
                          updatedTransitions[index].label = e.target.value;
                          handleGraph2Change({ ...graph2, transitions: updatedTransitions });
                        }
                        // const updatedTransitions = [...graph2.transitions];
                        // updatedTransitions[index].label = e.target.value;
                        // handleGraph2Change({ ...graph2, transitions: updatedTransitions });
                      }}
                    />
                  </td>
                  <td>
                    <button onClick={() => deleteRowFromGraph(graph2, setGraph2, index)}>
                      Delete Row
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <button onClick={() => addRowToGraph(graph2, setGraph2)}>Add Row</button>
          <div>
            <label>Alphabet (comma-separated):</label>
            <input
              type="text"
              value={graph2.alphabet.join(', ')}
              onChange={(e) => {
                const alphabet = e.target.value.split(',').map((symbol) => symbol.trim());
                setGraph2({ ...graph2, alphabet });
              }}
            />
          </div>
          <div>
            <label>Start State:</label>
            <input
              type="text"
              value={graph2.startState}
              onChange={(e) => {
                updateStartState({ ...graph2, startState: e.target.value }, setGraph2);
                updateStates({ ...graph2, startState: e.target.value }, setGraph2);
              }}
            />
          </div>
          <div>
            <label>Final States (comma-separated):</label>
            <input
              type="text"
              value={graph2.finalStates.join(', ')}
              onChange={(e) => updateFinalStates(graph2, setGraph2, e.target.value)}
            />
          </div>
          <DFAVisualization graph={graph2} />
          <h3>Minimize DFA</h3>
          <button onClick={() => {
            // check if the graph has its states and transitions defined
            if (graph2.states.length === 0 || graph2.transitions.length === 0) {
              alert("Please define the states and transitions of the DFA before minimizing it");
            } else {
              setMini2(true);
            }
          }}>Minimize</button>
          {mini2 ? <MinimizeDFA graph={graph2} /> : null}
        </div>
      </div>
      <div className='landing-container'>
        <h1 className='landing-header'>Result</h1>
        <div className='result'>
          {isEqual(graph1, graph2) ? (
            <h2 className='equal-message'>The DFAs are equal</h2>
          ) : (
            <h2 className='not-equal-message'>The DFAs are not equal</h2>
          )}
        </div>
      </div>
    </div>
  );
}

export default Landing;
