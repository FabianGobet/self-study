from pathlib import Path
from dotenv import load_dotenv
from crewai import Crew, Process
from llm_tests.agents import DeepSeekAgents
import llm_tests.tasks as TASKS
import llm_tests.tools as TOOLS
from crewai.knowledge.source.pdf_knowledge_source import PDFKnowledgeSource
import os

load_dotenv()

AGENTS = DeepSeekAgents()

class DeepSeekCrews():
    """Crews for DeepSeek"""
    
    def count_crew(self) -> Crew:
        word_count_tool = TOOLS.WordCountTool()
        deepseek_test_agent = AGENTS.deepseek_tool_tester(tools=[word_count_tool], verbose=True)
        count_words_task = TASKS.count_text_words_task(agent=deepseek_test_agent)

        return Crew(
            agents=[deepseek_test_agent], 
            tasks=[count_words_task], 
            verbose=True
        )
    
    def knowledge_crew(self) -> Crew:
        script_dir = os.path.dirname(__file__)
        pdf_path = os.path.abspath(os.path.join(script_dir, "../knowledge/deloitte-ch-en-Swiss-GAAP-FER-Checklist_2024.pdf"))
        pdf_knowledge_source = PDFKnowledgeSource(file_paths=[Path(pdf_path)])
        deepseek_knowledge_test_agent = AGENTS.deepseek_knowledge_tester(knowledge_sources=[pdf_knowledge_source], verbose=True)
        summarize_pdf_knowledge_task = TASKS.summarize_pdf_knowledge_task(agent=deepseek_knowledge_test_agent)

        return Crew(
            agents=[deepseek_knowledge_test_agent],
            tasks=[summarize_pdf_knowledge_task],
            verbose=True
        )
    
    def chat_crew(self) -> Crew:
        chat_agent = AGENTS.deepseek_chat(verbose=True)
        chat_task = TASKS.chat_task(agent=chat_agent)

        return Crew(
            agents=[chat_agent],
            tasks=[chat_task],
            verbose=True,
            manager_agent=chat_agent.llm,
            process=Process.hierarchical
        )
    
    def delegation_crew(self) -> Crew:
        delegator_agent = AGENTS.delegation_organizor(verbose=True)
        researcher_agent = AGENTS.delegation_researcher(tools=[TOOLS.TavilyWebSearchTool()], verbose=True)
        critic_agent = AGENTS.delegation_critic(verbose=True)
        delegator_task = TASKS.delegation_task(agent=delegator_agent, sub_agents=[researcher_agent, critic_agent])

        return Crew(
            agents=[delegator_agent, researcher_agent, critic_agent],
            tasks=[delegator_task],
            verbose=True
        )