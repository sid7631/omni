import abc

class Database(object, metaclass=abc.ABCMeta):
    def init(self):
        raise NotImplementedError()

    @abc.abstractmethod
    def connection_db(self):
        raise NotImplementedError("This method must be implemented in a subclass.")

    def reset(self):
        raise NotImplementedError()
