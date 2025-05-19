from crewai.tools import BaseTool
from typing import Type
from pydantic import BaseModel, Field


class WordCountToolInput(BaseModel):
    text: str = Field(..., description="The text which you want to count the words of.")

class WordCountTool(BaseTool):
    name: str = "word_counter"
    description: str = "This tool counts the number of words in a given text."
    args_schema: Type[BaseModel] = WordCountToolInput

    def _run(self, text: str) -> int:
        return len(text.split())
