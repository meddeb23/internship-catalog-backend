class Company:

    def __init__(self, data: dict) -> None:
        self.codeSujet = data["codeSujet"]
        self.company_name = data["company_name"]
        self.company_address = data["company_address"]
        self.company_city = data["company_city"]
        self.company_phone = data["company_phone"]
        self.company_website = data["company_website"]
        self.company_logo_url = None
        self.company_linkedin_url = None
        self.overview = None
        self.specialties = None

    def to_dict(self) -> dict:
        return {"codeSujet": self.codeSujet,
                "company_name": self.company_name,
                "company_address": self.company_address,
                "company_city": self.company_city,
                "company_phone": self.company_phone,
                "company_website": self.company_website,
                "company_logo_url": self.company_logo_url,
                "company_linkedin_url": self.company_linkedin_url,
                "overview": self.overview,
                "specialties": self.specialties,
                }
