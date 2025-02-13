from typing import List
from pydantic import BaseModel, Field


class Reflection(BaseModel):
    missing: str = Field(description="critique of what information is missing.")
    superfluous: str = Field(description="critique of what information is superfluous.")


class AnswerQuestion(BaseModel):
    answer: str = Field(..., description="~250 words answer to the questions.")
    reflection: Reflection = Field(
        ..., description="Your reflection on the initial answer."
    )
    search_queries: List[str] = Field(
        description="1-3 search queries to research information and improve your answer."
    )


class ReviseAnswer(AnswerQuestion):
    referances: List[str] = Field(
        description="citations motivating your updated answer."
    )
