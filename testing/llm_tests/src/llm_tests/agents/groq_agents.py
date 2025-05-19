from crewai import Agent
from textwrap import dedent
from langchain_groq import ChatGroq
import os

class GroqAgents():
    """Test agents for GROQ"""

    def __init__(self, global_verbose: None | bool = None, temperature: int = 0.15) -> None:
        self.global_verbose = global_verbose
        self.groq_llm = ChatGroq(
            api_key = os.environ["GROQ_API_KEY"],
            model = 'groq/qwen-qwq-32b',
            temperature = temperature
	    )

    def groq_tool_tester(self, tools: list, verbose: bool = False) -> Agent:
        return Agent(
            role="Senior words counter",
            goal="Count the number of words in a given text",
            backstory=dedent("""\
                You are a seasoned word counter with an expertise on counting words in a text. 
                You have been doing this for years and have a reputation for being the best in the business. 
                You have been called in to count the words in a text and you are ready to take on the challenge."""),
            llm=self.groq_llm,
            tools=tools,
            verbose=verbose
        )
    
    def groq_knowledge_tester(self, knowledge_sources: list, verbose: bool = False) -> Agent:
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
            llm=self.groq_llm,
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
    
    # delegation crew agents

    def organizor(self, verbose: bool = True) -> Agent:
        return Agent(
            role="Task delegator and information organizer",
            goal="Delegate tasks to agents to gather and organize information",
            backstory=dedent("""\
                You are a task delegator and information organizer with a talent for coordinating and managing a team of agents. 
                Your expertise in assigning tasks to peer agents and organizing the information they gather has made you an 
                essential player in the world of research. Now, you have been tasked with delegating tasks to agents to gather 
                and organize information, leveraging your skills to create a comprehensive and well-structured summary of the data."""),
            llm=self.groq_llm,
            verbose=self.global_verbose or verbose,
            allow_delegation=True
        )
    
    def researcher(self, tools: list, verbose: bool = True) -> Agent:
        return Agent(
            role="Web Researcher",
            goal="Research information on the web to gather data",
            backstory=dedent("""\
                You are a web researcher with a passion for exploring the depths of the internet to gather valuable data. 
                Your expertise in navigating online platforms and extracting key information using your web searching tools 
                has made you a sought-after specialist in the field of research. Now, you have been tasked with researching 
                information on the web to gather data, leveraging your skills to compile a comprehensive summary."""),
            llm=self.groq_llm,
            verbose=self.global_verbose or verbose,
            tools=tools
        )
    
    def critic(self, verbose: bool = True) -> Agent:
        return Agent(
            role="Content Critic",
            goal="Critique and analyze content to provide insights",
            backstory=dedent("""\
                You are a content critic with a keen eye for detail and a talent for analyzing and critiquing information. 
                Your expertise in evaluating content and providing valuable insights has made you a respected authority in 
                the world of research. Now, you have been tasked with critiquing and analyzing content to provide insights, 
                leveraging your skills to offer a fresh perspective and valuable feedback."""),
            llm=self.groq_llm,
            verbose=self.global_verbose or verbose
        )