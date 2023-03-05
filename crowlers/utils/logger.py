from colorama import Fore, Style
import datetime


class Logger:

    DEBUG = "DEBUG"
    ERROR = "ERROR"
    INFO = "INFO"
    EVENT = "EVENT"

    def __init__(self, debug='developement', filename="log/example.log") -> None:
        self.is_debugging = debug == "developement"
        self.filename = filename
        self.color_ref = {
            'DEBUG': Fore.CYAN,
            'ERROR': Fore.RED,
            'INFO': Fore.GREEN
        }

    def __get_message(self, message, type):
        return f"{datetime.datetime.now()} {type}: {message}\n"

    def __print(self, message, type, end):
        print(Fore.BLUE + str(datetime.datetime.now()), end=" ")
        print(self.color_ref[type] + Style.BRIGHT + type, end=": ")
        print(Style.RESET_ALL + message, end=end)

    def print(self, message, end="\n"):
        if (end == '\n'):
            print(message)
        else:
            print(self.color_ref[Logger.DEBUG] +
                  Style.BRIGHT + "DEBUG", end=": ")
            print(Style.RESET_ALL + message, end=end)

    def core(self, message, type="DEBUG", end="\n"):
        if (self.is_debugging and type == "DEBUG"):
            self.__print(message, type, end)
        else:
            self.__print(message, type, end)
        if type != Logger.DEBUG:
            self.write_to_file(message, type)

    def debug(self, message, end="\n"):
        self.core(message, end=end)

    def error(self, message, end="\n"):
        self.core(message, Logger.ERROR, end)

    def info(self, message, end="\n"):
        self.core(message, Logger.INFO, end)

    def write_to_file(self, message, type):
        with open(self.filename, 'a') as f:
            f.write(self.__get_message(message, type))
