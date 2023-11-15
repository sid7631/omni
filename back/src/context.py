from typing import Type, TYPE_CHECKING

if TYPE_CHECKING:
    from src.config import Config


class Context:
    def __init__(self) -> None:
        self.config: Config() = None
    
    def init(self):
        from src.config import Config
        from src.postgres import PgDatabase

        self.config = Config()
        self.config.load()
        
        try:
            self.db = PgDatabase()
            self.db.init()
        except Exception as e:
            print(f"Error initializing database: {e}")


instance = Context()

def context() -> Context:
    return instance

def config() -> 'Config':
    return context().config

