from models.company import Company
from utils.logger import Logger


class StatsManager:
    def __init__(self, length, idx=0) -> None:
        self.__data_size = length
        self.__logger = Logger(filename='log/stats.log')
        self.__success_nb = 0
        self.__fail_nb = 0
        self.__next_idx = idx

    def get_next_idx(self):
        return self.__next_idx

    def fail(self):
        self.__fail_nb += 1
        self.__next_idx += 1

    def success(self):
        self.__success_nb += 1
        self.__next_idx += 1

    def save(self, last_company: Company):
        scan_rate = (self.__success_nb+self.__fail_nb)*100/self.__data_size
        success_rate = self.__success_nb*100/(self.__success_nb+self.__fail_nb)
        self.__logger.info(
            f"statistics: \n\ttotal company scanned : {self.__fail_nb + self.__success_nb} company\n\tcompany found: {self.__success_nb} company\n\tcompany no found: {self.__fail_nb} company\n\tscaned companies rate: {scan_rate}%\n\tsuccess rate: {success_rate}%\n\tNext to company: {last_company.codeSujet} {last_company.company_name}")
        self.__logger.INFO(f'next index: {self.__next_idx}')
