import React from 'react'
import DFAVisualization from './dfavixgraph'

function Temp() {


    const [miniGraph, setMiniGraph] = React.useState({
      states: [],
      transitions: [],
      startState: [],
      finalStates: [],
      alphabet: [],
    })

    React.useEffect(()=>{

      handleSendDataToFlask(graph)

    },[])


    const handleSendDataToFlask = (graph) => {
     fetch('http://localhost:5000/transfer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(graph)
      })
      .then(response => response.json())
      .then(data => {
        setMiniGraph(data.minimized_dfa)
        console.log(data.minimized_dfa);
      })
    }
    

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
  return (
    <div>
        <DFAVisualization graph={graph} />
        <DFAVisualization graph={miniGraph} />
    </div>
  )
}

export default Temp