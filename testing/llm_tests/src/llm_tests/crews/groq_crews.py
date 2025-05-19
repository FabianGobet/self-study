from pathlib import Path
from dotenv import load_dotenv
from crewai import Crew, Process
from llm_tests.agents.groq_agents import GroqAgents
import llm_tests.tasks as tasks
import llm_tests.tools as tools
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
import os

load_dotenv()

AGENTS = GroqAgents()

class GroqCrews():
    """Crews for GROQ"""
    
    def count_crew(self) -> Crew:
        word_count_tool = tools.WordCountTool()
        groq_test_agent = AGENTS.groq_tool_tester(tools=[word_count_tool], verbose=True)
        count_words_task = tasks.count_text_words_task(agent=groq_test_agent)

        return Crew(
            agents=[groq_test_agent], 
            tasks=[count_words_task], 
            verbose=True
        )
    
    def knowledge_crew(self) -> Crew:
        script_dir = os.path.dirname(__file__)
        pdf_path = os.path.abspath(os.path.join(script_dir, "../knowledge/deloitte-ch-en-Swiss-GAAP-FER-Checklist_2024.pdf"))
        pdf_knowledge_source = PDFKnowledgeSource(file_paths=[Path(pdf_path)])
        groq_knowledge_test_agent = AGENTS.groq_knowledge_tester(knowledge_sources=[pdf_knowledge_source], verbose=True)
        summarize_pdf_knowledge_task = tasks.summarize_pdf_knowledge_task(agent=groq_knowledge_test_agent)

        return Crew(
            agents=[groq_knowledge_test_agent],
            tasks=[summarize_pdf_knowledge_task],
            verbose=True
        )
    
    def delegation_crew(self) -> Crew:
        web_search_tool = tools.TavilyWebSearchTool()
        organizor_agent = AGENTS.organizor(verbose=True)
        researcher_agent = AGENTS.researcher(tools=[web_search_tool], verbose=True)
        critique_agent = AGENTS.critic(verbose=True)

        request_research_task = tasks.request_research(agent=organizor_agent)
        request_critique_task = tasks.request_critique(agent=organizor_agent)
        search_topic_task = tasks.search_topic(agent=researcher_agent)
        critique_topic_task = tasks.critique_topic(agent=critique_agent)
        organize_topics_task = tasks.organize_topics(agent=organizor_agent)

        return Crew(
            agents=[organizor_agent, researcher_agent, critique_agent],
            tasks=[request_research_task, request_critique_task, search_topic_task, critique_topic_task, organize_topics_task],
            verbose=True,
            process=Process.hierarchical,
            manager_llm="openai/gpt-3.5-turbo"
        )