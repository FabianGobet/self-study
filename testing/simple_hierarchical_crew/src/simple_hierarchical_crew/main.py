#!/usr/bin/env python
from langtrace_python_sdk import langtrace, with_langtrace_root_span
import os
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()
langtrace.init(os.getenv("LANGTRACE_API_KEY"), api_host="http://localhost:3000/api/trace")

import sys
from simple_hierarchical_crew.crew import SimpleHierarchicalCrew




@with_langtrace_root_span("simple_hierarchical_crew_run")
def run():
    """
    Run the crew.
    """
    inputs = {
        'current_time': str(datetime.now()),
    }
    
    try:
        crew = SimpleHierarchicalCrew().crew()
        print('hello')
    except Exception as e:
        raise Exception(f"An error occurred while running the crew: {e}")


def train():
    """
    Train the crew for a given number of iterations.
    """
    inputs = {
        'current_time': datetime.now(),
    }
    try:
        SimpleHierarchicalCrew().crew().train(n_iterations=int(sys.argv[1]), filename=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while training the crew: {e}")

def replay():
    """
    Replay the crew execution from a specific task.
    """
    try:
        SimpleHierarchicalCrew().crew().replay(task_id=sys.argv[1])

    except Exception as e:
        raise Exception(f"An error occurred while replaying the crew: {e}")

def test():
    """
    Test the crew execution and returns the results.
    """
    inputs = {
        'current_time': datetime.now(),
    }
    try:
        SimpleHierarchicalCrew().crew().test(n_iterations=int(sys.argv[1]), openai_model_name=sys.argv[2], inputs=inputs)

    except Exception as e:
        raise Exception(f"An error occurred while testing the crew: {e}")


if __name__ == "__main__":
    run()