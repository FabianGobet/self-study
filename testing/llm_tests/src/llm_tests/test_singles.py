
from dotenv import load_dotenv
import os
from langtrace_python_sdk import langtrace, with_langtrace_root_span

load_dotenv()
langtrace.init(api_key = os.environ['LANGTRACE_API_KEY'], api_host="http://localhost:3000/api/trace")



@with_langtrace_root_span("test_singles")
def test_singles():
    # ? if imports are moved outside of decorated function, what happens?
    from llm_tests.tools import WordCountTool
    from llm_tests.agents import GroqAgents
    from llm_tests.tasks import count_text_words_task
    from time import time
    import asyncio

    word_counter = WordCountTool()
    agent = GroqAgents().groq_tool_tester([word_counter], verbose=True)
    task = count_text_words_task(agent)

    print(f"Task before interpolate_only\n{task}")
    print("----"*10,"\n")
    interpolated = task.interpolate_only(input_string=None, inputs={"text_input": "How many words are in this short text?"})
    print(f"Task after interpolate_only\n{task}")
    print("----"*10,"\n")
    print(f"interpolated result:\n{interpolated}")
    print("----"*10,"\n")
    task.interpolate_inputs_and_add_conversation_history(inputs={"text_input": "How many words are in this short text?"})
    print(f"Task after interpolate_inputs_and_add_conversation_history\n{task}")
    print("----"*10)
    print("----"*10,"\n")

    async def _await_future(fut):
        wrapped = asyncio.wrap_future(fut)
        return await wrapped

    print(f"Task run async.")
    start = time()
    result = asyncio.run(_await_future(task.execute_async()))
    print(f"Task run async took {time()-start:.2f} seconds.")
    print("Result:", result)
    print("----"*10,"\n")

    



