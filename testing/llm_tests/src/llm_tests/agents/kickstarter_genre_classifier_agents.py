from crewai import Agent
from textwrap import dedent
from langchain_groq import ChatGroq
import os

GROQ_LLM = ChatGroq(
		api_key = os.environ["GROQ_API_KEY"],
		model = 'groq/qwen-qwq-32b',
        temperature = 0.15
	)

class KickstarterGenreClassifierAgents():
    """Test agents for Kickstarter Genre Classifier"""

    def __init__(self, global_verbose: None | bool = None) -> None:
        self.global_verbose = global_verbose
    
    def game_collection_organizer(self, verbose: bool = True) -> Agent:
        return Agent(
            role="Game Collection Classification Organizer",
            goal="Organize a collection of games by classifying their genres",
            backstory=dedent("""\
                You are a game collection classification organizer with a passion for categorizing games by genre. 
                Your expertise in delegating tasks to peer agents to identify and classify games based on their 
                unique characteristics has made you a sought-after specialist in the gaming community. 
                Now, you have been tasked with organizing a collection of games by genre, leveraging your deep leading skills 
                and keen eye for detail to create a comprehensive and well-structured catalog."""),
            llm=GROQ_LLM,
            verbose=self.global_verbose or verbose
        )
    
    def kickstarter_scrapper(self, verbose: bool = True) -> Agent:
        return Agent(
            role="Kickstarter Scrapper Expert",
            goal="Scrap the Kickstarter website to gather information about games",
            backstory=dedent("""\
                You are a Kickstarter scrapper with a knack for extracting valuable information from the Kickstarter website. 
                Your expertise in navigating the platform and identifying key data points has made you an invaluable asset 
                in the world of game development. Now, you have been tasked with scraping Kickstarter games pages to gather 
                information about games, leveraging your skills to compile a comprehensive summary that can describe the game in terms of genre."""),
            llm=GROQ_LLM,
            verbose=self.global_verbose or verbose
        )
    
    def genre_classifier(self, verbose: bool = True) -> Agent:
        return Agent(
            role="Genre Classifier Expert",
            goal="Classify games into different genres",
            backstory=dedent("""\
                You are a genre classifier with a keen eye for identifying the unique characteristics of games. 
                Your expertise in analyzing game features and categorizing them into distinct genres has made you a 
                respected authority in the gaming industry. Now, you have been tasked with classifying games into different 
                genres, leveraging your deep knowledge and analytical skills to create a comprehensive and accurate classification."""),
            llm=GROQ_LLM,
            verbose=self.global_verbose or verbose
        )