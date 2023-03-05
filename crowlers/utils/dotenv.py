class Dotenv:

    _self = None

    # def __new__(cls):
    #     if cls._self is None:
    #         cls._self = super().__new__(cls)
    #     return cls._self

    def __init__(self, path_to_env) -> None:
        self.config = {}
        self.path = path_to_env
        self.__read_env()

    def __read_env(self):
        with open(self.path, "r") as file:
            lines = file.readlines()
            for l in lines:
                l.replace("\n", "")
                key, value = l.split("=")
                self.config[key] = value
