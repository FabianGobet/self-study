from dotenv import load_dotenv
import os
from langtrace_python_sdk import langtrace

load_dotenv()
langtrace.init(api_key = os.environ['LANGTRACE_API_KEY'], api_host="http://localhost:3000/api/trace")

from llm_tests.crews import GroqCrews
from langtrace_python_sdk.utils.with_root_span import with_langtrace_root_span


@with_langtrace_root_span("groq_tool_test_run")
def tool_test_run():
    cc = GroqCrews().count_crew()
    result = cc.kickoff(inputs={"text_input": "This is a test text for the agent to count the words."})
    print(result)

@with_langtrace_root_span("groq_knowledge_test_run")
def knowledge_test_run():
    kc = GroqCrews().knowledge_crew()
    result = kc.kickoff()
    print(result)

@with_langtrace_root_span("groq_delegation_test_run")
def delegation_test_run():
    dc = GroqCrews().delegation_crew()
    result = dc.kickoff(inputs={"topics": ["Artificial Intelligence", "Machine Learning", "Data Science"]})
    print(result)

