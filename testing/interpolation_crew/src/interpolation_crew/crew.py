from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task

@CrewBase
class InterpolationCrew():
    """InterpolationCrew crew"""

    agents_config = 'config/agents.yaml'
    tasks_config = 'config/tasks.yaml'

    @agent
    def writer(self) -> Agent:
        return Agent(
            config=self.agents_config['writer'],
            verbose=True
        )

    @agent
    def analyst(self) -> Agent:
        return Agent(
            config=self.agents_config['analyst'],
            verbose=True
        )

    @task
    def write_task(self) -> Task:
        return Task(
            config=self.tasks_config['write_task'],
        )

    @task
    def analyst_task(self) -> Task:
        return Task(
            config=self.tasks_config['analyst_task'],
        )

    @crew
    def crew(self) -> Crew:
        """Creates the InterpolationCrew crew"""

        return Crew(
            agents=self.agents, # Automatically created by the @agent decorator
            tasks=self.tasks, # Automatically created by the @task decorator
            process=Process.sequential,
            verbose=True,
        )
