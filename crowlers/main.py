import traceback
from os import path, getcwd
from utils.crawler import Crawler
from utils.logger import Logger
from utils.dotenv import Dotenv
from models.company import Company
import pandas as pd
import numpy as np
import json

env = Dotenv('./.env')
df = pd.read_csv(path.join(getcwd(), "Sociétés.csv"))
df = df.replace(np.nan, None)
logger = Logger(debug=env.config['env'] == "developement")

crawler = Crawler(env.config["driver_path"], logger)
# crawler.login(
#     url=env.config["url"], email=env.config["email"], password=env.config["pwd"])
crawler.fetch(env.config["url"])


def write_to_file(data: dict) -> None:
    try:
        with open('output_crawler.json', 'r') as f:
            f_data = json.load(f)
    except json.JSONDecodeError:
        f_data = []
    f_data.append(data)
    with open('output_crawler.json', 'w') as f:
        json.dump(f_data, f)


def display_stats(info: dict) -> None:
    print(
        f"statistics: \n\ttotal company scanned : {info['total']}\n\tcompany found: {info['success']}\n\tcompany no found: {info['total'] - info['success']}")


def main() -> None:
    info = {
        "total": 0,
        "success": 0,
    }
    try:
        for row in df.to_dict(orient='records'):
            info["total"] += 1
            company = Company(row)
            updated_company = crawler.get_company_data(
                company.company_name, company)
            if updated_company:
                info["success"] += 1
                logger.info(message=f"{company.company_name} : found")
                write_to_file(updated_company.to_dict())
            else:
                write_to_file(company.to_dict())
                logger.error(message=f"{company.company_name} : not found")
    except KeyboardInterrupt:
        display_stats(info)
        logger.INFO(f'stopped at index {idx}')
        crawler.driver.close()
        exit(0)

    except Exception as e:
        logger.error(f"An error occurred: {e}")
        logger.error(f"Stack trace: {traceback.format_exc()}")


main()
