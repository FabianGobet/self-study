from dotenv import load_dotenv
from typing import List
from langchain_core.messages import BaseMessage, ToolMessage
from langgraph.graph import END, MessageGraph
from tool_executor import execute_tools
from chains import revision_chain, first_responder

load_dotenv()

MAX_ITERATIONS = 2

builder = MessageGraph()
builder.add_node("draft", first_responder)
builder.add_node("execute_tools", execute_tools)
builder.add_node("revise", revision_chain)

builder.add_edge("draft", "execute_tools")
builder.add_edge("execute_tools", "revise")

def event_loop(state: List[BaseMessage]) -> List[BaseMessage]:
    count_tools_visits = sum(isinstance(item, ToolMessage) for item in state)
    if count_tools_visits > MAX_ITERATIONS:
        return END
    return "execute_tools"

builder.add_conditional_edges("revise", event_loop)
builder.set_entry_point("draft")

graph = builder.compile()
graph.get_graph(xray=1).draw_mermaid_png(output_file_path="graph.png")

if __name__ == "__main__":
    print("reflexion agent")

    res = graph.invoke()