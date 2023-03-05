import datetime
import json
from os import path


class FileManager:
    def __init__(self, folder) -> None:
        self.f = self.name_file(folder)
        self.init_file()

    def name_file(self, folder) -> str:
        timestamp = datetime.datetime.now().strftime('%Y-%m-%d_%H%M%S')
        return path.join(folder, f'output_{timestamp}.json')

    def init_file(self):
        if not path.isfile(self.f):
            with open(self.f, 'w') as f:
                json.dump([], f)

    def __read(self) -> dict:
        with open(self.f, 'r') as f:
            return json.load(f)

    def __write(self, data):
        with open(self.f, 'w') as f:
            json.dump(data, f)

    def append(self, data: dict):
        f_data = self.__read()
        f_data.append(data)
        self.__write(f_data)
