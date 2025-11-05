from crewai import Agent, Crew, Process, Task
from crewai.project import CrewBase, agent, crew, task
from crewai.agents.agent_builder.base_agent import BaseAgent
from typing import List
from crewai.knowledge.source.text_file_knowledge_source import TextFileKnowledgeSource
import os
from dotenv import load_dotenv
from crewai import LLM
from pydantic import BaseModel

load_dotenv()

history_source = TextFileKnowledgeSource(
    file_paths=["data.txt"],
)


@CrewBase
class Chatbot():
    """Chatbot crew"""

    agents: List[BaseAgent]
    tasks: List[Task]

    @agent
    def researcher(self) -> Agent:
        return Agent(
            config=self.agents_config['researcher'],
            llm=LLM(
                model="gemini/gemini-2.0-flash",
                api_key=os.getenv("GEMINI_API_KEY"),
                temperature=0.7
            ),
            verbose=True
        )

    @task
    def geopolitics_analysis_task(self) -> Task:
        return Task(
            config=self.tasks_config['geopolitics_analysis_task'],
            agent=self.researcher(),
        )

    @crew
    def crew(self) -> Crew:
        """Creates the Chatbot crew"""

        return Crew(
            agents=self.agents, 
            tasks=self.tasks, 
            process=Process.sequential,
            knowledge_sources=[history_source],
            embedder={
                "provider": "ollama",
                "config": {
                    "model": "mxbai-embed-large",
                    "url": "http://localhost:11434/api/embeddings"
                }
            },

            verbose=True,
        )
