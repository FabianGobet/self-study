from crewai import Task, Agent
from textwrap import dedent


def chat_task(agent: Agent) -> Task:
    """Chat about a specific topic. Placeholder is \{opic_input\}."""

    return Task(
        description=dedent("""\
            Conduct a thorough chat of what you know about a given topic.

            input topic:
            {topic_input}"""),
        expected_output=dedent("""\
            A small text containing your summarized knowledge about the topic.'"""), 
        agent=agent
    )