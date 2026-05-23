def search_naukri(role: str):

    return [

        {
            "id": "n1",
            "title": "Java Backend Engineer",
            "company": "Infosys",
            "location": "Bangalore",
            "salary": "12-18 LPA",
            "posted": "2 hrs ago",
            "description": "Spring Boot, AWS, Microservices",

            "requirements": [
                "Java",
                "Spring Boot",
                "AWS"
            ],

            "matchScore": 92
        },

        {
            "id": "n2",
            "title": "Full Stack Developer",
            "company": "TCS",
            "location": "Remote",
            "salary": "10-15 LPA",
            "posted": "5 hrs ago",
            "description": "Angular + Java backend",

            "requirements": [
                "Angular",
                "Java"
            ],

            "matchScore": 85
        }
    ]


def search_indeed(role: str):

    return [

        {
            "id": "i1",
            "title": "Software Engineer",
            "company": "Accenture",
            "location": "Hyderabad",
            "salary": "14-20 LPA",
            "posted": "Today",
            "description": "Spring + Docker + AWS",

            "requirements": [
                "Spring",
                "Docker",
                "AWS"
            ],

            "matchScore": 88
        }
    ]