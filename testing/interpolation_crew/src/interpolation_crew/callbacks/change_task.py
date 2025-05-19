from functools import partial
from crewai import Task
from crewai.tasks.task_output import TaskOutput

def _change_task(current_task_output: TaskOutput, other_task_object: Task) -> None:
    inputs = {
        'topic': 'AI LLMs',
        'new': current_task_output.raw
    }
    other_task_object.interpolate_inputs_and_add_conversation_history(inputs=inputs)

def change_task(other_task_object: Task) -> None:
    return partial(_change_task, other_task_object=other_task_object)