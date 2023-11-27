# Import Flask class from the flask module
from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)

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



# def distinguishable_states(dfa, p, q):
#     for symbol in dfa["alphabet"]:
#         t1 = next(
#             transition["target"]
#             for transition in dfa["transitions"]
#             if transition["source"] == p and transition["label"] == symbol
#         )
#         t2 = next(
#             transition["target"]
#             for transition in dfa["transitions"]
#             if transition["source"] == q and transition["label"] == symbol
#         )
#         if distinguishable_states(dfa, t1, t2):
#             return True
#     return False


# def minimize_dfa(dfa):
#     states = dfa["states"]
#     marked = [[False] * len(states) for _ in range(len(states))]

#     print("lol1")

#     # Mark pairs of final and non-final states
#     for i in range(len(states)):
#         for j in range(i + 1, len(states)):
#             if (
#                 (states[i] in dfa["finalStates"] and states[j] not in dfa["finalStates"])
#                 or (states[j] in dfa["finalStates"] and states[i] not in dfa["finalStates"])
#             ):
#                 marked[i][j] = True
#                 marked[j][i] = True


#     print("lol2")


#     # Mark distinguishable states
#     changed = True
#     while changed:
#         changed = False
#         for i in range(len(states)):
#             for j in range(i + 1, len(states)):
#                 if not marked[i][j]:
#                     for symbol in dfa["alphabet"]:
#                         t1 = next(
#                             transition["target"]
#                             for transition in dfa["transitions"]
#                             if transition["source"] == states[i] and transition["label"] == symbol
#                         )
#                         t2 = next(
#                             transition["target"]
#                             for transition in dfa["transitions"]
#                             if transition["source"] == states[j] and transition["label"] == symbol
#                         )
#                         if marked[states.index(t1)][states.index(t2)]:
#                             marked[i][j] = True
#                             marked[j][i] = True
#                             changed = True


#     print("lol3")
#     # Merge equivalent states
#     equivalent_classes = []
#     visited = set()
#     for i in range(len(states)):
#         if i not in visited:
#             equivalent_class = {states[i]}
#             for j in range(i + 1, len(states)):
#                 if not marked[i][j]:
#                     equivalent_class.add(states[j])
#                     visited.add(j)
#             equivalent_classes.append(equivalent_class)

#     print("lol4")

#     # Construct the minimized DFA
#     minimized_dfa = {
#         "states": [f"q{i}" for i in range(len(equivalent_classes))],
#         "alphabet": dfa["alphabet"],
#         "transitions": [],
#         "startState": f"q{equivalent_classes.index({dfa['startState']})}",
#         "finalStates": [f"q{i}" for i, eq_class in enumerate(equivalent_classes) if any(state in dfa["finalStates"] for state in eq_class)],
#     }
#     print("lol5")

#     for eq_class in equivalent_classes:
#         for symbol in dfa["alphabet"]:
#             target = next(
#                 transition["target"]
#                 for transition in dfa["transitions"]
#                 if transition["source"] == list(eq_class)[0] and transition["label"] == symbol
#             )
#             target_class = next(
#                 i for i, eq in enumerate(equivalent_classes) if target in eq
#             )
#             minimized_dfa["transitions"].append(
#                 {"source": f"q{equivalent_classes.index(eq_class)}", "target": f"q{target_class}", "label": symbol}
#             )
#     print("lol6")
#     return minimized_dfa


@app.route('/transfer', methods=['POST'])
def transfer():
    graph = request.get_json()
    print(graph)
    minimized_dfa = minimize_dfa(graph)
    print("minimized: ", minimize_dfa)
    return jsonify({
        "minimized_dfa": minimized_dfa
    })


if __name__ == '__main__':
    app.run(debug=True)
