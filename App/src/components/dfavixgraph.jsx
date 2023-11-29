import React, { useEffect, useRef } from "react";
import Viz from "viz.js";
import { Module, render } from "viz.js/full.render.js";

const DFAVisualization = ({ graph }) => {
  const graphRef = useRef(null);

  useEffect(() => {
    if (graph) {
      const dotSource = generateDotSource(graph);

      const viz = new Viz({ Module, render });
      viz.renderSVGElement(dotSource)
        .then((element) => {
          graphRef.current.innerHTML = "";
          graphRef.current.appendChild(element);
        })
        .catch((error) => {
          console.error("Error rendering DFA:", error);
        });
    }
  }, [graph]);

  //viz.js is a library that renders graphs in the DOT language
  //The DOT language is a graph description language. DOT graphs are typically files with the filename extension gv or dot. The extension gv is preferred, to avoid confusion with the extension dot used by versions of Microsoft Word before 2007.

  // Generates a dot source string from a DFA graph object  that can be used to render a DFA graph using Viz.js
  const generateDotSource = (graph) => {
    const { states, transitions, startState, finalStates } = graph;
    let dotSource = "digraph G {\n";
    dotSource += `  start [shape=point];\n`;
    dotSource += `  start -> ${startState};\n`;

    // Add states
    states.forEach((state) => {
      dotSource += `  ${state} [shape=${finalStates.includes(state) ? "doublecircle" : "circle"}];\n`;
    });

    // Add transitions
    transitions.forEach((transition) => {
      dotSource += `  ${transition.source} -> ${transition.target} [label="${transition.label}"];\n`;
    });

    dotSource += "}\n";

    return dotSource;
  };

  return (
    <div className="dfa-visualization">
      <div ref={graphRef} className="dfa-graph"></div>
    </div>
  );
};

export default DFAVisualization;
