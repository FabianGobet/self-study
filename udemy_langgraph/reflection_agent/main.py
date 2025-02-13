from dotenv import load_dotenv
from typing import List, Sequence

from langchain_core.messages import BaseMessage, HumanMessage
from langgraph.graph import END, MessageGraph

from chains import reflection_chain, generation_chain

load_dotenv()

REFLECT = "reflect"
GENERATE = "generate"


def generation_node(state: Sequence[BaseMessage]) -> Sequence[BaseMessage]:
    return generation_chain.invoke({"messages": state})


def reflection_node(state: Sequence[BaseMessage]) -> List[BaseMessage]:
    result = reflection_chain.invoke({"messages": state})
    # tricking the system to think that the user is the system
    return [HumanMessage(content=result.content)]


builder = MessageGraph()
builder.add_node(GENERATE, generation_node)
builder.add_node(REFLECT, reflection_node)
builder.set_entry_point(GENERATE)


def should_continue(state: Sequence[BaseMessage]) -> bool:
    if len(state) > 3:
        return END
    return REFLECT


builder.add_conditional_edges(GENERATE, should_continue)
builder.add_edge(REFLECT, GENERATE)

graph = builder.compile()
graph.get_graph(xray=1).draw_mermaid_png(output_file_path="graph.png")

if "__name__" == "__main__":
    inputs = HumanMessage(
        content="""Make this tweet better:
        @LangChainAI
        — newly Tool Calling feature is seriously underrated.

        After a long wait, it's  here- making the implementation of agents across different models with function calling - super easy.
        Made a video covering their newest blog post"""
    )
    response = graph.invoke(inputs)
