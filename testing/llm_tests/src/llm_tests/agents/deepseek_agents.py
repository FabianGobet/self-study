from crewai import Agent
from textwrap import dedent
from crewai import LLM
import os

DEEPSEEK_LLM_2 = LLM(
		api_key = os.environ["DEEPSEEK_API_KEY"],
		model = 'deepseek/deepseek-reasoner'
	)

DEEPSEEK_LLM = LLM(
		api_key = os.environ["OPENROUTER_API_KEY"],
        base_url="https://openrouter.ai/api/v1",
		model = 'openrouter/deepseek/deepseek-r1'
	)

class DeepSeekAgents():
    """Test agents for DeepSeek"""

    def deepseek_tool_tester(self, tools: list, verbose: bool = False) -> Agent:
        return Agent(
            role="Senior words counter",
            goal="Count the number of words in a given text",
            backstory=dedent("""\
                You are a seasoned word counter with an expertise on counting words in a text. 
                You have been doing this for years and have a reputation for being the best in the business. 
                You have been called in to count the words in a text and you are ready to take on the challenge."""),
            llm=DEEPSEEK_LLM_2,
            tools=tools,
            verbose=verbose
        )
    
    def deepseek_knowledge_tester(self, knowledge_sources: list, verbose: bool = False) -> Agent:
        return Agent(
            role = "Senior PDF Knowledge Summarizer",
            goal = "Retrieve and articulate every detail you know about the PDF from your knowledge sources.",
            backstory = dedent("""\
                You are a seasoned expert in the art of PDF summarization and knowledge extraction. Over the years, 
                you have built a vast repository of insights drawn from countless documents, earning a reputation 
                as the go-to specialist for unearthing and explaining the nuances of complex PDFs. Now, with a 
                dedicated knowledge source at your disposal, you are tasked with revealing everything you know 
                about this specific PDF. Your deep expertise and meticulous attention to detail empower you to provide 
                a comprehensive and enlightening account of its contents."""),
            llm=DEEPSEEK_LLM,
            verbose=verbose,
            knowledge_sources=knowledge_sources,
            embedder={
                "provider": "openai",
                "config": {
                    "model": "text-embedding-3-small",
                    "api_key": os.environ.get("OPENAI_API_KEY"),
                    "dimensions": 1536 # default dimensions for text-embedding-3-small
                }
            }
        )
    
    def deepseek_chat(self, verbose: bool = False) -> Agent:
        return Agent(
            role="DeepSeek Chat",
            goal="Chat with DeepSeek",
            backstory=dedent("""\
                You are a seasoned expert in the art of conversing with DeepSeek. Over the years, 
                you have built a vast repository of insights drawn from countless conversations, earning a reputation 
                as the go-to specialist for unearthing and explaining the nuances of complex topics. Now, with a 
                dedicated chat model at your disposal, you are tasked with engaging in a conversation with DeepSeek. 
                Your deep expertise and meticulous attention to detail empower you to provide a comprehensive and 
                enlightening account of its contents."""),
            llm=DEEPSEEK_LLM_2,
            verbose=verbose,
            allow_delegation=False
        )

'''
Direct deepseek api call for deepseek reasonor doesnt work in the current form of crewai and litellm versions.
There is no integration yet.

langchain-deepseek with DeepSeekChat() doesnt work with either reasonor or chat.

TODO:
- Check deepseer r1 through openrouter
- Check deepseek reasonor and deepseek chat for integration in manager roles (which uses purely chat)

Result:
- Deepseek chat through direct deepseek api doesnt work
- deepseek through openrouter can use tools but performance is not that good.
'''