import unittest
import json
import os
from app import app
from config import Config

class BasicTests(unittest.TestCase):

    def setUp(self):
        app.config['TESTING'] = True
        self.app = app.test_client()
        self.app_context = app.app_context()
        self.app_context.push()

    def tearDown(self):
        self.app_context.pop()

    def test_health(self):
        response = self.app.get('/api/health')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(json.loads(response.data)['status'], 'ok')

    def test_register_login(self):
        # Register
        username = "testuser_unique_123"
        password = "password123"
        response = self.app.post('/api/auth/register', 
                                 data=json.dumps(dict(username=username, password=password)),
                                 content_type='application/json')
        
        # It might fail if user exists from previous run, so we check for 201 or 400
        self.assertTrue(response.status_code in [201, 400])

        # Login
        response = self.app.post('/api/auth/login', 
                                 data=json.dumps(dict(username=username, password=password)),
                                 content_type='application/json')
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertTrue('access_token' in data)

if __name__ == "__main__":
    unittest.main()
