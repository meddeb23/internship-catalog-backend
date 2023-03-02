from utils.dotenv import Dotenv

from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys


env = Dotenv('./.env')


class Crawler:
    def __init__(self, path, timeout=20) -> None:
        self.path = path
        service = Service(executable_path=self.path)
        option = Options()
        option.headless = False  # change to true in production
        self.driver = webdriver.Chrome(service=service, options=option)
        self.wait = WebDriverWait(self.driver, timeout)

    def fetch(self, url):
        self.driver.get(url)

    def login(self, url, email, password):
        self.fetch(url)
        email_xpath = '//*[@id="session_key"]'
        password_xpath = '//*[@id="session_password"]'
        self.wait.until(EC.presence_of_element_located(
            (By.XPATH, email_xpath))).send_keys(email)
        self.wait.until(EC.presence_of_element_located(
            (By.XPATH, password_xpath))).send_keys(password)

    def search(self, company):
        search_xpath = '//*[@id="global-nav-typeahead"]/input'
        search_element = self.wait.until(EC.presence_of_element_located(
            (By.XPATH, search_xpath)))
        search_element.send_keys(company)
        search_element.send_keys(Keys.ENTER)

    def navigate_to_company_page(self):
        card_path = '.search-nec__hero-kcard-v2 > a'
        page_link = self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, card_path))).get_attribute("href")
        print("\npage link", page_link)
        self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, card_path))).click()

    def get_company_basic_data(self, data):
        title_selector = '#main > div.mb4 > section span'
        profil_image_selector = '#main div.relative > div.ph5.pt3 > div.org-top-card__primary-content.org-top-card-primary-content--zero-height-logo.org-top-card__primary-content--ia > div.org-top-card-primary-content__logo-container > img'
        cover_image_selector = '#main > div.mb4 > section div.live-video-hero-image > div.live-video-hero-image__bg-image > figure > div > div'

        print("🧐 looking for company image link", end=": ")
        data['profil_image'] = self.__get_element_by_selector(
            profil_image_selector).get_attribute("src")
        print(data['profil_image'])
        print("🧐 looking for company name", end=": ")
        data['name'] = self.__get_element_by_selector(title_selector).text
        print(data['name'])
        # name = self.wait.until(EC.presence_of_element_located(
        #     (By.CSS_SELECTOR, title_selector))).text

        # section_element.find_elements(by=By.TAG_NAME, value='center')
        return data

    def get_company_about_section(self, data):
        navigation_item_selector = '#main nav > ul >li:nth-child(2) > a'
        overview_selector = '#main > div.org-grid__content-height-enforcer section > p'
        args_list_selector = "#main > div.org-grid__content-height-enforcer section > dl dt, #main > div.org-grid__content-height-enforcer section > dl dd"
        self.__get_element_by_selector(
            navigation_item_selector).send_keys(Keys.ENTER)
        print("🧐 looking for company overview", end=": ")
        data['overview'] = self.__get_element_by_selector(
            overview_selector).text
        print(data['overview'])
        args_list = self.__get_elements_by_selector(args_list_selector)
        temp = None
        for i in args_list:
            if i.tag_name == "dt":
                temp = i.text
            else:
                if temp:
                    data[temp] = i.text
                    temp = None
        return data

    def get_company_location(self):
        location_selector = "#main > div.org-grid__content-height-enforcer > div > div > div:nth-child(2) > div:nth-child(1) div > p"

    def get_company_data(self, company_name) -> dict:
        data = {}
        self.search(company_name)
        self.navigate_to_company_page()
        data = self.get_company_basic_data(data)
        data = self.get_company_about_section(data)
        return data

    def __get_element_by_selector(self, selector_value):
        return self.wait.until(EC.presence_of_element_located(
            (By.CSS_SELECTOR, selector_value)))

    def __get_elements_by_selector(self, selector_value):
        return self.wait.until(EC.presence_of_all_elements_located(
            (By.CSS_SELECTOR, selector_value)))


crawler = Crawler(env.config["driver_path"])
crawler.login(
    url=env.config["url"], email=env.config["email"], password=env.config["pwd"])
data = crawler.get_company_data("Roundesk technologies")
print(f"\n\nreport generated : {data}\n\n")

crawler.driver.close()
