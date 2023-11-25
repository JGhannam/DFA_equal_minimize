# Import Flask class from the flask module
from flask import Flask, jsonify


app = Flask(__name__)


def distinguishable_states(dfa, p, q):
    for symbol in dfa["alphabet"]:
        t1 = next(
            transition["target"]
            for transition in dfa["transitions"]
            if transition["source"] == p and transition["label"] == symbol
        )
        t2 = next(
            transition["target"]
            for transition in dfa["transitions"]
            if transition["source"] == q and transition["label"] == symbol
        )
        if distinguishable_states(dfa, t1, t2):
            return True
    return False


def minimize_dfa(dfa):
    states = dfa["states"]
    marked = [[False] * len(states) for _ in range(len(states))]

    # Mark pairs of final and non-final states
    for i in range(len(states)):
        for j in range(i + 1, len(states)):
            if (
                (states[i] in dfa["finalStates"] and states[j] not in dfa["finalStates"])
                or (states[j] in dfa["finalStates"] and states[i] not in dfa["finalStates"])
            ):
                marked[i][j] = True
                marked[j][i] = True

    # Mark distinguishable states
    changed = True
    while changed:
        changed = False
        for i in range(len(states)):
            for j in range(i + 1, len(states)):
                if not marked[i][j]:
                    for symbol in dfa["alphabet"]:
                        t1 = next(
                            transition["target"]
                            for transition in dfa["transitions"]
                            if transition["source"] == states[i] and transition["label"] == symbol
                        )
                        t2 = next(
                            transition["target"]
                            for transition in dfa["transitions"]
                            if transition["source"] == states[j] and transition["label"] == symbol
                        )
                        if marked[states.index(t1)][states.index(t2)]:
                            marked[i][j] = True
                            marked[j][i] = True
                            changed = True

    # Merge equivalent states
    equivalent_classes = []
    visited = set()
    for i in range(len(states)):
        if i not in visited:
            equivalent_class = {states[i]}
            for j in range(i + 1, len(states)):
                if not marked[i][j]:
                    equivalent_class.add(states[j])
                    visited.add(j)
            equivalent_classes.append(equivalent_class)

    # Construct the minimized DFA
    minimized_dfa = {
        "states": [f"q{i}" for i in range(len(equivalent_classes))],
        "alphabet": dfa["alphabet"],
        "transitions": [],
        "startState": f"q{equivalent_classes.index({dfa['startState']})}",
        "finalStates": [f"q{i}" for i, eq_class in enumerate(equivalent_classes) if any(state in dfa["finalStates"] for state in eq_class)],
    }

    for eq_class in equivalent_classes:
        for symbol in dfa["alphabet"]:
            target = next(
                transition["target"]
                for transition in dfa["transitions"]
                if transition["source"] == list(eq_class)[0] and transition["label"] == symbol
            )
            target_class = next(
                i for i, eq in enumerate(equivalent_classes) if target in eq
            )
            minimized_dfa["transitions"].append(
                {"source": f"q{equivalent_classes.index(eq_class)}", "target": f"q{target_class}", "label": symbol}
            )

    return minimized_dfa


# Example usage
states = ["q0", "q1", "q2", "q3", "q4", "q5"]
transitions = [
    {"source": "q0", "target": "q1", "label": "0"},
    {"source": "q0", "target": "q2", "label": "1"},
    {"source": "q1", "target": "q3", "label": "0"},
    {"source": "q1", "target": "q4", "label": "1"},
    {"source": "q2", "target": "q4", "label": "0"},
    {"source": "q2", "target": "q3", "label": "1"},
    {"source": "q3", "target": "q5", "label": "0"},
    {"source": "q3", "target": "q5", "label": "1"},
    {"source": "q4", "target": "q5", "label": "0"},
    {"source": "q4", "target": "q5", "label": "1"},
    {"source": "q5", "target": "q5", "label": "0"},
    {"source": "q5", "target": "q5", "label": "1"},
]
start_state = "q0"
final_states = ["q1", "q2", "q5"]
alphabet = ["1", "0"]
graph = {
    "states": states,
    "transitions": transitions,
    "startState": start_state,
    "finalStates": final_states,
    "alphabet": alphabet,
}

minimized_dfa = minimize_dfa(graph)
print("Minimized DFA:")
print(minimized_dfa)


app = Flask(__name__)


import json
@app.route('/data')
def hello_world():
    json_data = json.dumps(minimized_dfa)
    
    # Return the JSON string
    return jsonify(data=json_data)

if __name__ == '__main__':
    app.run(debug=True)
