from crewai import Task, Agent
from textwrap import dedent
from pydantic import BaseModel, Field

# need to test if pydantic output can be used and variable placeholder filder with context pass

class TopicSearch(BaseModel):
    topic: str = Field(..., description="The topic chosen for research")
    web_search_info: str | None = Field(None, description="Information gathered from web search")

class TopicCritique(BaseModel):
    topicsearch: TopicSearch = Field(..., description="The topic and websearch info chosen for critique")
    critique: str = Field(..., description="Critique and analysis of the content")

class TopicsOrganized(BaseModel):
    topics: list[TopicCritique] = Field(..., description="A list of all web search info and critiques for each topic")

    
def request_research(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            From the provided list of topics, for those you still have not gather information on,
            choose one and assign it to the researcher agent to conduct research on the web.
            
            ---------------------------
            List of topics:
            {topics}
            ---------------------------"""),
        expected_output=dedent("""\
            A structured output in the form of a dictionary as follows:
            \{
                "topic": <string with the topic chosen>,
            \}
            
            For example, \{"topic": "Artificial Intelligence"\}"""),
        agent=agent,
        output_json=TopicSearch
    )

def request_critique(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            From the provided list of topics, for those you have gathered information on using the web researcher agent,
            choose one and assign it to the critic agent to critique and analyze the content.
            
            ---------------------------
            List of topics:
            {topics}
            ---------------------------"""),
        expected_output=dedent("""\
            A structured output in the form of a dictionary as follows:
            \{
                "topic": <string with the topic chosen>,
                "web_search_info": <information gathered from web search>,
            \}
"
            For example, \{"topic": "Artificial Intelligence", "web_search_info": "Artificial intelligence (AI) is ..."\}"""),
        agent=agent,
        output_json=TopicSearch
    )

def search_topic(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            From the information provided by the task delegator and information organizer
            agent, conduct a websearch on the provided topic to gather information.
            Having gathered such information, make a well-rounded summary of the information."""),
        expected_output=dedent("""\
            A structured output in the form of a dictionary as follows:
            \{
                "topic": <string with the topic chosen>,
                "web_search_info": <summary of information gathered from web search>,
            \}"""),
        agent=agent,
        output_json=TopicSearch
    )

def critique_topic(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            From the information provided by the web researcher agent, critique and analyze the content.
            Provide insights and feedback on the information gathered from the web search."""),
        expected_output=dedent("""\
            A structured output in the form of a dictionary as follows:
            \{
                "topicsearch": \{
                    "topic": <string with the topic chosen>,
                    "web_search_info": <information gathered from web search>,
                \},
                "critique": <critique and analysis of the content>,
            \}"""),
        agent=agent,
        output_json=TopicCritique
    )

def organize_topics(agent: Agent) -> Task:
    return Task(
        description=dedent("""\
            From the information provided by the content critic agent, organize the topics, web search info,
            and critiques into a structured format. Provide a list of all web search info and critiques for each topic."""),
        expected_output=dedent("""\
            A structured output in the form of a dictionary as follows:
            \{
                "topics": [
                    \{
                        "topicsearch": \{
                            "topic": <string with the topic chosen>,
                            "web_search_info": <information gathered from web search>,
                        \},
                        "critique": <critique and analysis of the content>,
                    \},
                    ...
                ],
            \}"""),
        agent=agent,
        output_json=TopicsOrganized
    )
                
                
