import unittest

from app.schemas import EmployeeCreate


class EmployeeSchemaTests(unittest.TestCase):
    def test_blank_leaving_date_is_accepted_as_none(self):
        payload = {
            "identity_id": 1,
            "employee_id": "EMP-001",
            "full_name": "Jane Doe",
            "date_of_joining": "2024-01-01",
            "date_of_birth": "1990-01-01",
            "educational_qualification": "B.Tech",
            "parents_name": "John Doe",
            "email": "jane@example.com",
            "phone": "1234567890",
            "department": "Engineering",
            "designation": "Developer",
            "salary": 50000,
            "address": "Somewhere",
            "leaving_date": "",
        }

        employee = EmployeeCreate(**payload)
        self.assertIsNone(employee.leaving_date)


if __name__ == "__main__":
    unittest.main()
