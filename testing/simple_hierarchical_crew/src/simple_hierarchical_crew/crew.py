from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from simple_hierarchical_crew.tools import SerperWebSearchTool, save_markdown

@CrewBase
class SimpleHierarchicalCrew():
    """SimpleHierarchicalCrew crew"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'
    web_search_tool = SerperWebSearchTool()
    llm_model = "openai/gpt-3.5-turbo"

    @agent
    def editor(self) -> Agent:
        return Agent(
            config=self.agents_config['editor'],
            #verbose=True,
            llm=self.llm_model
        )

    @agent
    def news_fetcher(self) -> Agent:
        return Agent(
            config=self.agents_config['news_fetcher'],
            #verbose=True,
            tools=[self.web_search_tool],
            llm=self.llm_model
        )
    
    @agent
    def news_analyzer(self) -> Agent:
        return Agent(
            config=self.agents_config['news_analyzer'],
            #verbose=True,
            tools=[self.web_search_tool],
            llm=self.llm_model
        )
    
    @agent
    def newsletter_compiler(self) -> Agent:
        return Agent(
            config=self.agents_config['newsletter_compiler'],
            #verbose=True,
            llm=self.llm_model
        )

    @task
    def fetch_news_task(self) -> Task:
        return Task(
            config=self.tasks_config['fetch_news_task'],
        )

    @task
    def analyze_news_task(self) -> Task:
        return Task(
            config=self.tasks_config['analyze_news_task'],
            output_file='report.md'
        )

    @task
    def compile_newsletter_task(self) -> Task:
        return Task(
            config=self.tasks_config['compile_newsletter_task'],
            callback=save_markdown
        )

    @crew
    def crew(self) -> Crew:
        """Creates the SimpleHierarchicalCrew crew"""

        return Crew(
            agents=self.agents,
            tasks=self.tasks,
            process=Process.hierarchical,
            verbose=True,
            manager_llm="openai/gpt-3.5-turbo"
        )
