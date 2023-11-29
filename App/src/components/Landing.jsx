import React, { useState } from 'react';
import './style/landing.css';

import DFAVisualization from './dfavixgraph';

import OpenAI from "openai";


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
  const [miniGraph, setMiniGraph] = React.useState({
    states: [],
    transitions: [],
    startState: [],
    finalStates: [],
    alphabet: [],
  })
  const [miniGraph2, setMiniGraph2] = React.useState({
    states: [],
    transitions: [],
    startState: [],
    finalStates: [],
    alphabet: [],
  })


  const [response_text, setResponse] = React.useState("");

  const [image , setImage] = React.useState(null);

  const openai = new OpenAI({
    apiKey: '',
    dangerouslyAllowBrowser: true,
  });
  



  // the following function is used to send the image to the openai api and get the response from it and set it to the state 
  async function vison() {
    console.log("vision");
    console.log(image);
    const response = await openai.chat.completions.create({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "you should give all the states final states transissions alphabets of this DFA in a json format and tell us what this DFA accepts" },
            {
              type: "image_url",
              image_url: {
                "url": image,
              },
            },
          ],
        },

      ],
      max_tokens: 1000,
    });
    setResponse(response.choices[0].message.content);
    console.log("Response: ",response.choices[0]);
    console.log(response.choices[0].message.content);

  }


  // the following function sends the data to the flask server to minimize the DFA and then it sets the minimized DFA to the state
  const handleSendDataToFlask = (DFA,which) => {
    console.log("Sending data to flask");
    console.log(DFA);
    fetch('http://localhost:5000/transfer', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(DFA)
    })
    .then(response => response.json())
    .then(data => {
      if (which === 1) {
        setMiniGraph(data.minimized_dfa)
      } else {
        setMiniGraph2(data.minimized_dfa)
      }
      console.log("minimized :",data.minimized_dfa);
    })
  }


  function isEqual(graph1, graph2) {
    console.log(graph1, graph2);
//     Steps to identify equivalence
// 1) For any pair of states (qi, qj) the transition for input a e E is defined by {qa,qb}
// where transition {qi, a}= qa and transition {qj, a}=qb
// The two automata are not equivalent if for a pair {qa,qb} one is INTERMEDIATE State and the other is FINAL State.
// 2) If Initial State is Final State of one automaton, then in second automaton also Initial State must be Final State for them to be equivalent.

    //1) For any pair of states (qi, qj) the transition for input a e E is defined by {qa,qb}
    for (const transition of graph1.transitions) {
      const source = transition.source;
      const target = transition.target;
      const label = transition.label;
      const transition2 = graph2.transitions.find(t => t.source === source && t.label === label);
      if (transition2) {
        if (transition2.target !== target) {
          return false;
        }
      } else {
        return false;
      }
    }

    //2) If Initial State is Final State of one automaton, then in second automaton also Initial State must be Final State for them to be equivalent.
    if (graph1.finalStates.includes(graph1.startState)) {
      if (!graph2.finalStates.includes(graph2.startState)) {
        return false;
      }
    }



    return true;
   
  }


//the following function is not used in the code but it is a good way to check if two transition sets are equal
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
              handleSendDataToFlask(graph1,1)
            }
          }}>Minimize</button>
          { miniGraph.states.length !== 0 ? <DFAVisualization graph={miniGraph} /> : null}
        </div>
        <div className='graphLanding'>
          <h1>Upload Image</h1>
          <input type="file" onChange={(e) => {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => {
              setImage(reader.result);
            }
          }
          } />
          <button onClick={() => vison()}>Send</button>
          {
            response_text ? 
            
            <div className="response">
              <h1>Response</h1>
              <p>{response_text}</p>
            </div>
            
         : null
          }
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
              handleSendDataToFlask(graph2,2)
            }
          }}>Minimize</button>
          { miniGraph2.states.length !== 0 ? <DFAVisualization graph={miniGraph2} /> : null}
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
