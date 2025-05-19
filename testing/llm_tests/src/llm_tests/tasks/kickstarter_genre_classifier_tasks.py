from crewai import Task, Agent
from textwrap import dedent


class KickstarterGenreClassifierTasks():
    """Test tasks for Kickstarter Genre Classifier"""

    def game_collection_classification_organizer_task(agent: Agent) -> Task:
        return Task(
            description=dedent("""\
                Conduct a thorough count on the number of words in the input text.
                For this task, you MUST use the provided tool to count the words, 
                and only then return your final answer.

                ---------------------------
                input text for which you must count the words:
                '{text_input}'
                ---------------------------"""),
            expected_output=dedent("""\
                A small report containing the number of words in the input text.
                For example, 'The text contains 100 words.'"""), 
            agent=agent
        )