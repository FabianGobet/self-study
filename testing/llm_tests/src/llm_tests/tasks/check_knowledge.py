from crewai import Task, Agent
from textwrap import dedent


def summarize_pdf_knowledge_task(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            You are tasked with retrieving and articulating every piece of information you have in your knowledge sources.
            For this task, you MUST use your integrated knowledge base to provide a comprehensive summary \
            that includes all relevant details and insights."""),
        expected_output=dedent("""\
            A detailed report that covers every aspect as derived from your knowledge sources.
            For example, a structured summary that includes key points, context, and insights \
            extracted from the document."""),
        agent=agent
    )