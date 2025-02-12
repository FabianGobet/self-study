from typing import List
from dotenv import load_dotenv
from langchain_community.tools.tavily_search import TavilySearchResults
from langchain_community.utilities.tavily_search import TavilySearchAPIWrapper
from langchain_core.messages import BaseMessage, ToolMessage, AIMessage
from langgraph.prebuilt import ToolExecutor, ToolInvocation
from chains import parser

load_dotenv()

search = TavilySearchAPIWrapper
tavily_tool = TavilySearchResults(api_wrapper=search, max_results=5)
tool_executor = ToolExecutor([tavily_tool])

def execute_tools(state: List[BaseMessage]) -> List[ToolMessage]:
    tool_invocation: AIMessage = state[-1]
    parsed_tool_calls = parser.invoke(tool_invocation)
    
    ids = []
    tool_invocations = []
    
    for parsed_call in parsed_tool_calls:
        for query in parsed_call['args']['search_queries']:
            tool_invocations.append(
                ToolInvocation(
                    tool='tavily_search_results_json',
                    tool_input=query
                )
            )
            ids.append(parsed_call['id'])