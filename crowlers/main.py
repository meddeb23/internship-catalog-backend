from os import path, getcwd

import pandas as pd
import numpy as np

from utils.crawler import Crawler
from utils.logger import Logger
from utils.dotenv import Dotenv
from utils.fileManager import FileManager
from utils.StatsManager import StatsManager
from utils.ProccessManager import ProccessManager
import sys

env = Dotenv('./.env')

df = pd.read_csv(path.join(getcwd(), "Sociétés.csv"))
df = df.replace(np.nan, None)

logger = Logger(debug=env.config['env'])
file_manager = FileManager('data')
stats_manager = StatsManager(df.shape[0])
crawler = Crawler(env.config["driver_path"], logger)

if '--login' in sys.argv:
    crawler.login(
        url=env.config["url"], email=env.config["email"], password=env.config["pwd"])

crawler.fetch(env.config["url"])
proccess = ProccessManager(df=df, logger=logger, crawler=crawler,
                           file_manager=file_manager, stats_manager=stats_manager, )

proccess.main()
