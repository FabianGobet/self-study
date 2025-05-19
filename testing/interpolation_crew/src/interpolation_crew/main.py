#!/usr/bin/env python
import sys
#import warnings

from datetime import datetime

from interpolation_crew.crew import InterpolationCrew

#warnings.filterwarnings("ignore", category=SyntaxWarning, module="pysbd")

from interpolation_crew.callbacks.change_task import change_task
from dotenv import load_dotenv

load_dotenv()

def run():
    """
    Run the crew.
    """
    inputs = {
        'topic': 'AI LLMs',
        'new': ''
    }
    
    try:
        cr = InterpolationCrew().crew()
        cr.tasks[0].callback=change_task(cr.tasks[1])
        cr.kickoff(inputs=inputs)
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        "topic": "AI LLMs"
    }
    try:
        InterpolationCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        InterpolationCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        "topic": "AI LLMs",
        "current_year": str(datetime.now().year)
    }
    try:
        InterpolationCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


if __name__ == "__main__":
    run()