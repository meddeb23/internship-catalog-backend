import traceback

from utils.crawler import Crawler
from utils.logger import Logger
from utils.fileManager import FileManager
from utils.StatsManager import StatsManager
from models.company import Company


class ProccessManager:
    def __init__(self, df, crawler: Crawler, file_manager: FileManager, stats_manager: StatsManager, logger: Logger) -> None:
        self.crawler = crawler
        self.file_manager = file_manager
        self.logger = logger
        self.stats_manager = stats_manager
        self.counter = stats_manager.get_next_idx()
        self.data_list = df.to_dict(orient='records')[self.counter:]

    def __core(self):
        idx = self.stats_manager.resume()
        for row in self.data_list[idx:]:
            company = Company(row)
            updated_company = self.crawler.get_company_data(company)
            if updated_company:
                # write the updated version of the company to a json file
                self.file_manager.append(updated_company.to_dict())
                # update the number of successful scans
                self.stats_manager.success()
                self.logger.info(message=f"{company.company_name} : found")
            else:
                # write the data of company to a json file
                self.file_manager.append(company.to_dict())
                # update the number of failed scans
                self.stats_manager.fail()
                self.logger.error(
                    message=f"{company.company_name} : not found")
            self.counter += 1

    def __handle_exceptions(self):
        # log the stats and save them to a file so they can be retireved later
        self.stats_manager.save(Company(self.data_list[self.counter]))
        self.logger.info(
            f'stopped at index {self.stats_manager.get_next_idx()}')
        self.crawler.driver.close()

    def main(self) -> None:

        try:
            self.__core()
        except KeyboardInterrupt:
            self.__handle_exceptions()
            exit(0)

        except Exception as e:
            # Log the errors
            self.logger.error(f"An error occurred: {e}")
            self.logger.error(f"Stack trace: {traceback.format_exc()}")
            # log the stats and save them to a file so they can be retireved later
            self.__handle_exceptions()
            exit(1)
