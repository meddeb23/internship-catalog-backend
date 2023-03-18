import os

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.common.exceptions import TimeoutException

from models.company import Company
from utils.logger import Logger


class Crawler:
    def __init__(self, path, logger: Logger, timeout=10) -> None:
        self.path = path
        self.logger = logger
        service = Service(
            executable_path="C:\\Users\\medde\\Downloads\\softwares\\chromedriver.exe")
        options = Options()
        param = "user-data-dir=" + os.path.join(os.getcwd(), 'chrome_session')
        options.add_argument(param)

        options.headless = False  # change to true in production
        self.driver = webdriver.Chrome(service=service, options=options)
        self.wait = WebDriverWait(self.driver, timeout)

    def fetch(self, url: str):
        self.driver.get(url)

    def login(self, url: str, email: str, password: str):
        self.fetch(url)
        email_xpath = '//*[@id="session_key"]'
        password_xpath = '//*[@id="session_password"]'
        self.__get_element_by_xpath(email_xpath).send_keys(email)
        self.__get_element_by_xpath(password_xpath).send_keys(password)

    def search(self, company_name: str):
        search_xpath = '//*[@id="global-nav-typeahead"]/input'
        search_element = self.__get_element_by_xpath(search_xpath)
        search_element.clear()
        search_element.send_keys(company_name)
        search_element.send_keys(Keys.ENTER)

    def navigate_to_company_page(self, data: Company):
        card_path = '.search-nec__hero-kcard-v2 > a'
        try:
            page_link = self.__get_element_by_selector(card_path)
            data.company_linkedin_url = page_link.get_attribute("href")
            page_link.click()
        except TimeoutException:
            self.logger.debug("element not found directly")
            card_list_xpath = '//*[@id="main"]/div/div/div'
            search_element = self.__get_elements_by_xpath(card_list_xpath)
            for i in search_element:
                card_item_xpath = f'//*[@id="{i.get_attribute("id")}"]/div/div[1]/div/h2'
                if self.__get_element_by_xpath(card_item_xpath).text == "Companies":
                    self.logger.print(i.get_attribute('id'))
                    link_xpath = f'//*[@id="{i.get_attribute("id")}"]/div/ul/li[1]/div/div/div/div/a'
                    page_link = self.__get_element_by_xpath(
                        link_xpath)
                    data.company_linkedin_url = page_link.get_attribute("href")
                    page_link.click()

                    break

    def get_company_basic_data(self, data: Company):
        title_selector = '#main > div.mb4 > section span'
        profil_image_selector = '#main div.relative > div.ph5.pt3 > div.org-top-card__primary-content.org-top-card-primary-content--zero-height-logo.org-top-card__primary-content--ia > div.org-top-card-primary-content__logo-container > img'
        cover_image_selector = '#main > div.mb4 > section div.live-video-hero-image > div.live-video-hero-image__bg-image > figure > div > div'

        self.logger.print("🧐 looking for company image link", end=": ")
        data.company_logo_url = self.__get_element_by_selector(
            profil_image_selector).get_attribute("src")
        self.logger.print(data.company_logo_url)
        self.logger.print("🧐 looking for company name", end=": ")
        data.company_name = self.__get_element_by_selector(title_selector).text
        self.logger.print(data.company_name)
        return data

    def get_company_about_section(self, data: Company):
        navigation_item_selector = '#main nav > ul >li:nth-child(2) > a'
        overview_selector = '#main > div.org-grid__content-height-enforcer section > p'
        args_list_selector = "#main > div.org-grid__content-height-enforcer section > dl dt, #main > div.org-grid__content-height-enforcer section > dl dd"
        self.__get_element_by_selector(
            navigation_item_selector).send_keys(Keys.ENTER)
        self.logger.print("🧐 looking for company overview", end=": ")
        data.overview = self.__get_element_by_selector(
            overview_selector).text
        self.logger.print(data.overview)
        args_list = self.__get_elements_by_selector(args_list_selector)
        temp = None
        switch_dict = {
            'website': 'company_website',
            'Specialties': 'specialties',
            'Phone': 'company_phone'
        }
        for i in args_list:
            if i.tag_name == "dt":
                temp = i.text
            else:
                if temp:
                    try:
                        setattr(data, switch_dict[temp], i.text)
                    except KeyError:
                        pass
                    temp = None
        return data

    def get_company_location(self):
        location_selector = "#main > div.org-grid__content-height-enforcer > div > div > div:nth-child(2) > div:nth-child(1) div > p"

    def get_company_data(self, data: Company) -> Company:
        try:
            self.search(data.company_name)
            self.navigate_to_company_page(data)
            self.logger.print(
                f"🤧 company Linkedin : {data.company_linkedin_url}")
            self.get_company_basic_data(data)
            self.get_company_about_section(data)
            return data
        except TimeoutException:
            return None

    def __get_element_by_selector(self, selector_value):
        return self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, selector_value)))

    def __get_elements_by_selector(self, selector_value):
        return self.wait.until(EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, selector_value)))

    def __get_elements_by_xpath(self, xpath_value):
        return self.wait.until(EC.presence_of_all_elements_located(
            (By.XPATH, xpath_value)))

    def __get_element_by_xpath(self, xpath_value):
        return self.wait.until(EC.presence_of_element_located(
            (By.XPATH, xpath_value)))
