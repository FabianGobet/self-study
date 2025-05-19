from dotenv import load_dotenv
import os
from langtrace_python_sdk import langtrace

load_dotenv()
langtrace.init(api_key = os.environ['LANGTRACE_API_KEY'], api_host="http://localhost:3000/api/trace")

from langtrace_python_sdk.utils.with_root_span import with_langtrace_root_span
from llm_tests.crews import DeepSeekCrews


@with_langtrace_root_span("deepseek_tool_test_run")
def tool_test_run():
    cc = DeepSeekCrews().count_crew()
    result = cc.kickoff(inputs={"text_input": "This is a test text for the agent to count the words."})
    print(result)

@with_langtrace_root_span("deepskeek_knowledge_test_run")
def knowledge_test_run():
    kc = DeepSeekCrews().knowledge_crew()
    result = kc.kickoff()
    print(result)

@with_langtrace_root_span("deepseek_chat_run")
def chat_test_run():
    cc = DeepSeekCrews().chat_crew()
    result = cc.kickoff(inputs={"topic_input": "Dildos"})
    print(result)

